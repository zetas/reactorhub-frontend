<?php

namespace App\Providers;

use Laravel\Socialite\Two\AbstractProvider;
use Laravel\Socialite\Two\ProviderInterface;
use Laravel\Socialite\Two\User;
use Laravel\Socialite\Two\InvalidStateException;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Support\Facades\Log;

class PatreonProvider extends AbstractProvider implements ProviderInterface
{
    /**
     * The scopes being requested.
     *
     * @var array
     */
    protected $scopes = ['identity', 'identity[email]'];

    /**
     * The separating character for the requested scopes.
     *
     * @var string
     */
    protected $scopeSeparator = ' ';

    /**
     * Get the authentication URL for the provider.
     *
     * @param  string  $state
     * @return string
     */
    protected function getAuthUrl($state)
    {
        return $this->buildAuthUrlFromBase('https://www.patreon.com/oauth2/authorize', $state);
    }

    /**
     * Get the token URL for the provider.
     *
     * @return string
     */
    protected function getTokenUrl()
    {
        return 'https://www.patreon.com/api/oauth2/token';
    }

    /**
     * Get the raw user for the given access token.
     *
     * @param  string  $token
     * @return array
     */
    protected function getUserByToken($token)
    {
        try {
            $includes = [
                'memberships',
                'memberships.campaign',
                'memberships.tier',
            ];

            $fields = [
                'user' => 'email,full_name,image_url,vanity,url',
                'member' => 'patron_status,currently_entitled_amount_cents,lifetime_support_cents,pledge_cadence,tier_title',
                'campaign' => 'creation_name,url,patron_count'
            ];

            $response = $this->getHttpClient()->get('https://www.patreon.com/api/oauth2/v2/identity', [
                'headers' => [
                    'Authorization' => 'Bearer ' . $token,
                    'Accept' => 'application/json',
                ],
                'query' => [
                    'include' => implode(',', $includes),
                    'fields[user]' => $fields['user'],
                    'fields[member]' => $fields['member'],
                    'fields[campaign]' => $fields['campaign']
                ]
            ]);

            $data = json_decode($response->getBody(), true);

            // Process memberships if included
            if (isset($data['included'])) {
                $data['memberships'] = $this->processMemberships($data['included']);
            }

            Log::info('Patreon user data retrieved', [
                'user_id' => $data['data']['id'] ?? null,
                'has_memberships' => isset($data['memberships'])
            ]);

            return $data;
        } catch (ClientException $e) {
            $response = $e->getResponse();
            $body = json_decode((string) $response->getBody(), true);

            Log::error('Patreon API error', [
                'status' => $response->getStatusCode(),
                'error' => $body['errors'] ?? $body
            ]);

            throw new InvalidStateException('Failed to get user from Patreon: ' . ($body['errors'][0]['detail'] ?? 'Unknown error'));
        }
    }

    /**
     * Process membership data from Patreon API response.
     *
     * @param  array  $included
     * @return array
     */
    protected function processMemberships(array $included)
    {
        $memberships = [];
        $campaigns = [];

        // First pass: collect campaigns
        foreach ($included as $item) {
            if ($item['type'] === 'campaign') {
                $campaigns[$item['id']] = $item['attributes'];
            }
        }

        // Second pass: process memberships
        foreach ($included as $item) {
            if ($item['type'] === 'member') {
                $membership = [
                    'member_id' => $item['id'],
                    'patron_status' => $item['attributes']['patron_status'] ?? null,
                    'amount_cents' => $item['attributes']['currently_entitled_amount_cents'] ?? 0,
                    'lifetime_support_cents' => $item['attributes']['lifetime_support_cents'] ?? 0,
                    'tier_title' => $item['attributes']['tier_title'] ?? null,
                    'pledge_cadence' => $item['attributes']['pledge_cadence'] ?? 'monthly'
                ];

                // Add campaign info if available
                if (isset($item['relationships']['campaign']['data']['id'])) {
                    $campaignId = $item['relationships']['campaign']['data']['id'];
                    $membership['creator_id'] = $campaignId;

                    if (isset($campaigns[$campaignId])) {
                        $membership['creator_name'] = $campaigns[$campaignId]['creation_name'] ?? null;
                        $membership['creator_url'] = $campaigns[$campaignId]['url'] ?? null;
                    }
                }

                // Only include active memberships
                if ($membership['patron_status'] === 'active_patron' ||
                    $membership['patron_status'] === 'declined_patron') {
                    $memberships[] = $membership;
                }
            }
        }

        return $memberships;
    }

    /**
     * Map the raw user array to a Socialite User instance.
     *
     * @param  array  $user
     * @return \Laravel\Socialite\Two\User
     */
    protected function mapUserToObject(array $user)
    {
        $userData = $user['data'] ?? [];
        $attributes = $userData['attributes'] ?? [];

        $socialiteUser = (new User)->setRaw($user)->map([
            'id' => $userData['id'] ?? null,
            'nickname' => $attributes['vanity'] ?? null,
            'name' => $attributes['full_name'] ?? null,
            'email' => $attributes['email'] ?? null,
            'avatar' => $attributes['image_url'] ?? null,
        ]);

        // Add memberships to raw data for processing
        if (isset($user['memberships'])) {
            $socialiteUser->setRaw(array_merge($user, [
                'memberships' => $user['memberships']
            ]));
        }

        return $socialiteUser;
    }

    /**
     * Set the scopes for creator authentication
     */
    public function setCreatorScopes()
    {
        $this->scopes = [
            'identity',
            'identity[email]',
            'campaigns',
            'campaigns.posts',
            'campaigns.members',
            'w:campaigns.webhook'
        ];

        return $this;
    }

    /**
     * Set the scopes for patron authentication
     */
    public function setPatronScopes()
    {
        $this->scopes = [
            'identity',
            'identity[email]',
            'memberships',
            'memberships.campaign'
        ];

        return $this;
    }

    /**
     * Refresh an access token.
     *
     * @param  string  $refreshToken
     * @return array
     */
    public function refreshToken($refreshToken)
    {
        try {
            $response = $this->getHttpClient()->post($this->getTokenUrl(), [
                'form_params' => [
                    'grant_type' => 'refresh_token',
                    'refresh_token' => $refreshToken,
                    'client_id' => $this->clientId,
                    'client_secret' => $this->clientSecret,
                ],
            ]);

            $data = json_decode($response->getBody(), true);

            Log::info('Patreon token refreshed successfully');

            return $data;
        } catch (ClientException $e) {
            $response = $e->getResponse();
            $body = json_decode((string) $response->getBody(), true);

            Log::error('Failed to refresh Patreon token', [
                'status' => $response->getStatusCode(),
                'error' => $body
            ]);

            throw new \Exception('Failed to refresh token: ' . ($body['error_description'] ?? 'Unknown error'));
        }
    }

    /**
     * Get the access token response for the given code.
     *
     * @param  string  $code
     * @return array
     */
    public function getAccessTokenResponse($code)
    {
        try {
            $response = $this->getHttpClient()->post($this->getTokenUrl(), [
                'form_params' => $this->getTokenFields($code),
            ]);

            $data = json_decode($response->getBody(), true);

            Log::info('Patreon access token obtained', [
                'has_refresh_token' => isset($data['refresh_token']),
                'expires_in' => $data['expires_in'] ?? null
            ]);

            return $data;
        } catch (ClientException $e) {
            $response = $e->getResponse();
            $body = json_decode((string) $response->getBody(), true);

            Log::error('Failed to get Patreon access token', [
                'status' => $response->getStatusCode(),
                'error' => $body
            ]);

            throw new InvalidStateException('Failed to get access token: ' . ($body['error_description'] ?? 'Unknown error'));
        }
    }
}
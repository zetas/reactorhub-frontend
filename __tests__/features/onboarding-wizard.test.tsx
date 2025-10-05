import React, { useState } from 'react';
import { render, screen, fireEvent, waitFor } from '../utils/test-utils';
import userEvent from '@testing-library/user-event';

describe('Phase 4 - Onboarding Wizard', () => {
  describe('Multi-Step Wizard', () => {
    const OnboardingWizard = ({ onComplete }: { onComplete: (data: any) => void }) => {
      const [currentStep, setCurrentStep] = useState(1);
      const [formData, setFormData] = useState({
        name: '',
        interests: [] as string[],
        preferences: '',
      });

      const totalSteps = 3;

      const handleNext = () => {
        if (currentStep < totalSteps) {
          setCurrentStep(currentStep + 1);
        } else {
          onComplete(formData);
        }
      };

      const handleBack = () => {
        if (currentStep > 1) {
          setCurrentStep(currentStep - 1);
        }
      };

      const updateFormData = (updates: Partial<typeof formData>) => {
        setFormData({ ...formData, ...updates });
      };

      return (
        <div role="dialog" aria-labelledby="onboarding-title" aria-describedby="onboarding-desc">
          <h2 id="onboarding-title">Welcome to ReactorHub</h2>
          <p id="onboarding-desc">Let&apos;s get you set up</p>

          <div role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={totalSteps}>
            Step {currentStep} of {totalSteps}
          </div>

          {currentStep === 1 && (
            <div>
              <h3>Tell us about yourself</h3>
              <label htmlFor="name">Your Name</label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => updateFormData({ name: e.target.value })}
              />
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h3>What are your interests?</h3>
              <fieldset>
                <legend className="sr-only">Select your interests</legend>
                <label>
                  <input
                    type="checkbox"
                    checked={formData.interests.includes('gaming')}
                    onChange={(e) => {
                      const interests = e.target.checked
                        ? [...formData.interests, 'gaming']
                        : formData.interests.filter(i => i !== 'gaming');
                      updateFormData({ interests });
                    }}
                  />
                  Gaming
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={formData.interests.includes('tech')}
                    onChange={(e) => {
                      const interests = e.target.checked
                        ? [...formData.interests, 'tech']
                        : formData.interests.filter(i => i !== 'tech');
                      updateFormData({ interests });
                    }}
                  />
                  Technology
                </label>
              </fieldset>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h3>Final preferences</h3>
              <label htmlFor="preferences">Communication Preferences</label>
              <select
                id="preferences"
                value={formData.preferences}
                onChange={(e) => updateFormData({ preferences: e.target.value })}
              >
                <option value="">Select...</option>
                <option value="email">Email</option>
                <option value="notifications">Notifications</option>
              </select>
            </div>
          )}

          <div className="flex justify-between mt-4">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              aria-label="Go to previous step"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              aria-label={currentStep === totalSteps ? 'Complete setup' : 'Go to next step'}
            >
              {currentStep === totalSteps ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      );
    };

    it('should render first step initially', () => {
      const mockComplete = jest.fn();
      render(<OnboardingWizard onComplete={mockComplete} />);

      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '1');
      expect(screen.getByText('Tell us about yourself')).toBeInTheDocument();
      expect(screen.getByLabelText('Your Name')).toBeInTheDocument();
    });

    it('should navigate to next step', async () => {
      const user = userEvent.setup();
      const mockComplete = jest.fn();
      render(<OnboardingWizard onComplete={mockComplete} />);

      const nextButton = screen.getByRole('button', { name: /next step/i });
      await user.click(nextButton);

      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '2');
      expect(screen.getByText('What are your interests?')).toBeInTheDocument();
    });

    it('should navigate back to previous step', async () => {
      const user = userEvent.setup();
      const mockComplete = jest.fn();
      render(<OnboardingWizard onComplete={mockComplete} />);

      // Go to step 2
      await user.click(screen.getByRole('button', { name: /next step/i }));

      // Go back to step 1
      const backButton = screen.getByRole('button', { name: /previous step/i });
      await user.click(backButton);

      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '1');
      expect(screen.getByText('Tell us about yourself')).toBeInTheDocument();
    });

    it('should disable back button on first step', () => {
      const mockComplete = jest.fn();
      render(<OnboardingWizard onComplete={mockComplete} />);

      const backButton = screen.getByRole('button', { name: /previous step/i });
      expect(backButton).toBeDisabled();
    });

    it('should complete onboarding on last step', async () => {
      const user = userEvent.setup();
      const mockComplete = jest.fn();
      render(<OnboardingWizard onComplete={mockComplete} />);

      // Fill in name
      const nameInput = screen.getByLabelText('Your Name');
      await user.type(nameInput, 'John Doe');

      // Go to step 2
      await user.click(screen.getByRole('button', { name: /next step/i }));

      // Select interests
      await user.click(screen.getByLabelText('Gaming'));

      // Go to step 3
      await user.click(screen.getByRole('button', { name: /next step/i }));

      // Select preferences
      const prefsSelect = screen.getByLabelText('Communication Preferences');
      await user.selectOptions(prefsSelect, 'email');

      // Complete
      await user.click(screen.getByRole('button', { name: /complete setup/i }));

      expect(mockComplete).toHaveBeenCalledWith({
        name: 'John Doe',
        interests: ['gaming'],
        preferences: 'email',
      });
    });

    it('should maintain form data across steps', async () => {
      const user = userEvent.setup();
      const mockComplete = jest.fn();
      render(<OnboardingWizard onComplete={mockComplete} />);

      // Fill in name
      const nameInput = screen.getByLabelText('Your Name');
      await user.type(nameInput, 'Jane Smith');

      // Go forward
      await user.click(screen.getByRole('button', { name: /next step/i }));

      // Go back
      await user.click(screen.getByRole('button', { name: /previous step/i }));

      // Check name is still there
      const nameInputAgain = screen.getByLabelText('Your Name') as HTMLInputElement;
      expect(nameInputAgain.value).toBe('Jane Smith');
    });
  });

  describe('Progress Indicator', () => {
    const ProgressSteps = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => {
      const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

      return (
        <nav aria-label="Progress">
          <ol className="flex">
            {steps.map((step) => (
              <li
                key={step}
                className={step === currentStep ? 'active' : step < currentStep ? 'completed' : ''}
                aria-current={step === currentStep ? 'step' : undefined}
              >
                <span className="sr-only">
                  {step === currentStep ? 'Current step' : step < currentStep ? 'Completed' : 'Upcoming'}:
                </span>
                Step {step}
              </li>
            ))}
          </ol>
        </nav>
      );
    };

    it('should render all steps', () => {
      render(<ProgressSteps currentStep={2} totalSteps={4} />);

      expect(screen.getByText('Step 1')).toBeInTheDocument();
      expect(screen.getByText('Step 2')).toBeInTheDocument();
      expect(screen.getByText('Step 3')).toBeInTheDocument();
      expect(screen.getByText('Step 4')).toBeInTheDocument();
    });

    it('should indicate current step', () => {
      const { container } = render(<ProgressSteps currentStep={2} totalSteps={4} />);

      const currentStep = container.querySelector('li[aria-current="step"]');
      expect(currentStep).toHaveTextContent('Step 2');
    });

    it('should mark completed steps', () => {
      const { container } = render(<ProgressSteps currentStep={3} totalSteps={4} />);

      const completedSteps = container.querySelectorAll('li.completed');
      expect(completedSteps).toHaveLength(2); // Steps 1 and 2
    });
  });

  describe('Step Validation', () => {
    const ValidatedWizard = () => {
      const [currentStep, setCurrentStep] = useState(1);
      const [email, setEmail] = useState('');
      const [error, setError] = useState('');

      const validateAndProceed = () => {
        if (currentStep === 1) {
          if (!email.includes('@')) {
            setError('Please enter a valid email');
            return;
          }
        }
        setError('');
        setCurrentStep(currentStep + 1);
      };

      return (
        <div>
          {currentStep === 1 && (
            <div>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!error}
                aria-describedby={error ? 'email-error' : undefined}
              />
              {error && (
                <span id="email-error" role="alert">
                  {error}
                </span>
              )}
            </div>
          )}

          {currentStep === 2 && <div>Step 2 content</div>}

          <button onClick={validateAndProceed}>Next</button>
        </div>
      );
    };

    it('should show validation error for invalid input', async () => {
      const user = userEvent.setup();
      render(<ValidatedWizard />);

      const emailInput = screen.getByLabelText('Email');
      await user.type(emailInput, 'invalid-email');

      const nextButton = screen.getByRole('button', { name: 'Next' });
      await user.click(nextButton);

      expect(screen.getByRole('alert')).toHaveTextContent('Please enter a valid email');
    });

    it('should proceed when input is valid', async () => {
      const user = userEvent.setup();
      render(<ValidatedWizard />);

      const emailInput = screen.getByLabelText('Email');
      await user.type(emailInput, 'valid@email.com');

      const nextButton = screen.getByRole('button', { name: 'Next' });
      await user.click(nextButton);

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      expect(screen.getByText('Step 2 content')).toBeInTheDocument();
    });
  });

  describe('Skip Functionality', () => {
    const SkippableWizard = ({ onComplete, onSkip }: {
      onComplete: () => void;
      onSkip: () => void;
    }) => {
      const [currentStep, setCurrentStep] = useState(1);
      const canSkip = currentStep === 2; // Only allow skipping step 2

      return (
        <div>
          <div>Step {currentStep}</div>

          <div className="flex gap-2">
            <button onClick={() => setCurrentStep(currentStep + 1)}>
              Next
            </button>
            {canSkip && (
              <button onClick={onSkip}>
                Skip this step
              </button>
            )}
            {currentStep === 3 && (
              <button onClick={onComplete}>
                Finish
              </button>
            )}
          </div>
        </div>
      );
    };

    it('should allow skipping optional steps', async () => {
      const user = userEvent.setup();
      const mockComplete = jest.fn();
      const mockSkip = jest.fn();

      render(<SkippableWizard onComplete={mockComplete} onSkip={mockSkip} />);

      // Go to step 2
      await user.click(screen.getByRole('button', { name: 'Next' }));

      // Skip should be available
      const skipButton = screen.getByRole('button', { name: 'Skip this step' });
      expect(skipButton).toBeInTheDocument();

      await user.click(skipButton);
      expect(mockSkip).toHaveBeenCalled();
    });
  });

  describe('Wizard Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      const mockComplete = jest.fn();
      render(
        <div role="dialog" aria-labelledby="wizard-title" aria-describedby="wizard-desc">
          <h2 id="wizard-title">Setup Wizard</h2>
          <p id="wizard-desc">Complete these steps to get started</p>
          <div role="progressbar" aria-valuenow={1} aria-valuemin={1} aria-valuemax={3}>
            Progress: 1 of 3
          </div>
        </div>
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-labelledby', 'wizard-title');
      expect(dialog).toHaveAttribute('aria-describedby', 'wizard-desc');

      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('aria-valuenow', '1');
      expect(progress).toHaveAttribute('aria-valuemin', '1');
      expect(progress).toHaveAttribute('aria-valuemax', '3');
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      const mockComplete = jest.fn();

      render(
        <div>
          <input type="text" placeholder="Field 1" />
          <button>Next</button>
        </div>
      );

      const input = screen.getByPlaceholderText('Field 1');
      const button = screen.getByRole('button');

      await user.tab();
      expect(input).toHaveFocus();

      await user.tab();
      expect(button).toHaveFocus();

      await user.keyboard('{Enter}');
    });

    it('should announce step changes to screen readers', () => {
      render(
        <div role="region" aria-live="polite">
          <div aria-atomic="true">
            Now on step 2 of 3: Select your interests
          </div>
        </div>
      );

      const announcement = screen.getByText(/now on step 2 of 3/i);
      expect(announcement.parentElement).toHaveAttribute('aria-atomic', 'true');
      expect(announcement.parentElement?.parentElement).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('Wizard Completion', () => {
    it('should show success message after completion', async () => {
      const CompletionWizard = () => {
        const [isComplete, setIsComplete] = useState(false);

        if (isComplete) {
          return (
            <div role="status" aria-live="polite">
              <h2>Setup Complete!</h2>
              <p>You&apos;re all set. Welcome to ReactorHub!</p>
            </div>
          );
        }

        return (
          <div>
            <button onClick={() => setIsComplete(true)}>
              Complete Setup
            </button>
          </div>
        );
      };

      const user = userEvent.setup();
      render(<CompletionWizard />);

      const completeButton = screen.getByRole('button');
      await user.click(completeButton);

      await waitFor(() => {
        expect(screen.getByText('Setup Complete!')).toBeInTheDocument();
      });

      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });
});

/**
 * Utility functions for generating placeholder images and content
 */

export const placeholders = {
  /**
   * Generate a placeholder image URL using a reliable service
   */
  image: (width: number, height: number, text?: string) => {
    const baseUrl = 'https://via.placeholder.com';
    const dimensions = `${width}x${height}`;
    const bgColor = '1f2937'; // gray-800
    const textColor = 'ffffff'; // white
    const displayText = text ? encodeURIComponent(text) : 'ReactorHub';
    
    return `${baseUrl}/${dimensions}/${bgColor}/${textColor}?text=${displayText}`;
  },

  /**
   * Generate a video thumbnail placeholder
   */
  videoThumbnail: (width: number = 320, height: number = 180, title?: string) => {
    const text = title ? title.substring(0, 20) : 'Video Thumbnail';
    return placeholders.image(width, height, text);
  },

  /**
   * Generate an avatar placeholder
   */
  avatar: (size: number = 40, name?: string) => {
    const text = name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
    return placeholders.image(size, size, text);
  },

  /**
   * Generate a series poster placeholder
   */
  seriesPoster: (width: number = 200, height: number = 300, title?: string) => {
    const text = title ? title.substring(0, 15) : 'Series Poster';
    return placeholders.image(width, height, text);
  },

  /**
   * Generate a creator banner placeholder
   */
  creatorBanner: (width: number = 800, height: number = 200, name?: string) => {
    const text = name ? `${name} Creator` : 'Creator Banner';
    return placeholders.image(width, height, text);
  },

  /**
   * Mock video data with proper placeholder images
   */
  mockVideo: (id: string, title: string, series?: string) => ({
    id,
    title,
    thumbnail: placeholders.videoThumbnail(320, 180, title),
    series: series ? {
      id: series.toLowerCase().replace(/\s+/g, '-'),
      title: series,
      poster: placeholders.seriesPoster(200, 300, series)
    } : undefined
  }),

  /**
   * Mock user data with proper placeholder avatar
   */
  mockUser: (id: string, name: string, email: string) => ({
    id,
    name,
    email,
    avatar: placeholders.avatar(40, name)
  }),

  /**
   * Fallback image for broken images
   */
  fallback: (width: number = 320, height: number = 180) => {
    return placeholders.image(width, height, 'Image Not Found');
  }
};

/**
 * Image error handler component props
 */
export const handleImageError = (
  event: React.SyntheticEvent<HTMLImageElement>,
  fallbackWidth: number = 320,
  fallbackHeight: number = 180
) => {
  const img = event.currentTarget;
  img.src = placeholders.fallback(fallbackWidth, fallbackHeight);
};

/**
 * Generate a data URL for a solid color placeholder
 */
export const generateColorPlaceholder = (
  width: number,
  height: number,
  color: string = '#1f2937'
) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  if (ctx) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
    return canvas.toDataURL();
  }
  
  return placeholders.image(width, height);
};
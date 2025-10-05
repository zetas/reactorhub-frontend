/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ReeActor Brand Colors - New Scheme
        brand: {
          primary: '#0F0F0F',    // True black
          secondary: '#E94B3C',  // Coral red
          accent: '#6C7A89',     // Steel blue-gray
          support: '#FAFAFA',    // Near white
          success: '#10B981',    // Emerald (keep)
          warning: '#F59E0B',    // Amber (keep)
          error: '#E94B3C',      // Use coral red for errors
          info: '#6C7A89',       // Use accent for info
        },

        // Semantic Color System - Coral Red Scale
        primary: {
          50: '#FEF6F5',
          100: '#FDECEA',
          200: '#FBD9D5',
          300: '#F7B8AF',
          400: '#F38D7F',
          500: '#E94B3C',
          600: '#D73B2C',
          700: '#B82E21',
          800: '#97261C',
          900: '#7D201A',
          950: '#440F0C',
        },

        // Dark Mode Color Palette - True Black Based
        dark: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0F0F0F',
        },
        
        // Surface Colors (for cards, panels, etc.)
        surface: {
          light: {
            primary: '#FAFAFA',
            secondary: '#F5F5F5',
            tertiary: '#E5E5E5',
            elevated: '#FAFAFA',
          },
          dark: {
            primary: '#0F0F0F',
            secondary: '#171717',
            tertiary: '#262626',
            elevated: '#171717',
          }
        },

        // Text Colors
        text: {
          light: {
            primary: '#0F0F0F',
            secondary: '#525252',
            tertiary: '#737373',
            inverse: '#FAFAFA',
          },
          dark: {
            primary: '#FAFAFA',
            secondary: '#D4D4D4',
            tertiary: '#A3A3A3',
            inverse: '#0F0F0F',
          }
        },

        // Border Colors
        border: {
          light: {
            primary: '#E5E5E5',
            secondary: '#D4D4D4',
            focus: '#6C7A89',
          },
          dark: {
            primary: '#262626',
            secondary: '#404040',
            focus: '#6C7A89',
          }
        },
        
        // Accessibility Colors (WCAG AA compliant)
        a11y: {
          // High contrast text colors
          text: {
            'high-contrast': '#0F0F0F',
            'high-contrast-inverse': '#FAFAFA',
          },
          // Focus indicators
          focus: {
            ring: '#6C7A89',
            'ring-dark': '#6C7A89',
            outline: '#6C7A89',
            'outline-dark': '#6C7A89',
          },
          // Status colors with proper contrast
          status: {
            success: '#059669',    // Green-600 for better contrast
            warning: '#D97706',    // Amber-600 for better contrast
            error: '#D73B2C',      // Coral red darker shade for better contrast
            info: '#6C7A89',       // Steel blue-gray for better contrast
          }
        },

        // Accent color scale - Steel Blue-Gray
        accent: {
          50: '#F8F9FA',
          100: '#F1F3F5',
          200: '#E9ECEF',
          300: '#DEE2E6',
          400: '#ADB5BD',
          500: '#6C7A89',
          600: '#5A677A',
          700: '#495566',
          800: '#384452',
          900: '#2A333E',
          950: '#1A1F26',
        }
      },
      // Enhanced mobile-first breakpoints
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      // Mobile-optimized spacing
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      // Touch-friendly sizing
      minHeight: {
        'touch': '44px', // Minimum touch target size
      },
      minWidth: {
        'touch': '44px',
      },
      // Mobile-first typography
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      
      // Design System Shadows
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'sm': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'glow': '0 0 20px rgba(233, 75, 60, 0.5)',
        'glow-lg': '0 0 40px rgba(233, 75, 60, 0.8)',
        'dark-sm': '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)',
        'dark-md': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
        'dark-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
      },
      
      // Animation Durations
      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
        '250': '250ms',
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
      },
      
      // Border Radius System
      borderRadius: {
        'xs': '0.125rem',
        'sm': '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        'full': '9999px',
      },
      
      // Z-Index Scale
      zIndex: {
        '1': '1',
        '10': '10',
        '20': '20',
        '30': '30',
        '40': '40',
        '50': '50',
        'dropdown': '1000',
        'sticky': '1020',
        'fixed': '1030',
        'modal-backdrop': '1040',
        'modal': '1050',
        'popover': '1060',
        'tooltip': '1070',
        'toast': '1080',
      },
      
      // Accessibility utilities
      utilities: {
        // Focus ring utilities
        '.focus-ring': {
          '@apply focus:outline-none focus:ring-2 focus:ring-a11y-focus-ring focus:ring-offset-2': {},
        },
        '.focus-ring-dark': {
          '@apply dark:focus:ring-a11y-focus-ring-dark dark:focus:ring-offset-gray-900': {},
        },
        '.focus-visible-ring': {
          '@apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-a11y-focus-ring focus-visible:ring-offset-2': {},
        },
        
        // High contrast text
        '.text-high-contrast': {
          '@apply text-a11y-text-high-contrast dark:text-a11y-text-high-contrast-inverse': {},
        },
        
        // Screen reader only
        '.sr-only': {
          'position': 'absolute',
          'width': '1px',
          'height': '1px',
          'padding': '0',
          'margin': '-1px',
          'overflow': 'hidden',
          'clip': 'rect(0, 0, 0, 0)',
          'white-space': 'nowrap',
          'border': '0',
        },
        '.not-sr-only': {
          'position': 'static',
          'width': 'auto',
          'height': 'auto',
          'padding': '0',
          'margin': '0',
          'overflow': 'visible',
          'clip': 'auto',
          'white-space': 'normal',
        },
      },
    },
  },
  plugins: [],
}
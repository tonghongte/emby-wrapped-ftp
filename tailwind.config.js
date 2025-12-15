/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    theme: {
        extend: {
            colors: {
                bg: {
                    primary: '#0a0a0a',
                    secondary: '#141414',
                    tertiary: '#1a1a1a'
                },
                accent: {
                    primary: '#1db954',
                    secondary: '#1ed760',
                    purple: '#7c3aed',
                    pink: '#ec4899',
                    blue: '#3b82f6',
                    gold: '#fbbf24'
                }
            },
            fontFamily: {
                display: ['Space Grotesk', 'system-ui', 'sans-serif'],
                body: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace']
            },
            fontSize: {
                'hero': 'clamp(3rem, 15vw, 6rem)',
                'title': 'clamp(1.5rem, 6vw, 2.5rem)',
                'body-lg': 'clamp(1rem, 4vw, 1.25rem)',
                'caption': 'clamp(0.75rem, 3vw, 1rem)'
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out forwards',
                'slide-up': 'slideUp 0.5s ease-out forwards',
                'scale-in': 'scaleIn 0.3s ease-out forwards',
                'ken-burns': 'kenBurns 20s ease-out forwards',
                'pulse-glow': 'pulseGlow 2s ease-in-out infinite'
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' }
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' }
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' }
                },
                kenBurns: {
                    '0%': { transform: 'scale(1)' },
                    '100%': { transform: 'scale(1.05)' }
                },
                pulseGlow: {
                    '0%, 100%': { opacity: '0.5' },
                    '50%': { opacity: '1' }
                }
            }
        }
    },
    plugins: []
};


import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Cosmic theme colors
				cosmic: {
					void: 'hsl(var(--cosmic-void))',
					deep: 'hsl(var(--cosmic-deep))',
					nebula: 'hsl(var(--cosmic-nebula))',
					stardust: 'hsl(var(--cosmic-stardust))',
					aurora: 'hsl(var(--cosmic-aurora))',
					constellation: 'hsl(var(--cosmic-constellation))',
					moonlight: 'hsl(var(--cosmic-moonlight))',
					solar: 'hsl(var(--cosmic-solar))',
				},
				gradient: {
					cosmic: 'var(--gradient-cosmic)',
					nebula: 'var(--gradient-nebula)',
					stardust: 'var(--gradient-stardust)',
					meditation: 'var(--gradient-meditation)',
				},
				// Custom colors for our habit app
				habit: {
					primary: "#9b87f5",
					secondary: "#7E69AB",
					tertiary: "#6E59A5",
					dark: "#1A1F2C",
					light: "#D6BCFA",
				},
				status: {
					completed: "#10B981",
					pending: "#F59E0B",
					missed: "#EF4444",
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'bounce-small': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-5px)' }
				},
				'pulse-light': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.7' }
				},
				'scale-in': {
					'0%': {
						transform: 'scale(0.95)',
						opacity: '0'
					},
					'100%': {
						transform: 'scale(1)',
						opacity: '1'
					}
				},
				'check-mark': {
					'0%': {
						height: '0',
						width: '0',
						opacity: '0'
					},
					'40%': {
						height: '0',
						width: '8px',
						opacity: '1'
					},
					'100%': {
						height: '16px',
						width: '8px',
						opacity: '1'
					}
				},
				'star-twinkle': {
					'0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
					'50%': { opacity: '1', transform: 'scale(1.2)' }
				},
				'orbit': {
					'0%': { transform: 'rotate(0deg) translateX(20px) rotate(0deg)' },
					'100%': { transform: 'rotate(360deg) translateX(20px) rotate(-360deg)' }
				},
				'nebula-pulse': {
					'0%, 100%': { backgroundSize: '100% 100%', opacity: '0.7' },
					'50%': { backgroundSize: '110% 110%', opacity: '0.9' }
				},
				'planet-glow': {
					'0%, 100%': { boxShadow: '0 0 20px hsl(var(--cosmic-nebula) / 0.5)' },
					'50%': { boxShadow: '0 0 40px hsl(var(--cosmic-nebula) / 0.8), 0 0 60px hsl(var(--cosmic-aurora) / 0.4)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'bounce-small': 'bounce-small 1.5s ease-in-out infinite',
				'pulse-light': 'pulse-light 2s ease-in-out infinite',
				'scale-in': 'scale-in 0.2s ease-out',
				'check-mark': 'check-mark 0.3s ease-in-out forwards',
				'star-twinkle': 'star-twinkle 3s ease-in-out infinite',
				'orbit': 'orbit 10s linear infinite',
				'nebula-pulse': 'nebula-pulse 8s ease-in-out infinite',
				'planet-glow': 'planet-glow 3s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

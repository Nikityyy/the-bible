tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "gold-accent": "#D4AF37",
        "gold-accent-light": "#E7C66B",
        "background-base": "#F9F9FB",
        "surface-white": "#FFFFFF",
        "text-primary": "#1C1C1E",
        "text-secondary": "#6E6E73",
        "divider-faint": "#E5E5EA",
      },
      fontFamily: {
        "sans": ["Inter", 'Helvetica Neue', 'sans-serif']
      },
      borderRadius: {
        "lg": "16px",
        "xl": "20px",
      },
      boxShadow: {
        'soft': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'subtle': '0 1px 3px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-in': 'slideIn 0.5s cubic-bezier(0.25, 1, 0.5, 1) forwards',
        'slide-out': 'slideOut 0.5s cubic-bezier(0.25, 1, 0.5, 1) forwards',
        'list-fade-in': 'listFadeIn 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        listFadeIn: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(100%)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
        slideOut: {
          '0%': { transform: 'translateX(0)', opacity: 1 },
          '100%': { transform: 'translateX(100%)', opacity: 0 },
        }
      },
    },
  },
}

// PDF configuration constants
export const PDF_CONFIG = {
  paperSize: 'A4',
  margin: {
    top: '1cm',
    left: '1cm',
    right: '1cm',
    bottom: '1cm'
  },
  scale: 0.8,
  font: 'Arial'
} as const;

// Use web-safe fonts only
export const PDF_FONTS = {
  'Arial': 'Arial',
  'Arial-Bold': 'Arial-Bold',
  'Times New Roman': 'Times New Roman',
  'Times New Roman-Bold': 'Times New Roman-Bold'
} as const;
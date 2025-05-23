export function parseBackground(input: string | undefined) {
  const result = {
    gradient: false,
    direction: '',
    color1: '',
    color2: '',
    opacity1: 1,
    opacity2: 1,
    image: '',
    ImageSize: '',
    color: '', // For solid colors
  };

  // Handle empty or undefined input
  if (!input || input.trim() === '') {
    return result;
  }

  // Regex for gradients (supports rgb, rgba, and hex colors)
  const gradientRegex = /linear-gradient\(\s*(to [\w\s]+),\s*(rgba?\([^)]+\)|#[0-9a-fA-F]{3,6}),\s*(rgba?\([^)]+\)|#[0-9a-fA-F]{3,6})\)/;
  // Regex for images
  const imageRegex = /url\("([^"]+)"\).*\/\s*(\w+)$/;
  // Regex for solid colors (hex, rgb, or rgba)
  const solidColorRegex = /^(#(?:[0-9a-fA-F]{3}){1,2}|rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)|rgba\(\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\))$/;

  // Check for solid color
  const solidMatch = input.match(solidColorRegex);
  if (solidMatch) {
    result.color = input;
    if (input.startsWith('rgba')) {
      const rgbaMatch = input.match(/rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)/);
      if (rgbaMatch) {
        result.opacity1 = parseFloat(rgbaMatch[4]) || 1;
        result.color1 = `rgb(${rgbaMatch[1]}, ${rgbaMatch[2]}, ${rgbaMatch[3]})`;
      }
    } else if (input.startsWith('rgb')) {
      result.color1 = input;
      result.opacity1 = 1;
    } else if (input.startsWith('#')) {
      result.color1 = input;
      result.opacity1 = 1;
    }
    return result;
  }

  // Check for gradient
  const gradientMatch = input.match(gradientRegex);
  if (gradientMatch) {
    result.gradient = true;
    result.direction = gradientMatch[1];

    const parseColor = (colorStr: string) => {
      if (colorStr.startsWith('rgba')) {
        const parts = colorStr.match(/rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)/);
        if (parts) {
          return {
            r: parseInt(parts[1], 10),
            g: parseInt(parts[2], 10),
            b: parseInt(parts[3], 10),
            a: parseFloat(parts[4]) || 1,
          };
        }
      } else if (colorStr.startsWith('rgb')) {
        const parts = colorStr.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);
        if (parts) {
          return {
            r: parseInt(parts[1], 10),
            g: parseInt(parts[2], 10),
            b: parseInt(parts[3], 10),
            a: 1,
          };
        }
      } else if (colorStr.startsWith('#')) {
        let hex = colorStr.replace('#', '');
        if (hex.length === 3) {
          hex = hex
            .split('')
            .map(c => c + c)
            .join('');
        }
        if (hex.length === 6) {
          return {
            r: parseInt(hex.substring(0, 2), 16),
            g: parseInt(hex.substring(2, 4), 16),
            b: parseInt(hex.substring(4, 6), 16),
            a: 1,
          };
        }
      }
      return { r: 255, g: 255, b: 255, a: 1 }; // Fallback to white
    };

    const color1 = parseColor(gradientMatch[2]);
    const color2 = parseColor(gradientMatch[3]);

    result.color1 = `rgb(${color1.r}, ${color1.g}, ${color1.b})`;
    result.opacity1 = color1.a;
    result.color2 = `rgb(${color2.r}, ${color2.g}, ${color2.b})`;
    result.opacity2 = color2.a;
  }

  // Check for image
  const imageMatch = input.match(imageRegex);
  if (imageMatch) {
    result.image = imageMatch[1];
    result.ImageSize = imageMatch[2];
  }

  return result;
}
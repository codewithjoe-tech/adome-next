export function parseBackground(input: string) {
  const result = {
    gradient: false,
    direction: '',
    color1: '',
    color2: '',
    opacity1: 1,
    opacity2: 1,
    image: '',
    ImageSize: '',
    color: '', // Add a field for solid colors
  };

  // Regex for gradients
  const gradientRegex = /linear-gradient\(\s*(to [\w\s]+),\s*rgba?\(([^)]+)\),\s*rgba?\(([^)]+)\)\)/;
  // Regex for images
  const imageRegex = /url\("([^"]+)"\).*\/\s*(\w+)$/;
  // Regex for solid colors (hex, rgb, or rgba)
  const solidColorRegex = /^(#(?:[0-9a-fA-F]{3}){1,2}|rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)|rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\))$/;

  // Check for solid color
  const solidMatch = input.match(solidColorRegex);
  if (solidMatch) {
    result.color = input; // Store the solid color directly
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

    const parseColor = (rgbaStr: string) => {
      const parts = rgbaStr.split(',').map(part => part.trim());
      const r = parseInt(parts[0], 10) || 0;
      const g = parseInt(parts[1], 10) || 0;
      const b = parseInt(parts[2], 10) || 0;
      const a = parseFloat(parts[3]) || 1;
      return { r, g, b, a };
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
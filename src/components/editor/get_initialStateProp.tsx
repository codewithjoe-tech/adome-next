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
  };

  const gradientRegex = /linear-gradient\(\s*(to [\w\s]+),\s*rgba?\(([^)]+)\),\s*rgba?\(([^)]+)\)\)/;
  const imageRegex = /url\("([^"]+)"\).*\/\s*(\w+)$/;

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

  const imageMatch = input.match(imageRegex);
  if (imageMatch) {
    result.image = imageMatch[1];
    result.ImageSize = imageMatch[2];
  }

  return result;
}

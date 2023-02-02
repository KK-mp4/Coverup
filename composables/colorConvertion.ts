export function hexToRgb(hex: string) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

//https://stackoverflow.com/a/73998199
export function RGBtoXYZ([R, G, B]: [number, number, number]) {
    const [var_R, var_G, var_B] = [R, G, B]
        .map(x => x / 255)
        .map(x => x > 0.04045
            ? Math.pow(((x + 0.055) / 1.055), 2.4)
            : x / 12.92)
        .map(x => x * 100)

    // Observer. = 2°, Illuminant = D65
    const X = var_R * 0.4124 + var_G * 0.3576 + var_B * 0.1805
    const Y = var_R * 0.2126 + var_G * 0.7152 + var_B * 0.0722
    const Z = var_R * 0.0193 + var_G * 0.1192 + var_B * 0.9505
    return [X, Y, Z]
}

const ref_X =  95.047;
const ref_Y = 100.000;
const ref_Z = 108.883;

export function XYZtoLAB([x, y, z]: [number, number, number]) {
    const [ var_X, var_Y, var_Z ] = [ x / ref_X, y / ref_Y, z / ref_Z ]
        .map(a => a > 0.008856
            ? Math.pow(a, 1 / 3)
            : (7.787 * a) + (16 / 116))

    const CIE_L = (116 * var_Y) - 16
    const CIE_a = 500 * (var_X - var_Y)
    const CIE_b = 200 * (var_Y - var_Z)

    return [CIE_L, CIE_a, CIE_b]
}
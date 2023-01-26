import validate from './validation.ts';
import { Colour, Hsla, Rgba } from './internal/data.ts';
import { HslaColor, RgbaColor, Rgba255Color } from './internal/model.ts';

// Provide the hue, saturation, and lightness values for the color.
// Hue takes a value between 0 and 360, saturation and lightness take a value between 0 and 1.
function hsl(hue: number, saturation: number, lightness: number) {
    const color = new HslaColor(hue, saturation, lightness, 1);
    return validate(color);
}

// Provide the hue, saturation, and lightness values for the color.
// Hue takes a value between 0 and 360, saturation, lightness and alpha between 0 and 1.
function hsla(
    hue: number,
    saturation: number,
    lightness: number,
    alpha: number
) {
    const color = new HslaColor(hue, saturation, lightness, alpha);
    return validate(color);
}

// Create a color from a Hsla object.
// Example: hsl(...fromHsl({ hue: 0, saturation: 0, lightness: 0, alpha: 1 }));
function fromHsl({ hue, saturation, lightness }: Hsla): Colour {
    return [hue, saturation, lightness, 1];
}

// Create a color from a Hsla object.
// Example: hsla(...fromHsla({ hue: 0, saturation: 0, lightness: 0, alpha: 1 }));
function fromHsla({ hue, saturation, lightness, alpha }: Hsla): Colour {
    return [hue, saturation, lightness, alpha];
}

// Deconstruct a `Color` into its hsl channels.
function toHsl(colour: Colour) {
    const [hue, saturation, lightness, alpha] = colour;
    const color = new HslaColor(hue, saturation, lightness, alpha);
    return validate(color);
}

// Provide the red, green, and blue channels for the color.
// Each channel takes a value between 0 and 1.
function rgb(red: number, green: number, blue: number) {
    const color = new RgbaColor(red, green, blue, 1);
    return validate(color);
}

// Provide the red, green, and blue channels for the color.
// Each channel take a value between 0 and 1.
function rgba(red: number, green: number, blue: number, alpha: number) {
    const color = new RgbaColor(red, green, blue, alpha);
    return validate(color);
}

// Provide the red, green, and blue channels for the color.
// Each channel takes a value between 0 and 255.
function rgb255(red: number, green: number, blue: number) {
    const color = new Rgba255Color(red, green, blue, 1);
    return validate(color);
}

// Provide the red, green, and blue channels for the color.
// Each channel takes a value between 0 and 255, and alpha between 0 and 1.
function rgba255(red: number, green: number, blue: number, alpha: number) {
    const color = new Rgba255Color(red, green, blue, alpha);
    return validate(color);
}

// Create a color from a Rgba object.
// Example: rgb(...fromRgb({ red: 0, green: 0, blue: 0, alpha: 1 }));
function fromRgb({ red, green, blue }: Rgba): Colour {
    return [red, green, blue, 1];
}

// Create a color from a Rgba object.
// Example: rgba(...fromRgba({ red: 0, green: 0, blue: 0, alpha: 1 }));
function fromRgba({ red, green, blue, alpha }: Rgba): Colour {
    return [red, green, blue, alpha];
}

// Deconstruct a `Color` into its rgb channels.
function toRgb(colour: Colour) {
    const [red, green, blue, alpha] = colour;
    const color = new RgbaColor(red, green, blue, alpha);
    return validate(color);
}

export {
    hsl,
    hsla,
    fromHsl,
    fromHsla,
    toHsl,
    rgb,
    rgba,
    rgb255,
    rgba255,
    fromRgb,
    fromRgba,
    toRgb,
};

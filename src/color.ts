import { Colour, ColourAlpha, Color, Rgba, Hsla } from './internal/model';

// Provide the red, green, and blue channels for the color.
// Each channel takes a value between 0 and 255.
function rgb(red: number, green: number, blue: number): Color {
    if (!isRgb(red, green, blue)) {
        throw new Error('Each channel should be a value between 0 and 255.');
    }
    return { red, green, blue, alpha: 1 };
}

// Provide the red, green, and blue channels for the color.
// Each channel takes a value between 0 and 255, and alpha between 0 and 1.
function rgba(red: number, green: number, blue: number, alpha: number): Color {
    if (!isRgb(red, green, blue, alpha)) {
        throw new Error(
            'Each channel should be a value between 0 and 255, and alpha between 0 and 1.'
        );
    }
    return { red, green, blue, alpha };
}

// Create a color from a Rgba object.
// Example: rgb(...fromRgb({ red: 0, green: 0, blue: 0, alpha: 1 }));
function fromRgb(color: Rgba): Colour {
    return [color.red, color.green, color.blue];
}

// Create a color from a Rgba object.
// Example: rgba(...fromRgba({ red: 0, green: 0, blue: 0, alpha: 1 }));
function fromRgba(color: Rgba): ColourAlpha {
    return [color.red, color.green, color.blue, color.alpha];
}

function isRgb(red: number, green: number, blue: number, alpha?: number) {
    if (alpha) {
        return (
            red >= 0 &&
            red <= 255 &&
            green >= 0 &&
            green <= 255 &&
            blue >= 0 &&
            blue <= 255 &&
            alpha >= 0 &&
            alpha <= 1
        );
    } else {
        return (
            red >= 0 &&
            red <= 255 &&
            green >= 0 &&
            green <= 255 &&
            blue >= 0 &&
            blue <= 255
        );
    }
}

// Provide the hue, saturation, and lightness values for the color.
// Hue takes a value between 0 and 360, saturation and lightness take a value between 0 and 100.
function hsl(hue: number, saturation: number, lightness: number): Color {
    if (!isHsl(hue, saturation, lightness)) {
        throw new Error(
            'Hue should be a value between 0 and 360, saturation and lightness between 0 and 100.'
        );
    }
    return { hue, saturation, lightness, alpha: 1 };
}

// Provide the hue, saturation, and lightness values for the color.
// Hue takes a value between 0 and 360, saturation and lightness take a value between 0 and 100, and alpha between 0 and 1.
function hsla(
    hue: number,
    saturation: number,
    lightness: number,
    alpha: number
): Color {
    if (!isHsl(hue, saturation, lightness, alpha)) {
        throw new Error(
            'Hue should be a value between 0 and 360, saturation and lightness between 0 and 100, and alpha between 0 and 1.'
        );
    }
    return { hue, saturation, lightness, alpha };
}

// Create a color from a Hsla object.
// Example: hsl(...fromHsl({ hue: 0, saturation: 0, lightness: 0, alpha: 1 }));
function fromHsl(color: Hsla): Colour {
    return [color.hue, color.saturation, color.lightness];
}

// Create a color from a Hsla object.
// Example: hsla(...fromHsla({ hue: 0, saturation: 0, lightness: 0, alpha: 1 }));
function fromHsla(color: Hsla): ColourAlpha {
    return [color.hue, color.saturation, color.lightness, color.alpha];
}

function isHsl(
    hue: number,
    saturation: number,
    lightness: number,
    alpha?: number
) {
    if (alpha) {
        return (
            hue >= 0 &&
            hue <= 360 &&
            saturation >= 0 &&
            saturation <= 100 &&
            lightness >= 0 &&
            lightness <= 100 &&
            alpha >= 0 &&
            alpha <= 1
        );
    } else {
        return (
            hue >= 0 &&
            hue <= 360 &&
            saturation >= 0 &&
            saturation <= 100 &&
            lightness >= 0 &&
            lightness <= 100
        );
    }
}

export { rgb, rgba, fromRgb, fromRgba, hsl, hsla, fromHsl, fromHsla };

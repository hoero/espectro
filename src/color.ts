import { classValidator } from './deps.ts';
import validate from './validation.ts';
import { Color, Colour, Hsla, Rgba, Notation } from './internal/data.ts';

const min = {
    message:
        'Invalid value. Channel should be more or equal to $constraint1, but actual value is $value.',
};
const max = {
    message:
        'Invalid value. Channel should be less or equal to $constraint1, but actual value is $value.',
};

class ChannelsColor {
    @classValidator.Min(0, min)
    private a: number;
    @classValidator.Min(0, min)
    private b: number;
    @classValidator.Min(0, min)
    private c: number;
    @classValidator.Min(0, min)
    private d: number;

    constructor(
        private notation: Notation,
        a: number,
        b: number,
        c: number,
        d: number
    ) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
    }

    get color(): Color {
        switch (this.notation) {
            case Notation.Hsla:
                return Hsla(this.a, this.b, this.c, this.d);
            case Notation.Rgba:
                return Rgba(this.a, this.b, this.c, this.d);

            default:
                throw new Error('Use Hsla or Rgba notation.');
        }
    }
}

class HslaColor extends ChannelsColor {
    @classValidator.Max(360, max)
    hue: number;
    @classValidator.Max(1, max)
    saturation: number;
    @classValidator.Max(1, max)
    lightness: number;
    @classValidator.Max(1, max)
    alpha: number;

    constructor(h: number, s: number, l: number, a: number) {
        super(Notation.Hsla, h, s, l, a);
        this.hue = h;
        this.saturation = s;
        this.lightness = l;
        this.alpha = a;
    }
}

class RgbaColor extends ChannelsColor {
    @classValidator.Max(1, max)
    red: number;
    @classValidator.Max(1, max)
    green: number;
    @classValidator.Max(1, max)
    blue: number;
    @classValidator.Max(1, max)
    alpha: number;

    constructor(red: number, green: number, blue: number, alpha: number) {
        super(Notation.Rgba, red, green, blue, alpha);
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
    }
}

class Rgba255Color extends ChannelsColor {
    @classValidator.Max(255)
    red: number;
    @classValidator.Max(255)
    green: number;
    @classValidator.Max(255)
    blue: number;
    @classValidator.Max(1, max)
    alpha: number;

    constructor(red: number, green: number, blue: number, alpha: number) {
        super(Notation.Rgba, red, green, blue, alpha);
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
    }
}

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
    ChannelsColor,
    HslaColor,
    RgbaColor,
    Rgba255Color,
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

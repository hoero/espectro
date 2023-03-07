import { classValidator } from '../deps.ts';
import validate from './validation.ts';
import { Colour, Hsla, Rgba, Notation } from './internal/data.ts';

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
    // TODO:
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

    get color(): Hsla | Rgba {
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

/**
 * Provide the hue, saturation, and lightness values for the color.
 * @param hue takes a value between 0 and 360.
 * @param saturation takes a value between 0 and 1.
 * @param lightness takes a value between 0 and 1.
 * @returns a Promise that resolves on Hsla.
 */
function hsl(
    hue: number,
    saturation: number,
    lightness: number
): Promise<Hsla | Rgba> {
    const color = new HslaColor(hue, saturation, lightness, 1);
    return validateColor(color);
}

/**
 * Provide the hue, saturation, and lightness values for the color.
 * @param hue takes a value between 0 and 360.
 * @param saturation takes a value between 0 and 1.
 * @param lightness takes a value between 0 and 1.
 * @param alpha takes a value between 0 and 1.
 * @returns a Promise that resolves on Hsla.
 */
function hsla(
    hue: number,
    saturation: number,
    lightness: number,
    alpha: number
): Promise<Hsla | Rgba> {
    const color = new HslaColor(hue, saturation, lightness, alpha);
    return validateColor(color);
}

/**
 * Create a color from a Hsla object.
 * Example: hsl(...fromHsl({ hue: 0, saturation: 0, lightness: 0, alpha: 1 }));
 * @param hsl e.g { hue: 0, saturation: 0, lightness: 0, alpha: 1 }
 * @returns an array with each channel.
 */
function fromHsl({ hue, saturation, lightness }: Hsla): Colour {
    return [hue, saturation, lightness, 1];
}

/**
 * Create a color from a Hsla object.
 * Example: hsla(...fromHsla({ hue: 0, saturation: 0, lightness: 0, alpha: 1 }));
 * @param hsla e.g { hue: 0, saturation: 0, lightness: 0, alpha: 1 }
 * @returns an array with each channel.
 */
function fromHsla({ hue, saturation, lightness, alpha }: Hsla): Colour {
    return [hue, saturation, lightness, alpha];
}

/**
 * Deconstruct a `Color` into its hsl channels.
 * @param colour an array with each channel.
 * @returns a Promise that resolves on Hsla.
 */
function toHsl(colour: Colour): Promise<Hsla | Rgba> {
    const [hue, saturation, lightness, alpha] = colour;
    const color = new HslaColor(hue, saturation, lightness, alpha);
    return validateColor(color);
}

/**
 * Provide the red, green, and blue channels for the color.
 * @param red takes a value between 0 and 1.
 * @param green takes a value between 0 and 1.
 * @param blue takes a value between 0 and 1.
 * @returns a Promise that resolves on Rgba.
 */
function rgb(red: number, green: number, blue: number): Promise<Hsla | Rgba> {
    const color = new RgbaColor(red, green, blue, 1);
    return validateColor(color);
}

/**
 * Provide the red, green, blue and alpha channels for the color.
 * @param red takes a value between 0 and 1.
 * @param green takes a value between 0 and 1.
 * @param blue takes a value between 0 and 1.
 * @param alpha takes a value between 0 and 1.
 * @returns a Promise that resolves on Rgba.
 */
function rgba(
    red: number,
    green: number,
    blue: number,
    alpha: number
): Promise<Hsla | Rgba> {
    const color = new RgbaColor(red, green, blue, alpha);
    return validateColor(color);
}

/**
 * Provide the red, green, and blue channels for the color.
 * @param red takes a value between 0 and 255.
 * @param green takes a value between 0 and 255.
 * @param blue takes a value between 0 and 255.
 * @returns a Promise that resolves on Rgba.
 */
function rgb255(
    red: number,
    green: number,
    blue: number
): Promise<Hsla | Rgba> {
    const color = new Rgba255Color(red, green, blue, 1);
    return validateColor(color);
}

/**
 * Provide the red, green, blue and alpha channels for the color.
 * @param red takes a value between 0 and 255.
 * @param green takes a value between 0 and 255.
 * @param blue takes a value between 0 and 255.
 * @param alpha takes a value between 0 and 1.
 * @returns a Promise that resolves on Rgba.
 */
function rgba255(
    red: number,
    green: number,
    blue: number,
    alpha: number
): Promise<Hsla | Rgba> {
    const color = new Rgba255Color(red, green, blue, alpha);
    return validateColor(color);
}

/**
 * Create a color from a Rgba object.
 * Example: rgb(...fromRgb({ red: 0, green: 0, blue: 0, alpha: 1 }));
 * @param rgb e.g. { red: 0, green: 0, blue: 0, alpha: 1 }
 * @returns  an array with each channel.
 */
function fromRgb({ red, green, blue }: Rgba): Colour {
    return [red, green, blue, 1];
}

/**
 * Create a color from a Rgba object.
 * Example: rgba(...fromRgba({ red: 0, green: 0, blue: 0, alpha: 1 }));
 * @param rgba e.g. { red: 0, green: 0, blue: 0, alpha: 1 }
 * @returns  an array with each channel.
 */
function fromRgba({ red, green, blue, alpha }: Rgba): Colour {
    return [red, green, blue, alpha];
}

/**
 * Deconstruct a `Color` into its rgb channels.
 * @param colour an array with each channel.
 * @returns a Promise that resolves on Rgba.
 */
function toRgb(colour: Colour): Promise<Hsla | Rgba> {
    const [red, green, blue, alpha] = colour;
    const color = new RgbaColor(red, green, blue, alpha);
    return validateColor(color);
}

async function validateColor(color: ChannelsColor): Promise<Hsla | Rgba> {
    const result = await validate(color);
    if (result === undefined) {
        throw new Error('Color is undefined!');
    }
    return result;
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

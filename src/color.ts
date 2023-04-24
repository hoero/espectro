// deno-lint-ignore-file
/**
 * # Color
 *
 * In order to use attributes like `Font.color` and `Background.color`, you'll need to make some colors!
 *
 * @docs Color, Colour, hsl, hsla, fromHsl, fromHsla, toHsl, rgba, rgb, rgb255, rgba255, fromRgb, fromRgba, toRgb
 */

import { Colour, Hsla, Rgba, Notation, Color } from './internal/data.ts';

interface ValidatorConfig {
    [property: string]: {
        [validatorProp: string]: [string, Record<string, unknown>][];
    };
}

const registeredValidators: ValidatorConfig = {};

const min =
    'Invalid value. Channel should be more or equal to $constraint, but actual value is $value.';
const max =
    'Invalid value. Channel should be less or equal to $constraint, but actual value is $value.';

class ChannelsColor {
    private _notation: Notation;
    @Min(0, min)
    private a: number;
    @Min(0, min)
    private b: number;
    @Min(0, min)
    private c: number;
    @Min(0, min)
    private d: number;

    constructor(
        notation: Notation,
        a: number,
        b: number,
        c: number,
        d: number
    ) {
        this._notation = notation;
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
    }

    get color(): Color {
        switch (this._notation) {
            case Notation.Hsl:
                return Hsla(this.a, this.b, this.c, 1, this._notation);

            case Notation.Hsla:
                return Hsla(this.a, this.b, this.c, this.d, this._notation);

            case Notation.Rgb:
                return Rgba(this.a, this.b, this.c, 1, this._notation);

            case Notation.Rgba:
                return Rgba(this.a, this.b, this.c, this.d, this._notation);

            case Notation.Rgb255:
                return Rgba(this.a, this.b, this.c, 1, this._notation);

            case Notation.Rgba255:
                return Rgba(this.a, this.b, this.c, this.d, this._notation);

            default:
                throw new Error('Use Hsla or Rgba notation.');
        }
    }
}

class HslaColor extends ChannelsColor {
    notation: Notation.Hsl | Notation.Hsla;
    @Max(360, max)
    hue: number;
    @Max(100, max)
    saturation: number;
    @Max(100, max)
    lightness: number;
    @Max(1, max)
    alpha: number;

    constructor(
        n: Notation.Hsl | Notation.Hsla,
        h: number,
        s: number,
        l: number,
        a: number
    ) {
        super(n, h, s, l, a);
        this.notation = n;
        this.hue = h;
        this.saturation = s;
        this.lightness = l;
        this.alpha = a;
    }
}

class RgbaColor extends ChannelsColor {
    notation: Notation.Rgb | Notation.Rgba;
    @Max(1, max)
    red: number;
    @Max(1, max)
    green: number;
    @Max(1, max)
    blue: number;
    @Max(1, max)
    alpha: number;

    constructor(
        n: Notation.Rgb | Notation.Rgba,
        r: number,
        g: number,
        b: number,
        a: number
    ) {
        super(n, r, g, b, a);
        this.notation = n;
        this.red = r;
        this.green = g;
        this.blue = b;
        this.alpha = a;
    }
}

class Rgba255Color extends ChannelsColor {
    notation: Notation.Rgb255 | Notation.Rgba255;
    @Max(255, max)
    red: number;
    @Max(255, max)
    green: number;
    @Max(255, max)
    blue: number;
    @Max(1, max)
    alpha: number;

    constructor(
        n: Notation.Rgb255 | Notation.Rgba255,
        r: number,
        g: number,
        b: number,
        a: number
    ) {
        super(n, r, g, b, a);
        this.notation = n;
        this.red = r;
        this.green = g;
        this.blue = b;
        this.alpha = a;
    }
}

function Min(min: number, message: string) {
    return function (target: any, propName: string) {
        registeredValidators[target.constructor.name] = {
            ...registeredValidators[target.constructor.name],
            [propName]: [
                ...(registeredValidators[target.constructor.name]?.[propName] ??
                    []),
                ['min', { val: min, message }],
            ],
        };
    };
}

function Max(max: number, message: string) {
    return function (target: any, propName: string) {
        registeredValidators[target.constructor.name] = {
            ...registeredValidators[target.constructor.name],
            [propName]: [
                ...(registeredValidators[target.constructor.name]?.[propName] ??
                    []),
                ['max', { val: max, message }],
            ],
        };
    };
}

function isValid(obj: any): boolean {
    const objValidatorConfig = registeredValidators[obj.constructor.name];
    if (!objValidatorConfig) return true;
    let isValid = true;
    for (const prop in objValidatorConfig) {
        for (const validator of objValidatorConfig[prop]) {
            switch (validator[0]) {
                case 'min':
                    isValid = isValid && obj[prop] >= <number>validator[1].val;
                    break;
                case 'max':
                    isValid = isValid && obj[prop] <= <number>validator[1].val;
                    break;
            }
        }
    }
    return isValid;
}

function validate(color: any): Color {
    const objValidatorConfig = registeredValidators[color.constructor.name];
    const isValid_: boolean = isValid(color);
    let color_ = Hsla(0, 0, 0, 0, Notation.Hsla);
    for (const prop in objValidatorConfig) {
        for (const validator of objValidatorConfig[prop]) {
            switch (validator[0]) {
                case 'min': {
                    const msg = <string>validator[1].message,
                        val = `${color[prop]}`,
                        constraint = `${validator[1].val}`;
                    if (!isValid_)
                        throw new Error(
                            msg
                                .replace('$constraint', constraint)
                                .replace('$value', val)
                        );
                    color_ = color.color;
                    break;
                }
                case 'max': {
                    const msg = <string>validator[1].message,
                        val = `${color[prop]}`,
                        constraint = `${validator[1].val}`;
                    if (!isValid_)
                        throw new Error(
                            msg
                                .replace('$constraint', constraint)
                                .replace('$value', val)
                        );
                    color_ = color.color;
                    break;
                }
            }
        }
    }
    return color_;
}

/**
 * Provide the hue, saturation, and lightness values for the color.
 * @param hue takes a value between 0 and 360.
 * @param saturation takes a value between 0 and 100.
 * @param lightness takes a value between 0 and 100.
 */
function hsl(hue: number, saturation: number, lightness: number): Color {
    const color = new HslaColor(Notation.Hsl, hue, saturation, lightness, 1);
    return validate(color);
}

/**
 * Provide the hue, saturation, and lightness values for the color.
 * @param hue takes a value between 0 and 360.
 * @param saturation takes a value between 0 and 100.
 * @param lightness takes a value between 0 and 100.
 * @param alpha takes a value between 0 and 1.
 */
function hsla(
    hue: number,
    saturation: number,
    lightness: number,
    alpha: number
): Color {
    const color = new HslaColor(
        Notation.Hsla,
        hue,
        saturation,
        lightness,
        alpha
    );
    return validate(color);
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
 */
function toHsl(colour: Colour): Color {
    const [hue, saturation, lightness, alpha] = colour;
    const color = new HslaColor(
        Notation.Hsl,
        hue,
        saturation,
        lightness,
        alpha
    );
    return validate(color);
}

/**
 * Provide the red, green, and blue channels for the color.
 * @param red takes a value between 0 and 1.
 * @param green takes a value between 0 and 1.
 * @param blue takes a value between 0 and 1.
 */
function rgb(red: number, green: number, blue: number): Color {
    const color = new RgbaColor(Notation.Rgb, red, green, blue, 1);
    return validate(color);
}

/**
 * Provide the red, green, blue and alpha channels for the color.
 * @param red takes a value between 0 and 1.
 * @param green takes a value between 0 and 1.
 * @param blue takes a value between 0 and 1.
 * @param alpha takes a value between 0 and 1.
 */
function rgba(red: number, green: number, blue: number, alpha: number): Color {
    const color = new RgbaColor(Notation.Rgba, red, green, blue, alpha);
    return validate(color);
}

/**
 * Provide the red, green, and blue channels for the color.
 * @param red takes a value between 0 and 255.
 * @param green takes a value between 0 and 255.
 * @param blue takes a value between 0 and 255.
 */
function rgb255(red: number, green: number, blue: number): Color {
    const color = new Rgba255Color(Notation.Rgb255, red, green, blue, 1);
    return validate(color);
}

/**
 * Provide the red, green, blue and alpha channels for the color.
 * @param red takes a value between 0 and 255.
 * @param green takes a value between 0 and 255.
 * @param blue takes a value between 0 and 255.
 * @param alpha takes a value between 0 and 1.
 */
function rgba255(
    red: number,
    green: number,
    blue: number,
    alpha: number
): Color {
    const color = new Rgba255Color(Notation.Rgba255, red, green, blue, alpha);
    return validate(color);
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
 */
function toRgb(colour: Colour): Color {
    const [red, green, blue, alpha] = colour;
    const color = new RgbaColor(Notation.Rgb, red, green, blue, alpha);
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

import { Min, Max } from 'class-validator';

import { Flag, Second, bgColor, fontColor, fontSize, fontFamily } from './flag';

interface Style {
    selector: string;
    props: Property[];
}

interface FontFamily {
    name: string;
    typefaces: Font[];
}

type FontSize = number;

interface Colored {
    class: string;
    prop: string;
    color: string;
}

type Styles = Style | FontFamily | FontSize | Colored;

interface Adjustment {
    capital: number;
    lowercase: number;
    baseline: number;
    descender: number;
}

enum FontFamilyType {
    Serif,
    SansSerif,
    Monospace,
}

type Typeface = string;

interface ImportFont {
    name: string;
    url: string;
}

interface FontWith {
    name: string;
    adjustment: Adjustment | undefined;
    variants: Variant[];
}

type Font = FontFamilyType | Typeface | ImportFont | FontWith;

type VariantActive = string;

type VariantOff = string;

interface VariantIndexed {
    name: string;
    index: number;
}

type Variant = VariantActive | VariantOff | VariantIndexed;

interface Property {
    key: string;
    value: string;
}

interface StyleClass {
    flag: Second | Flag;
    style: Styles;
}

enum Attributes {
    StyleClass,
}

interface Channels {
    a: number;
    b: number;
    c: number;
    d: number;
}

interface Hsla {
    hue: number;
    saturation: number;
    lightness: number;
    alpha: number;
}
interface Rgba {
    red: number;
    green: number;
    blue: number;
    alpha: number;
}

type Colour = [number, number, number, number];

type Color = Hsla | Rgba | undefined;

enum Notation {
    Hsl,
    Hsla,
    Rgb,
    Rgba,
    Rgb255,
    Rgba255,
}

type Px = [Lengths.Px, number];

type Rem = [Lengths.Rem, number];

type MinMax = [Lengths.Content | Lengths.Fill, number];

type Length = Px | Rem | MinMax | Lengths;

enum Lengths {
    Px,
    Rem,
    Content,
    Fill,
    MinContent,
    MaxContent,
}

let min = {
    message:
        'Invalid value. Channel should be more or equal to $constraint1, but actual value is $value.',
};
let max = {
    message:
        'Invalid value. Channel should be less or equal to $constraint1, but actual value is $value.',
};

class ChannelsColor {
    @Min(0, min)
    private a: number;
    @Min(0, min)
    private b: number;
    @Min(0, min)
    private c: number;
    @Min(0, min)
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
                return {
                    hue: this.a,
                    saturation: this.b,
                    lightness: this.c,
                    alpha: this.d,
                };
            case Notation.Rgba:
                return {
                    red: this.a,
                    green: this.b,
                    blue: this.c,
                    alpha: this.d,
                };

            default:
                throw new Error('Use Hsla or Rgba notation.');
        }
    }
}

class HslaColor extends ChannelsColor {
    @Max(360, max)
    hue: number;
    @Max(1, max)
    saturation: number;
    @Max(1, max)
    lightness: number;
    @Max(1, max)
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
    @Max(1, max)
    red: number;
    @Max(1, max)
    green: number;
    @Max(1, max)
    blue: number;
    @Max(1, max)
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
    @Max(255)
    red: number;
    @Max(255)
    green: number;
    @Max(255)
    blue: number;
    @Max(1, max)
    alpha: number;

    constructor(red: number, green: number, blue: number, alpha: number) {
        super(Notation.Rgba, red, green, blue, alpha);
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
    }
}

const rootStyle: StyleClass[] = [
    {
        flag: bgColor,
        style: {
            class: `bg-${formatColorClass(0, 0, 1, 0)}`,
            prop: 'background-color',
            color: formatColor(0, 0, 1, 0),
        },
    },
    {
        flag: fontColor,
        style: {
            class: `fc-${formatColorClass(0, 0, 0, 1)}`,
            prop: 'color',
            color: formatColor(0, 0, 0, 1),
        },
    },
    {
        flag: fontSize,
        style: 20,
    },
    {
        flag: fontFamily,
        style: 20,
    },
];

function floatClass(x: number) {
    return Math.round(x * 255).toString();
}

function formatColor(
    a: number,
    b: number,
    c: number,
    d: number,
    type: Notation = Notation.Hsl
) {
    switch (type) {
        case Notation.Hsl:
            return `hsl(${a}, ${b * 100}%, ${c * 100}%)`;

        case Notation.Hsla:
            return `hsla(${a}, ${b * 100}%, ${c * 100}%, ${d})`;

        case Notation.Rgb:
            return `rgb(${floatClass(a)}, ${floatClass(b)}, ${floatClass(c)})`;

        case Notation.Rgba:
            return `rgba(${floatClass(a)}
                    , ${floatClass(b)}
                    , ${floatClass(c)}
                    , ${d})`;

        case Notation.Rgb255:
            return `rgb(${a}, ${b}, ${c})`;

        case Notation.Rgba255:
            return `rgba(${a}, ${b}, ${c}, ${d})`;
    }
}

function formatColorClass(
    a: number,
    b: number,
    c: number,
    d: number,
    type: Notation = Notation.Hsl
) {
    switch (type) {
        case Notation.Hsl:
            return `${a}-${b * 100}-${c * 100}`;

        case Notation.Hsla:
            return `${a}-${b * 100}-${c * 100}-${d * 100})`;

        case Notation.Rgb:
            return `${floatClass(a)}-${floatClass(b)}-${floatClass(c)}`;

        case Notation.Rgba:
            return `${floatClass(a)}
                    -${floatClass(b)}
                    -${floatClass(c)}
                    -${d * 100}`;

        case Notation.Rgb255:
            return `${a}-${b}-${c})`;

        case Notation.Rgba255:
            return `${a}-${b}-${c}-${d * 100})`;
    }
}

export {
    Hsla,
    Rgba,
    Colour,
    Color,
    Notation,
    ChannelsColor,
    HslaColor,
    RgbaColor,
    Rgba255Color,
    MinMax,
    Length,
    Lengths,
};

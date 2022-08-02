import { Min, Max } from 'class-validator';
import { reduce as foldl, words, some as any } from 'lodash';

import {
    Flag,
    Second,
    Field,
    bgColor,
    fontColor,
    fontSize,
    fontFamily,
} from './flag';
import { classes } from './style';

enum LayoutContext {
    AsRow,
    AsColumn,
    AsEl,
    AsGrid,
    AsParagraph,
    AsTextColumn,
}

interface Align {
    hAlign: HAlign | undefined;
    vAlign: VAlign | undefined;
}

enum Aligned {
    Unaligned,
    Aligned,
}

enum HAlign {
    Left,
    centerX,
    Right,
}

enum VAlign {
    Top,
    centerY,
    Bottom,
}

interface Style {
    selector: string;
    props: Property[];
}

interface FontFamily {
    name: string;
    typefaces: Typefaces[];
}

interface Typefaces {
    type: FontFamilyType;
    font: string;
}

type FontSize = number;

interface Single {
    class: string;
    prop: string;
    value: string;
}

interface Colored {
    class: string;
    prop: string;
    color: string;
}

interface SpacingStyle {
    name: string;
    x: number;
    y: number;
}

interface BorderWidth {
    class: string;
    top: number;
    right: number;
    bottom: number;
    left: number;
}

interface PaddingStyle {
    name: string;
    top: number;
    right: number;
    bottom: number;
    left: number;
}

interface GridTemplateStyle {
    spacing: [Length, Length];
    columns: Length[];
    rows: Length[];
}

interface GridPosition {
    row: number;
    column: number;
    width: number;
    height: number;
}

type Transform = Transformation;

interface PseudoSelector {
    class: PseudoClass;
    styles: Style[];
}

interface Transparency {
    name: string;
    transparency: number;
}

interface Shadows {
    name: string;
    prop: string;
}

type Styles =
    | Style
    | FontFamily
    | FontSize
    | Single
    | Colored
    | SpacingStyle
    | BorderWidth
    | PaddingStyle
    | GridTemplateStyle
    | GridPosition
    | Transform
    | PseudoSelector
    | Transparency
    | Shadows;

type Untransformed = undefined;

type Moved = XYZ;

interface FullTransform {
    translate: XYZ;
    scale: XYZ;
    rotate: XYZ;
    angle: Angle;
}

type Transformation = Untransformed | Moved | FullTransform;

enum Transformations {
    Untransformed,
    Moved,
    FullTransform,
}

enum PseudoClass {
    Focus,
    Hover,
    Active,
}

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
    Typeface,
    ImportFont,
    FontWith,
}

type Typeface = string;

interface ImportFont {
    name: string;
    url: string;
}

interface FontWith {
    name: string;
    adjustment: Adjustment | undefined;
    variants: [Variants, Variant][];
}

type Font = FontFamilyType | Typeface | ImportFont | FontWith;

type VariantActive = string;

type VariantOff = string;

interface VariantIndexed {
    name: string;
    index: number;
}

type Variant = VariantActive | VariantOff | VariantIndexed;

enum Variants {
    VariantActive,
    VariantOff,
    VariantIndexed,
}

function renderVariant(variants: Variants, variant: Variant) {
    switch (variants) {
        case Variants.VariantActive:
            if (typeof variant === 'string') {
                return `\'${variant}\'`;
            }
            return '';

        case Variants.VariantOff:
            if (typeof variant === 'string') {
                return `\'${variant}\' 0`;
            }
            return '';

        case Variants.VariantIndexed:
            if (typeof variant === 'object') {
                return `\'${variant.name}\' ${variant.index}`;
            }
            return '';
    }
}

function variantName(variants: Variants, variant: Variant) {
    switch (variants) {
        case Variants.VariantActive:
            if (typeof variant === 'string') {
                return variant;
            }
            return '';

        case Variants.VariantOff:
            if (typeof variant === 'string') {
                return `${variant}-0`;
            }
            return '';

        case Variants.VariantIndexed:
            if (typeof variant === 'object') {
                return `${variant.name}-${variant.index}`;
            }
            return '';
    }
}

function renderVariants(typeface: FontFamilyType, font: FontWith) {
    switch (typeface) {
        case FontFamilyType.FontWith:
            const variants = font.variants.map((variant) => {
                return renderVariant(variant[0], variant[1]);
            });
            return variants.join(', ');

        default:
            return undefined;
    }
}

function isSmallCaps(variants: Variants, variant: Variant) {
    switch (variants) {
        case Variants.VariantActive:
            if (typeof variant === 'string') {
                return variant === 'smcp';
            }
            return false;

        case Variants.VariantOff:
            return false;

        case Variants.VariantIndexed:
            if (typeof variant === 'object') {
                return variant.name === 'smcp' && variant.index === 1;
            }
            return false;
    }
}

function hasSmallCaps(typeface: FontFamilyType, font: FontWith) {
    switch (typeface) {
        case FontFamilyType.FontWith:
            return any(
                font.variants,
                font.variants.map((variant) => {
                    return isSmallCaps(variant[0], variant[1]);
                })
            );

        default:
            return false;
    }
}

interface Property {
    key: string;
    value: string;
}

type XYZ = [number, number, number];

type Angle = number;

type NoAttribute = undefined;

type Attr = Element['attributes'];

type Describe = Description;

interface Class {
    flag: Second | Flag;
    class: string;
}

interface StyleClass {
    flag: Second | Flag;
    style: Styles;
}

enum Attributes {
    NoAttribute,
    Describe,
    Class,
    StyleClass,
    AlignY,
    AlignX,
    Width,
    Height,
    Nearby,
    TransformComponent,
}

type Description = Descriptions | Heading | Label;

type Heading = number;

type Label = string;

enum Descriptions {
    Main,
    Navigation,
    ContentInfo,
    Complementary,
    Heading,
    Label,
    LivePolite,
    LiveAssertive,
    Button,
    Paragraph,
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

type NoNearbyChildren = undefined;

type ChildrenBehind = HTMLElement[];

type ChildrenInFront = HTMLElement[];

type ChildrenBehindAndInFront = [HTMLElement[], HTMLElement[]];

type NearbyChildren =
    | NoNearbyChildren
    | ChildrenBehind
    | ChildrenInFront
    | ChildrenBehindAndInFront;

enum NearbyChildrens {
    NoNearbyChildren,
    ChildrenBehind,
    ChildrenInFront,
    ChildrenBehindAndInFront,
}

interface Gathered {
    attributes: Element['attributes'][];
    styles: Styles[];
    children: NearbyChildren;
    has: Field;
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

function gatherAttrRecursive(
    classes: string,
    has: Field,
    transform: Transformation,
    styles: Styles[],
    attrs: Element['attributes'][],
    children: NearbyChildren
) {}

const rowClass = classes.any + ' ' + classes.row,
    columnClass = classes.any + ' ' + classes.column,
    singleClass = classes.any + ' ' + classes.single,
    gridClass = classes.any + ' ' + classes.grid,
    paragraphClass = classes.any + ' ' + classes.paragraph,
    pageClass = classes.any + ' ' + classes.page;

function contextClasses(context: LayoutContext) {
    switch (context) {
        case LayoutContext.AsRow:
            return rowClass;

        case LayoutContext.AsColumn:
            return columnClass;

        case LayoutContext.AsEl:
            return singleClass;

        case LayoutContext.AsGrid:
            return gridClass;

        case LayoutContext.AsParagraph:
            return paragraphClass;

        case LayoutContext.AsTextColumn:
            return pageClass;
    }
}

const families: Typefaces[] = [
    { type: FontFamilyType.Typeface, font: 'Open Sans' },
    { type: FontFamilyType.Typeface, font: 'Helvetica' },
    { type: FontFamilyType.Typeface, font: 'Verdana' },
    { type: FontFamilyType.SansSerif, font: '' },
];

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
        style: {
            name: foldl(
                families,
                (result: string, n: Typefaces) => {
                    return renderFontClassName(n.type, n.font, result);
                },
                'font-'
            ),
            typefaces: families,
        },
    },
];

function renderFontClassName(
    type: FontFamilyType,
    font: Font,
    current: string
) {
    switch (type) {
        case FontFamilyType.Serif:
            return current + 'serif';

        case FontFamilyType.SansSerif:
            return current + 'sans-serif';

        case FontFamilyType.Monospace:
            return current + 'monospace';

        case FontFamilyType.Typeface:
            if (typeof font === 'string') {
                return current + words(font).join('-');
            }
            return '';

        case FontFamilyType.ImportFont || FontFamilyType.FontWith:
            if (typeof font === 'object') {
                return current + words(font.name).join('-');
            }
            return '';

        default:
            return '';
    }
}

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
    rootStyle,
    MinMax,
    Length,
    Lengths,
};

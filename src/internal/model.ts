import { Min, Max } from 'class-validator';
import {
    reduce as foldl,
    words,
    some as any,
    isArray,
    isString,
    isObject,
} from 'lodash';

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

enum Elements {
    Unstyled,
    Styled,
    Text,
    Empty,
}

interface Unstyled {
    type: Elements.Unstyled;
    html: (a: LayoutContext) => HTMLElement;
}

interface Styled {
    type: Elements.Styled;
    styles: Style_[];
    html: (a: EmbedStyles, b: LayoutContext) => HTMLElement;
}

interface Text {
    type: Elements.Text;
    str: string;
}

interface Empty {
    type: Elements.Empty;
}

type Element = Unstyled | Styled | Text | Empty;

enum EmbedStyles {
    NoStyleSheet,
    StaticRootAndDynamic,
    OnlyDynamic,
}

interface NoStyleSheet {
    type: EmbedStyles.NoStyleSheet;
}

interface StaticRootAndDynamic {
    type: EmbedStyles.StaticRootAndDynamic;
    options: OptionRecord;
    styles: Style_[];
}

interface OnlyDynamic {
    type: EmbedStyles.OnlyDynamic;
    options: OptionRecord;
    styles: Style_[];
}

type EmbedStyle = NoStyleSheet | StaticRootAndDynamic | OnlyDynamic;

const noStyleSheet = EmbedStyles.NoStyleSheet;

enum LayoutContext {
    AsRow,
    AsColumn,
    AsEl,
    AsGrid,
    AsParagraph,
    AsTextColumn,
}

interface Align {
    hAlign: HAlign | null;
    vAlign: VAlign | null;
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

enum Styles {
    Style,
    FontFamily,
    FontSize,
    Single,
    Colored,
    SpacingStyle,
    BorderWidth,
    PaddingStyle,
    GridTemplateStyle,
    GridPosition,
    Transform,
    PseudoSelector,
    Transparency,
    Shadows,
}

interface Style_ {
    type: Styles.Style;
    selector: string;
    props: Property[];
}

interface FontFamily {
    type: Styles.FontFamily;
    name: string;
    typefaces: Font[];
}

interface FontSize {
    type: Styles.FontSize;
    i: number;
}

interface Single {
    type: Styles.Single;
    class: string;
    prop: string;
    value: string;
}

interface Colored {
    type: Styles.Colored;
    class: string;
    prop: string;
    color: Color;
}

interface SpacingStyle {
    type: Styles.SpacingStyle;
    name: string;
    x: number;
    y: number;
}

interface BorderWidth {
    type: Styles.BorderWidth;
    class: string;
    top: number;
    right: number;
    bottom: number;
    left: number;
}

interface PaddingStyle {
    type: Styles.PaddingStyle;
    name: string;
    top: number;
    right: number;
    bottom: number;
    left: number;
}

interface GridTemplateStyle {
    type: Styles.GridTemplateStyle;
    spacing: [Length, Length];
    columns: Length[];
    rows: Length[];
}

interface GridPosition {
    type: Styles.GridPosition;
    row: number;
    column: number;
    width: number;
    height: number;
}

interface Transform {
    type: Styles.Transform;
    transform: Transformation;
}

interface PseudoSelector {
    type: Styles.PseudoSelector;
    class: PseudoClass;
    styles: Style_[];
}

interface Transparency {
    type: Styles.Transparency;
    name: string;
    transparency: number;
}

interface Shadows {
    type: Styles.Shadows;
    name: string;
    prop: string;
}

type Style =
    | Style_
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

enum Transformations {
    Untransformed,
    Moved,
    FullTransform,
}

interface Untransformed {
    type: Transformations.Untransformed;
}

interface Moved {
    type: Transformations.Moved;
    xyz: XYZ;
}

interface FullTransform {
    type: Transformations.FullTransform;
    translate: XYZ;
    scale: XYZ;
    rotate: XYZ;
    angle: Angle;
}

type Transformation = Untransformed | Moved | FullTransform;

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

interface Serif {
    type: FontFamilyType.Serif;
}

interface SansSerif {
    type: FontFamilyType.SansSerif;
}

interface Monospace {
    type: FontFamilyType.Monospace;
}

interface Typeface {
    type: FontFamilyType.Typeface;
    name: string;
}

interface ImportFont {
    type: FontFamilyType.ImportFont;
    name: string;
    url: string;
}

interface FontWith {
    type: FontFamilyType.FontWith;
    name: string;
    adjustment: Adjustment | null;
    variants: Variant[];
}

type Font = Serif | SansSerif | Monospace | Typeface | ImportFont | FontWith;

enum Variants {
    VariantActive,
    VariantOff,
    VariantIndexed,
}

interface VariantActive {
    type: Variants.VariantActive;
    name: string;
}

interface VariantOff {
    type: Variants.VariantOff;
    name: string;
}

interface VariantIndexed {
    type: Variants.VariantIndexed;
    name: string;
    index: number;
}

type Variant = VariantActive | VariantOff | VariantIndexed;

function renderVariant(variant: Variant) {
    switch (variant.type) {
        case Variants.VariantActive:
            if (isString(variant)) {
                return `\'${variant}\'`;
            }
            return '';

        case Variants.VariantOff:
            if (isString(variant)) {
                return `\'${variant}\' 0`;
            }
            return '';

        case Variants.VariantIndexed:
            if (isObject(variant)) {
                return `\'${variant.name}\' ${variant.index}`;
            }
            return '';
    }
}

function variantName(variant: Variant) {
    switch (variant.type) {
        case Variants.VariantActive:
            if (isString(variant)) {
                return variant;
            }
            return '';

        case Variants.VariantOff:
            if (isString(variant)) {
                return `${variant}-0`;
            }
            return '';

        case Variants.VariantIndexed:
            if (isObject(variant)) {
                return `${variant.name}-${variant.index}`;
            }
            return '';
    }
}

function renderVariants(font: FontWith) {
    switch (font.type) {
        case FontFamilyType.FontWith:
            const variants = font.variants.map((variant) => {
                return renderVariant(variant);
            });
            return variants.join(', ');

        default:
            return null;
    }
}

function isSmallCaps(variant: Variant) {
    switch (variant.type) {
        case Variants.VariantActive:
            if (isString(variant)) {
                return variant === 'smcp';
            }
            return false;

        case Variants.VariantOff:
            return false;

        case Variants.VariantIndexed:
            if (isObject(variant)) {
                return variant.name === 'smcp' && variant.index === 1;
            }
            return false;
    }
}

function hasSmallCaps(font: FontWith) {
    switch (font.type) {
        case FontFamilyType.FontWith:
            return any(
                font.variants,
                font.variants.map((variant) => {
                    return isSmallCaps(variant);
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

enum Attributes {
    NoAttribute,
    Attr,
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

interface NoAttribute {
    type: Attributes.NoAttribute;
}

interface Attr {
    type: Attributes.Attr;
    attr: HTMLElement['attributes'];
}

interface Describe {
    type: Attributes.Describe;
    description: Description;
}

interface Class {
    type: Attributes.Class;
    flag: Second | Flag;
    class: string;
}

interface StyleClass {
    type: Attributes.StyleClass;
    flag: Second | Flag;
    style: Style;
}

interface AlignY {
    type: Attributes.AlignY;
    y: VAlign;
}

interface AlignX {
    type: Attributes.AlignX;
    x: HAlign;
}

interface Width {
    type: Attributes.Width;
    width: Length;
}

interface Height {
    type: Attributes.Height;
    width: Length;
}

interface Nearby {
    type: Attributes.Nearby;
    location: Location;
    element: Elements;
}

interface TransformComponent_ {
    type: Attributes.TransformComponent;
    flag: Flag | Second;
    component: TransformComponent;
}

type Attribute =
    | NoAttribute
    | Attr
    | Describe
    | Class
    | StyleClass
    | AlignY
    | AlignX
    | Width
    | Height
    | Nearby
    | TransformComponent_;

enum TransformComponents {
    MoveX,
    MoveY,
    MoveZ,
    MoveXYZ,
    Rotate,
    Scale,
}

interface MoveX {
    type: TransformComponents.MoveX;
    x: number;
}

interface MoveY {
    type: TransformComponents.MoveY;
    y: number;
}

interface MoveZ {
    type: TransformComponents.MoveZ;
    z: number;
}

interface MoveXYZ {
    type: TransformComponents.MoveXYZ;
    xyz: XYZ;
}

interface Rotate {
    type: TransformComponents.Rotate;
    xyz: XYZ;
    angle: number;
}

interface Scale {
    type: TransformComponents.Scale;
    xyz: number;
}

type TransformComponent = MoveX | MoveY | MoveZ | MoveXYZ | Rotate | Scale;

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
interface Main {
    type: Descriptions.Main;
}

interface Navigation {
    type: Descriptions.Navigation;
}

interface ContentInfo {
    type: Descriptions.ContentInfo;
}

interface Complementary {
    type: Descriptions.Complementary;
}

interface Heading {
    type: Descriptions.Heading;
    i: number;
}

interface Label {
    type: Descriptions.Label;
    label: string;
}

interface LivePolite {
    type: Descriptions.LivePolite;
}

interface LiveAssertive {
    type: Descriptions.LiveAssertive;
}

interface Button {
    type: Descriptions.Button;
}

interface Paragraph {
    type: Descriptions.Paragraph;
}

type Description =
    | Main
    | Navigation
    | ContentInfo
    | Complementary
    | Heading
    | Label
    | LivePolite
    | LiveAssertive
    | Button
    | Paragraph;

enum Lengths {
    Px,
    Rem,
    Content,
    Fill,
    MinContent,
    MaxContent,
}

interface Px {
    type: Lengths.Px;
    px: number;
}

interface Rem {
    type: Lengths.Rem;
    rem: number;
}

interface MinMax {
    type: Lengths.Content | Lengths.Fill;
    size: number;
}

type Length = Px | Rem | MinMax | Lengths;

enum Axis {
    XAxis,
    YAxis,
    AllAxis,
}

enum Location {
    Above,
    Below,
    OnRight,
    OnLeft,
    InFront,
    Behind,
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

type Color = Hsla | Rgba | string | null;

enum Notation {
    Hsl,
    Hsla,
    Rgb,
    Rgba,
    Rgb255,
    Rgba255,
}

type NodeName_ = string;

type Embedded = [string, string];

type NodeName = NodeNames.Generic | NodeName_ | Embedded;

enum NodeNames {
    Generic,
    NodeName,
    Embedded,
}

const div = NodeNames.Generic;

type NoNearbyChildren = NearbyChildrens.NoNearbyChildren;

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
    node: NodeNames;
    attributes: HTMLElement['attributes'];
    styles: Style_[];
    children: NearbyChildrens;
    has: Field;
}

function transformClass(transform: Transformation) {
    switch (transform.type) {
        case Transformations.Untransformed:
            return null;

        case Transformations.Moved:
            if (isArray(transform.xyz)) {
                return `mv-${floatClass(transform.xyz[0])}-${floatClass(
                    transform.xyz[1]
                )}-${floatClass(transform.xyz[2])}`;
            }
            return null;

        case Transformations.FullTransform:
            if (isObject(transform) && !isArray(transform)) {
                return `tfrm-${floatClass(transform.translate[0])}-${floatClass(
                    transform.translate[1]
                )}-${floatClass(transform.translate[2])}-${floatClass(
                    transform.scale[0]
                )}-${floatClass(transform.scale[1])}-${floatClass(
                    transform.scale[2]
                )}-${floatClass(transform.rotate[0])}-${floatClass(
                    transform.rotate[1]
                )}-${floatClass(transform.rotate[2])}-${floatClass(
                    transform.angle
                )}`;
            }
            return null;
    }
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
    node: NodeNames,
    has: Field,
    transform: Transformation,
    styles: Style_[],
    attrs: HTMLElement['attributes'],
    children: NearbyChildrens,
    elementAttrs: Attribute[]
): Gathered {
    switch (elementAttrs) {
        case []:
            switch (transformClass(transform)) {
                case null:
                    const nodeMap = new NamedNodeMap();
                    const attr = document.createAttribute('class');
                    attr.value = classes;

                    return {
                        node: node,
                        // attributes: {},
                        attributes: nodeMap.setNamedItem(attr),
                        styles: styles,
                        children: children,
                        has: has,
                    };

                default:
                    break;
            }
            break;

        default:
            break;
    }
}

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

enum RenderMode {
    Layout,
    NoStaticStyleSheet,
    WithVirtualCss,
}

interface OptionRecord {
    hover: HoverSetting;
    focus: FocusStyle;
    mode: RenderMode;
}

enum HoverSetting {
    NoHover,
    AllowHover,
    ForceHover,
}

type HoverOption = HoverSetting;

type FocusStyleOption = FocusStyle;

type RenderModeOption = RenderMode;

type Option = HoverOption | FocusStyleOption | RenderModeOption;

enum Options {
    HoverOption,
    FocusStyleOption,
    RenderModeOption,
}

interface FocusStyle {
    borderColor: Color;
    shadow: Shadow | null;
    backgroundColor: Color;
}

interface Shadow {
    color: Color;
    offset: [number, number];
    blur: number;
    size: number;
}

const families: Font[] = [
    { type: FontFamilyType.Typeface, name: 'Open Sans' },
    { type: FontFamilyType.Typeface, name: 'Helvetica' },
    { type: FontFamilyType.Typeface, name: 'Verdana' },
    { type: FontFamilyType.SansSerif },
];

const rootStyle: StyleClass[] = [
    {
        type: Attributes.StyleClass,
        flag: bgColor,
        style: {
            type: Styles.Colored,
            class: `bg-${formatColorClass(0, 0, 1, 0)}`,
            prop: 'background-color',
            color: formatColor(0, 0, 1, 0),
        },
    },
    {
        type: Attributes.StyleClass,
        flag: fontColor,
        style: {
            type: Styles.Colored,
            class: `fc-${formatColorClass(0, 0, 0, 1)}`,
            prop: 'color',
            color: formatColor(0, 0, 0, 1),
        },
    },
    {
        type: Attributes.StyleClass,
        flag: fontSize,
        style: {
            type: Styles.FontSize,
            i: 20,
        },
    },
    {
        type: Attributes.StyleClass,
        flag: fontFamily,
        style: {
            type: Styles.FontFamily,
            name: foldl(
                families,
                (result: string, n: Font) => {
                    return renderFontClassName(n, result);
                },
                'font-'
            ),
            typefaces: families,
        },
    },
];

function renderFontClassName(font: Font, current: string) {
    switch (font.type) {
        case FontFamilyType.Serif:
            return current + 'serif';

        case FontFamilyType.SansSerif:
            return current + 'sans-serif';

        case FontFamilyType.Monospace:
            return current + 'monospace';

        case FontFamilyType.Typeface:
            if (isString(font)) {
                return current + words(font).join('-');
            }
            return '';

        case FontFamilyType.ImportFont || FontFamilyType.FontWith:
            if (isObject(font)) {
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
            return `rgba(${floatClass(a)}, ${floatClass(b)}, ${floatClass(
                c
            )}, ${d})`;

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
            return `${floatClass(a)}-${floatClass(b)}-${floatClass(c)}-${
                d * 100
            }`;

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

// deno-lint-ignore-file no-explicit-any
import { elmish, preact } from '../../deps.ts';
import { Flag_, Second, Field } from './flag.ts';

export type Maybe<T> = elmish.Maybe.Maybe<T>;

export enum Elements {
    Unstyled,
    Styled,
    Text,
    Empty,
}

export interface Unstyled {
    type: Elements.Unstyled;
    html: (a: LayoutContext) => preact.JSX.Element;
}

export function Unstyled(
    html: (a: LayoutContext) => preact.JSX.Element
): Unstyled {
    return { type: Elements.Unstyled, html };
}

export interface Styled {
    type: Elements.Styled;
    styles: Style[];
    html: (a: EmbedStyle, b: LayoutContext) => preact.JSX.Element;
}

export function Styled(
    styles: Style[],
    html: (a: EmbedStyle, b: LayoutContext) => preact.JSX.Element
): Styled {
    return { type: Elements.Styled, styles, html };
}

export interface Text {
    type: Elements.Text;
    str: string;
}

export function Text(str: string): Text {
    return { type: Elements.Text, str };
}

export interface Empty {
    type: Elements.Empty;
}

export function Empty(): Empty {
    return { type: Elements.Empty };
}

export type Element = Unstyled | Styled | Text | Empty;

export enum EmbedStyles {
    NoStyleSheet,
    StaticRootAndDynamic,
    OnlyDynamic,
}

export interface NoStyleSheet {
    type: EmbedStyles.NoStyleSheet;
}

export function NoStyleSheet(): NoStyleSheet {
    return { type: EmbedStyles.NoStyleSheet };
}

export interface StaticRootAndDynamic {
    type: EmbedStyles.StaticRootAndDynamic;
    options: OptionObject;
    styles: Style[];
}

export function StaticRootAndDynamic(
    options: OptionObject,
    styles: Style[]
): StaticRootAndDynamic {
    return { type: EmbedStyles.StaticRootAndDynamic, options, styles };
}

export interface OnlyDynamic {
    type: EmbedStyles.OnlyDynamic;
    options: OptionObject;
    styles: Style[];
}

export function OnlyDynamic(
    options: OptionObject,
    styles: Style[]
): OnlyDynamic {
    return { type: EmbedStyles.OnlyDynamic, options, styles };
}

export type EmbedStyle = NoStyleSheet | StaticRootAndDynamic | OnlyDynamic;

export enum Aligned {
    Unaligned,
    Aligned,
}

export enum HAlign {
    Left,
    CenterX,
    Right,
}

export enum VAlign {
    Top,
    CenterY,
    Bottom,
}

export interface Align {
    hAlign: Maybe<HAlign>;
    vAlign: Maybe<VAlign>;
}

export function Align(hAlign: Maybe<HAlign>, vAlign: Maybe<VAlign>): Align {
    return { hAlign, vAlign };
}

export enum Styles {
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

export interface Style_ {
    type: Styles.Style;
    selector: string;
    props: Property[];
}

export function Style_(selector: string, props: Property[]): Style_ {
    return {
        type: Styles.Style,
        selector,
        props,
    };
}

export interface FontFamily {
    type: Styles.FontFamily;
    name: string;
    typefaces: Font[];
}

export function FontFamily(name: string, typefaces: Font[]): FontFamily {
    return {
        type: Styles.FontFamily,
        name,
        typefaces,
    };
}

export interface FontSize {
    type: Styles.FontSize;
    i: number | Rem;
}

export function FontSize(i: number | Rem): FontSize {
    return {
        type: Styles.FontSize,
        i,
    };
}

export interface Single {
    type: Styles.Single;
    class_: string;
    prop: string;
    value: string;
}

export function Single(class_: string, prop: string, value: string): Single {
    return {
        type: Styles.Single,
        class_,
        prop,
        value,
    };
}

export interface Colored {
    type: Styles.Colored;
    class_: string;
    prop: string;
    color: Color;
}

export function Colored(class_: string, prop: string, color: Color): Colored {
    return {
        type: Styles.Colored,
        class_,
        prop,
        color,
    };
}

export interface SpacingStyle {
    type: Styles.SpacingStyle;
    class_: string;
    x: number | Rem;
    y: number | Rem;
}

export function SpacingStyle(
    class_: string,
    x: number | Rem,
    y: number | Rem
): SpacingStyle {
    return {
        type: Styles.SpacingStyle,
        class_,
        x,
        y,
    };
}

export interface BorderWidth {
    type: Styles.BorderWidth;
    class_: string;
    top: number | Rem;
    right: number | Rem;
    bottom: number | Rem;
    left: number | Rem;
}

export function BorderWidth(
    class_: string,
    top: number | Rem,
    right: number | Rem,
    bottom: number | Rem,
    left: number | Rem
): BorderWidth {
    return {
        type: Styles.BorderWidth,
        class_,
        top,
        right,
        bottom,
        left,
    };
}

export interface PaddingStyle {
    type: Styles.PaddingStyle;
    class_: string;
    top: number | Rem;
    right: number | Rem;
    bottom: number | Rem;
    left: number | Rem;
}

export function PaddingStyle(
    class_: string,
    top: number | Rem,
    right: number | Rem,
    bottom: number | Rem,
    left: number | Rem
): PaddingStyle {
    return {
        type: Styles.PaddingStyle,
        class_,
        top,
        right,
        bottom,
        left,
    };
}

export interface GridTemplateStyle {
    type: Styles.GridTemplateStyle;
    spacing: [Length, Length];
    columns: Length[];
    rows: Length[];
}

export function GridTemplateStyle(
    spacing: [Length, Length],
    columns: Length[],
    rows: Length[]
): GridTemplateStyle {
    return {
        type: Styles.GridTemplateStyle,
        spacing,
        columns,
        rows,
    };
}

export interface GridPosition {
    type: Styles.GridPosition;
    row: number;
    column: number;
    width: number;
    height: number;
}

export function GridPosition(
    row: number,
    column: number,
    width: number,
    height: number
): GridPosition {
    return {
        type: Styles.GridPosition,
        row,
        column,
        width,
        height,
    };
}

export interface Transform {
    type: Styles.Transform;
    transform: Transformation;
}

export function Transform(transform: Transformation): Transform {
    return {
        type: Styles.Transform,
        transform,
    };
}

export interface PseudoSelector {
    type: Styles.PseudoSelector;
    class_: PseudoClass;
    styles: Style[];
}

export function PseudoSelector(
    class_: PseudoClass,
    styles: Style[]
): PseudoSelector {
    return {
        type: Styles.PseudoSelector,
        class_,
        styles,
    };
}

export interface Transparency {
    type: Styles.Transparency;
    name: string;
    transparency: number;
}

export function Transparency(name: string, transparency: number): Transparency {
    return {
        type: Styles.Transparency,
        name,
        transparency,
    };
}

export interface Shadows {
    type: Styles.Shadows;
    name: string;
    prop: string;
}

export function Shadows(name: string, prop: string): Shadows {
    return {
        type: Styles.Shadows,
        name,
        prop,
    };
}

export type Style =
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

export enum Transformations {
    Untransformed,
    Moved,
    FullTransform,
}

export interface Untransformed {
    type: Transformations.Untransformed;
}

export function Untransformed(): Untransformed {
    return {
        type: Transformations.Untransformed,
    };
}

export interface Moved {
    type: Transformations.Moved;
    xyz: XYZ | [Rem, Rem, Rem];
}

export function Moved(xyz: XYZ | [Rem, Rem, Rem]): Moved {
    return {
        type: Transformations.Moved,
        xyz,
    };
}

export interface FullTransform {
    type: Transformations.FullTransform;
    translate: XYZ | [Rem, Rem, Rem];
    scale: XYZ;
    rotate: XYZ;
    angle: Angle;
}

export function FullTransform(
    translate: XYZ | [Rem, Rem, Rem],
    scale: XYZ,
    rotate: XYZ,
    angle: Angle
): FullTransform {
    return {
        type: Transformations.FullTransform,
        translate,
        scale,
        rotate,
        angle,
    };
}

export type Transformation = Untransformed | Moved | FullTransform;

export enum PseudoClass {
    Focus,
    Hover,
    Active,
}

export interface Adjustment {
    capital: number;
    lowercase: number;
    baseline: number;
    descender: number;
}

export function Adjustment(
    capital: number,
    lowercase: number,
    baseline: number,
    descender: number
): Adjustment {
    return {
        capital,
        lowercase,
        baseline,
        descender,
    };
}

export enum FontFamilyType {
    Serif,
    SansSerif,
    Monospace,
    Typeface,
    ImportFont,
    FontWith,
}

export interface Serif {
    type: FontFamilyType.Serif;
}

export function Serif(): Serif {
    return {
        type: FontFamilyType.Serif,
    };
}

export interface SansSerif {
    type: FontFamilyType.SansSerif;
}

export function SansSerif(): SansSerif {
    return {
        type: FontFamilyType.SansSerif,
    };
}

export interface Monospace {
    type: FontFamilyType.Monospace;
}

export function Monospace(): Monospace {
    return {
        type: FontFamilyType.Monospace,
    };
}

export interface Typeface {
    type: FontFamilyType.Typeface;
    name: string;
}

export function Typeface(name: string): Typeface {
    return {
        type: FontFamilyType.Typeface,
        name,
    };
}

export interface ImportFont {
    type: FontFamilyType.ImportFont;
    name: string;
    url: string;
}

export function ImportFont(name: string, url: string): ImportFont {
    return {
        type: FontFamilyType.ImportFont,
        name,
        url,
    };
}

export interface FontWith {
    type: FontFamilyType.FontWith;
    name: string;
    adjustment: Maybe<Adjustment>;
    variants: Variant[];
}

export function FontWith(
    name: string,
    adjustment: Maybe<Adjustment>,
    variants: Variant[]
): FontWith {
    return {
        type: FontFamilyType.FontWith,
        name,
        adjustment,
        variants,
    };
}

export type Font =
    | Serif
    | SansSerif
    | Monospace
    | Typeface
    | ImportFont
    | FontWith;

export enum Variants {
    VariantActive,
    VariantOff,
    VariantIndexed,
}

export interface VariantActive {
    type: Variants.VariantActive;
    name: string;
}

export function VariantActive(name: string): VariantActive {
    return {
        type: Variants.VariantActive,
        name,
    };
}

export interface VariantOff {
    type: Variants.VariantOff;
    name: string;
}

export function VariantOff(name: string): VariantOff {
    return {
        type: Variants.VariantOff,
        name,
    };
}

export interface VariantIndexed {
    type: Variants.VariantIndexed;
    name: string;
    index: number;
}

export function VariantIndexed(name: string, index: number): VariantIndexed {
    return {
        type: Variants.VariantIndexed,
        name,
        index,
    };
}

export type Variant = VariantActive | VariantOff | VariantIndexed;

export enum LayoutContext {
    AsRow,
    AsColumn,
    AsEl,
    AsGrid,
    AsParagraph,
    AsTextColumn,
}

export interface Property {
    key: string;
    value: string;
}

export function Property(key: string, value: string): Property {
    return {
        key,
        value,
    };
}

export type XYZ = [number, number, number];

export type Angle = number;

export enum Attributes {
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

export interface NoAttribute {
    type: Attributes.NoAttribute;
}

export function NoAttribute(): NoAttribute {
    return { type: Attributes.NoAttribute };
}

export interface Attr {
    type: Attributes.Attr;
    attr: preact.ClassAttributes<string> &
        preact.JSX.HTMLAttributes &
        preact.JSX.SVGAttributes;
}

export function Attr(
    attr: preact.ClassAttributes<string> &
        preact.JSX.HTMLAttributes &
        preact.JSX.SVGAttributes
): Attr {
    return { type: Attributes.Attr, attr };
}

export interface Attr_ {
    attribute: string;
    value: string;
}

export function Attr_(attribute: string, value: string): Attr_ {
    return { attribute, value };
}

export interface Describe {
    type: Attributes.Describe;
    description: Description;
}

export function Describe(description: Description): Describe {
    return { type: Attributes.Describe, description };
}

export interface Class {
    type: Attributes.Class;
    flag: Second | Flag_;
    class_: string;
}

export function Class(flag: Second | Flag_, class_: string): Class {
    return { type: Attributes.Class, flag, class_ };
}

export interface StyleClass {
    type: Attributes.StyleClass;
    flag: Second | Flag_;
    style: Style;
}

export function StyleClass(flag: Second | Flag_, style: Style): StyleClass {
    return {
        type: Attributes.StyleClass,
        flag,
        style,
    };
}

export interface AlignY {
    type: Attributes.AlignY;
    y: VAlign;
}

export function AlignY(y: VAlign): AlignY {
    return { type: Attributes.AlignY, y };
}

export interface AlignX {
    type: Attributes.AlignX;
    x: HAlign;
}

export function AlignX(x: HAlign): AlignX {
    return { type: Attributes.AlignX, x };
}

export interface Width {
    type: Attributes.Width;
    width: Length;
}

export function Width(width: Length): Width {
    return { type: Attributes.Width, width };
}

export interface Height {
    type: Attributes.Height;
    height: Length;
}

export function Height(height: Length): Height {
    return { type: Attributes.Height, height };
}

export enum Location {
    Above,
    Below,
    OnRight,
    OnLeft,
    InFront,
    Behind,
    Floating,
}

export interface Nearby {
    type: Attributes.Nearby;
    location: Location;
    element: Element;
}

export function Nearby(location: Location, element: Element): Nearby {
    return { type: Attributes.Nearby, location, element };
}

export interface TransformComponent_ {
    type: Attributes.TransformComponent;
    flag: Flag_ | Second;
    component: TransformComponent;
}

export function TransformComponent_(
    flag: Flag_ | Second,
    component: TransformComponent
): TransformComponent_ {
    return { type: Attributes.TransformComponent, flag, component };
}

export type Attribute =
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

export enum TransformComponents {
    MoveX,
    MoveY,
    MoveZ,
    MoveXYZ,
    Rotate,
    Scale,
}

export interface MoveX {
    type: TransformComponents.MoveX;
    x: number | Rem;
}

export function MoveX(x: number | Rem): MoveX {
    return { type: TransformComponents.MoveX, x };
}

export interface MoveY {
    type: TransformComponents.MoveY;
    y: number | Rem;
}

export function MoveY(y: number | Rem): MoveY {
    return { type: TransformComponents.MoveY, y };
}

export interface MoveZ {
    type: TransformComponents.MoveZ;
    z: number | Rem;
}

export function MoveZ(z: number | Rem): MoveZ {
    return { type: TransformComponents.MoveZ, z };
}

export interface MoveXYZ {
    type: TransformComponents.MoveXYZ;
    xyz: XYZ | [Rem, Rem, Rem];
}

export function MoveXYZ(xyz: XYZ | [Rem, Rem, Rem]): MoveXYZ {
    return { type: TransformComponents.MoveXYZ, xyz };
}

export interface Rotate {
    type: TransformComponents.Rotate;
    xyz: XYZ;
    angle: number;
}

export function Rotate(xyz: XYZ, angle: number): Rotate {
    return { type: TransformComponents.Rotate, xyz, angle };
}

export interface Scale {
    type: TransformComponents.Scale;
    xyz: XYZ;
}

export function Scale(xyz: XYZ): Scale {
    return { type: TransformComponents.Scale, xyz };
}

export type TransformComponent =
    | MoveX
    | MoveY
    | MoveZ
    | MoveXYZ
    | Rotate
    | Scale;

export enum Descriptions {
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

export interface Main {
    type: Descriptions.Main;
}

export function Main(): Main {
    return { type: Descriptions.Main };
}

export interface Navigation {
    type: Descriptions.Navigation;
}

export function Navigation(): Navigation {
    return { type: Descriptions.Navigation };
}

export interface ContentInfo {
    type: Descriptions.ContentInfo;
}

export function ContentInfo(): ContentInfo {
    return { type: Descriptions.ContentInfo };
}

export interface Complementary {
    type: Descriptions.Complementary;
}

export function Complementary(): Complementary {
    return { type: Descriptions.Complementary };
}

export interface Heading {
    type: Descriptions.Heading;
    i: number;
}

export function Heading(i: number): Heading {
    return { type: Descriptions.Heading, i };
}

export interface Label {
    type: Descriptions.Label;
    label: string;
}

export function Label(label: string): Label {
    return { type: Descriptions.Label, label };
}

export interface LivePolite {
    type: Descriptions.LivePolite;
}

export function LivePolite(): LivePolite {
    return { type: Descriptions.LivePolite };
}

export interface LiveAssertive {
    type: Descriptions.LiveAssertive;
}

export function LiveAssertive(): LiveAssertive {
    return { type: Descriptions.LiveAssertive };
}

export interface Button {
    type: Descriptions.Button;
}

export function Button(): Button {
    return { type: Descriptions.Button };
}

export interface Paragraph {
    type: Descriptions.Paragraph;
}

export function Paragraph(): Paragraph {
    return { type: Descriptions.Paragraph };
}

export type Description =
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

export enum Lengths {
    Px,
    Rem,
    Content,
    Fill,
    Min,
    Max,
    MinContent,
    MaxContent,
    Viewport,
}

export interface Px {
    type: Lengths.Px;
    px: number;
}

export function Px(px: number): Px {
    return { type: Lengths.Px, px };
}

export interface Rem {
    type: Lengths.Rem;
    rem: number;
}

export function Rem(rem: number): Rem {
    return { type: Lengths.Rem, rem };
}

export interface Content {
    type: Lengths.Content;
}

export function Content(): Content {
    return { type: Lengths.Content };
}

export interface Fill {
    type: Lengths.Fill;
    i: number;
}

export function Fill(i: number): Fill {
    return { type: Lengths.Fill, i };
}

export interface Min {
    type: Lengths.Min;
    min: number;
    length: Length;
}

export function Min(min: number, length: Length): Min {
    return { type: Lengths.Min, min, length };
}

export interface Max {
    type: Lengths.Max;
    max: number;
    length: Length;
}

export function Max(max: number, length: Length): Max {
    return { type: Lengths.Max, max, length };
}

export interface MinContent {
    type: Lengths.MinContent;
}

export function MinContent(): MinContent {
    return { type: Lengths.MinContent };
}

export interface MaxContent {
    type: Lengths.MaxContent;
}

export function MaxContent(): MaxContent {
    return { type: Lengths.MaxContent };
}

export interface Viewport {
    type: Lengths.Viewport;
    i?: number;
}

export function Viewport(i?: number): Viewport {
    return { type: Lengths.Viewport, i };
}

export type Length =
    | Px
    | Rem
    | Content
    | Fill
    | Min
    | Max
    | MinContent
    | MaxContent
    | Viewport;

export enum Axis {
    XAxis,
    YAxis,
    AllAxis,
}

// Color

export interface Channels {
    a: number;
    b: number;
    c: number;
    d: number;
}

export function Channels(a: number, b: number, c: number, d: number): Channels {
    return { a, b, c, d };
}

export interface Hsla {
    hue: number;
    saturation: number;
    lightness: number;
    alpha: number;
    type: Notation.Hsl | Notation.Hsla;
}

export function Hsla(
    hue: number,
    saturation: number,
    lightness: number,
    alpha: number,
    type: Notation.Hsl | Notation.Hsla
): Hsla {
    return { hue, saturation, lightness, alpha, type };
}

export interface Rgba {
    red: number;
    green: number;
    blue: number;
    alpha: number;
    type: Notation.Rgb | Notation.Rgba | Notation.Rgb255 | Notation.Rgba255;
}

export function Rgba(
    red: number,
    green: number,
    blue: number,
    alpha: number,
    type: Notation.Rgb | Notation.Rgba | Notation.Rgb255 | Notation.Rgba255
): Rgba {
    return { red, green, blue, alpha, type };
}

export type Colour = [number, number, number, number];

export type Color = Hsla | Rgba;

// TODO: Review colors notation, is there a necessity for Rgb to not have 255 values?
export enum Notation {
    Hsl,
    Hsla,
    Rgb,
    Rgba,
    Rgb255,
    Rgba255,
}

// Gradient

export type Hint = number;

export type Stop = number;

export type HRadius = number;

export type VRadius = number;

export type XPosition = number;

export type YPosition = number;

export interface Step {
    step: Color | Hint;
    stop?: Stop | [Stop, Stop];
}

export function Step(step: Color | Hint, stop?: Stop | [Stop, Stop]): Step {
    return { step, stop };
}

export interface GradientLinear {
    type: Gradients.Linear;
    steps: Step[];
    angle?: number | SideOrCorner;
}

export function GradientLinear(steps: Step[], angle?: number): GradientLinear {
    return { type: Gradients.Linear, steps, angle };
}

export interface GradientRadial {
    type: Gradients.Radial;
    steps: Step[];
    shape?: EndingShape;
    size?: Size;
    radius?: [HRadius, VRadius];
    position?: Position;
    positions?: [XPosition, YPosition];
}

export function GradientRadial({
    steps,
    shape,
    size,
    radius,
    position,
    positions,
}: {
    steps: Step[];
    shape?: EndingShape;
    size?: Size;
    radius?: [HRadius, VRadius];
    position?: Position;
    positions?: [XPosition, YPosition];
}): GradientRadial {
    return {
        type: Gradients.Radial,
        steps,
        shape,
        size,
        radius,
        position,
        positions,
    };
}

export type Gradient = GradientLinear | GradientRadial;

export enum Gradients {
    Linear,
    Radial,
}

export enum SideOrCorner {
    Top,
    Bottom,
    Left,
    LeftTop,
    LeftBottom,
    Right,
    RightTop,
    RightBottom,
}

export enum Position {
    Top,
    Bottom,
    Left,
    LeftTop,
    LeftCenter,
    LeftBottom,
    LeftLength,
    Right,
    RightTop,
    RightCenter,
    RightBottom,
    RightLength,
    Center,
    CenterTop,
    CenterBottom,
    Length,
    LengthLeft,
    LengthRight,
}

export enum EndingShape {
    Ellipse,
    Circle,
}

export enum Size {
    ClosestSide,
    ClosestCorner,
    FarthestSide,
    FarthestCorner,
    Px,
    PxPercentage,
    Percentage,
    PercentagePx,
}

export enum NodeNames {
    Generic,
    NodeName,
    Embedded,
}

export interface Generic {
    type: NodeNames.Generic;
}

export function Generic(): Generic {
    return { type: NodeNames.Generic };
}

export interface NodeName_ {
    type: NodeNames.NodeName;
    nodeName: keyof preact.JSX.IntrinsicElements;
}

export function NodeName(
    nodeName: keyof preact.JSX.IntrinsicElements
): NodeName_ {
    return { type: NodeNames.NodeName, nodeName };
}

export interface Embedded {
    type: NodeNames.Embedded;
    nodeName: keyof preact.JSX.IntrinsicElements;
    internal: keyof preact.JSX.IntrinsicElements;
}

export function Embedded(
    nodeName: keyof preact.JSX.IntrinsicElements,
    internal: keyof preact.JSX.IntrinsicElements
): Embedded {
    return { type: NodeNames.Embedded, nodeName, internal };
}

export type NodeName = Generic | NodeName_ | Embedded;

export enum NearbyChildrens {
    NoNearbyChildren,
    ChildrenBehind,
    ChildrenInFront,
    ChildrenBehindAndInFront,
}

export interface NoNearbyChildren {
    type: NearbyChildrens.NoNearbyChildren;
}

export function NoNearbyChildren(): NoNearbyChildren {
    return {
        type: NearbyChildrens.NoNearbyChildren,
    };
}

export interface ChildrenBehind {
    type: NearbyChildrens.ChildrenBehind;
    existingBehind: preact.ComponentChildren[];
}

export function ChildrenBehind(
    existingBehind: preact.ComponentChildren[]
): ChildrenBehind {
    return {
        type: NearbyChildrens.ChildrenBehind,
        existingBehind,
    };
}

export interface ChildrenInFront {
    type: NearbyChildrens.ChildrenInFront;
    existingInFront: preact.ComponentChildren[];
}

export function ChildrenInFront(
    existingInFront: preact.ComponentChildren[]
): ChildrenInFront {
    return {
        type: NearbyChildrens.ChildrenInFront,
        existingInFront,
    };
}

export interface ChildrenBehindAndInFront {
    type: NearbyChildrens.ChildrenBehindAndInFront;
    existingBehind: preact.ComponentChildren[];
    existingInFront: preact.ComponentChildren[];
}

export function ChildrenBehindAndInFront(
    existingBehind: preact.ComponentChildren[],
    existingInFront: preact.ComponentChildren[]
): ChildrenBehindAndInFront {
    return {
        type: NearbyChildrens.ChildrenBehindAndInFront,
        existingBehind,
        existingInFront,
    };
}

export type NearbyChildren =
    | NoNearbyChildren
    | ChildrenBehind
    | ChildrenInFront
    | ChildrenBehindAndInFront;

export interface Gathered {
    node: NodeName;
    attributes: preact.ClassAttributes<string> &
        preact.JSX.HTMLAttributes &
        preact.JSX.SVGAttributes;
    styles: Style[];
    children: NearbyChildren;
    has: Field[];
}

export function Gathered(
    node: NodeName,
    attributes: preact.ClassAttributes<string> &
        preact.JSX.HTMLAttributes &
        preact.JSX.SVGAttributes,
    styles: Style[],
    children: NearbyChildren,
    has: Field[]
): Gathered {
    return { node, attributes, styles, children, has };
}

export enum Childrens {
    Unkeyed,
    Keyed,
}

export interface Unkeyed<T> {
    type: Childrens.Unkeyed;
    unkeyed: T[];
}

export function Unkeyed(unkeyed: any[]): Unkeyed<any> {
    return {
        type: Childrens.Unkeyed,
        unkeyed,
    };
}

export interface Keyed<T> {
    type: Childrens.Keyed;
    keyed: [string, T][];
}

export function Keyed(keyed: [string, any][]): Keyed<any> {
    return {
        type: Childrens.Keyed,
        keyed,
    };
}

export type Children<T> = Unkeyed<T> | Keyed<T>;

export interface Spaced {
    name: string;
    x: number | Rem;
    y: number | Rem;
}

export type Spacing = Spaced;

export function Spacing(
    name: string,
    x: number | Rem,
    y: number | Rem
): Spacing {
    return { name, x, y };
}

export interface Padding_ {
    name: string;
    top: number | Rem;
    right: number | Rem;
    bottom: number | Rem;
    left: number | Rem;
}

export type Padding = Padding_;

export function Padding(
    name: string,
    top: number | Rem,
    right: number | Rem,
    bottom: number | Rem,
    left: number | Rem
): Padding {
    return { name, top, right, bottom, left };
}

export enum RenderMode {
    Layout,
    NoStaticStyleSheet,
    WithVirtualCss,
}

export interface OptionObject {
    hover: HoverSetting;
    focus: FocusStyle;
    mode: RenderMode;
}

export function OptionObject(
    hover: HoverSetting,
    focus: FocusStyle,
    mode: RenderMode
): OptionObject {
    return { hover, focus, mode };
}

export enum HoverSetting {
    NoHover,
    AllowHover,
    ForceHover,
}

export interface HoverOption {
    type: Options.HoverOption;
    hover: HoverSetting;
}

export function HoverOption(hover: HoverSetting): HoverOption {
    return {
        type: Options.HoverOption,
        hover,
    };
}

export interface FocusStyleOption {
    type: Options.FocusStyleOption;
    focus: FocusStyle;
}

export function FocusStyleOption(focus: FocusStyle): FocusStyleOption {
    return {
        type: Options.FocusStyleOption,
        focus,
    };
}

export interface RenderModeOption {
    type: Options.RenderModeOption;
    mode: RenderMode;
}

export function RenderModeOption(mode: RenderMode): RenderModeOption {
    return {
        type: Options.RenderModeOption,
        mode,
    };
}

export type Option = HoverOption | FocusStyleOption | RenderModeOption;

export enum Options {
    HoverOption,
    FocusStyleOption,
    RenderModeOption,
}

export interface FocusStyle {
    borderColor: Maybe<Color>;
    shadow: Maybe<Shadow>;
    backgroundColor: Maybe<Color>;
}

export function FocusStyle(
    borderColor: Maybe<Color>,
    shadow: Maybe<Shadow>,
    backgroundColor: Maybe<Color>
): FocusStyle {
    return { borderColor, shadow, backgroundColor };
}

export interface Shadow {
    color: Color;
    offset: [number, number];
    inset?: boolean;
    blur: number;
    size: number;
}

export function Shadow(
    color: Color,
    offset: [number, number],
    blur: number,
    size: number,
    inset?: boolean
): Shadow {
    return { color, offset, blur, size, inset };
}

export enum TextElement {
    Text,
    Fill,
}

// Constants

export const asRow = LayoutContext.AsRow,
    asColumn = LayoutContext.AsColumn,
    asEl = LayoutContext.AsEl,
    asGrid = LayoutContext.AsGrid,
    asParagraph = LayoutContext.AsParagraph,
    asTextColumn = LayoutContext.AsTextColumn;

import { Flag_, Second, Field } from './flag';

export enum Elements {
    Unstyled,
    Styled,
    Text,
    Empty,
}

export interface Unstyled {
    type: Elements.Unstyled;
    html: (a: LayoutContext) => _SvelteComponent;
}

export interface Styled {
    type: Elements.Styled;
    styles: Style_[];
    html: (a: EmbedStyles, b: LayoutContext) => _SvelteComponent;
}

export interface Text {
    type: Elements.Text;
    str: string;
}

export interface Empty {
    type: Elements.Empty;
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

export interface StaticRootAndDynamic {
    type: EmbedStyles.StaticRootAndDynamic;
    options: OptionRecord;
    styles: Style_[];
}

export interface OnlyDynamic {
    type: EmbedStyles.OnlyDynamic;
    options: OptionRecord;
    styles: Style_[];
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
    hAlign: HAlign | null;
    vAlign: VAlign | null;
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

export interface FontFamily {
    type: Styles.FontFamily;
    name: string;
    typefaces: Font[];
}

export interface FontSize {
    type: Styles.FontSize;
    i: number;
}

export interface Single {
    type: Styles.Single;
    class: string;
    prop: string;
    value: string;
}

export interface Colored {
    type: Styles.Colored;
    class: string;
    prop: string;
    color: Color;
}

export interface SpacingStyle {
    type: Styles.SpacingStyle;
    name: string;
    x: number;
    y: number;
}

export interface BorderWidth {
    type: Styles.BorderWidth;
    class: string;
    top: number;
    right: number;
    bottom: number;
    left: number;
}

export interface PaddingStyle {
    type: Styles.PaddingStyle;
    name: string;
    top: number;
    right: number;
    bottom: number;
    left: number;
}

export interface GridTemplateStyle {
    type: Styles.GridTemplateStyle;
    spacing: [Length, Length];
    columns: Length[];
    rows: Length[];
}

export interface GridPosition {
    type: Styles.GridPosition;
    row: number;
    column: number;
    width: number;
    height: number;
}

export interface Transform {
    type: Styles.Transform;
    transform: Transformation;
}

export interface PseudoSelector {
    type: Styles.PseudoSelector;
    class: PseudoClass;
    styles: Style_[];
}

export interface Transparency {
    type: Styles.Transparency;
    name: string;
    transparency: number;
}

export interface Shadows {
    type: Styles.Shadows;
    name: string;
    prop: string;
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

export interface Moved {
    type: Transformations.Moved;
    xyz: XYZ;
}

export interface FullTransform {
    type: Transformations.FullTransform;
    translate: XYZ;
    scale: XYZ;
    rotate: XYZ;
    angle: Angle;
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

export interface SansSerif {
    type: FontFamilyType.SansSerif;
}

export interface Monospace {
    type: FontFamilyType.Monospace;
}

export interface Typeface {
    type: FontFamilyType.Typeface;
    name: string;
}

export interface ImportFont {
    type: FontFamilyType.ImportFont;
    name: string;
    url: string;
}

export interface FontWith {
    type: FontFamilyType.FontWith;
    name: string;
    adjustment: Adjustment | null;
    variants: Variant[];
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

export interface VariantOff {
    type: Variants.VariantOff;
    name: string;
}

export interface VariantIndexed {
    type: Variants.VariantIndexed;
    name: string;
    index: number;
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

export interface Attr {
    type: Attributes.Attr;
    attr: globalThis.Attr;
}

export interface Attr_ {
    attribute: string;
    value: string;
}

export interface Describe {
    type: Attributes.Describe;
    description: Description;
}

export interface Class {
    type: Attributes.Class;
    flag: Second | Flag_;
    class: string;
}

export interface StyleClass {
    type: Attributes.StyleClass;
    flag: Second | Flag_;
    style: Style;
}

export interface AlignY {
    type: Attributes.AlignY;
    y: VAlign;
}

export interface AlignX {
    type: Attributes.AlignX;
    x: HAlign;
}

export interface Width {
    type: Attributes.Width;
    width: Length;
}

export interface Height {
    type: Attributes.Height;
    height: Length;
}

export enum Location {
    Above,
    Below,
    OnRight,
    OnLeft,
    InFront,
    Behind,
}

export interface Nearby {
    type: Attributes.Nearby;
    location: Location;
    element: Element;
}

export interface TransformComponent_ {
    type: Attributes.TransformComponent;
    flag: Flag_ | Second;
    component: TransformComponent;
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
    x: number;
}

export interface MoveY {
    type: TransformComponents.MoveY;
    y: number;
}

export interface MoveZ {
    type: TransformComponents.MoveZ;
    z: number;
}

export interface MoveXYZ {
    type: TransformComponents.MoveXYZ;
    xyz: XYZ;
}

export interface Rotate {
    type: TransformComponents.Rotate;
    xyz: XYZ;
    angle: number;
}

export interface Scale {
    type: TransformComponents.Scale;
    xyz: XYZ;
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

export interface Navigation {
    type: Descriptions.Navigation;
}

export interface ContentInfo {
    type: Descriptions.ContentInfo;
}

export interface Complementary {
    type: Descriptions.Complementary;
}

export interface Heading {
    type: Descriptions.Heading;
    i: number;
}

export interface Label {
    type: Descriptions.Label;
    label: string;
}

export interface LivePolite {
    type: Descriptions.LivePolite;
}

export interface LiveAssertive {
    type: Descriptions.LiveAssertive;
}

export interface Button {
    type: Descriptions.Button;
}

export interface Paragraph {
    type: Descriptions.Paragraph;
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
    MinContent,
    MaxContent,
}

export interface Px {
    type: Lengths.Px;
    px: number;
}

export interface Rem {
    type: Lengths.Rem;
    rem: number;
}

export interface Content {
    type: Lengths.Content;
}

export interface Fill {
    type: Lengths.Fill;
    i: number;
}

export interface Min {
    type: Lengths.MinContent;
    min: number;
    length: Length;
}

export interface Max {
    type: Lengths.MaxContent;
    max: number;
    length: Length;
}

export type Length = Px | Rem | Content | Fill | Min | Max;

export enum Axis {
    XAxis,
    YAxis,
    AllAxis,
}

export interface Channels {
    a: number;
    b: number;
    c: number;
    d: number;
}

export interface Hsla {
    hue: number;
    saturation: number;
    lightness: number;
    alpha: number;
    type?: Notation.Hsl | Notation.Hsla;
}

export interface Rgba {
    red: number;
    green: number;
    blue: number;
    alpha: number;
    type?: Notation.Rgb | Notation.Rgba | Notation.Rgb255 | Notation.Rgba255;
}

export type Colour = [number, number, number, number];

export type Color = Hsla | Rgba | string | null;

export enum Notation {
    Hsl,
    Hsla,
    Rgb,
    Rgba,
    Rgb255,
    Rgba255,
}

export enum NodeNames {
    Generic,
    NodeName,
    Embedded,
}

export interface Generic {
    type: NodeNames.Generic;
}

export interface NodeName_ {
    type: NodeNames.NodeName;
    nodeName: string;
}

export interface Embedded {
    type: NodeNames.Embedded;
    nodeName: string;
    internal: string;
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

export interface ChildrenBehind {
    type: NearbyChildrens.ChildrenBehind;
    existingBehind: _SvelteComponent[];
}

export interface ChildrenInFront {
    type: NearbyChildrens.ChildrenInFront;
    existingInFront: _SvelteComponent[];
}

export interface ChildrenBehindAndInFront {
    type: NearbyChildrens.ChildrenBehindAndInFront;
    existingBehind: _SvelteComponent[];
    existingInFront: _SvelteComponent[];
}

export type NearbyChildren =
    | NoNearbyChildren
    | ChildrenBehind
    | ChildrenInFront
    | ChildrenBehindAndInFront;

export interface Gathered {
    node: NodeName;
    attributes: globalThis.Attr[];
    styles: Style[];
    children: NearbyChildren;
    has: Field;
}

export enum RenderMode {
    Layout,
    NoStaticStyleSheet,
    WithVirtualCss,
}

export interface OptionRecord {
    hover: HoverSetting;
    focus: FocusStyle;
    mode: RenderMode;
}

export enum HoverSetting {
    NoHover,
    AllowHover,
    ForceHover,
}

export type HoverOption = HoverSetting;

export type FocusStyleOption = FocusStyle;

export type RenderModeOption = RenderMode;

export type Option = HoverOption | FocusStyleOption | RenderModeOption;

export enum Options {
    HoverOption,
    FocusStyleOption,
    RenderModeOption,
}

export interface FocusStyle {
    borderColor: Color;
    shadow: Shadow | null;
    backgroundColor: Color;
}

export interface Shadow {
    color: Hsla | Rgba;
    offset: [number, number];
    inset?: boolean;
    blur: number;
    size: number;
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

// Component Types

export type SvelteComponentConstructorOptions<T> = T extends abstract new (
    opts: Svelte2TsxComponentConstructorParameters<infer P>
) => any
    ? Svelte2TsxComponentConstructorParameters<P>
    : never;

export type SvelteComponentProps<T> = T extends abstract new (
    opts: Svelte2TsxComponentConstructorParameters<infer P>
) => any
    ? Svelte2TsxComponentConstructorParameters<P>['props']
    : never;

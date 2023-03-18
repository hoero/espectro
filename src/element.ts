/*TODO:
# Basic Elements

@docs Element, none, text, el


# Rows and Columns

When we want more than one child on an element, we want to be _specific_ about how they will be laid out.

So, the common ways to do that would be `row` and `column`.

@docs row, wrappedRow, column


# Text Layout

Text layout needs some specific considerations.

@docs paragraph, textColumn


# Data Table

@docs Column, table, IndexedColumn, indexedTable


# Size

@docs Attribute, width, height, Length, px, shrink, fill, fillPortion, maximum, minimum


# Debugging

@docs explain


# Padding and Spacing

There's no concept of margin in `elm-ui`, instead we have padding and spacing.

Padding is the distance between the outer edge and the content, and spacing is the space between children.

So, if we have the following row, with some padding and spacing.

    Element.row [ padding 10, spacing 7 ]
        [ Element.el [] none
        , Element.el [] none
        , Element.el [] none
        ]

Here's what we can expect:

![Three boxes spaced 7 pixels apart. There's a 10 pixel distance from the edge of the parent to the boxes.](https://mdgriffith.gitbooks.io/style-elements/content/assets/spacing-400.png)

**Note** `spacing` set on a `paragraph`, will set the pixel spacing between lines.

@docs padding, paddingXY, paddingEach

@docs spacing, spacingXY, spaceEvenly


# Alignment

Alignment can be used to align an `Element` within another `Element`.

    Element.el [ centerX, alignTop ] (text "I'm centered and aligned top!")

If alignment is set on elements in a layout such as `row`, then the element will push the other elements in that direction. Here's an example.

    Element.row []
        [ Element.el [] Element.none
        , Element.el [ alignLeft ] Element.none
        , Element.el [ centerX ] Element.none
        , Element.el [ alignRight ] Element.none
        ]

will result in a layout like

    |-|-|    |-|    |-|

Where there are two elements on the left, one on the right, and one in the center of the space between the elements on the left and right.

**Note** For text alignment, check out `Element.Font`!

@docs centerX, centerY, alignLeft, alignRight, alignTop, alignBottom


# Transparency

@docs transparent, alpha, pointer


# Adjustment

@docs moveUp, moveDown, moveRight, moveLeft, rotate, scale


# Clipping and Scrollbars

Clip the content if it overflows.

@docs clip, clipX, clipY

Add a scrollbar if the content is larger than the element.

@docs scrollbars, scrollbarX, scrollbarY


# Rendering

@docs layout, layoutWith, Option, noStaticStyleSheet, forceHover, noHover, focusStyle, FocusStyle


# Links

@docs link, newTabLink, download, downloadAs


# Images

@docs image


# Color

In order to use attributes like `Font.color` and `Background.color`, you'll need to make some colors!

@docs Color, rgba, rgb, rgb255, rgba255, fromRgb, fromRgb255, toRgb


# Nearby Elements

Let's say we want a dropdown menu. Essentially we want to say: _put this element below this other element, but don't affect the layout when you do_.

    Element.row []
        [ Element.el
            [ Element.below (Element.text "I'm below!")
            ]
            (Element.text "I'm normal!")
        ]

This will result in

    |- I'm normal! -|
       I'm below

Where `"I'm Below"` doesn't change the size of `Element.row`.

This is very useful for things like dropdown menus or tooltips.

@docs above, below, onRight, onLeft, inFront, behindContent


# Temporary Styling

@docs Attr, Decoration, mouseOver, mouseDown, focused


# Responsiveness

The main technique for responsiveness is to store window size information in your model.

Install the `Browser` package, and set up a subscription for [`Browser.Events.onResize`](https://package.elm-lang.org/packages/elm/browser/latest/Browser-Events#onResize).

You'll also need to retrieve the initial window size. You can either use [`Browser.Dom.getViewport`](https://package.elm-lang.org/packages/elm/browser/latest/Browser-Dom#getViewport) or pass in `window.innerWidth` and `window.innerHeight` as flags to your program, which is the preferred way. This requires minor setup on the JS side, but allows you to avoid the state where you don't have window info.

@docs Device, DeviceClass, Orientation, classifyDevice


# Scaling

@docs modular


## Mapping

@docs map, mapAttribute


## Compatibility

@docs html, htmlAttribute
*/
import { DOM, elmish } from '../deps.ts';
import {
    Length,
    Px,
    Rem,
    Content,
    Fill,
    Min,
    Max,
    MinContent,
    MaxContent,
    Element,
    Attribute,
    Attr,
    Option,
    RenderMode,
    RenderModeOption,
    FocusStyle,
    FocusStyleOption,
    HoverSetting,
    HoverOption,
    Empty,
    Text,
    asEl,
    asRow,
    asColumn,
    Unkeyed,
    Width,
    Height,
    Padding_,
    Spaced,
    Maybe,
    PaddingStyle,
    StyleClass,
    SpacingStyle,
    GridPosition,
    GridTemplateStyle,
    asGrid,
    asParagraph,
    Paragraph,
    Describe,
    asTextColumn,
    Attributes,
    NodeName,
    Location,
    Elements,
    NoAttribute,
    Nearby,
    TransformComponent_,
    Scale,
    Rotate,
    MoveY,
    MoveX,
    AlignX,
    HAlign,
    AlignY,
    VAlign,
    Class,
    Transparency,
    PseudoSelector,
    PseudoClass,
} from './internal/data.ts';
import * as Flag from './internal/flag.ts';
import { classes } from './internal/style.ts';
import { attribute } from './dom/attribute.ts';
import * as Internal from './internal/model.ts';
import { style } from './elements/attributes.ts';

interface Column<T extends Record<string, unknown>> {
    header: Element;
    width: Length;
    view: (record: T) => Element;
}

function Column(
    header: Element,
    width: Length,
    view: (record: Record<string, unknown>) => Element
): Column<Record<string, unknown>> {
    return { header, width, view };
}

interface IndexedColumn<T extends Record<string, unknown>> {
    header: Element;
    width: Length;
    view: (a: number, record: T) => Element;
}

function IndexedColumn(
    header: Element,
    width: Length,
    view: (a: number, record: Record<string, unknown>) => Element
): IndexedColumn<Record<string, unknown>> {
    return { header, width, view };
}

interface InternalTable<T extends Record<string, unknown>> {
    data: T[];
    columns: InternalTableColumn[];
}

function _InternalTable(
    data: Record<string, unknown>[],
    columns: InternalTableColumn[]
): InternalTable<Record<string, unknown>> {
    return { data, columns };
}

enum InternalTableColumns {
    InternalIndexedColumn,
    InternalColumn,
}

interface InternalIndexedColumn {
    type: InternalTableColumns.InternalIndexedColumn;
    column: IndexedColumn<Record<string, unknown>>;
}

function InternalIndexedColumn(
    column: IndexedColumn<Record<string, unknown>>
): InternalIndexedColumn {
    return {
        type: InternalTableColumns.InternalIndexedColumn,
        column,
    };
}

interface InternalColumn {
    type: InternalTableColumns.InternalColumn;
    column: Column<Record<string, unknown>>;
}

function InternalColumn(
    column: Column<Record<string, unknown>>
): InternalColumn {
    return {
        type: InternalTableColumns.InternalColumn,
        column,
    };
}

type InternalTableColumn = InternalIndexedColumn | InternalColumn;

enum DeviceClass {
    Phone,
    Tablet,
    Desktop,
    BigDesktop,
}

enum Orientation {
    Portrait,
    Landscape,
}

interface Device {
    class_: DeviceClass;
    orientation: Orientation;
}

function Device(class_: DeviceClass, orientation: Orientation): Device {
    return { class_, orientation };
}

const { Just, Nothing, MaybeType } = elmish.Maybe;

/**
 * Shrink an element to fit its contents.
 */
const shrink: Length = Content();

/**
 * Fill the available space. The available space will be split evenly between elements that have `width fill`.
 */
const fill: Length = Fill(1);

/**
 * Set supported CSS property to min-content
 */
const minContent: Length = MinContent();

/**
 * Set supported CSS property to max-content
 */
const maxContent: Length = MaxContent();

/**TODO:
 * Elm UI embeds two StyleSheets, one that is constant, and one that changes dynamically based on styles collected from the elements being rendered.

This option will stop the static/constant stylesheet from rendering.

If you're embedding multiple elm-ui `layout` elements, you need to guarantee that only one is rendering the static style sheet and that it's above all the others in the DOM tree.
 */
const noStaticStyleSheet: Option = RenderModeOption(
    RenderMode.NoStaticStyleSheet
);

const _defaultFocus: FocusStyle = Internal.focusDefaultStyle;

/**
 * Disable all `mouseOver` styles.
 */
const noHover: Option = HoverOption(HoverSetting.NoHover);

/**
 * Any `hover` styles, aka attributes with `mouseOver` in the name, will be always turned on.

    This is useful for when you're targeting a platform that has no mouse, such as mobile.
 */
const forceHover: Option = HoverOption(HoverSetting.ForceHover);

/**
 * When you want to render exactly nothing.
 */
const none: Element = Empty();

const scrollbars: Attribute = Class(Flag.overflow, classes.scrollbars);

const scrollbarY: Attribute = Class(Flag.overflow, classes.scrollbarsY);

const scrollbarX: Attribute = Class(Flag.overflow, classes.scrollbarsX);

const clip: Attribute = Class(Flag.overflow, classes.clip);

const clipY: Attribute = Class(Flag.overflow, classes.clipY);

const clipX: Attribute = Class(Flag.overflow, classes.clipX);

const centerX: Attribute = AlignX(HAlign.CenterX);

const centerY: Attribute = AlignY(VAlign.CenterY);

const alignTop: Attribute = AlignY(VAlign.Top);

const alignBottom: Attribute = AlignY(VAlign.Bottom);

const alignLeft: Attribute = AlignX(HAlign.Left);

const alignRight: Attribute = AlignX(HAlign.Right);

const spaceEvenly: Attribute = Class(Flag.spacing, classes.spaceEvenly);

/**
 * Set the cursor to be a pointing hand when it's hovering over this element.
 */
const pointer: Attribute = Class(Flag.cursor, classes.cursorPointer);

function html(html: DOM.Node): Element {
    return Internal.unstyled(html);
}

function htmlAttribute(attribute: DOM.Attr): Attribute {
    return Attr(attribute);
}

function px(value: number): Length {
    return Px(Math.round(value));
}

function rem(value: number): Length {
    return Rem(value);
}

/** TODO: Similarly you can set a minimum boundary.

     el
        [ height
            (fill
                |> maximum 300
                |> minimum 30
            )

        ]
        (text "I will stop at 300px")
*/
function minimum(value: number, length: Length): Length {
    return Min(value, length);
}

/** TODO: Add a maximum to a length.

    el
        [ height
            (fill
                |> maximum 300
            )
        ]
        (text "I will stop at 300px")
*/
function maximum(value: number, length: Length): Length {
    return Max(value, length);
}

/** TODO: Sometimes you may not want to split available space evenly. In this case you can use `fillPortion` to define which elements should have what portion of the available space.

So, two elements, one with `width (fillPortion 2)` and one with `width (fillPortion 3)`. The first would get 2 portions of the available space, while the second would get 3.

**Also:** `fill == fillPortion 1`
*/
function fillPortion(value: number): Length {
    return Fill(value);
}

// This is your top level node where you can turn `Element` into `Html`.
async function layout(
    attributes: Attribute[],
    child: Element
): Promise<DOM.Node> {
    return await layoutWith([], attributes, child);
}

async function layoutWith(
    options: Option[],
    attributes: Attribute[],
    child: Element
): Promise<DOM.Node> {
    return await Internal.renderRoot(
        options,
        [
            Internal.htmlClass(
                `${classes.root} ${classes.any} ${classes.single}`
            ),
            ...Internal.rootStyle.concat(attributes),
        ],
        child
    );
}

function focusStyle(focus: FocusStyle): FocusStyleOption {
    return FocusStyleOption(focus);
}

/**
 * Create some plain text.

    text "Hello, you stylish developer!"

**Note** text does not wrap by default. In order to get text to wrap, check out `paragraph`!
 */
function text(content: string): Element {
    return Text(content);
}

/**TODO:
 * The basic building block of your layout.

You can think of an `el` as a `div`, but it can only have one child.

If you want multiple children, you'll need to use something like `row` or `column`

    import Element exposing (Element, rgb)
    import Element.Background as Background
    import Element.Border as Border

    myElement : Element msg
    myElement =
        Element.el
            [ Background.color (rgb 0 0.5 0)
            , Border.color (rgb 0 0.7 0)
            ]
            (Element.text "You've made a stylish element!")
 */
async function el(attributes: Attribute[], child: Element): Promise<Element> {
    return await Internal.element(
        asEl,
        Internal.div,
        [width(shrink), height(shrink), ...attributes],
        Unkeyed([child])
    );
}

async function row(
    attributes: Attribute[],
    children: Element[]
): Promise<Element> {
    return await Internal.element(
        asRow,
        Internal.div,
        [
            Internal.htmlClass(
                classes.contentLeft + ' ' + classes.contentCenterY
            ),
            width(shrink),
            height(shrink),
            ...attributes,
        ],
        Unkeyed(children)
    );
}

async function column(
    attributes: Attribute[],
    children: Element[]
): Promise<Element> {
    return await Internal.element(
        asColumn,
        Internal.div,
        [
            Internal.htmlClass(classes.contentTop + ' ' + classes.contentLeft),
            height(shrink),
            width(shrink),
            ...attributes,
        ],
        Unkeyed(children)
    );
}

// Same as `row`, but will wrap if it takes up too much horizontal space.
async function wrappedRow(
    attributes: Attribute[],
    children: Element[]
): Promise<Element> {
    const [padded, spaced]: [Maybe<Padding_>, Maybe<Spaced>] =
        Internal.extractSpacingAndPadding(attributes);

    switch (spaced.type) {
        case MaybeType.Nothing:
            return await Internal.element(
                asRow,
                Internal.div,
                [
                    Internal.htmlClass(
                        classes.contentLeft +
                            ' ' +
                            classes.contentCenterY +
                            ' ' +
                            classes.wrapped
                    ),
                    width(shrink),
                    height(shrink),
                    ...attributes,
                ],
                Unkeyed(children)
            );

        case MaybeType.Just: {
            const { name, x, y } = spaced.value,
                newPadding: Maybe<StyleClass> = (() => {
                    switch (padded.type) {
                        case MaybeType.Just: {
                            const { top, right, bottom, left } = padded.value;
                            if (right >= x / 2 && bottom >= y / 2) {
                                const newTop = top - y / 2,
                                    newRight = right - x / 2,
                                    newBottom = bottom - y / 2,
                                    newLeft = left - x / 2;
                                return Just(
                                    StyleClass(
                                        Flag.padding,
                                        PaddingStyle(
                                            Internal.paddingNameFloat(
                                                newTop,
                                                newRight,
                                                newBottom,
                                                newLeft
                                            ),
                                            newTop,
                                            newRight,
                                            newBottom,
                                            newLeft
                                        )
                                    )
                                );
                            }
                            return Nothing();
                        }

                        case MaybeType.Nothing:
                            return Nothing();
                    }
                })();

            switch (newPadding.type) {
                case MaybeType.Just:
                    return await Internal.element(
                        asRow,
                        Internal.div,
                        [
                            Internal.htmlClass(
                                classes.contentLeft +
                                    ' ' +
                                    classes.contentCenterY +
                                    ' ' +
                                    classes.wrapped
                            ),
                            width(shrink),
                            height(shrink),
                            ...attributes,
                            newPadding.value,
                        ],
                        Unkeyed(children)
                    );

                case MaybeType.Nothing: {
                    // Not enough space in padding to compensate for spacing
                    const halfX = (x / 2) * -1,
                        halfY = (y / 2) * -1;
                    return await Internal.element(
                        asEl,
                        Internal.div,
                        attributes,
                        Unkeyed([
                            await Internal.element(
                                asRow,
                                Internal.div,
                                [
                                    Internal.htmlClass(
                                        classes.contentLeft +
                                            ' ' +
                                            classes.contentCenterY +
                                            ' ' +
                                            classes.wrapped
                                    ),
                                    style(
                                        'margin',
                                        `${halfY.toString()}px ${halfX.toString()}px`
                                    ),
                                    style(
                                        'width',
                                        `calc(100% + ${x.toString()}px)`
                                    ),
                                    style(
                                        'height',
                                        `calc(100% + ${y.toString()}px)`
                                    ),
                                    StyleClass(
                                        Flag.spacing,
                                        SpacingStyle(name, x, y)
                                    ),
                                ],
                                Unkeyed(children)
                            ),
                        ])
                    );
                }
            }
        }
    }
}

/**
 * Highlight the borders of an element and it's children below. This can really help if you're running into some issue with your layout!
 */
function explain(): Attribute {
    console.error(`An element is being debugged!`);
    return Internal.htmlClass('explain');
}

/** TODO:
 * Show some tabular data.

Start with a list of records and specify how each column should be rendered.

So, if we have a list of `persons`:

    type alias Person =
        { firstName : String
        , lastName : String
        }

    persons : List Person
    persons =
        [ { firstName = "David"
          , lastName = "Bowie"
          }
        , { firstName = "Florence"
          , lastName = "Welch"
          }
        ]

We could render it using

    Element.table []
        { data = persons
        , columns =
            [ { header = Element.text "First Name"
              , width = fill
              , view =
                    \person ->
                        Element.text person.firstName
              }
            , { header = Element.text "Last Name"
              , width = fill
              , view =
                    \person ->
                        Element.text person.lastName
              }
            ]
        }

**Note:** Sometimes you might not have a list of records directly in your model. In this case it can be really nice to write a function that transforms some part of your model into a list of records before feeding it into `Element.table`.
 */
async function table(
    attributes: Attribute[],
    config: {
        data: Record<string, unknown>[];
        columns: Column<Record<string, unknown>>[];
    }
): Promise<Element> {
    return await tableHelper(attributes, {
        data: config.data,
        columns: config.columns.map(InternalColumn),
    });
}

/** TODO:
 * Same as `Element.table` except the `view` for each column will also receive the row index as well as the record.
 */
async function indexedTable(
    attributes: Attribute[],
    config: {
        data: Record<string, unknown>[];
        columns: IndexedColumn<Record<string, unknown>>[];
    }
): Promise<Element> {
    return await tableHelper(attributes, {
        data: config.data,
        columns: config.columns.map(InternalIndexedColumn),
    });
}

async function tableHelper(
    attributes: Attribute[],
    config: InternalTable<Record<string, unknown>>
): Promise<Element> {
    const [sX, sY] = Internal.getSpacing(attributes, [0, 0]);

    const maybeHeaders: Maybe<Promise<Element>> = ((headers: Element[]) => {
        const [headers_] = headers.map(
            async (header: Element, col: number) =>
                await onGrid(1, col + 1, header)
        );
        return headers.some((value: Element) => value === Empty())
            ? Nothing()
            : Just(headers_);
    })(config.columns.map(columnHeader));

    const template: Attribute = StyleClass(
        Flag.gridTemplate,
        GridTemplateStyle(
            [Px(sX), Px(sY)],
            config.columns.map(columnWidth),
            config.data.map(() => Content())
        )
    );

    const children: Promise<{
        elements: Element[];
        column: number;
        row: number;
    }> = config.data.reduce(
        async (
            acc: Promise<{
                elements: Element[];
                column: number;
                row: number;
            }>,
            data: Record<string, unknown>
        ) => await build(config.columns, data, acc),
        new Promise<{
            elements: Element[];
            column: number;
            row: number;
        }>((resolve, _reject) => {
            resolve({
                elements: [],
                row: maybeHeaders === Nothing() ? 1 : 2,
                column: 1,
            });
        })
    );

    const children_ = await children;

    function columnHeader(col: InternalTableColumn): Element {
        switch (col.type) {
            case InternalTableColumns.InternalIndexedColumn:
                return col.column.header;

            case InternalTableColumns.InternalColumn:
                return col.column.header;
        }
    }

    function columnWidth(col: InternalTableColumn): Length {
        switch (col.type) {
            case InternalTableColumns.InternalIndexedColumn:
                return col.column.width;

            case InternalTableColumns.InternalColumn:
                return col.column.width;
        }
    }

    async function onGrid(
        rowLevel: number,
        columnLevel: number,
        elem: Element
    ): Promise<Element> {
        return await Internal.element(
            asEl,
            Internal.div,
            [
                StyleClass(
                    Flag.gridPosition,
                    GridPosition(rowLevel, columnLevel, 1, 1)
                ),
            ],
            Unkeyed([elem])
        );
    }

    async function add(
        cell: Record<string, unknown>,
        columnConfig: InternalTableColumn,
        cursor: Promise<{ elements: Element[]; row: number; column: number }>
    ): Promise<{ elements: Element[]; row: number; column: number }> {
        const cursor_ = await cursor;
        switch (columnConfig.type) {
            case InternalTableColumns.InternalIndexedColumn: {
                cursor_.elements = [
                    await onGrid(
                        cursor_.row,
                        cursor_.column,
                        columnConfig.column.view(
                            maybeHeaders === Nothing()
                                ? cursor_.row - 1
                                : cursor_.row - 2,
                            cell
                        )
                    ),
                    ...cursor_.elements,
                ];
                cursor_.column = cursor_.column + 1;
                return cursor;
            }

            case InternalTableColumns.InternalColumn:
                return {
                    elements: [
                        await onGrid(
                            cursor_.row,
                            cursor_.column,
                            columnConfig.column.view(cell)
                        ),
                        ...cursor_.elements,
                    ],
                    row: cursor_.row,
                    column: cursor_.column + 1,
                };
        }
    }

    async function build(
        columns: InternalTableColumn[],
        rowData: Record<string, unknown>,
        cursor: Promise<{
            elements: Element[];
            column: number;
            row: number;
        }>
    ): Promise<{
        elements: Element[];
        column: number;
        row: number;
    }> {
        const newCursor: Promise<{
            elements: Element[];
            column: number;
            row: number;
        }> = columns.reduce(
            async (
                acc: Promise<{
                    elements: Element[];
                    column: number;
                    row: number;
                }>,
                column: InternalTableColumn
            ) => await add(rowData, column, acc),
            cursor
        );
        const cursor_ = await cursor;
        const newCursor_ = await newCursor;

        return {
            elements: newCursor_.elements,
            row: cursor_.row + 1,
            column: 1,
        };
    }

    return await Internal.element(
        asGrid,
        Internal.div,
        [width(fill), template, ...attributes],
        Unkeyed(
            await (() => {
                switch (maybeHeaders.type) {
                    case MaybeType.Nothing:
                        return children_.elements;

                    case MaybeType.Just:
                        return [
                            maybeHeaders.value,
                            ...children_.elements.reverse(),
                        ];
                }
            })()
        )
    );
}

/**TODO:
 * A paragraph will layout all children as wrapped, inline elements.

    import Element exposing (el, paragraph, text)
    import Element.Font as Font

    view =
        paragraph []
            [ text "lots of text ...."
            , el [ Font.bold ] (text "this is bold")
            , text "lots of text ...."
            ]

This is really useful when you want to markup text by having some parts be bold, or some be links, or whatever you so desire.

Also, if a child element has `alignLeft` or `alignRight`, then it will be moved to that side and the text will flow around it, (ah yes, `float` behavior).

This makes it particularly easy to do something like a [dropped capital](https://en.wikipedia.org/wiki/Initial).

    import Element exposing (alignLeft, el, padding, paragraph, text)
    import Element.Font as Font

    view =
        paragraph []
            [ el
                [ alignLeft
                , padding 5
                ]
                (text "S")
            , text "o much text ...."
            ]

Which will look something like

![A paragraph where the first letter is twice the height of the others](https://mdgriffith.gitbooks.io/style-elements/content/assets/Screen%20Shot%202017-08-25%20at%209.41.52%20PM.png)

**Note** `spacing` on a paragraph will set the pixel spacing between lines.

 */
async function paragraph(
    attributes: Attribute[],
    children: Element[]
): Promise<Element> {
    return await Internal.element(
        asParagraph,
        Internal.div,
        [Describe(Paragraph()), width(fill), spacing(5), ...attributes],
        Unkeyed(children)
    );
}

/**TODO:
 * Now that we have a paragraph, we need some way to attach a bunch of paragraph's together.

To do that we can use a `textColumn`.

The main difference between a `column` and a `textColumn` is that `textColumn` will flow the text around elements that have `alignRight` or `alignLeft`, just like we just saw with paragraph.

In the following example, we have a `textColumn` where one child has `alignLeft`.

    Element.textColumn [ spacing 10, padding 10 ]
        [ paragraph [] [ text "lots of text ...." ]
        , el [ alignLeft ] none
        , paragraph [] [ text "lots of text ...." ]
        ]

Which will result in something like:

![A text layout where an image is on the left.](https://mdgriffith.gitbooks.io/style-elements/content/assets/Screen%20Shot%202017-08-25%20at%208.42.39%20PM.png)
 */
async function textColumn(
    attributes: Attribute[],
    children: Element[]
): Promise<Element> {
    return await Internal.element(
        asTextColumn,
        Internal.div,
        [width(maximum(750, minimum(500, fill))), ...attributes],
        Unkeyed(children)
    );
}

/**TODO:
 * Both a source and a description are required for images.

The description is used for people using screen readers.

Leaving the description blank will cause the image to be ignored by assistive technology. This can make sense for images that are purely decorative and add no additional information.

So, take a moment to describe your image as you would to someone who has a harder time seeing.
 */
async function image(
    attributes: Attribute[],
    { src, description }: { src: string; description: string }
): Promise<Element> {
    const imageAttributes: Attribute[] = attributes.filter((a: Attribute) => {
        switch (a.type) {
            case Attributes.Width:
                return true;

            case Attributes.Height:
                return true;

            default:
                return false;
        }
    });
    return await Internal.element(
        asEl,
        Internal.div,
        [Internal.htmlClass(classes.imageContainer), ...attributes],
        Unkeyed([
            await Internal.element(
                asEl,
                NodeName('img'),
                [
                    Attr(attribute('src', src)),
                    Attr(attribute('alt', description)),
                    ...imageAttributes,
                ],
                Unkeyed([])
            ),
        ])
    );
}

/**TODO:
 * link []
        { url = "http://fruits.com"
        , label = text "A link to my favorite fruit provider."
        }
 */
async function link(
    attributes: Attribute[],
    { url, label }: { url: string; label: Element }
): Promise<Element> {
    return await linkCore(attributes, { url, label });
}

/**TODO:
 *
 * @param attributes
 * @param param1
 * @returns
 */
async function newTabLink(
    attributes: Attribute[],
    { url, label }: { url: string; label: Element }
): Promise<Element> {
    return await linkCore(
        [Attr(attribute('target', '_blank')), ...attributes],
        {
            url,
            label,
        }
    );
}

async function linkCore(
    attributes: Attribute[],
    { url, label }: { url: string; label: Element }
): Promise<Element> {
    return await Internal.element(
        asEl,
        NodeName('a'),
        [
            Attr(attribute('href', url)),
            Attr(attribute('rel', 'noopener noreferrer')),
            width(shrink),
            height(shrink),
            Internal.htmlClass(
                `${classes.contentCenterX} ${classes.contentCenterY} ${classes.link}`
            ),
            ...attributes,
        ],
        Unkeyed([label])
    );
}

/**TODO:
 * A link to download a file.
 * @param attributes
 * @param param1
 * @returns
 */
async function download(
    attributes: Attribute[],
    { url, label }: { url: string; label: Element }
): Promise<Element> {
    return await downloadCore(attributes, { url, filename: '', label });
}

/**TODO:
 * A link to download a file, but you can specify the filename.
 * @param attributes
 * @param param1
 * @returns
 */
async function downloadAs(
    attributes: Attribute[],
    { label, filename, url }: { label: Element; filename: string; url: string }
): Promise<Element> {
    return await downloadCore(attributes, { url, filename, label });
}

async function downloadCore(
    attributes: Attribute[],
    { url, filename, label }: { url: string; filename: string; label: Element }
): Promise<Element> {
    return await Internal.element(
        asEl,
        NodeName('a'),
        [
            Attr(attribute('href', url)),
            Attr(attribute('download', filename)),
            width(shrink),
            height(shrink),
            Internal.htmlClass(classes.contentCenterX),
            Internal.htmlClass(classes.contentCenterY),
            ...attributes,
        ],
        Unkeyed([label])
    );
}

// NEARBYS
function below(element: Element): Attribute {
    return createNearby(Location.Below, element);
}

function above(element: Element): Attribute {
    return createNearby(Location.Above, element);
}

function onRight(element: Element): Attribute {
    return createNearby(Location.OnRight, element);
}

function onLeft(element: Element): Attribute {
    return createNearby(Location.OnLeft, element);
}

/**TODO:
 * This will place an element in front of another.

**Note:** If you use this on a `layout` element, it will place the element as fixed to the viewport which can be useful for modals and overlays.
 * @param element 
 * @returns 
 */
function inFront(element: Element): Attribute {
    return createNearby(Location.InFront, element);
}

/**TODO:
 * This will place an element between the background and the content of an element.
 * @param element
 * @returns
 */
function behindContent(element: Element): Attribute {
    return createNearby(Location.Behind, element);
}

function createNearby(location: Location, element: Element): Attribute {
    switch (element.type) {
        case Elements.Empty:
            return NoAttribute();

        default:
            return Nearby(location, element);
    }
}

/**
 * TODO:
 * @param attributes
 * @returns
 */
function width(width: Length): Attribute {
    return Width(width);
}

/**
 * TODO:
 * @param attributes
 * @returns
 */
function height(width: Length): Attribute {
    return Height(width);
}

function scale(n: number): Attribute {
    return TransformComponent_(Flag.scale, Scale([n, n, 1]));
}

/**TODO:
 * Angle is given in radians.
 * @param angle
 * @returns
 */
function rotate(angle: number): Attribute {
    return TransformComponent_(Flag.rotate, Rotate([0, 0, 1], angle));
}

function moveUp(y: number): Attribute {
    return TransformComponent_(Flag.moveY, MoveY(y * -1));
}

function moveDown(y: number): Attribute {
    return TransformComponent_(Flag.moveY, MoveY(y));
}

function moveRight(x: number): Attribute {
    return TransformComponent_(Flag.moveX, MoveX(x));
}

function moveLeft(x: number): Attribute {
    return TransformComponent_(Flag.moveX, MoveX(x * -1));
}

function padding(x: number): Attribute {
    return StyleClass(Flag.padding, PaddingStyle('p-' + x, x, x, x, x));
}

/**
 * Set horizontal and vertical padding.
 * @param x
 * @param y
 * @returns
 */
function paddingXY(x: number, y: number): Attribute {
    return x === y
        ? padding(x)
        : StyleClass(Flag.padding, PaddingStyle(`p-${x}-${y}`, y, x, y, x));
}

/** TODO:
 *If you find yourself defining unique paddings all the time, you might consider defining

    edges =
        { top = 0
        , right = 0
        , bottom = 0
        , left = 0
        }

And then just do

    paddingEach { edges | right = 5 }
 * @param param0
 * @returns
 */
function paddingEach({
    top,
    right,
    bottom,
    left,
}: {
    top: number;
    right: number;
    bottom: number;
    left: number;
}): Attribute {
    return top === right && top === bottom && top === left
        ? padding(top)
        : StyleClass(
              Flag.padding,
              PaddingStyle(
                  Internal.paddingName(top, right, bottom, left),
                  top,
                  right,
                  bottom,
                  left
              )
          );
}

function spacing(x: number): Attribute {
    return StyleClass(
        Flag.spacing,
        SpacingStyle(Internal.spacingName(x, x), x, x)
    );
}

/**TODO:
 * In the majority of cases you'll just need to use `spacing`, which will work as intended.

However for some layouts, like `textColumn`, you may want to set a different spacing for the x axis compared to the y axis.
 * @param x 
 * @param y 
 * @returns 
 */
function spacingXY(x: number, y: number): Attribute {
    return StyleClass(
        Flag.spacing,
        SpacingStyle(Internal.spacingName(x, y), x, y)
    );
}

/**TODO:
 * Make an element transparent and have it ignore any mouse or touch events, though it will stil take up space.
 * @param on
 * @returns
 */
function transparent(on: boolean): Attribute {
    return on
        ? StyleClass(Flag.transparency, Transparency('transparent', 1.0))
        : StyleClass(Flag.transparency, Transparency('visible', 0.0));
}

/**TODO:
 * A capped value between 0.0 and 1.0, where 0.0 is transparent and 1.0 is fully opaque.

Semantically equivalent to html opacity.
 * @param o 
 * @returns 
 */
function alpha(o: number): Attribute {
    const transparency_: number = ((x: number) => 1 - x)(
        Math.min(1.0, Math.max(0.0, o))
    );
    return StyleClass(
        Flag.transparency,
        Transparency(
            'transparency-' + Internal.floatClass(transparency_),
            transparency_
        )
    );
}

/** TODO:
 * Takes in a Window.Size and returns a device profile which can be used for responsiveness.

If you have more detailed concerns around responsiveness, it probably makes sense to copy this function into your codebase and modify as needed.
 * @param window 
 * @returns 
 */
function classifyDevice(window: { width: number; height: number }): Device {
    const longSide: number = Math.max(window.width, window.height),
        shortSide: number = Math.min(window.width, window.height);
    return Device(
        (() => {
            if (shortSide < 600) {
                return DeviceClass.Phone;
            } else if (longSide <= 1200) {
                return DeviceClass.Tablet;
            } else if (longSide > 1200 && longSide <= 1920) {
                return DeviceClass.Desktop;
            } else {
                return DeviceClass.BigDesktop;
            }
        })(),
        window.width < window.height
            ? Orientation.Portrait
            : Orientation.Landscape
    );
}

/**TODO:
 * When designing it's nice to use a modular scale to set spacial rythms.

    scaled =
        Element.modular 16 1.25

A modular scale starts with a number, and multiplies it by a ratio a number of times.
Then, when setting font sizes you can use:

    Font.size (scaled 1) -- results in 16

    Font.size (scaled 2) -- 16 * 1.25 results in 20

    Font.size (scaled 4) -- 16 * 1.25 ^ (4 - 1) results in 31.25

We can also provide negative numbers to scale below 16px.

    Font.size (scaled -1) -- 16 * 1.25 ^ (-1) results in 12.8
 * @param normal 
 * @param ratio 
 * @param rescale 
 * @returns 
 */
function modular(normal: number, ratio: number, rescale: number): number {
    if (rescale === 0) {
        return normal;
    } else if (rescale < 0) {
        return normal * ratio ** rescale;
    } else {
        return normal * ratio ** (rescale - 1);
    }
}

function mouseOver(decs: Attribute[]): Attribute {
    return StyleClass(
        Flag.hover,
        PseudoSelector(PseudoClass.Hover, Internal.unwrapDecorations(decs))
    );
}

function mouseDown(decs: Attribute[]): Attribute {
    return StyleClass(
        Flag.active,
        PseudoSelector(PseudoClass.Active, Internal.unwrapDecorations(decs))
    );
}

function focused(decs: Attribute[]): Attribute {
    return StyleClass(
        Flag.focus,
        PseudoSelector(PseudoClass.Focus, Internal.unwrapDecorations(decs))
    );
}

export {
    rem,
    minContent,
    maxContent,
    none,
    text,
    el,
    row,
    wrappedRow,
    Column,
    column,
    paragraph,
    textColumn,
    table,
    IndexedColumn,
    indexedTable,
    width,
    height,
    px,
    shrink,
    fill,
    fillPortion,
    maximum,
    minimum,
    explain,
    padding,
    paddingXY,
    paddingEach,
    spacing,
    spacingXY,
    spaceEvenly,
    centerX,
    centerY,
    alignLeft,
    alignRight,
    alignTop,
    alignBottom,
    transparent,
    alpha,
    pointer,
    moveUp,
    moveDown,
    moveRight,
    moveLeft,
    rotate,
    scale,
    clip,
    clipX,
    clipY,
    scrollbars,
    scrollbarX,
    scrollbarY,
    layout,
    layoutWith,
    noStaticStyleSheet,
    forceHover,
    noHover,
    focusStyle,
    link,
    newTabLink,
    download,
    downloadAs,
    image,
    above,
    below,
    onRight,
    onLeft,
    inFront,
    behindContent,
    mouseOver,
    mouseDown,
    focused,
    DeviceClass,
    Orientation,
    Device,
    classifyDevice,
    modular,
    html,
    htmlAttribute,
};

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
import { DOM } from './deps.ts';
import { elmish } from './deps.ts';

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
    Padding,
    Spacing,
    PaddingStyle,
    StyleClass,
    SpacingStyle,
} from './internal/data.ts';
import { padding, spacing } from './internal/flag.ts';
import { classes } from './internal/style.ts';
import { attribute } from './dom/attribute.ts';
import {
    unstyled,
    renderRoot,
    htmlClass,
    rootStyle,
    focusDefaultStyle,
    element,
    div,
    extractSpacingAndPadding,
    paddingNameFloat,
} from './internal/model.ts';

const { Just, Nothing, map, withDefault } = elmish.Maybe;

function html(html: DOM.Node): Element {
    return unstyled(html);
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

// Shrink an element to fit its contents.
let shrink: Length = Content();

// Fill the available space. The available space will be split evenly between elements that have `width fill`.
let fill: Length = Fill(1);

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
function minimum(value: number, length: Content | Fill): Length {
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
function maximum(value: number, length: Content | Fill): Length {
    return Max(value, length);
}

// Set supported CSS property to min-content
let minContent: Length = MinContent();

// Set supported CSS property to max-content
let maxContent: Length = MaxContent();

/** TODO: Sometimes you may not want to split available space evenly. In this case you can use `fillPortion` to define which elements should have what portion of the available space.

So, two elements, one with `width (fillPortion 2)` and one with `width (fillPortion 3)`. The first would get 2 portions of the available space, while the second would get 3.

**Also:** `fill == fillPortion 1`
*/
function fillPortion(value: number): Length {
    return Fill(value);
}

// This is your top level node where you can turn `Element` into `Html`.
function layout(attributes: Attribute[], child: Element): DOM.Node {
    return layoutWith([], attributes, child);
}

function layoutWith(
    options: Option[],
    attributes: Attribute[],
    child: Element
): DOM.Node {
    return renderRoot(
        options,
        [
            htmlClass(`${classes.root} ${classes.any} ${classes.single}`),
            ...rootStyle.concat(attributes),
        ],
        child
    );
}

/**TODO:
 * Elm UI embeds two StyleSheets, one that is constant, and one that changes dynamically based on styles collected from the elements being rendered.

This option will stop the static/constant stylesheet from rendering.

If you're embedding multiple elm-ui `layout` elements, you need to guarantee that only one is rendering the static style sheet and that it's above all the others in the DOM tree.
 */
const noStaticStyleSheet: Option = RenderModeOption(
    RenderMode.NoStaticStyleSheet
);

const defaultFocus: FocusStyle = focusDefaultStyle;

function focusStyle(focus: FocusStyle): FocusStyleOption {
    return FocusStyleOption(focus);
}

// Disable all `mouseOver` styles.
const noHover: Option = HoverOption(HoverSetting.NoHover);

/**
 * Any `hover` styles, aka attributes with `mouseOver` in the name, will be always turned on.

    This is useful for when you're targeting a platform that has no mouse, such as mobile.
 */
const forceHover: Option = HoverOption(HoverSetting.ForceHover);

// When you want to render exactly nothing.
const none: Element = Empty();

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
function el(attributes: Attribute[], child: Element): Element {
    return element(
        asEl,
        div,
        [width(shrink), height(shrink), ...attributes],
        Unkeyed([child])
    );
}

function row(attributes: Attribute[], children: Element[]): Element {
    return element(
        asRow,
        div,
        [
            htmlClass(classes.contentLeft + ' ' + classes.contentCenterY),
            width(shrink),
            height(shrink),
            ...attributes,
        ],
        Unkeyed(children)
    );
}

function column(attributes: Attribute[], children: Element[]): Element {
    return element(
        asColumn,
        div,
        [
            htmlClass(classes.contentTop + ' ' + classes.contentLeft),
            height(shrink),
            width(shrink),
            ...attributes,
        ],
        Unkeyed(children)
    );
}

// Same as `row`, but will wrap if it takes up too much horizontal space.
function wrappedRow(attributes: Attribute[], children: Element[]): Element {
    const [padded, spaced]: [Maybe<Padding_>, Maybe<Spaced>] =
        extractSpacingAndPadding(attributes);

    switch (spaced) {
        case Nothing():
            return element(
                asRow,
                div,
                [
                    htmlClass(
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

        default: {
            const { name, x, y } = withDefault(Spacing('', 0, 0), spaced),
                newPadding: Maybe<StyleClass> = (() => {
                    switch (padded) {
                        case Nothing():
                            return Nothing();

                        default: {
                            const { top, right, bottom, left } = withDefault(
                                Padding('', 0, 0, 0, 0),
                                padded
                            );
                            if (right >= x / 2 && bottom >= y / 2) {
                                const newTop = top - y / 2,
                                    newRight = right - x / 2,
                                    newBottom = bottom - y / 2,
                                    newLeft = left - x / 2;
                                return Just(
                                    StyleClass(
                                        padding,
                                        PaddingStyle(
                                            paddingNameFloat(
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
                    }
                })();

            switch (newPadding) {
                case Nothing(): {
                    // Not enough space in padding to compensate for spacing
                    const halfX = (x / 2) * -1,
                        halfY = (y / 2) * -1;
                    return element(
                        asEl,
                        div,
                        attributes,
                        Unkeyed([
                            element(
                                asRow,
                                div,
                                [
                                    htmlClass(
                                        classes.contentLeft +
                                            ' ' +
                                            classes.contentCenterY +
                                            ' ' +
                                            classes.wrapped
                                    ),
                                    Attr(
                                        attribute(
                                            'style',
                                            `margin: ${halfY.toString()}px ${halfX.toString()}px`
                                        )
                                    ),
                                    Attr(
                                        attribute(
                                            'style',
                                            `width: calc(100% + ${x.toString()}px)`
                                        )
                                    ),
                                    Attr(
                                        attribute(
                                            'style',
                                            `height: calc(100% + ${y.toString()}px)`
                                        )
                                    ),
                                    StyleClass(
                                        spacing,
                                        SpacingStyle(name, x, y)
                                    ),
                                ],
                                Unkeyed(children)
                            ),
                        ])
                    );
                }

                default: {
                    const pad = withDefault(
                        StyleClass(padding, PaddingStyle('', 0, 0, 0, 0)),
                        newPadding
                    );
                    return element(
                        asRow,
                        div,
                        [
                            htmlClass(
                                classes.contentLeft +
                                    ' ' +
                                    classes.contentCenterY +
                                    ' ' +
                                    classes.wrapped
                            ),
                            width(shrink),
                            height(shrink),
                            ...attributes,
                            pad,
                        ],
                        Unkeyed(children)
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
    return htmlClass('explain');
}

/**
 * TODO:
 * @param width
 * @returns
 */
function width(width: Length): Attribute {
    return Width(width);
}

/**
 * TODO:
 * @param height
 * @returns
 */
function height(width: Length): Attribute {
    return Height(width);
}

export {
    px,
    rem,
    shrink,
    fill,
    fillPortion,
    minContent,
    maxContent,
    minimum,
    maximum,
};

// deno-lint-ignore-file no-explicit-any
/** TODO:
 * Input elements have a lot of constraints!

We want all of our input elements to:

  - _Always be accessible_
  - _Behave intuitively_
  - _Be completely restyleable_

While these three goals may seem pretty obvious, Html and CSS have made it surprisingly difficult to achieve!

And incredibly difficult for developers to remember all the tricks necessary to make things work. If you've every tried to make a `<textarea>` be the height of it's content or restyle a radio button while maintaining accessibility, you may be familiar.

This module is intended to be accessible by default. You shouldn't have to wade through docs, articles, and books to find out [exactly how accessible your html actually is](https://www.powermapper.com/tests/screen-readers/aria/index.html).


# Focus Styling

All Elements can be styled on focus by using [`Element.focusStyle`](Element#focusStyle) to set a global focus style or [`Element.focused`](Element#focused) to set a focus style individually for an element.

@docs focusedOnLoad


# Buttons

@docs button


# Checkboxes

A checkbox requires you to store a `Bool` in your model.

This is also the first input element that has a [`required label`](#Label).

    import Element exposing (text)
    import Element.Input as Input

    type Msg
        = GuacamoleChecked Bool

    view model =
        Input.checkbox []
            { onChange = GuacamoleChecked
            , icon = Input.defaultCheckbox
            , checked = model.guacamole
            , label =
                Input.labelRight []
                    (text "Do you want Guacamole?")
            }

@docs checkbox, defaultCheckbox


# Text

@docs text, multiline

@docs Placeholder, placeholder


## Text with autofill

If we want to play nicely with a browser's ability to autofill a form, we need to be able to give it a hint about what we're expecting.

The following inputs are very similar to `Input.text`, but they give the browser a hint to allow autofill to work correctly.

@docs username, newPassword, currentPassword, email, search, spellChecked


# Sliders

A slider is great for choosing between a range of numerical values.

  - **thumb** - The icon that you click and drag to change the value.
  - **track** - The line behind the thumb denoting where you can slide to.

@docs slider, Thumb, thumb, defaultThumb


# Radio Selection

The fact that we still call this a radio selection is fascinating. I can't remember the last time I actually used an honest-to-goodness button on a radio. Chalk it up along with the floppy disk save icon or the word [Dashboard](https://en.wikipedia.org/wiki/Dashboard).

Perhaps a better name would be `Input.chooseOne`, because this allows you to select one of a set of options!

Nevertheless, here we are. Here's how you put one together

    Input.radio
        [ padding 10
        , spacing 20
        ]
        { onChange = ChooseLunch
        , selected = Just model.lunch
        , label = Input.labelAbove [] (text "Lunch")
        , options =
            [ Input.option Burrito (text "Burrito")
            , Input.option Taco (text "Taco!")
            , Input.option Gyro (text "Gyro")
            ]
        }

**Note** we're using `Input.option`, which will render the default radio icon you're probably used to. If you want compeltely custom styling, use `Input.optionWith`!

@docs radio, radioRow, Option, option, optionWith, OptionState


# Labels

Every input has a required `Label`.

@docs Label, labelAbove, labelBelow, labelLeft, labelRight, labelHidden


# Form Elements

You might be wondering where something like `<form>` is.

What I've found is that most people who want `<form>` usually want it for the [implicit submission behavior](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#implicit-submission) or to be clearer, they want to do something when the `Enter` key is pressed.

Instead of implicit submission behavior, [try making an `onEnter` event handler like in this Ellie Example](https://ellie-app.com/5X6jBKtxzdpa1). Then everything is explicit!

And no one has to look up obtuse html documentation to understand the behavior of their code :).


# File Inputs

Presently, elm-ui does not expose a replacement for `<input type="file">`; in the meantime, an `Input.button` and `elm/file`'s `File.Select` may meet your needs.


# Disabling Inputs

You also might be wondering how to disable an input.

Disabled inputs can be a little problematic for user experience, and doubly so for accessibility. This is because it's now your priority to inform the user _why_ some field is disabled.

If an input is truly disabled, meaning it's not focusable or doesn't send off a `Msg`, you actually lose your ability to help the user out! For those wary about accessibility [this is a big problem.](https://ux.stackexchange.com/questions/103239/should-disabled-elements-be-focusable-for-accessibility-purposes)

Here are some alternatives to think about that don't involve explicitly disabling an input.

**Disabled Buttons** - Change the `Msg` it fires, the text that is rendered, and optionally set a `Region.description` which will be available to screen readers.

    import Element.Input as Input
    import Element.Region as Region

    myButton ready =
        if ready then
            Input.button
                [ Background.color blue
                ]
                { onPress =
                    Just SaveButtonPressed
                , label =
                    text "Save blog post"
                }

        else
            Input.button
                [ Background.color grey
                , Region.description
                    "A publish date is required before saving a blogpost."
                ]
                { onPress =
                    Just DisabledSaveButtonPressed
                , label =
                    text "Save Blog "
                }

Consider showing a hint if `DisabledSaveButtonPressed` is sent.

For other inputs such as `Input.text`, consider simply rendering it in a normal `paragraph` or `el` if it's not editable.

Alternatively, see if it's reasonable to _not_ display an input if you'd normally disable it. Is there an option where it's only visible when it's editable?
 */

import { elmish } from '../deps.ts';

import { hsl, hsla } from '../color.ts';
import { attribute } from '../dom/attribute.ts';
import { ComponentEventContext, EventHandler } from '../dom/event.ts';
import {
    alignLeft,
    alpha,
    behindContent,
    centerX,
    centerY,
    clip,
    el,
    fill,
    fillPortion,
    height,
    htmlAttribute,
    inFront,
    moveUp,
    none,
    paddingEach,
    paddingXY,
    pointer,
    px,
    rotate,
    row as row_,
    scrollbarY,
    shrink,
    spacing,
    spacingXY,
    text as text_,
    transparent,
    width,
} from '../element.ts';
import {
    Attribute,
    Describe,
    Element,
    NoAttribute,
    Label as AriaLabel,
    Maybe,
    asEl,
    Unkeyed,
    Attributes,
    Styles,
    PseudoClass,
    Button,
    asColumn,
    NodeName,
    Hsla,
    Rgba,
    Length,
    Px,
    Fill,
    Rem,
    Property,
    StyleClass,
    Style_,
    Shadow,
    Lengths,
    PaddingStyle,
    asParagraph,
    Class,
    asRow,
} from '../internal/data.ts';
import { classes } from '../internal/style.ts';
import * as Internal from '../internal/model.ts';
import * as Flag from '../internal/flag.ts';
import * as Events from './events.ts';
import * as Region from './region.ts';
import * as Border from './border.ts';
import * as Background from './background.ts';
import * as Font from './font.ts';
import domElement from '../dom/element.ts';
import {
    ariaChecked,
    autofill,
    class_,
    disabled,
    max,
    min,
    orient,
    role,
    spellcheck,
    step,
    style,
    tabindex,
    type,
    value,
} from './attributes.ts';

const { Just, Nothing, map, withDefault } = elmish.Maybe;

interface Placeholder_ {
    attributes: Attribute[];
    element: Element;
}

function Placeholder(attributes: Attribute[], element: Element): Placeholder_ {
    return { attributes, element };
}

type Placeholder = Placeholder_;

enum LabelLocation {
    OnRight,
    OnLeft,
    Above,
    Below,
}

enum Labels {
    Label,
    HiddenLabel,
}

interface Label_ {
    type: Labels.Label;
    location: LabelLocation;
    attributes: Attribute[];
    element: Element;
}

function Label(
    location: LabelLocation,
    attributes: Attribute[],
    element: Element
): Label_ {
    return { type: Labels.Label, location, attributes, element };
}

interface HiddenLabel {
    type: Labels.HiddenLabel;
    label: string;
}

function HiddenLabel(label: string): HiddenLabel {
    return { type: Labels.HiddenLabel, label };
}

type Label = Label_ | HiddenLabel;

interface Thumb_ {
    attributes: Attribute[];
}

function Thumb(attributes: Attribute[]): Thumb {
    return { attributes };
}

type Thumb = Thumb_;

enum TextKinds {
    TextInputNode,
    TextArea,
}

interface TextInputNode {
    type: TextKinds.TextInputNode;
    inputType: string;
}

function TextInputNode(inputType: string): TextInputNode {
    return {
        type: TextKinds.TextInputNode,
        inputType,
    };
}

interface TextArea {
    type: TextKinds.TextArea;
}

function TextArea(): TextArea {
    return {
        type: TextKinds.TextArea,
    };
}

type TextKind = TextInputNode | TextArea;

interface TextInput {
    input: TextKind;
    spellchecked: boolean;
    autofill: Maybe<string>;
}

interface Text {
    onChange: {
        componentClass: string;
        handler: (text: string, ctx: ComponentEventContext) => EventHandler;
    };
    text: string;
    placeholder: Maybe<Placeholder>;
    label: Label;
}

enum OptionState {
    Idle,
    Focused,
    Selected,
}

interface Option_ {
    value: any;
    view: (x: OptionState) => Element;
}

function Option(value: any, view: (x: OptionState) => Element): Option {
    return { value, view };
}

type Option = Option_;

enum Found {
    NotFound,
    BeforeFound,
    AfterFound,
}

enum Orientation {
    Row,
    Column,
}

// Colors
const white: Promise<Hsla | Rgba> = hsl(0, 0, 1),
    charcoal: Promise<Hsla | Rgba> = hsl(84, 0.02, 0.53);

// Thumb
const defaultThumb: Thumb = Thumb([
    width(px(16)),
    height(px(16)),
    Border.rounded(8),
    Border.width(1),
    Border.color(hsl(0, 0, 0.5)),
    Background.color(white),
]);

// Style Defaults
const defaultTextPadding: Attribute = paddingXY(12, 12),
    defaultTextBoxStyle: Attribute[] = [
        defaultTextPadding,
        Border.rounded(3),
        Border.color(white),
        Border.width(1),
        spacing(5),
        width(fill),
        height(shrink),
    ];

/**
 * TODO:
 * @param attributes
 * @param element
 * @returns
 */
function placeholder(attributes: Attribute[], element: Element): Placeholder {
    return Placeholder(attributes, element);
}

/**
 * TODO:
 * @param label
 * @returns
 */
function isStacked(label: Label): boolean {
    switch (label.type) {
        case Labels.Label:
            switch (label.location) {
                case LabelLocation.OnRight:
                    return false;

                case LabelLocation.OnLeft:
                    return false;

                case LabelLocation.Above:
                    return true;

                case LabelLocation.Below:
                    return true;
            }
            break;

        case Labels.HiddenLabel:
            return true;
    }
}

/**
 * TODO:
 * @param attributes
 * @param element
 * @returns
 */
function labelRight(attributes: Attribute[], element: Element): Label {
    return Label(LabelLocation.OnRight, attributes, element);
}

/**
 * TODO:
 * @param attributes
 * @param element
 * @returns
 */
function labelLeft(attributes: Attribute[], element: Element): Label {
    return Label(LabelLocation.OnLeft, attributes, element);
}

/**
 * TODO:
 * @param attributes
 * @param element
 * @returns
 */
function labelAbove(attributes: Attribute[], element: Element): Label {
    return Label(LabelLocation.Above, attributes, element);
}

/**
 * TODO:
 * @param attributes
 * @param element
 * @returns
 */
function labelBelow(attributes: Attribute[], element: Element): Label {
    return Label(LabelLocation.Below, attributes, element);
}

/**
 * Sometimes you may need to have a label which is not visible, but is still accessible to screen readers.

Seriously consider a visible label before using this.

The situations where a hidden label makes sense:

  - A searchbar with a `search` button right next to it.
  - A `table` of inputs where the header gives the label.

Basically, a hidden label works when there are other contextual clues that sighted people can pick up on.
 * @param label 
 * @returns 
 */
function labelHidden(label: string): Label {
    return HiddenLabel(label);
}

/**
 * TODO:
 * @param label
 * @returns
 */
function hiddenLabelAttribute(label: Label): Attribute {
    switch (label.type) {
        case Labels.Label:
            return NoAttribute();

        case Labels.HiddenLabel:
            return Describe(AriaLabel(label.label));
    }
}

/**TODO:
 *A standard button.

The `onPress` handler will be fired either `onClick` or when the element is focused and the `Enter` key has been pressed.

    import Element exposing (rgb255, text)
    import Element.Background as Background
    import Element.Input as Input

    blue =
        Element.rgb255 238 238 238

    myButton =
        Input.button
            [ Background.color blue
            , Element.focused
                [ Background.color purple ]
            ]
            { onPress = Just ClickMsg
            , label = text "My Button"
            }

**Note** If you have an icon button but want it to be accessible, consider adding a [`Region.description`](Element-Region#description), which will describe the button to screen readers.
 * @param attributes
 * @param param1
 * @returns
 */
function button(
    attributes: Attribute[],
    {
        onPress,
        label,
    }: {
        onPress: { componentClass: string; handler: Maybe<EventHandler> };
        label: Element;
    }
): Element {
    return Internal.element(
        asEl,
        Internal.div,
        [
            width(shrink),
            height(shrink),
            Internal.htmlClass(
                `${classes.contentCenterX} ${classes.contentCenterY} ${classes.seButton} ${classes.noTextSelection}`
            ),
            pointer,
            focusDefault(attributes),
            Describe(Button()),
            tabindex(0),
        ].concat(
            (() => {
                switch (onPress.handler) {
                    case Nothing():
                        return [disabled(true), ...attributes];

                    default: {
                        const handler = withDefault(() => {}, onPress.handler);
                        return [
                            Events.onClick(onPress.componentClass, handler),
                            Events.onKeyLookUp(
                                onPress.componentClass,
                                (ctx) => {
                                    const { key } = <KeyboardEvent>ctx.e;
                                    switch (key) {
                                        case Events.enter:
                                        case Events.space:
                                            handler(ctx);
                                            break;
                                        default:
                                            break;
                                    }
                                }
                            ),
                            ...attributes,
                        ];
                    }
                }
            })()
        ),
        Unkeyed([label])
    );
}

function focusDefault(attributes: Attribute[]): Attribute {
    if (attributes.every(hasFocusStyle)) return NoAttribute();
    return Internal.htmlClass('focusable');
}

function hasFocusStyle(attribute: Attribute): boolean {
    switch (attribute.type) {
        case Attributes.StyleClass:
            switch (attribute.style.type) {
                case Styles.PseudoSelector:
                    return attribute.style.class_ === PseudoClass.Focus;

                default:
                    return false;
            }

        default:
            return false;
    }
}

/**TODO:
 * - **onChange** - The `Msg` to send.
  - **icon** - The checkbox icon to show. This can be whatever you'd like, but `Input.defaultCheckbox` is included to get you started.
  - **checked** - The current checked state.
  - **label** - The [`Label`](#Label) for this checkbox
 * @param attributes 
 * @param param1 
 * @returns 
 */
function checkbox(
    attributes: Attribute[],
    {
        label,
        icon,
        checked,
        onChange,
    }: {
        onChange: {
            componentClass: string;
            handler: (
                checked: boolean,
                ctx: ComponentEventContext
            ) => EventHandler;
        };
        icon: (checked: boolean) => Element;
        checked: boolean;
        label: Label;
    }
): Element {
    const attrs: Attribute[] = [
        isHiddenLabel(label) ? NoAttribute() : spacing(6),
        Events.onClick(onChange.componentClass, (ctx) =>
            onChange.handler(!checked, ctx)
        ),
        Region.announce,
        Events.onKeyLookUp(onChange.componentClass, (ctx) => {
            const { key } = <KeyboardEvent>ctx.e;
            switch (key) {
                case Events.enter:
                case Events.space:
                    onChange.handler(!checked, ctx);
                    break;
                default:
                    break;
            }
        }),
        tabindex(0),
        pointer,
        alignLeft,
        width(fill),
        ...attributes,
    ];
    return applyLabel(
        [
            role('checkbox'),
            ariaChecked(checked ? true : false),
            hiddenLabelAttribute(label),
            ...attrs,
        ],
        label,
        Internal.element(
            asEl,
            Internal.div,
            [centerY, height(fill), width(shrink)],
            Unkeyed([icon(checked)])
        )
    );
}

function thumb(attributes: Attribute[]): Thumb {
    return Thumb(attributes);
}

/**TODO:
 * A slider input, good for capturing float values.

    Input.slider
        [ Element.height (Element.px 30)

        -- Here is where we're creating/styling the "track"
        , Element.behindContent
            (Element.el
                [ Element.width Element.fill
                , Element.height (Element.px 2)
                , Element.centerY
                , Background.color grey
                , Border.rounded 2
                ]
                Element.none
            )
        ]
        { onChange = AdjustValue
        , label =
            Input.labelAbove []
                (text "My Slider Value")
        , min = 0
        , max = 75
        , step = Nothing
        , value = model.sliderValue
        , thumb =
            Input.defaultThumb
        }

`Element.behindContent` is used to render the track of the slider. Without it, no track would be rendered. The `thumb` is the icon that you can move around.

The slider can be vertical or horizontal depending on the width/height of the slider.

  - `height fill` and `width (px someWidth)` will cause the slider to be vertical.
  - `height (px someHeight)` and `width (px someWidth)` where `someHeight` > `someWidth` will also do it.
  - otherwise, the slider will be horizontal.

**Note** If you want a slider for an `Int` value:

  - set `step` to be `Just 1`, or some other whole value
  - `value = toFloat model.myInt`
  - And finally, round the value before making a message `onChange = round >> AdjustValue`
 * @param attributes 
 * @param input 
 * @returns 
 */
function slider(
    attributes: Attribute[],
    input: {
        onChange: {
            componentClass: string;
            handler: (
                value: number,
                ctx: ComponentEventContext
            ) => EventHandler;
        };
        label: Label;
        min: number;
        max: number;
        value: number;
        thumb: Thumb;
        step: Maybe<number>;
    }
): Element {
    const thumbAttributes: Attribute[] = input.thumb.attributes,
        width_: Maybe<Length> = Internal.getWidth(thumbAttributes),
        height_: Maybe<Length> = Internal.getHeight(thumbAttributes),
        trackWidth: Maybe<Length> = Internal.getWidth(attributes),
        trackHeight: Maybe<Length> = Internal.getHeight(attributes),
        vertical: boolean = (() => {
            const w: number = withDefault(0, Internal.getLength(trackWidth));
            const h: number = withDefault(0, Internal.getLength(trackHeight));
            switch ([trackWidth, trackHeight]) {
                case [Nothing(), Nothing()]:
                    return false;

                case [Just(Px(w)), Just(Px(h))]:
                    return h > w;

                // TODO: Test because is different than source
                case [Just(Px(0)), Just(Fill(0))]:
                    return true;

                default:
                    return false;
            }
        })(),
        [spacingX, spacingY]: [number, number] = Internal.getSpacing(
            attributes,
            [5, 5]
        ),
        factor = (input.value - input.min) / (input.max - input.min),
        thumbWidthString: string = (() => {
            const w: number = withDefault(0, Internal.getLength(width_));
            switch (width_) {
                case Nothing():
                    return '20px';

                case Just(Px(w)):
                    return w + 'px';

                case Just(Rem(w)):
                    return w + 'rem';

                default:
                    return '100%';
            }
        })(),
        thumbHeightString: string = (() => {
            const h: number = withDefault(0, Internal.getLength(height_));
            switch (height_) {
                case Nothing():
                    return '20px';

                case Just(Px(h)):
                    return h + 'px';

                case Just(Rem(h)):
                    return h + 'rem';

                default:
                    return '100%';
            }
        })(),
        /**TODO:
         * Needed attributes

           Thumb Attributes
              - Width/Height of thumb so that the input can shadow it.


           Attributes

               OnParent ->
                   Spacing


               On track ->
                   Everything else




            The `<input>`
         */
        className = `thmb-${thumbWidthString}-${thumbHeightString}`,
        thumbShadowStyle = [
            Property('width', thumbWidthString),
            Property('height', thumbHeightString),
        ];
    return applyLabel(
        [
            isHiddenLabel(input.label)
                ? NoAttribute()
                : spacingXY(spacingX, spacingY),
            Region.announce,
            tabindex(0),
            width(
                (() => {
                    const w: Length = withDefault(Px(0), trackWidth);
                    switch (trackWidth) {
                        case Just(Px(0)):
                            return shrink;

                        case Just(w):
                            return w;

                        default:
                            return fill;
                    }
                })()
            ),
            height(
                (() => {
                    const h: Length = withDefault(Px(0), trackHeight);
                    switch (trackHeight) {
                        case Just(Px(0)):
                            return shrink;

                        case Just(h):
                            return h;

                        default:
                            return shrink;
                    }
                })()
            ),
        ],
        input.label,
        row_(
            [
                width(withDefault(fill, trackWidth)),
                height(withDefault(px(20), trackHeight)),
            ],
            [
                Internal.element(
                    asEl,
                    NodeName('input'),
                    [
                        hiddenLabelAttribute(input.label),
                        StyleClass(
                            Flag.active,
                            Style_(
                                `input[type="range"].${className}::-moz-range-thumb`,
                                thumbShadowStyle
                            )
                        ),
                        StyleClass(
                            Flag.hover,
                            Style_(
                                `input[type="range"].${className}::-webkit-slider-thumb`,
                                thumbShadowStyle
                            )
                        ),
                        StyleClass(
                            Flag.focus,
                            Style_(
                                `input[type="range"].${className}::-ms-thumb`,
                                thumbShadowStyle
                            )
                        ),
                        class_(className + ' ui-slide-bar focusable-parent'),
                        Events.onInput(input.onChange.componentClass, (ctx) => {
                            const { inputType } = <InputEvent>ctx.e;
                            return input.onChange.handler(
                                Number.parseFloat(inputType),
                                ctx
                            );
                        }),
                        type('range'),
                        step(
                            input.step === Nothing()
                                ? // Note: If we set `any` here,
                                  // Firefox makes a single press of the arrows keys equal to 1
                                  // We could set the step manually to the effective range / 100
                                  // String.fromFloat ((input.max - input.min) / 100)
                                  // Which matches Chrome's default behavior
                                  // HOWEVER, that means manually moving a slider with the mouse will snap to that interval.
                                  'any'
                                : withDefault(0, input.step)
                        ),
                        min(input.min),
                        max(input.max),
                        value(input.value),
                        vertical ? orient('vertical') : NoAttribute(),
                        width(
                            vertical
                                ? withDefault(px(20), trackHeight)
                                : withDefault(fill, trackWidth)
                        ),
                        height(
                            vertical
                                ? withDefault(fill, trackWidth)
                                : withDefault(px(20), trackHeight)
                        ),
                    ],
                    Unkeyed([])
                ),
                el(
                    [
                        width(withDefault(fill, trackWidth)),
                        height(withDefault(px(20), trackHeight)),
                        ...attributes,
                        // This is after `attributes` because the thumb should be in front of everything.
                        behindContent(
                            vertical
                                ? viewVerticalThumb(
                                      factor,
                                      [
                                          Internal.htmlClass('focusable-thumb'),
                                          ...thumbAttributes,
                                      ],
                                      trackWidth
                                  )
                                : viewHorizontalThumb(
                                      factor,
                                      [
                                          Internal.htmlClass('focusable-thumb'),
                                          ...thumbAttributes,
                                      ],
                                      trackHeight
                                  )
                        ),
                    ],
                    none
                ),
            ]
        )
    );
}

function viewHorizontalThumb(
    factor: number,
    attributes: Attribute[],
    trackHeight: Maybe<Length>
): Element {
    return row_(
        [width(fill), height(withDefault(fill, trackHeight)), centerY],
        [
            el([width(fillPortion(Math.round(factor * 10000)))], none),
            el([centerY, ...attributes], none),
            el(
                [width(fillPortion(Math.round(Math.abs(1 - factor) * 10000)))],
                none
            ),
        ]
    );
}

function viewVerticalThumb(
    factor: number,
    attributes: Attribute[],
    trackWidth: Maybe<Length>
): Element {
    return row_(
        [height(fill), width(withDefault(fill, trackWidth)), centerX],
        [
            el(
                [height(fillPortion(Math.round(Math.abs(1 - factor) * 10000)))],
                none
            ),
            el([centerX, ...attributes], none),
            el([height(fillPortion(Math.round(factor * 10000)))], none),
        ]
    );
}

function textHelper(
    textInput: TextInput,
    attributes: Attribute[],
    textOptions: Text
): Element {
    const withDefaults: Attribute[] = defaultTextBoxStyle.concat(attributes),
        redistributed: {
            fullParent: Attribute[];
            parent: Attribute[];
            wrapper: Attribute[];
            input: Attribute[];
            cover: Attribute[];
        } = redistribute(
            textInput.input.type === TextKinds.TextArea,
            isStacked(textOptions.label),
            withDefaults
        ),
        heightConstrained: boolean = (() => {
            switch (textInput.input.type) {
                case TextKinds.TextInputNode:
                    return false;

                case TextKinds.TextArea:
                    return withDefault(
                        false,
                        map(
                            isConstrained,
                            withDefaults.flatMap(getHeight).reverse()[0]
                        )
                    );
            }
        })(),
        parentPadding: {
            top: number;
            right: number;
            bottom: number;
            left: number;
        } = withDefault(
            { top: 0, right: 0, bottom: 0, left: 0 },
            withDefaults.flatMap(getPadding).reverse()[0]
        ),
        inputElement: Element = Internal.element(
            asEl,
            (() => {
                switch (textInput.input.type) {
                    case TextKinds.TextInputNode:
                        return NodeName('input');

                    default:
                        return NodeName('textarea');
                }
            })(),
            (() => {
                switch (textInput.input.type) {
                    case TextKinds.TextInputNode:
                        // Note: Due to a weird edgecase in...Edge...
                        // `type` needs to come _before_ `value`
                        // More reading: https://github.com/mdgriffith/elm-ui/pull/94/commits/4f493a27001ccc3cf1f2baa82e092c35d3811876
                        return [
                            type(textInput.input.inputType),
                            Internal.htmlClass(classes.inputText),
                        ];

                    default:
                        return [
                            clip,
                            height(fill),
                            // The only reason we do this padding trick is so that when the user clicks in the padding,
                            // that the cursor will reset correctly.
                            // This could probably be combined with the above `calcMoveToCompensateForPadding`
                            paddingEach(parentPadding),
                            calcMoveToCompensateForPadding(withDefaults),
                            Internal.htmlClass(classes.inputMultiline),
                            style(
                                'margin',
                                `${renderBox(negateBox(parentPadding))}`
                            ),
                            style('box-sizing', 'content-box'),
                        ];
                }
            })().concat([
                value(textOptions.text),
                Events.onInput(textOptions.onChange.componentClass, (ctx) => {
                    const { inputType } = <InputEvent>ctx.e;
                    return textOptions.onChange.handler(inputType, ctx);
                }),
                hiddenLabelAttribute(textOptions.label),
                spellcheck(textInput.spellchecked),
                withDefault(NoAttribute(), map(autofill, textInput.autofill)),
                ...redistributed.input,
            ]),
            Unkeyed([])
        ),
        wrappedInput: Element = (() => {
            switch (textInput.input.type) {
                case TextKinds.TextArea:
                    // textarea with height-content means that
                    // the input element is rendered `inFront` with a transparent background
                    // Then the input text is rendered as the space filling element.
                    return Internal.element(
                        asEl,
                        Internal.div,
                        (heightConstrained ? [scrollbarY] : []).concat([
                            width(fill),
                            withDefaults.every(hasFocusStyle)
                                ? NoAttribute()
                                : Internal.htmlClass(classes.focusedWithin),
                            Internal.htmlClass(classes.inputMultilineWrapper),
                            ...redistributed.parent,
                        ]),
                        Unkeyed([
                            Internal.element(
                                asParagraph,
                                Internal.div,
                                [
                                    width(fill),
                                    height(fill),
                                    inFront(inputElement),
                                    Internal.htmlClass(
                                        classes.inputMultilineParent
                                    ),
                                    ...redistributed.wrapper,
                                ],
                                Unkeyed(
                                    (() => {
                                        if (textOptions.text === '') {
                                            switch (textOptions.placeholder) {
                                                case Nothing():
                                                    // Without this, firefox will make the text area lose focus
                                                    // if the input is empty and you mash the keyboard
                                                    return [text_('\u{00A0}')];

                                                default: {
                                                    const place = withDefault(
                                                        placeholder([], none),
                                                        textOptions.placeholder
                                                    );
                                                    return [
                                                        renderPlaceholder(
                                                            place,
                                                            [],
                                                            textOptions.text ===
                                                                ''
                                                        ),
                                                    ];
                                                }
                                            }
                                        } else {
                                            const el = domElement('span', [
                                                [
                                                    'class',
                                                    classes.inputMultilineFiller,
                                                ],
                                            ]);
                                            // We append a non-breaking space to the end of the content so that newlines don't get chomped.
                                            el.append(
                                                textOptions.text + '\u{00A0}'
                                            );
                                            return [Internal.unstyled(el)];
                                        }
                                    })()
                                )
                            ),
                        ])
                    );

                case TextKinds.TextInputNode:
                    return Internal.element(
                        asEl,
                        Internal.div,
                        [
                            width(fill),
                            withDefaults.every(hasFocusStyle)
                                ? NoAttribute()
                                : Internal.htmlClass(classes.focusedWithin),
                            ...redistributed.parent,
                            ...(() => {
                                switch (textOptions.placeholder) {
                                    case Nothing():
                                        return [];

                                    default: {
                                        const place = withDefault(
                                            placeholder([], none),
                                            textOptions.placeholder
                                        );
                                        return [
                                            behindContent(
                                                renderPlaceholder(
                                                    place,
                                                    redistributed.cover,
                                                    textOptions.text === ''
                                                )
                                            ),
                                        ];
                                    }
                                }
                            })(),
                        ],
                        Unkeyed([inputElement])
                    );
            }
        })();

    function getPadding(
        attr: Attribute
    ): Maybe<{ top: number; right: number; bottom: number; left: number }> {
        switch (attr.type) {
            case Attributes.StyleClass:
                switch (attr.style.type) {
                    case Styles.PaddingStyle:
                        // The - 3 is here to prevent accidental triggering of scrollbars
                        // when things are off by a pixel or two.
                        // (or at least when the browser *thinks* it's off by a pixel or two)
                        return Just({
                            top: Math.max(0, Math.floor(attr.style.top - 3)),
                            right: Math.max(
                                0,
                                Math.floor(attr.style.right - 3)
                            ),
                            bottom: Math.max(
                                0,
                                Math.floor(attr.style.bottom - 3)
                            ),
                            left: Math.max(0, Math.floor(attr.style.left - 3)),
                        });

                    default:
                        return Nothing();
                }

            default:
                return Nothing();
        }
    }

    return applyLabel(
        [
            Class(Flag.cursor, classes.cursorText),
            isHiddenLabel(textOptions.label) ? NoAttribute() : spacing(5),
            Region.announce,
            ...redistributed.fullParent,
        ],
        textOptions.label,
        wrappedInput
    );
}

function getHeight(attribute: Attribute): Maybe<Length> {
    switch (attribute.type) {
        case Attributes.Height:
            return Just(attribute.height);

        default:
            return Nothing();
    }
}

function negateBox(box: {
    top: number;
    right: number;
    bottom: number;
    left: number;
}) {
    return {
        top: box.top * -1,
        right: box.right * -1,
        bottom: box.bottom * -1,
        left: box.left * -1,
    };
}

function renderBox({
    top,
    right,
    bottom,
    left,
}: {
    top: number;
    right: number;
    bottom: number;
    left: number;
}) {
    return `${top}px ${right}px ${bottom}px ${left}px`;
}

function renderPlaceholder(
    placeholder: Placeholder,
    forPlaceholder: Attribute[],
    on: boolean
): Element {
    return el(
        [
            ...forPlaceholder,
            Internal.htmlClass(
                `${classes.noTextSelection} ${classes.passPointerEvents}`
            ),
            height(fill),
            width(fill),
            alpha(on ? 1 : 0),
            clip,
            Font.color(charcoal),
            Background.color(hsla(0, 0, 0, 0)),
            Border.color(hsla(0, 0, 0, 0)),
            ...placeholder.attributes,
        ],
        placeholder.element
    );
}

/**
 * Because textareas are now shadowed, where they're rendered twice,
 * we to move the literal text area up because spacing is based on line height.
 */
function calcMoveToCompensateForPadding(attributes: Attribute[]): Attribute {
    const gathered: Maybe<number> = attributes.reduceRight(
        (acc: Maybe<number>, attr: Attribute) => {
            return gatherSpacing(attr, acc);
        },
        Nothing()
    );
    function gatherSpacing(
        attr: Attribute,
        found: Maybe<number>
    ): Maybe<number> {
        switch (attr.type) {
            case Attributes.StyleClass:
                switch (attr.style.type) {
                    case Styles.SpacingStyle:
                        switch (found) {
                            case Nothing():
                                return Just(attr.style.y);

                            default:
                                return found;
                        }

                    default:
                        return found;
                }

            default:
                return found;
        }
    }
    switch (gathered) {
        case Nothing():
            return NoAttribute();

        default: {
            const vSpace: number = withDefault(0, gathered);
            return moveUp(Math.floor(vSpace / 2));
        }
    }
}

/**TODO:
 * Given the list of attributes provided to `Input.multiline` or `Input.text`,

redistribute them to the parent, the input, or the cover.

  - fullParent -> Wrapper around label and input
  - parent -> parent of wrapper
  - wrapper -> the element that is here to take up space.
  - cover -> things like placeholders or text areas which are layered on top of input.
  - input -> actual input element
 */
function redistribute(
    isMultiline: boolean,
    stacked: boolean,
    attributes: Attribute[]
): {
    fullParent: Attribute[];
    parent: Attribute[];
    wrapper: Attribute[];
    input: Attribute[];
    cover: Attribute[];
} {
    return ((redist) => {
        return {
            fullParent: redist.fullParent.reverse(),
            parent: redist.parent.reverse(),
            wrapper: redist.wrapper.reverse(),
            input: redist.input.reverse(),
            cover: redist.cover.reverse(),
        };
    })(
        attributes.reduce(
            (
                acc: {
                    fullParent: Attribute[];
                    parent: Attribute[];
                    wrapper: Attribute[];
                    input: Attribute[];
                    cover: Attribute[];
                },
                attr: Attribute
            ) => {
                return redistributeOver(isMultiline, stacked, attr, acc);
            },
            {
                fullParent: [],
                parent: [],
                wrapper: [],
                input: [],
                cover: [],
            }
        )
    );
}

function isFill(length: Length): boolean {
    switch (length.type) {
        case Lengths.Fill:
            return true;

        case Lengths.Min:
            return isFill(length.length);

        case Lengths.Max:
            return isFill(length.length);

        default:
            return false;
    }
}

function _isShrink(length: Length): boolean {
    switch (length.type) {
        case Lengths.Content:
            return true;

        case Lengths.Min:
            return _isShrink(length.length);

        case Lengths.Max:
            return _isShrink(length.length);

        default:
            return false;
    }
}

function isConstrained(length: Length): boolean {
    switch (length.type) {
        case Lengths.Content:
            return false;

        case Lengths.Min:
            return isConstrained(length.length);

        default:
            return true;
    }
}

function isPixel(length: Length): boolean {
    switch (length.type) {
        case Lengths.Px:
            return true;

        case Lengths.Min:
            return isPixel(length.length);

        case Lengths.Max:
            return isPixel(length.length);

        default:
            return false;
    }
}

function isRem(length: Length): boolean {
    switch (length.type) {
        case Lengths.Rem:
            return true;

        case Lengths.Min:
            return isRem(length.length);

        case Lengths.Max:
            return isRem(length.length);

        default:
            return false;
    }
}

/**
 * isStacked means that the label is above or below
 */
function redistributeOver(
    isMultiline: boolean,
    stacked: boolean,
    attr: Attribute,
    els: {
        fullParent: Attribute[];
        parent: Attribute[];
        wrapper: Attribute[];
        input: Attribute[];
        cover: Attribute[];
    }
): {
    fullParent: Attribute[];
    parent: Attribute[];
    wrapper: Attribute[];
    input: Attribute[];
    cover: Attribute[];
} {
    switch (attr.type) {
        case Attributes.Nearby: {
            els.parent = [attr, ...els.parent];
            return els;
        }

        case Attributes.Width: {
            if (isFill(attr.width)) {
                els.parent = [attr, ...els.parent];
                els.fullParent = [attr, ...els.fullParent];
                els.input = [attr, ...els.input];
                return els;
            } else if (stacked) {
                els.fullParent = [attr, ...els.fullParent];
                return els;
            } else {
                els.parent = [attr, ...els.parent];
                return els;
            }
        }

        case Attributes.Height: {
            if (!stacked) {
                els.fullParent = [attr, ...els.fullParent];
                els.parent = [attr, ...els.parent];
                return els;
            } else if (isFill(attr.height)) {
                els.fullParent = [attr, ...els.fullParent];
                els.parent = [attr, ...els.parent];
                return els;
            } else if (isPixel(attr.height) || isRem(attr.height)) {
                els.parent = [attr, ...els.parent];
                return els;
            } else {
                els.parent = [attr, ...els.parent];
                return els;
            }
        }

        case Attributes.AlignX: {
            els.fullParent = [attr, ...els.fullParent];
            return els;
        }

        case Attributes.AlignY: {
            els.fullParent = [attr, ...els.fullParent];
            return els;
        }

        case Attributes.StyleClass:
            switch (attr.style.type) {
                case Styles.SpacingStyle: {
                    els.fullParent = [attr, ...els.fullParent];
                    els.parent = [attr, ...els.parent];
                    els.input = [attr, ...els.input];
                    els.wrapper = [attr, ...els.wrapper];
                    return els;
                }

                case Styles.PaddingStyle: {
                    if (isMultiline) {
                        els.parent = [attr, ...els.parent];
                        els.cover = [attr, ...els.cover];
                        return els;
                    } else {
                        const newHeight = htmlAttribute(
                                attribute(
                                    'style',
                                    `height: calc(1.0em + ${
                                        2 *
                                        Math.min(
                                            attr.style.top,
                                            attr.style.bottom
                                        )
                                    }px)"`
                                )
                            ),
                            newLineHeight = htmlAttribute(
                                attribute(
                                    'style',
                                    `line-height: calc(1.0em + ${
                                        2 *
                                        Math.min(
                                            attr.style.top,
                                            attr.style.bottom
                                        )
                                    }px)"`
                                )
                            ),
                            newTop =
                                attr.style.top -
                                Math.min(attr.style.top, attr.style.bottom),
                            newBottom =
                                attr.style.bottom -
                                Math.min(attr.style.top, attr.style.bottom),
                            reducedVerticalPadding = StyleClass(
                                Flag.padding,
                                PaddingStyle(
                                    Internal.paddingNameFloat(
                                        newTop,
                                        attr.style.right,
                                        newBottom,
                                        attr.style.left
                                    ),
                                    newTop,
                                    attr.style.right,
                                    newBottom,
                                    attr.style.left
                                )
                            );
                        els.parent = [reducedVerticalPadding, ...els.parent];
                        els.input = [newHeight, newLineHeight, ...els.input];
                        els.cover = [attr, ...els.cover];
                        return els;
                    }
                }

                case Styles.BorderWidth: {
                    els.parent = [attr, ...els.parent];
                    els.cover = [attr, ...els.cover];
                    return els;
                }

                case Styles.Transform: {
                    els.parent = [attr, ...els.parent];
                    els.cover = [attr, ...els.cover];
                    return els;
                }

                case Styles.FontSize: {
                    els.fullParent = [attr, ...els.fullParent];
                    return els;
                }

                case Styles.FontFamily: {
                    els.fullParent = [attr, ...els.fullParent];
                    return els;
                }

                default: {
                    els.parent = [attr, ...els.parent];
                    return els;
                }
            }

        case Attributes.NoAttribute: {
            return els;
        }

        case Attributes.Attr: {
            els.input = [attr, ...els.input];
            return els;
        }

        case Attributes.Event: {
            els.input = [attr, ...els.input];
            return els;
        }

        case Attributes.Describe: {
            els.input = [attr, ...els.input];
            return els;
        }

        case Attributes.Class: {
            els.parent = [attr, ...els.parent];
            return els;
        }

        case Attributes.TransformComponent: {
            els.input = [attr, ...els.input];
            return els;
        }
    }
}

/**
 * TODO:
 * @param attributes
 * @param textOptions
 * @returns
 */
function text(attributes: Attribute[], textOptions: Text): Element {
    return textHelper(
        {
            input: TextInputNode('text'),
            spellchecked: false,
            autofill: Nothing(),
        },
        attributes,
        textOptions
    );
}

/**
 * TODO:
 * @param attributes
 * @param textOptions
 * @returns
 */
function spellChecked(attributes: Attribute[], textOptions: Text): Element {
    return textHelper(
        {
            input: TextInputNode('text'),
            spellchecked: true,
            autofill: Nothing(),
        },
        attributes,
        textOptions
    );
}

/**
 * TODO:
 * @param attributes
 * @param textOptions
 * @returns
 */
function search(attributes: Attribute[], textOptions: Text): Element {
    return textHelper(
        {
            input: TextInputNode('search'),
            spellchecked: false,
            autofill: Nothing(),
        },
        attributes,
        textOptions
    );
}

/**
 *
 * @param attributes
 * @param pass
 * @returns
 */
function newPassword(
    attributes: Attribute[],
    pass: {
        onChange: {
            componentClass: string;
            handler: (text: string, ctx: ComponentEventContext) => EventHandler;
        };
        text: string;
        placeholder: Maybe<Placeholder>;
        label: Label;
        show: boolean;
    }
): Element {
    return textHelper(
        {
            input: TextInputNode(pass.show ? 'text' : 'password'),
            spellchecked: false,
            autofill: Just('new-password'),
        },
        attributes,
        {
            onChange: pass.onChange,
            text: pass.text,
            placeholder: pass.placeholder,
            label: pass.label,
        }
    );
}

/**
 *
 * @param attributes
 * @param pass
 * @returns
 */
function currentPassword(
    attributes: Attribute[],
    pass: {
        onChange: {
            componentClass: string;
            handler: (text: string, ctx: ComponentEventContext) => EventHandler;
        };
        text: string;
        placeholder: Maybe<Placeholder>;
        label: Label;
        show: boolean;
    }
): Element {
    return textHelper(
        {
            input: TextInputNode(pass.show ? 'text' : 'password'),
            spellchecked: false,
            autofill: Just('current-password'),
        },
        attributes,
        {
            onChange: pass.onChange,
            text: pass.text,
            placeholder: pass.placeholder,
            label: pass.label,
        }
    );
}

/**
 * TODO:
 * @param attributes
 * @param textOptions
 * @returns
 */
function username(attributes: Attribute[], textOptions: Text): Element {
    return textHelper(
        {
            input: TextInputNode('text'),
            spellchecked: false,
            autofill: Just('username'),
        },
        attributes,
        textOptions
    );
}

/**
 * TODO:
 * @param attributes
 * @param textOptions
 * @returns
 */
function email(attributes: Attribute[], textOptions: Text): Element {
    return textHelper(
        {
            input: TextInputNode('email'),
            spellchecked: false,
            autofill: Just('email'),
        },
        attributes,
        textOptions
    );
}

/**
 *
 * @param attributes
 * @param multi
 * @returns
 */
function multiline(
    attributes: Attribute[],
    multi: {
        onChange: {
            componentClass: string;
            handler: (text: string, ctx: ComponentEventContext) => EventHandler;
        };
        text: string;
        placeholder: Maybe<Placeholder>;
        label: Label;
        spellcheck: boolean;
    }
): Element {
    return textHelper(
        {
            input: TextArea(),
            spellchecked: multi.spellcheck,
            autofill: Nothing(),
        },
        attributes,
        {
            onChange: multi.onChange,
            text: multi.text,
            placeholder: multi.placeholder,
            label: multi.label,
        }
    );
}

/**
 *TODO:
 * @param label
 * @returns
 */
function isHiddenLabel(label: Label): boolean {
    switch (label.type) {
        case Labels.HiddenLabel:
            return true;

        default:
            return false;
    }
}

/**
 * TODO:
 * @param attributes
 * @param label
 * @param input
 * @returns
 */
function applyLabel(
    attributes: Attribute[],
    label: Label,
    input: Element
): Element {
    switch (label.type) {
        case Labels.HiddenLabel:
            // NOTE: This means that the label is applied outside of this function!
            // It would be nice to unify this logic, but it's a little tricky
            return Internal.element(
                asColumn,
                NodeName('label'),
                attributes,
                Unkeyed([input])
            );

        case Labels.Label: {
            const labelElement = Internal.element(
                asEl,
                Internal.div,
                label.attributes,
                Unkeyed([label.element])
            );
            switch (label.location) {
                case LabelLocation.Above:
                    return Internal.element(
                        asColumn,
                        NodeName('label'),
                        [Internal.htmlClass(classes.inputLabel), ...attributes],
                        Unkeyed([labelElement, input])
                    );

                case LabelLocation.Below:
                    return Internal.element(
                        asColumn,
                        NodeName('label'),
                        [Internal.htmlClass(classes.inputLabel), ...attributes],
                        Unkeyed([input, labelElement])
                    );

                case LabelLocation.OnRight:
                    return Internal.element(
                        asColumn,
                        NodeName('label'),
                        [Internal.htmlClass(classes.inputLabel), ...attributes],
                        Unkeyed([input, labelElement])
                    );

                case LabelLocation.OnLeft:
                    return Internal.element(
                        asColumn,
                        NodeName('label'),
                        [Internal.htmlClass(classes.inputLabel), ...attributes],
                        Unkeyed([labelElement, input])
                    );
            }
        }
    }
}

/**
 * Add a choice to your radio element. This will be rendered with the default radio icon.
 */
function option(value: any, text: Element): Option {
    return Option(value, (status: OptionState) =>
        defaultRadioOption(text, status)
    );
}

/**
 * Customize exactly what your radio option should look like in different states.
 */
function optionWith(value: any, view: (x: OptionState) => Element): Option {
    return Option(value, view);
}

/**
 * TODO:
 * @param attributes
 * @param input
 * @returns
 */
function radio(
    attributes: Attribute[],
    input: {
        onChange: {
            componentClass: string;
            handler: (option: any, ctx: ComponentEventContext) => EventHandler;
        };
        options: Option[];
        selected: Maybe<any>;
        label: Label;
    }
): Element {
    return radioHelper(Orientation.Column, attributes, input);
}

/**TODO:
 * Same as radio, but displayed as a row
 * @param attributes
 * @param input
 * @returns
 */
function radioRow(
    attributes: Attribute[],
    input: {
        onChange: {
            componentClass: string;
            handler: (option: any, ctx: ComponentEventContext) => EventHandler;
        };
        options: Option[];
        selected: Maybe<any>;
        label: Label;
    }
): Element {
    return radioHelper(Orientation.Row, attributes, input);
}

function defaultRadioOption(
    optionLabel: Element,
    status: OptionState
): Element {
    return row_(
        [spacing(10), alignLeft, width(shrink)],
        [
            el(
                [
                    status === OptionState.Selected
                        ? Internal.htmlClass('unfocusable')
                        : NoAttribute(),
                    width(px(14)),
                    height(px(14)),
                    Background.color(white),
                    Border.rounded(7),
                    Border.width(
                        (() => {
                            switch (status) {
                                case OptionState.Idle:
                                    return 1;

                                case OptionState.Focused:
                                    return 1;

                                case OptionState.Selected:
                                    return 5;
                            }
                        })()
                    ),
                    Border.color(
                        (() => {
                            switch (status) {
                                case OptionState.Idle:
                                    return hsl(0, 0, 0.82);

                                case OptionState.Focused:
                                    return hsl(0, 0, 0.82);

                                case OptionState.Selected:
                                    return hsl(211, 0.97, 0.61);
                            }
                        })()
                    ),
                ],
                none
            ),
            el([width(fill), Internal.htmlClass('unfocusable')], optionLabel),
        ]
    );
}

function radioHelper(
    orientation: Orientation,
    attributes: Attribute[],
    input: {
        onChange: {
            componentClass: string;
            handler: (option: any, ctx: ComponentEventContext) => EventHandler;
        };
        options: Option[];
        selected: Maybe<any>;
        label: Label;
    }
): Element {
    const optionArea: Element = (() => {
            switch (orientation) {
                case Orientation.Row:
                    return row(
                        [hiddenLabelAttribute(input.label), ...attributes],
                        input.options.map(renderOption)
                    );

                case Orientation.Column:
                    return column(
                        [hiddenLabelAttribute(input.label), ...attributes],
                        input.options.map(renderOption)
                    );
            }
        })(),
        prevNext: Maybe<[any, any]> = (() => {
            switch (input.options) {
                case []:
                    return Nothing();

                default: {
                    const val: any = input.options[0].value;
                    return (([found, b, a]) => {
                        switch (found) {
                            case Found.NotFound:
                                return Just([b, val]);

                            case Found.BeforeFound:
                                return Just([b, val]);

                            case Found.AfterFound:
                                return Just([b, a]);
                        }
                    })(
                        input.options.reduce(
                            (
                                acc: [Found, any, any],
                                option: Option
                            ): [Found, any, any] => track(option, acc),
                            [Found.NotFound, val, val]
                        )
                    );
                }
            }
        })(),
        events: Attribute[] = Internal.get(attributes, (attr) => {
            switch (attr.type) {
                case Attributes.Width:
                    if (attr.width === fill) return true;
                    return false;

                case Attributes.Height:
                    if (attr.height === fill) return true;
                    return false;

                case Attributes.Attr:
                    return true;

                default:
                    return false;
            }
        });

    function renderOption({ value, view }: Option) {
        const status =
            Just(value) === input.selected
                ? OptionState.Selected
                : OptionState.Idle;
        return el(
            [
                pointer,
                (() => {
                    switch (orientation) {
                        case Orientation.Row:
                            return width(shrink);

                        case Orientation.Column:
                            return width(fill);
                    }
                })(),
                (() => {
                    switch (status) {
                        case OptionState.Selected:
                            return ariaChecked(true);

                        default:
                            return ariaChecked(false);
                    }
                })(),
                role('radio'),
                Events.onClick(input.onChange.componentClass, (ctx) =>
                    input.onChange.handler(value, ctx)
                ),
            ],
            view(status)
        );
    }

    function track(
        opt: Option,
        [found, prev, next]: [Found, any, any]
    ): [Found, any, any] {
        switch (opt) {
            default:
                switch (found) {
                    case Found.NotFound:
                        if (Just(opt.value) === input.selected) {
                            return [Found.BeforeFound, prev, next];
                        } else {
                            return [found, opt.value, next];
                        }

                    case Found.BeforeFound:
                        return [Found.AfterFound, prev, opt.value];

                    case Found.AfterFound:
                        return [found, prev, next];
                }
        }
    }

    return applyLabel(
        [
            alignLeft,
            tabindex(0),
            Internal.htmlClass('focus'),
            Region.announce,
            role('radiogroup'),
            Events.onKeyLookUp(input.onChange.componentClass, (ctx) => {
                const { key } = <KeyboardEvent>ctx.e;
                const [prev, next] = withDefault(['', ''], prevNext);
                switch (key) {
                    case Events.leftArrow:
                    case Events.leftArrow_:
                    case Events.upArrow:
                    case Events.upArrow_:
                        input.onChange.handler(prev, ctx);
                        break;
                    case Events.rightArrow:
                    case Events.rightArrow_:
                    case Events.downArrow:
                    case Events.downArrow_:
                        input.onChange.handler(next, ctx);
                        break;
                    case Events.space:
                        switch (input.selected) {
                            case Nothing():
                                input.onChange.handler(prev, ctx);
                                break;
                            default:
                                break;
                        }
                        break;
                    default:
                        break;
                }
            }),
            ...events,
        ],
        input.label,
        optionArea
    );
}

function column(attributes: Attribute[], children: Element[]): Element {
    return Internal.element(
        asColumn,
        Internal.div,
        [height(shrink), width(fill), ...attributes],
        Unkeyed(children)
    );
}

function row(attributes: Attribute[], children: Element[]): Element {
    return Internal.element(
        asRow,
        Internal.div,
        [width(fill), ...attributes],
        Unkeyed(children)
    );
}

// Style Defaults

/**TODO:
 * The blue default checked box icon.

You'll likely want to make your own checkbox at some point that fits your design.
 * @param checked 
 * @returns 
 */
function defaultCheckbox(checked: boolean): Element {
    return el(
        [
            Internal.htmlClass('focusable'),
            width(px(14)),
            height(px(14)),
            centerY,
            Font.color(white),
            Font.size(9),
            Font.center,
            Border.width(checked ? 0 : 1),
            Border.rounded(3),
            Border.color(checked ? hsl(211, 0.97, 0.61) : hsl(0, 0, 0.83)),
            Border.shadow(
                Shadow(
                    checked ? hsla(0, 0, 0.93, 0) : hsl(0, 0, 0.93),
                    [0, 0],
                    1,
                    1
                )
            ),
            Background.color(checked ? hsl(211, 0.97, 0.61) : white),
            inFront(
                el(
                    [
                        height(px(6)),
                        width(px(9)),
                        rotate(-45),
                        centerX,
                        centerY,
                        moveUp(1),
                        transparent(!checked),
                        Border.color(white),
                        Border.widthEach({
                            top: 0,
                            left: 2,
                            bottom: 2,
                            right: 0,
                        }),
                    ],
                    none
                )
            ),
        ],
        none
    );
}

export {
    button,
    checkbox,
    defaultCheckbox,
    text,
    multiline,
    Placeholder,
    placeholder,
    username,
    newPassword,
    currentPassword,
    email,
    search,
    spellChecked,
    slider,
    Thumb,
    thumb,
    defaultThumb,
    radio,
    radioRow,
    Option,
    option,
    optionWith,
    OptionState,
    Label,
    labelAbove,
    labelBelow,
    labelLeft,
    labelRight,
    labelHidden,
};

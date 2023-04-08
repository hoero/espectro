// deno-lint-ignore-file
import { elmish, preact } from '../../deps.ts';
import { hsl } from '../color.ts';
import {
    alignLeft,
    alpha,
    behindContent,
    centerX,
    centerY,
    clip,
    fill,
    fillPortion,
    height,
    inFront,
    paddingEach,
    paddingXY,
    pointer,
    px,
    scrollbarY,
    shrink,
    spacing,
    spacingXY,
    width,
} from '../element.ts';
import {
    Attribute,
    Describe,
    NoAttribute,
    Label as AriaLabel,
    Maybe,
    Attributes,
    Styles,
    asColumn,
    NodeName,
    Length,
    Property,
    StyleClass,
    Style_,
    Lengths,
    asParagraph,
    Class,
    asRow,
    MinContent,
} from '../internal/data.ts';
import { classes } from '../internal/style.ts';
import * as Internal from '../internal/model.ts';
import * as Flag from '../internal/flag.ts';
import * as Events from './events.ts';
import * as Region from './region.ts';
import * as Border from './border.ts';
import * as Background from './background.ts';
import {
    ariaChecked,
    autofill,
    class_,
    disabled,
    max as max_,
    min as min_,
    orient,
    role,
    spellcheck,
    step as step_,
    style,
    tabindex,
    type,
    value as value_,
} from './attributes.ts';
import { isEmpty } from '../utils/utils.ts';
import {
    Found,
    HiddenLabel,
    LabelLocation,
    Labels,
    OptionState,
    Orientation,
    TextArea,
    TextInput,
    TextInputNode,
    TextKinds,
    Thumb,
    button,
    buttonAttrs,
    calcMoveToCompensateForPadding,
    checkboxAttrs,
    defaultRadioAttrs,
    defaultRadioInFrontAttrs,
    defaultTextBoxStyle,
    focusDefault,
    getHeight,
    hasFocusStyle,
    isConstrained,
    negateBox,
    placeholderAttrs,
    radioAttrs,
    redistribute,
    renderBox,
    white,
} from './input.ts';
import * as Element from '../element.ts';
import * as ElementJsx from '../element.tsx';

interface Placeholder_ {
    attributes: Attribute[];
    children: preact.ComponentChild;
}

function Placeholder(
    attributes: Attribute[],
    children: preact.ComponentChild
): Placeholder_ {
    return { attributes, children };
}

type Placeholder = Placeholder_;

interface Label_ {
    type: Labels.Label;
    location: LabelLocation;
    attributes: Attribute[];
    children: preact.ComponentChild;
}

function Label(
    location: LabelLocation,
    attributes: Attribute[],
    children: preact.ComponentChild
): Label_ {
    return { type: Labels.Label, location, attributes, children };
}

type Label = Label_ | HiddenLabel;

interface Text {
    onChange: (
        text: string,
        event: preact.JSX.TargetedEvent<EventTarget>
    ) => preact.JSX.GenericEventHandler<EventTarget>;
    text: string;
    placeholder: Maybe<Placeholder>;
    label: Label;
}

interface Option_ {
    value: any;
    view: (x: OptionState) => preact.ComponentChild;
}

function Option_(
    value: any,
    view: (x: OptionState) => preact.ComponentChild
): Option {
    return { value, view };
}

type Option = Option_;

const { Just, Nothing, map, withDefault, MaybeType } = elmish.Maybe,
    { LayoutWith, El } = ElementJsx;

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

function labelRight(
    attributes: Attribute[],
    children: preact.ComponentChild
): Label {
    return Label(
        LabelLocation.OnRight,
        attributes,
        ElementJsx.Text({ children })
    );
}

function labelLeft(
    attributes: Attribute[],
    children: preact.ComponentChild
): Label {
    return Label(
        LabelLocation.OnLeft,
        attributes,
        ElementJsx.Text({ children })
    );
}

function labelAbove(
    attributes: Attribute[],
    children: preact.ComponentChild
): Label {
    return Label(
        LabelLocation.Above,
        attributes,
        ElementJsx.Text({ children })
    );
}

function labelBelow(
    attributes: Attribute[],
    children: preact.ComponentChild
): Label {
    return Label(
        LabelLocation.Below,
        attributes,
        ElementJsx.Text({ children })
    );
}

/**
 * Sometimes you may need to have a label which is not visible, but is still accessible to screen readers.
 *
 * Seriously consider a visible label before using this.
 *
 * The situations where a hidden label makes sense:
 *
 * - A searchbar with a `search` button right next to it.
 * - A `table` of inputs where the header gives the label.
 * Basically, a hidden label works when there are other contextual clues that sighted people can pick up on.
 */
function labelHidden(label: string): Label {
    return HiddenLabel(label);
}

function hiddenLabelAttribute(label: Label): Attribute {
    switch (label.type) {
        case Labels.Label:
            return NoAttribute();

        case Labels.HiddenLabel:
            return Describe(AriaLabel(label.label));
    }
}

/**
 * A standard button.
 *
 * The `onPress` handler will be fired either `onClick` or when the element is focused and the `Enter` key has been pressed.
 *
 * ```jsx
 * <Button
 *  attributes={[
 *      Background.color(blue),
 *      Element.focused([ Background.color(purple) ])
 *  ]}
 *  onPress={clickHandler}
 * >
 *  My Button
 * </Button>
 * ```
 *
 * **Note** If you have an icon button but want it to be accessible, consider adding a [`Region.description`](Element-Region#description), which will describe the button to screen readers.
 */
function Button({
    attributes,
    onPress,
    children,
}: {
    attributes: Attribute[];
    onPress: Maybe<preact.JSX.EventHandler<preact.JSX.TargetedEvent>>;
    children: preact.ComponentChild;
}) {
    return (
        <LayoutWith
            options={[Element.noStaticStyleSheet]}
            attributes={[...buttonAttrs, focusDefault(attributes)].concat(
                (() => {
                    switch (onPress.type) {
                        case MaybeType.Nothing:
                            return [disabled(true), ...attributes];

                        case MaybeType.Just: {
                            const handler = onPress.value;
                            return [
                                Events.onClick(handler),
                                Events.onKeyLookUp((event) => {
                                    const { key } = event;
                                    switch (key) {
                                        case Events.enter:
                                        case Events.space:
                                            handler(event);
                                            break;
                                        default:
                                            break;
                                    }
                                }),
                                ...attributes,
                            ];
                        }
                    }
                })()
            )}
        >
            {ElementJsx.Text({ children })}
        </LayoutWith>
    );
}

/**
 * - **onChange** - The `event` to send.
 * - **icon** - The checkbox icon to show. This can be whatever you'd like, but `Input.defaultCheckbox` is included to get you started.
 * - **checked** - The current checked state.
 * - **label** - The [`Label`](#Label) for this checkbox
 */
function Checkbox({
    attributes,
    label,
    icon,
    checked,
    onChange,
}: {
    attributes: Attribute[];
    onChange: (
        checked: boolean,
        event: preact.JSX.TargetedEvent
    ) => preact.JSX.EventHandler<preact.JSX.TargetedEvent>;
    icon: (checked: boolean) => preact.ComponentChild;
    checked: boolean;
    label: Label;
}) {
    return (
        <ApplyLabel
            attributes={[
                ...checkboxAttrs,
                ariaChecked(checked ? true : false),
                hiddenLabelAttribute(label),
                isHiddenLabel(label) ? NoAttribute() : spacing(6),
                Events.onClick((event) => onChange(!checked, event)),
                Region.announce,
                Events.onKeyLookUp((event) => {
                    const { key } = event;
                    switch (key) {
                        case Events.enter:
                        case Events.space:
                            onChange(!checked, event);
                            break;
                        default:
                            break;
                    }
                }),
                ...attributes,
            ]}
            label={label}
        >
            <LayoutWith
                options={[Element.noStaticStyleSheet]}
                attributes={[centerY, height(fill), width(shrink)]}
            >
                {icon(checked)}
            </LayoutWith>
        </ApplyLabel>
    );
}

/**
 * A slider input, good for capturing float values.
 *
 * ```jsx
 * <Slider
 *  attributes={
 *      [ Element.height(Element.px(30))
 *      // Here is where we're creating/styling the "track"
 *      , Element.behindContent(
 *          jsx(<El
 *              attributes={[
 *                  Element.width(Element.fill),
 *                  Element.height(Element.px(2)),
 *                  Element.centerY,
 *                  Background.color(grey),
 *                  Border.rounded(2)
 *              ]}
 *              >{}</El>
 *          )
 *      ]}
 *  label={InputJsx.labelAbove([], "My Slider Value")}
 *  min={0}
 *  max={75}
 *  step={Nothing()}
 *  value={model.sliderValue}
 *  thumb={Input.defaultThumb}
 *  onChange={adjustValue}
 * />
 * ```
 *
 * `Element.behindContent` is used to render the track of the slider. Without it, no track would be rendered. The `thumb` is the icon that you can move around.
 *
 * The slider can be vertical or horizontal depending on the width/height of the slider.
 *
 * - `height(fill)` and `width(px(someWidth))` will cause the slider to be vertical.
 * - `height(px(someHeight))` and `width(px(someWidth))` where `someHeight` > `someWidth` will also do it.
 * - otherwise, the slider will be horizontal.
 *
 * **Note** If you want a slider for an `Int` value:
 *
 * - set `step` to be `1`, or some other whole value
 * - `value = model.myNumber`
 * - And finally, round the value before making an event.
 */
function Slider({
    attributes,
    label,
    min,
    max,
    value,
    thumb,
    step,
    onChange,
}: {
    attributes: Attribute[];
    onChange: (
        value: number,
        event: preact.JSX.TargetedEvent<EventTarget>
    ) => preact.JSX.GenericEventHandler<EventTarget>;
    label: Label;
    min: number;
    max: number;
    value: number;
    thumb: Thumb;
    step: Maybe<number>;
}) {
    const thumbAttributes: Attribute[] = thumb.attributes,
        width_: Maybe<Length> = Internal.getWidth(thumbAttributes),
        height_: Maybe<Length> = Internal.getHeight(thumbAttributes),
        trackWidth: Maybe<Length> = Internal.getWidth(attributes),
        trackHeight: Maybe<Length> = Internal.getHeight(attributes),
        vertical: boolean = (() => {
            const trackWidth_: Length = withDefault(MinContent(), trackWidth);
            const trackHeight_: Length = withDefault(MinContent(), trackHeight);
            const w: number = withDefault(0, Internal.getLength(trackWidth));
            const h: number = withDefault(0, Internal.getLength(trackHeight));
            if (
                trackWidth.type === MaybeType.Nothing &&
                trackHeight.type === MaybeType.Nothing
            )
                return false;
            if (
                trackWidth_.type === Lengths.Px &&
                trackHeight_.type === Lengths.Px
            )
                return h > w;
            if (
                trackWidth_.type === Lengths.Px &&
                trackHeight_.type === Lengths.Fill
            )
                return true;
            return false;
        })(),
        [spacingX, spacingY]: [number, number] = Internal.getSpacing(
            attributes,
            [5, 5]
        ),
        factor = (value - min) / (max - min),
        thumbWidthString: string = (() => {
            const w: number = withDefault(0, Internal.getLength(width_));
            switch (width_.type) {
                case MaybeType.Nothing:
                    return '20px';

                case MaybeType.Just:
                    switch (width_.value.type) {
                        case Lengths.Px:
                            return w + 'px';

                        case Lengths.Rem:
                            return w + 'rem';

                        default:
                            return '100%';
                    }
            }
        })(),
        thumbHeightString: string = (() => {
            const h: number = withDefault(0, Internal.getLength(height_));
            switch (height_.type) {
                case MaybeType.Nothing:
                    return '20px';

                case MaybeType.Just:
                    switch (height_.value.type) {
                        case Lengths.Px:
                            return h + 'px';

                        case Lengths.Rem:
                            return h + 'rem';

                        default:
                            return '100%';
                    }
            }
        })(),
        /**
         * Needed attributes
         *
         * Thumb Attributes
         *      - Width/Height of thumb so that the input can shadow it.
         *
         *      Attributes
         *
         *      OnParent ->
         *          Spacing
         *
         *      On track ->
         *          Everything else
         *
         * The `<input>`
         */
        className = `thmb-${thumbWidthString}-${thumbHeightString}`,
        thumbShadowStyle = [
            Property('width', thumbWidthString),
            Property('height', thumbHeightString),
        ];
    return (
        <ApplyLabel
            attributes={[
                isHiddenLabel(label)
                    ? NoAttribute()
                    : spacingXY(spacingX, spacingY),
                Region.announce,
                tabindex(0),
                width(
                    (() => {
                        switch (trackWidth.type) {
                            case MaybeType.Nothing:
                                return fill;

                            case MaybeType.Just:
                                switch (trackWidth.value.type) {
                                    case Lengths.Px:
                                    case Lengths.Rem:
                                        return shrink;

                                    default:
                                        return trackWidth.value;
                                }
                        }
                    })()
                ),
                height(
                    (() => {
                        switch (trackHeight.type) {
                            case MaybeType.Nothing:
                                return shrink;

                            case MaybeType.Just:
                                switch (trackHeight.value.type) {
                                    case Lengths.Px:
                                    case Lengths.Rem:
                                        return shrink;

                                    default:
                                        return trackHeight.value;
                                }
                        }
                    })()
                ),
            ]}
            label={label}
        >
            <ElementJsx.Row
                attributes={[
                    width(withDefault(fill, trackWidth)),
                    height(withDefault(px(20), trackHeight)),
                ]}
            >
                <LayoutWith
                    options={[Element.noStaticStyleSheet]}
                    attributes={[
                        hiddenLabelAttribute(label),
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
                        Events.onInput((event) => {
                            const { data } = event as InputEvent;
                            const data_ = typeof data === 'string' ? data : '0';
                            return onChange(Number.parseFloat(data_), event);
                        }),
                        type('range'),
                        step_(
                            step.type === MaybeType.Nothing
                                ? // Note: If we set `any` here,
                                  // Firefox makes a single press of the arrows keys equal to 1
                                  // We could set the step manually to the effective range / 100
                                  // ((max - min) / 100).toString()
                                  // Which matches Chrome's default behavior
                                  // HOWEVER, that means manually moving a slider with the mouse will snap to that interval.
                                  'any'
                                : step.value
                        ),
                        min_(min),
                        max_(max),
                        value_(value),
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
                    ]}
                    node={NodeName('input')}
                >
                    {}
                </LayoutWith>
                <El
                    attributes={[
                        width(withDefault(fill, trackWidth)),
                        height(withDefault(px(20), trackHeight)),
                        ...attributes,
                        // This is after `attributes` because the thumb should be in front of everything.
                        behindContent(
                            vertical
                                ? Element.jsx(
                                      <ViewVerticalThumb
                                          factor={factor}
                                          attributes={[
                                              Internal.htmlClass(
                                                  'focusable-thumb'
                                              ),
                                              ...thumbAttributes,
                                          ]}
                                          trackWidth={trackWidth}
                                      />
                                  )
                                : Element.jsx(
                                      <ViewHorizontalThumb
                                          factor={factor}
                                          attributes={[
                                              Internal.htmlClass(
                                                  'focusable-thumb'
                                              ),
                                              ...thumbAttributes,
                                          ]}
                                          trackHeight={trackHeight}
                                      />
                                  )
                        ),
                    ]}
                >
                    {}
                </El>
            </ElementJsx.Row>
        </ApplyLabel>
    );
}

function ViewHorizontalThumb({
    factor,
    attributes,
    trackHeight,
}: {
    factor: number;
    attributes: Attribute[];
    trackHeight: Maybe<Length>;
}) {
    return (
        <ElementJsx.Row
            attributes={[
                width(fill),
                height(withDefault(fill, trackHeight)),
                centerY,
            ]}
        >
            <El attributes={[width(fillPortion(Math.round(factor * 10000)))]}>
                {}
            </El>
            <El attributes={[centerY, ...attributes]}>{}</El>
            <El
                attributes={[
                    width(
                        fillPortion(Math.round(Math.abs(1 - factor) * 10000))
                    ),
                ]}
            >
                {}
            </El>
        </ElementJsx.Row>
    );
}

function ViewVerticalThumb({
    factor,
    attributes,
    trackWidth,
}: {
    factor: number;
    attributes: Attribute[];
    trackWidth: Maybe<Length>;
}) {
    return (
        <ElementJsx.Row
            attributes={[
                height(fill),
                width(withDefault(fill, trackWidth)),
                centerX,
            ]}
        >
            <El
                attributes={[
                    height(
                        fillPortion(Math.round(Math.abs(1 - factor) * 10000))
                    ),
                ]}
            >
                {}
            </El>
            <El attributes={[centerX, ...attributes]}>{}</El>
            <El attributes={[height(fillPortion(Math.round(factor * 10000)))]}>
                {}
            </El>
        </ElementJsx.Row>
    );
}

function TextHelper({
    textInput,
    attributes,
    textOptions,
}: {
    textInput: TextInput;
    attributes: Attribute[];
    textOptions: Text;
}) {
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
        inputElement = (
            <LayoutWith
                options={[Element.noStaticStyleSheet]}
                attributes={(() => {
                    switch (textInput.input.type) {
                        case TextKinds.TextInputNode:
                            // Note: Due to a weird edgecase in...Edge...
                            // `type` needs to come _before_ `value`
                            // More reading: https://github.com/mdgriffith/elm-ui/pull/94/commits/4f493a27001ccc3cf1f2baa82e092c35d3811876
                            return [
                                type(textInput.input.data),
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
                    value_(textOptions.text),
                    Events.onInput((event) => {
                        const { data } = event as InputEvent;
                        const data_ = typeof data === 'string' ? data : '';
                        return textOptions.onChange(data_, event);
                    }),
                    hiddenLabelAttribute(textOptions.label),
                    spellcheck(textInput.spellchecked),
                    withDefault(
                        NoAttribute(),
                        map(autofill, textInput.autofill)
                    ),
                    ...redistributed.input,
                ])}
                node={(() => {
                    switch (textInput.input.type) {
                        case TextKinds.TextInputNode:
                            return NodeName('input');

                        default:
                            return NodeName('textarea');
                    }
                })()}
            >
                {}
            </LayoutWith>
        ),
        wrappedInput = (() => {
            switch (textInput.input.type) {
                case TextKinds.TextArea:
                    // textarea with height-content means that
                    // the input element is rendered `inFront` with a transparent background
                    // Then the input text is rendered as the space filling element.
                    return (
                        <LayoutWith
                            options={[Element.noStaticStyleSheet]}
                            attributes={(heightConstrained
                                ? [scrollbarY]
                                : []
                            ).concat([
                                width(fill),
                                withDefaults.some(hasFocusStyle)
                                    ? NoAttribute()
                                    : Internal.htmlClass(classes.focusedWithin),
                                Internal.htmlClass(
                                    classes.inputMultilineWrapper
                                ),
                                ...redistributed.parent,
                            ])}
                        >
                            <LayoutWith
                                options={[Element.noStaticStyleSheet]}
                                attributes={[
                                    width(fill),
                                    height(fill),
                                    inFront(Element.jsx(inputElement)),
                                    Internal.htmlClass(
                                        classes.inputMultilineParent
                                    ),
                                    ...redistributed.wrapper,
                                ]}
                                context={asParagraph}
                            >
                                {(() => {
                                    if (textOptions.text === '') {
                                        switch (textOptions.placeholder.type) {
                                            case MaybeType.Nothing:
                                                // Without this, firefox will make the text area lose focus
                                                // if the input is empty and you mash the keyboard
                                                return (
                                                    <ElementJsx.Text>
                                                        {'\u{00A0}'}
                                                    </ElementJsx.Text>
                                                );

                                            case MaybeType.Just:
                                                return (
                                                    <RenderPlaceholder
                                                        placeholder={
                                                            textOptions
                                                                .placeholder
                                                                .value
                                                        }
                                                        forPlaceholder={[]}
                                                        on={
                                                            textOptions.text ===
                                                            ''
                                                        }
                                                    />
                                                );
                                        }
                                    } else {
                                        return (
                                            <LayoutWith
                                                options={[
                                                    Element.noStaticStyleSheet,
                                                ]}
                                                attributes={[
                                                    Internal.htmlClass(
                                                        classes.inputMultilineFiller
                                                    ),
                                                ]}
                                                node={NodeName('span')}
                                            >
                                                {textOptions.text + '\u{00A0}'}
                                            </LayoutWith>
                                        );
                                    }
                                })()}
                            </LayoutWith>
                        </LayoutWith>
                    );

                case TextKinds.TextInputNode: {
                    const attr = (() => {
                        switch (textOptions.placeholder.type) {
                            case MaybeType.Nothing:
                                return [];

                            case MaybeType.Just:
                                return [
                                    behindContent(
                                        Element.jsx(
                                            <RenderPlaceholder
                                                placeholder={
                                                    textOptions.placeholder
                                                        .value
                                                }
                                                forPlaceholder={
                                                    redistributed.cover
                                                }
                                                on={textOptions.text === ''}
                                            />
                                        )
                                    ),
                                ];
                        }
                    })();
                    return (
                        <LayoutWith
                            options={[Element.noStaticStyleSheet]}
                            attributes={[
                                width(fill),
                                withDefaults.some(hasFocusStyle)
                                    ? NoAttribute()
                                    : Internal.htmlClass(classes.focusedWithin),
                                ...redistributed.parent,
                                ...attr,
                            ]}
                        >
                            {inputElement}
                        </LayoutWith>
                    );
                }
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

    return (
        <ApplyLabel
            attributes={[
                Class(Flag.cursor, classes.cursorText),
                isHiddenLabel(textOptions.label) ? NoAttribute() : spacing(5),
                Region.announce,
                ...redistributed.fullParent,
            ]}
            label={textOptions.label}
        >
            {wrappedInput}
        </ApplyLabel>
    );
}

function RenderPlaceholder({
    placeholder,
    forPlaceholder,
    on,
}: {
    placeholder: Placeholder;
    forPlaceholder: Attribute[];
    on: boolean;
}) {
    return (
        <El
            attributes={[
                ...forPlaceholder,
                ...placeholderAttrs,
                alpha(on ? 1 : 0),
                ...placeholder.attributes,
            ]}
        >
            {placeholder.children}
        </El>
    );
}

function Text({
    attributes,
    textOptions,
}: {
    attributes: Attribute[];
    textOptions: Text;
}) {
    return (
        <TextHelper
            textInput={{
                input: TextInputNode('text'),
                spellchecked: false,
                autofill: Nothing(),
            }}
            attributes={attributes}
            textOptions={textOptions}
        />
    );
}

function SpellChecked({
    attributes,
    textOptions,
}: {
    attributes: Attribute[];
    textOptions: Text;
}) {
    return (
        <TextHelper
            textInput={{
                input: TextInputNode('text'),
                spellchecked: true,
                autofill: Nothing(),
            }}
            attributes={attributes}
            textOptions={textOptions}
        />
    );
}

function Search({
    attributes,
    textOptions,
}: {
    attributes: Attribute[];
    textOptions: Text;
}) {
    return (
        <TextHelper
            textInput={{
                input: TextInputNode('search'),
                spellchecked: false,
                autofill: Nothing(),
            }}
            attributes={attributes}
            textOptions={textOptions}
        />
    );
}

function NewPassword({
    attributes,
    text,
    placeholder,
    label,
    show,
    onChange,
}: {
    attributes: Attribute[];
    onChange: (
        text: string,
        event: preact.JSX.TargetedEvent<EventTarget>
    ) => preact.JSX.GenericEventHandler<EventTarget>;
    text: string;
    placeholder: Maybe<Placeholder>;
    label: Label;
    show: boolean;
}) {
    return (
        <TextHelper
            textInput={{
                input: TextInputNode(show ? 'text' : 'password'),
                spellchecked: false,
                autofill: Just('new-password'),
            }}
            attributes={attributes}
            textOptions={{
                onChange,
                text,
                placeholder,
                label,
            }}
        />
    );
}

function currentPassword({
    attributes,
    text,
    placeholder,
    label,
    show,
    onChange,
}: {
    attributes: Attribute[];
    onChange: (
        text: string,
        event: preact.JSX.TargetedEvent<EventTarget>
    ) => preact.JSX.GenericEventHandler<EventTarget>;
    text: string;
    placeholder: Maybe<Placeholder>;
    label: Label;
    show: boolean;
}) {
    return (
        <TextHelper
            textInput={{
                input: TextInputNode(show ? 'text' : 'password'),
                spellchecked: false,
                autofill: Just('current-password'),
            }}
            attributes={attributes}
            textOptions={{
                onChange,
                text,
                placeholder,
                label,
            }}
        />
    );
}

function Username({
    attributes,
    textOptions,
}: {
    attributes: Attribute[];
    textOptions: Text;
}) {
    return (
        <TextHelper
            textInput={{
                input: TextInputNode('text'),
                spellchecked: false,
                autofill: Just('username'),
            }}
            attributes={attributes}
            textOptions={textOptions}
        />
    );
}

function Email({
    attributes,
    textOptions,
}: {
    attributes: Attribute[];
    textOptions: Text;
}) {
    return (
        <TextHelper
            textInput={{
                input: TextInputNode('email'),
                spellchecked: false,
                autofill: Just('email'),
            }}
            attributes={attributes}
            textOptions={textOptions}
        />
    );
}

function Multiline({
    attributes,
    text,
    placeholder,
    label,
    spellcheck,
    onChange,
}: {
    attributes: Attribute[];
    onChange: (
        text: string,
        event: preact.JSX.TargetedEvent<EventTarget>
    ) => preact.JSX.GenericEventHandler<EventTarget>;
    text: string;
    placeholder: Maybe<Placeholder>;
    label: Label;
    spellcheck: boolean;
}) {
    return (
        <TextHelper
            textInput={{
                input: TextArea(),
                spellchecked: spellcheck,
                autofill: Nothing(),
            }}
            attributes={attributes}
            textOptions={{
                onChange,
                text,
                placeholder,
                label,
            }}
        />
    );
}

function isHiddenLabel(label: Label): boolean {
    switch (label.type) {
        case Labels.HiddenLabel:
            return true;

        default:
            return false;
    }
}

function ApplyLabel({
    attributes,
    label,
    children,
}: {
    attributes: Attribute[];
    label: Label;
    children: preact.ComponentChild;
}) {
    switch (label.type) {
        case Labels.HiddenLabel:
            // NOTE: This means that the label is applied outside of this function!
            // It would be nice to unify this logic, but it's a little tricky
            return (
                <LayoutWith
                    options={[Element.noStaticStyleSheet]}
                    attributes={attributes}
                    context={asColumn}
                    node={NodeName('label')}
                >
                    {children}
                </LayoutWith>
            );

        case Labels.Label: {
            const labelElement = (
                <LayoutWith
                    options={[Element.noStaticStyleSheet]}
                    attributes={label.attributes}
                >
                    {label.children}
                </LayoutWith>
            );
            switch (label.location) {
                case LabelLocation.Above:
                    return (
                        <LayoutWith
                            options={[Element.noStaticStyleSheet]}
                            attributes={[
                                Internal.htmlClass(classes.inputLabel),
                                ...attributes,
                            ]}
                            context={asColumn}
                            node={NodeName('label')}
                        >
                            {labelElement}
                            {children}
                        </LayoutWith>
                    );

                case LabelLocation.Below:
                    return (
                        <LayoutWith
                            options={[Element.noStaticStyleSheet]}
                            attributes={[
                                Internal.htmlClass(classes.inputLabel),
                                ...attributes,
                            ]}
                            context={asColumn}
                            node={NodeName('label')}
                        >
                            {children}
                            {labelElement}
                        </LayoutWith>
                    );

                case LabelLocation.OnRight:
                    return (
                        <LayoutWith
                            options={[Element.noStaticStyleSheet]}
                            attributes={[
                                Internal.htmlClass(classes.inputLabel),
                                ...attributes,
                            ]}
                            context={asColumn}
                            node={NodeName('label')}
                        >
                            {children}
                            {labelElement}
                        </LayoutWith>
                    );

                case LabelLocation.OnLeft:
                    return (
                        <LayoutWith
                            options={[Element.noStaticStyleSheet]}
                            attributes={[
                                Internal.htmlClass(classes.inputLabel),
                                ...attributes,
                            ]}
                            context={asColumn}
                            node={NodeName('label')}
                        >
                            {labelElement}
                            {children}
                        </LayoutWith>
                    );
            }
        }
    }
}

/** Add a choice to your radio element. This will be rendered with the default radio icon. */
function Option(value: any, text: preact.ComponentChild): Option {
    return Option(value, (status: OptionState) => (
        <DefaultRadioOption status={status}>{text}</DefaultRadioOption>
    ));
}

/** Customize exactly what your radio option should look like in different states. */
function OptionWith(
    value: any,
    view: (x: OptionState) => preact.ComponentChild
): Option {
    return Option(value, view);
}

function Radio({
    attributes,
    options,
    selected,
    label,
    onChange,
}: {
    attributes: Attribute[];
    onChange: (
        option: any,
        event: preact.JSX.TargetedEvent
    ) => preact.JSX.EventHandler<preact.JSX.TargetedEvent>;
    options: Option[];
    selected: Maybe<any>;
    label: Label;
}) {
    return (
        <RadioHelper
            orientation={Orientation.Column}
            attributes={attributes}
            options={options}
            selected={selected}
            label={label}
            onChange={onChange}
        />
    );
}

/** Same as radio, but displayed as a row */
function RadioRow({
    attributes,
    options,
    selected,
    label,
    onChange,
}: {
    attributes: Attribute[];
    onChange: (
        option: any,
        event: preact.JSX.TargetedEvent
    ) => preact.JSX.EventHandler<preact.JSX.TargetedEvent>;
    options: Option[];
    selected: Maybe<any>;
    label: Label;
}) {
    return (
        <RadioHelper
            orientation={Orientation.Row}
            attributes={attributes}
            options={options}
            selected={selected}
            label={label}
            onChange={onChange}
        />
    );
}

function DefaultRadioOption({
    status,
    children,
}: {
    status: OptionState;
    children: preact.ComponentChild;
}) {
    return (
        <ElementJsx.Row attributes={[spacing(10), alignLeft, width(shrink)]}>
            <El
                attributes={[
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
                ]}
            >
                {}
            </El>
            <El attributes={[width(fill), Internal.htmlClass('unfocusable')]}>
                {ElementJsx.Text({ children })}
            </El>
        </ElementJsx.Row>
    );
}

function RadioHelper({
    orientation,
    attributes,
    options,
    selected,
    label,
    onChange,
}: {
    orientation: Orientation;
    attributes: Attribute[];
    onChange: (
        option: any,
        event: preact.JSX.TargetedEvent
    ) => preact.JSX.EventHandler<preact.JSX.TargetedEvent>;
    options: Option[];
    selected: Maybe<any>;
    label: Label;
}) {
    const optionArea = (() => {
            switch (orientation) {
                case Orientation.Row: {
                    const children = options.map((x: Option) =>
                        renderOption(x)
                    );
                    return (
                        <Row
                            attributes={[
                                hiddenLabelAttribute(label),
                                ...attributes,
                            ]}
                        >
                            {children}
                        </Row>
                    );
                }

                case Orientation.Column: {
                    const children = options.map((x: Option) =>
                        renderOption(x)
                    );
                    return (
                        <Column
                            attributes={[
                                hiddenLabelAttribute(label),
                                ...attributes,
                            ]}
                        >
                            {children}
                        </Column>
                    );
                }
            }
        })(),
        prevNext: Maybe<[any, any]> = (() => {
            if (isEmpty(options)) return Nothing();

            const val: any = options[0].value;
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
                options.reduce(
                    (
                        acc: [Found, any, any],
                        option: Option
                    ): [Found, any, any] => track(option, acc),
                    [Found.NotFound, val, val]
                )
            );
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
            Just(value) === selected ? OptionState.Selected : OptionState.Idle;
        return (
            <El
                attributes={[
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
                    Events.onClick((event) => onChange(value, event)),
                ]}
            >
                {view(status)}
            </El>
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
                        if (Just(opt.value) === selected) {
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

    return (
        <ApplyLabel
            attributes={[
                ...radioAttrs,
                Events.onKeyLookUp((event) => {
                    const { key } = event;
                    switch (prevNext.type) {
                        case MaybeType.Nothing:
                            break;

                        case MaybeType.Just: {
                            const [prev, next] = prevNext.value;
                            switch (key) {
                                case Events.leftArrow:
                                case Events.leftArrow_:
                                case Events.upArrow:
                                case Events.upArrow_:
                                    onChange(prev, event);
                                    break;
                                case Events.rightArrow:
                                case Events.rightArrow_:
                                case Events.downArrow:
                                case Events.downArrow_:
                                    onChange(next, event);
                                    break;
                                case Events.space:
                                    switch (selected.type) {
                                        case MaybeType.Nothing:
                                            onChange(prev, event);
                                            break;
                                        default:
                                            break;
                                    }
                                    break;
                                default:
                                    break;
                            }
                        }
                    }
                }),
                ...events,
            ]}
            label={label}
        >
            {optionArea}
        </ApplyLabel>
    );
}

function Column({
    attributes,
    children,
}: {
    attributes: Attribute[];
    children: preact.ComponentChild[];
}) {
    return (
        <LayoutWith
            options={[Element.noStaticStyleSheet]}
            attributes={[height(shrink), width(fill), ...attributes]}
            context={asColumn}
        >
            {children}
        </LayoutWith>
    );
}

function Row({
    attributes,
    children,
}: {
    attributes: Attribute[];
    children: preact.ComponentChild[];
}) {
    return (
        <LayoutWith
            options={[Element.noStaticStyleSheet]}
            attributes={[width(fill), ...attributes]}
            context={asRow}
        >
            {children}
        </LayoutWith>
    );
}

// Style Defaults

/**
 * The blue default checked box icon.
 *
 * You'll likely want to make your own checkbox at some point that fits your design.
 */
function DefaultCheckbox(checked: boolean) {
    return (
        <El
            attributes={[
                ...defaultRadioAttrs(checked),
                inFront(
                    Element.jsx(
                        <El attributes={defaultRadioInFrontAttrs(checked)}>
                            {}
                        </El>
                    )
                ),
            ]}
        >
            {}
        </El>
    );
}

export {
    Button,
    Checkbox,
    DefaultCheckbox,
    Text,
    Multiline,
    Placeholder,
    Username,
    NewPassword,
    currentPassword,
    Email,
    Search,
    SpellChecked,
    Slider,
    Radio,
    RadioRow,
    Option,
    Option_,
    OptionWith,
    OptionState,
    Label,
    labelAbove,
    labelBelow,
    labelLeft,
    labelRight,
    labelHidden,
    hiddenLabelAttribute,
    isHiddenLabel,
};

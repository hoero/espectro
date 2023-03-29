// deno-lint-ignore-file no-explicit-any
import { elmish, preact } from '../../deps.ts';
import * as Flag from './flag.ts';
import { classes as cls, dot, rules } from './style.ts';
import {
    Elements,
    Element,
    Styles,
    Style,
    Transformations,
    Transformation,
    FontFamilyType,
    SansSerif,
    Typeface,
    Font,
    Variants,
    Variant,
    LayoutContext,
    Attributes,
    StyleClass,
    Location,
    Attribute,
    Descriptions,
    Length,
    Lengths,
    Color,
    Notation,
    NodeNames,
    NodeName,
    NearbyChildrens,
    NearbyChildren,
    Gathered,
    EmbedStyles,
    HAlign,
    VAlign,
    TransformComponent,
    TransformComponents,
    Shadow,
    PseudoClass,
    Single,
    EmbedStyle,
    Unkeyed,
    Keyed,
    Children,
    Childrens,
    TextElement,
    asEl,
    OptionObject,
    FocusStyle,
    Style_,
    Property,
    Option,
    HoverSetting,
    Adjustment,
    Maybe,
    RenderMode,
    NoStyleSheet,
    Generic,
    Attr,
    Unstyled,
    Styled,
    Embedded,
    Untransformed,
    Moved,
    FullTransform,
    NoNearbyChildren,
    ChildrenBehind,
    ChildrenInFront,
    ChildrenBehindAndInFront,
    Colored,
    FontSize,
    FontFamily,
    Options,
    Transform,
    Spacing,
    Padding,
    PaddingStyle,
    SpacingStyle,
    OnlyDynamic,
    StaticRootAndDynamic,
    Px,
    Hsla,
} from './data.ts';
import { isEmpty, isNumber, isPlainObject, isString } from '../utils/utils.ts';
import { rgba } from '../color.ts';

const { Just, Nothing, map, withDefault, MaybeType } = elmish.Maybe;

const { h } = preact;

const noStyleSheet = NoStyleSheet();

function renderVariant(variant: Variant): string {
    switch (variant.type) {
        case Variants.VariantActive:
            if (isString(variant.name)) {
                return `\'${variant.name}\'`;
            }
            return '';

        case Variants.VariantOff:
            if (isString(variant.name)) {
                return `\'${variant.name}\' 0`;
            }
            return '';

        case Variants.VariantIndexed:
            if (isPlainObject(variant)) {
                return `\'${variant.name}\' ${variant.index}`;
            }
            return '';
    }
}

function variantName(variant: Variant): string {
    switch (variant.type) {
        case Variants.VariantActive:
            if (isString(variant.name)) {
                return variant.name;
            }
            return '';

        case Variants.VariantOff:
            if (isString(variant.name)) {
                return `${variant.name}-0`;
            }
            return '';

        case Variants.VariantIndexed:
            if (isPlainObject(variant)) {
                return `${variant.name}-${variant.index}`;
            }
            return '';
    }
}

function renderVariants(typeface: Font): Maybe<string> {
    switch (typeface.type) {
        case FontFamilyType.FontWith: {
            return Just(typeface.variants.map(renderVariant).join(', '));
        }

        default:
            return Nothing();
    }
}

function isSmallCaps(variant: Variant): boolean {
    switch (variant.type) {
        case Variants.VariantActive:
            if (isString(variant.name)) {
                return variant.name === 'smcp';
            }
            return false;

        case Variants.VariantOff:
            return false;

        case Variants.VariantIndexed:
            if (isPlainObject(variant)) {
                return variant.name === 'smcp' && variant.index === 1;
            }
            return false;
    }
}

function hasSmallCaps(typeface: Font): boolean {
    switch (typeface.type) {
        case FontFamilyType.FontWith:
            return typeface.variants.some(isSmallCaps);

        default:
            return false;
    }
}

const div = Generic();

function htmlClass(cls: string): Attribute {
    return Attr({ class: cls });
}

function unstyled(node: preact.JSX.Element): Element {
    return Unstyled(() => node);
}

function finalizeNode(
    has: Flag.Field[],
    node: NodeName,
    attributes: preact.ClassAttributes<string> &
        preact.JSX.HTMLAttributes &
        preact.JSX.SVGAttributes,
    children: Children<preact.JSX.Element>,
    embedMode: EmbedStyle,
    parentContext: LayoutContext
): preact.JSX.Element {
    const html: preact.JSX.Element = (() => {
        switch (node.type) {
            case NodeNames.Generic:
                return createNode('div', attributes);

            case NodeNames.NodeName:
                return createNode(node.nodeName, attributes);

            case NodeNames.Embedded: {
                return h<any>(
                    node.nodeName,
                    attributes,
                    h(node.internal, {
                        class: cls.any + ' ' + cls.single,
                    })
                );
            }
        }
    })();

    function createNode(
        nodeName: keyof preact.JSX.IntrinsicElements,
        attrs: preact.ClassAttributes<string> &
            preact.JSX.HTMLAttributes &
            preact.JSX.SVGAttributes
    ): preact.JSX.Element {
        switch (children.type) {
            case Childrens.Keyed: {
                const child = (
                    embedMode: EmbedStyle
                ): [string, preact.ComponentChildren][] => {
                    switch (embedMode.type) {
                        case EmbedStyles.NoStyleSheet:
                            return children.keyed;

                        case EmbedStyles.OnlyDynamic:
                            return embedKeyed(
                                false,
                                embedMode.options,
                                embedMode.styles,
                                children.keyed
                            );

                        case EmbedStyles.StaticRootAndDynamic:
                            return embedKeyed(
                                true,
                                embedMode.options,
                                embedMode.styles,
                                children.keyed
                            );
                    }
                };
                return h<any>(
                    nodeName,
                    attrs,
                    child(embedMode).map(
                        ([key, componentChild]: [
                            string,
                            preact.ComponentChildren
                        ]) => h<any>('span', { key }, componentChild)
                    )
                );
            }

            case Childrens.Unkeyed: {
                const child = (
                    embedMode: EmbedStyle
                ): preact.ComponentChildren[] => {
                    switch (embedMode.type) {
                        case EmbedStyles.NoStyleSheet:
                            return children.unkeyed;

                        case EmbedStyles.OnlyDynamic:
                            return embedWith(
                                false,
                                embedMode.options,
                                embedMode.styles,
                                children.unkeyed
                            );

                        case EmbedStyles.StaticRootAndDynamic:
                            return embedWith(
                                true,
                                embedMode.options,
                                embedMode.styles,
                                children.unkeyed
                            );
                    }
                };
                const child_ = child(embedMode);
                switch (nodeName) {
                    case 'div':
                        return h<any>('div', attrs, child_);

                    case 'p':
                        return h<any>('p', attrs, child_);

                    default:
                        return h<any>(nodeName, attrs, child_);
                }
            }
        }
    }

    switch (parentContext) {
        case LayoutContext.AsRow:
            if (
                Flag.present(Flag.widthFill, has) &&
                !Flag.present(Flag.widthBetween, has)
            ) {
                return html;
            } else if (Flag.present(Flag.alignRight, has)) {
                return h(
                    'u',
                    {
                        class: [
                            cls.any,
                            cls.single,
                            cls.container,
                            cls.contentCenterY,
                            cls.alignContainerRight,
                        ].join(' '),
                    },
                    html
                );
            } else if (Flag.present(Flag.centerX, has)) {
                return h(
                    's',
                    {
                        class: [
                            cls.any,
                            cls.single,
                            cls.container,
                            cls.contentCenterY,
                            cls.alignContainerCenterX,
                        ].join(' '),
                    },
                    html
                );
            } else {
                return html;
            }

        case LayoutContext.AsColumn:
            if (
                Flag.present(Flag.heightFill, has) &&
                !Flag.present(Flag.heightBetween, has)
            ) {
                return html;
            } else if (Flag.present(Flag.centerY, has)) {
                return h(
                    's',
                    {
                        class: [
                            cls.any,
                            cls.single,
                            cls.container,
                            cls.alignContainerCenterY,
                        ].join(' '),
                    },
                    html
                );
            } else if (Flag.present(Flag.alignBottom, has)) {
                return h(
                    'u',
                    {
                        class: [
                            cls.any,
                            cls.single,
                            cls.container,
                            cls.alignContainerBottom,
                        ].join(' '),
                    },
                    html
                );
            } else {
                return html;
            }

        case LayoutContext.AsEl:
            if (
                Flag.present(Flag.alignRight, has) ||
                Flag.present(Flag.alignBottom, has)
            ) {
                return h(
                    'u',
                    {
                        class: [
                            cls.any,
                            cls.single,
                            cls.container,
                            cls.contentCenterY,
                            cls.alignContainerRight,
                        ].join(' '),
                    },
                    html
                );
            } else if (
                Flag.present(Flag.centerX, has) ||
                Flag.present(Flag.centerY, has)
            ) {
                return h(
                    's',
                    {
                        class: [
                            cls.any,
                            cls.single,
                            cls.container,
                            cls.contentCenterY,
                            cls.alignContainerCenterX,
                        ].join(' '),
                    },
                    html
                );
            } else {
                return html;
            }

        default:
            return html;
    }
}

function embedWith(
    static_: boolean,
    opts: OptionObject,
    styles: Style[],
    children: preact.ComponentChildren[]
): preact.ComponentChildren[] {
    const dinamicStyleSheet: preact.JSX.Element = toStyleSheet(
        opts,
        styles.reduce(
            (
                acc: [Set<string>, Style[]],
                style: Style
            ): [Set<string>, Style[]] => reduceStyles(style, acc),
            [new Set(''), renderFocusStyle(opts.focus)]
        )[1]
    );
    if (static_) return [staticRoot(opts), dinamicStyleSheet, ...children];
    return [dinamicStyleSheet, ...children];
}

function embedKeyed(
    static_: boolean,
    opts: OptionObject,
    styles: Style[],
    children: [string, preact.ComponentChildren][]
): [string, preact.ComponentChildren][] {
    const dinamicStyleSheet: preact.JSX.Element = toStyleSheet(
        opts,
        styles.reduce(
            (
                acc: [Set<string>, Style[]],
                style: Style
            ): [Set<string>, Style[]] => reduceStyles(style, acc),
            [new Set(''), renderFocusStyle(opts.focus)]
        )[1]
    );
    if (static_)
        return [
            ['static-stylesheet', staticRoot(opts)],
            ['dynamic-stylesheet', dinamicStyleSheet],
            ...children,
        ];
    return [['dynamic-stylesheet', dinamicStyleSheet], ...children];
}

function reduceStyles(
    style: Style,
    [cache, existing]: [Set<string>, Style[]]
): [Set<string>, Style[]] {
    const styleName = getStyleName(style);

    if (cache.has(styleName)) {
        return [cache, existing];
    }

    return [cache.add(styleName), [style, ...existing]];
}

function addNodeName(
    newNode: keyof preact.JSX.IntrinsicElements,
    old: NodeName
): NodeName {
    switch (old.type) {
        case NodeNames.Generic:
            return NodeName(newNode);

        case NodeNames.NodeName:
            return Embedded(old.nodeName, newNode);

        case NodeNames.Embedded:
            return Embedded(old.nodeName, old.internal);
    }
}

function alignXName(align: HAlign) {
    switch (align) {
        case HAlign.Left:
            return `${cls.alignedHorizontally} ${cls.alignLeft}`;

        case HAlign.CenterX:
            return `${cls.alignedHorizontally} ${cls.alignCenterX}`;

        case HAlign.Right:
            return `${cls.alignedHorizontally} ${cls.alignRight}`;
    }
}

function alignYName(align: VAlign) {
    switch (align) {
        case VAlign.Top:
            return `${cls.alignedVertically} ${cls.alignTop}`;

        case VAlign.CenterY:
            return `${cls.alignedVertically} ${cls.alignCenterY}`;

        case VAlign.Bottom:
            return `${cls.alignedVertically} ${cls.alignBottom}`;
    }
}

function transformClass(transform: Transformation): Maybe<string> {
    switch (transform.type) {
        case Transformations.Untransformed:
            return Nothing();

        case Transformations.Moved:
            if (Array.isArray(transform.xyz)) {
                return Just(
                    `mv-${floatClass(transform.xyz[0])}-${floatClass(
                        transform.xyz[1]
                    )}-${floatClass(transform.xyz[2])}`
                );
            }
            return Nothing();

        case Transformations.FullTransform:
            if (isPlainObject(transform) && !Array.isArray(transform)) {
                return Just(
                    `tfrm-${floatClass(transform.translate[0])}-${floatClass(
                        transform.translate[1]
                    )}-${floatClass(transform.translate[2])}-${floatClass(
                        transform.scale[0]
                    )}-${floatClass(transform.scale[1])}-${floatClass(
                        transform.scale[2]
                    )}-${floatClass(transform.rotate[0])}-${floatClass(
                        transform.rotate[1]
                    )}-${floatClass(transform.rotate[2])}-${floatClass(
                        transform.angle
                    )}`
                );
            }
            return Nothing();
    }
}

function transformValue(transform: Transformation): Maybe<string> {
    switch (transform.type) {
        case Transformations.Untransformed:
            return Nothing();

        case Transformations.Moved:
            if (Array.isArray(transform.xyz)) {
                return Just(
                    `translate3d(${transform.xyz[0]}px, ${transform.xyz[1]}px, ${transform.xyz[2]}px)`
                );
            }
            return Nothing();

        case Transformations.FullTransform:
            if (isPlainObject(transform) && !Array.isArray(transform)) {
                const translate = `translate3d(${transform.translate[0]}px, ${transform.translate[1]}px, ${transform.translate[2]}px)`;
                const scale = `scale3d(${transform.scale[0]}px, ${transform.scale[1]}px, ${transform.scale[2]}px)`;
                const rotate = `rotate3d(${transform.rotate[0]}px, ${transform.rotate[1]}px, ${transform.rotate[2]}px)`;
                return Just(`${translate} ${scale} ${rotate}`);
            }
            return Nothing();
    }
}

function composeTransformation(
    transform: Transformation,
    component: TransformComponent
): Transformation {
    switch (transform.type) {
        case Transformations.Untransformed:
            switch (component.type) {
                case TransformComponents.MoveX:
                    return Moved([component.x, 0, 0]);

                case TransformComponents.MoveY:
                    return Moved([0, component.y, 0]);

                case TransformComponents.MoveZ:
                    return Moved([0, 0, component.z]);

                case TransformComponents.MoveXYZ:
                    return Moved(component.xyz);

                case TransformComponents.Rotate:
                    return FullTransform(
                        [0, 0, 0],
                        [1, 1, 1],
                        component.xyz,
                        component.angle
                    );

                case TransformComponents.Scale:
                    return FullTransform(
                        [0, 0, 0],
                        component.xyz,
                        [0, 0, 1],
                        0
                    );
            }
            break;

        case Transformations.Moved:
            if (Array.isArray(transform.xyz)) {
                switch (component.type) {
                    case TransformComponents.MoveX:
                        return Moved([
                            component.x,
                            transform.xyz[1],
                            transform.xyz[2],
                        ]);

                    case TransformComponents.MoveY:
                        return Moved([
                            transform.xyz[0],
                            component.y,
                            transform.xyz[2],
                        ]);

                    case TransformComponents.MoveZ:
                        return Moved([
                            transform.xyz[0],
                            transform.xyz[1],
                            component.z,
                        ]);

                    case TransformComponents.MoveXYZ:
                        return Moved(component.xyz);

                    case TransformComponents.Rotate:
                        return FullTransform(
                            transform.xyz,
                            [1, 1, 1],
                            component.xyz,
                            component.angle
                        );

                    case TransformComponents.Scale:
                        return FullTransform(
                            transform.xyz,
                            component.xyz,
                            [0, 0, 1],
                            0
                        );
                }
            }
            return Untransformed();

        case Transformations.FullTransform:
            if (isPlainObject(transform) && !Array.isArray(transform)) {
                switch (component.type) {
                    case TransformComponents.MoveX:
                        return FullTransform(
                            [
                                component.x,
                                transform.translate[1],
                                transform.translate[2],
                            ],
                            transform.scale,
                            transform.rotate,
                            transform.angle
                        );

                    case TransformComponents.MoveY:
                        return FullTransform(
                            [
                                transform.translate[0],
                                component.y,
                                transform.translate[2],
                            ],
                            transform.scale,
                            transform.rotate,
                            transform.angle
                        );

                    case TransformComponents.MoveZ:
                        return FullTransform(
                            [
                                transform.translate[0],
                                transform.translate[1],
                                component.z,
                            ],
                            transform.scale,
                            transform.rotate,
                            transform.angle
                        );

                    case TransformComponents.MoveXYZ:
                        return FullTransform(
                            component.xyz,
                            transform.scale,
                            transform.rotate,
                            transform.angle
                        );

                    case TransformComponents.Rotate:
                        return FullTransform(
                            transform.translate,
                            transform.scale,
                            component.xyz,
                            component.angle
                        );

                    case TransformComponents.Scale:
                        return FullTransform(
                            transform.translate,
                            component.xyz,
                            transform.rotate,
                            transform.angle
                        );
                }
            }
            return Untransformed();
    }
}

function skippable(flag: Flag.Flag, style: Style) {
    if (flag === Flag.borderWidth) {
        switch (style.type) {
            case Styles.Single:
                switch (style.value) {
                    case '0px':
                    case '1px':
                    case '2px':
                    case '3px':
                    case '4px':
                    case '5px':
                    case '6px':
                        return true;

                    default:
                        return false;
                }
                break;

            default:
                return false;
        }
    }

    switch (style.type) {
        case Styles.FontSize:
            return style.i >= 8 && style.i <= 32;

        case Styles.PaddingStyle:
            return (
                style.top === style.bottom &&
                style.top === style.right &&
                style.top === style.left &&
                style.top >= 0 &&
                style.top <= 24
            );

        // case Styles.SpacingStyle:
        //     return true;

        // case Styles.FontFamily:
        //     return true;

        default:
            return false;
    }
}

function gatherAttrRecursive(
    classes: string,
    node: NodeName,
    has: Flag.Field[],
    transform: Transformation,
    styles: Style[],
    attrs: preact.ClassAttributes<string> &
        preact.JSX.HTMLAttributes &
        preact.JSX.SVGAttributes,
    children: NearbyChildren,
    elementAttrs: Attribute[]
): Gathered {
    if (isEmpty(elementAttrs)) {
        const class_ = transformClass(transform);

        switch (class_.type) {
            case MaybeType.Nothing: {
                const classes_ = attrs.class;
                attrs.class = classes + ' ' + classes_;
                return Gathered(node, attrs, styles, children, has);
            }

            case MaybeType.Just: {
                const classes_ = attrs.class;
                attrs.class = classes + ' ' + class_.value + ' ' + classes_;
                return Gathered(
                    node,
                    attrs,
                    [Transform(transform), ...styles],
                    children,
                    has
                );
            }
        }
    }

    const [attribute_, ...remaining] = elementAttrs;

    switch (attribute_.type) {
        case Attributes.NoAttribute:
            return gatherAttrRecursive(
                classes,
                node,
                has,
                transform,
                styles,
                attrs,
                children,
                remaining
            );

        case Attributes.Attr:
            return gatherAttrRecursive(
                classes,
                node,
                has,
                transform,
                styles,
                { ...attrs, ...attribute_.attr },
                children,
                remaining
            );

        case Attributes.Describe:
            switch (attribute_.description.type) {
                case Descriptions.Main:
                    return gatherAttrRecursive(
                        classes,
                        addNodeName('main', node),
                        has,
                        transform,
                        styles,
                        attrs,
                        children,
                        remaining
                    );

                case Descriptions.Navigation:
                    return gatherAttrRecursive(
                        classes,
                        addNodeName('nav', node),
                        has,
                        transform,
                        styles,
                        attrs,
                        children,
                        remaining
                    );

                case Descriptions.ContentInfo:
                    return gatherAttrRecursive(
                        classes,
                        addNodeName('footer', node),
                        has,
                        transform,
                        styles,
                        attrs,
                        children,
                        remaining
                    );

                case Descriptions.Complementary:
                    return gatherAttrRecursive(
                        classes,
                        addNodeName('aside', node),
                        has,
                        transform,
                        styles,
                        attrs,
                        children,
                        remaining
                    );

                case Descriptions.Heading:
                    if (attribute_.description.i <= 1) {
                        return gatherAttrRecursive(
                            classes,
                            addNodeName('h1', node),
                            has,
                            transform,
                            styles,
                            attrs,
                            children,
                            remaining
                        );
                    } else if (attribute_.description.i < 7) {
                        const heading: keyof preact.JSX.IntrinsicElements =
                            (() => {
                                switch (attribute_.description.i) {
                                    case 1:
                                        return 'h1';

                                    case 2:
                                        return 'h2';

                                    case 3:
                                        return 'h3';

                                    case 4:
                                        return 'h4';

                                    case 5:
                                        return 'h5';

                                    case 6:
                                    default:
                                        return 'h6';
                                }
                            })();
                        return gatherAttrRecursive(
                            classes,
                            addNodeName(heading, node),
                            has,
                            transform,
                            styles,
                            attrs,
                            children,
                            remaining
                        );
                    } else {
                        return gatherAttrRecursive(
                            classes,
                            addNodeName('h6', node),
                            has,
                            transform,
                            styles,
                            attrs,
                            children,
                            remaining
                        );
                    }

                case Descriptions.Label:
                    return gatherAttrRecursive(
                        classes,
                        node,
                        has,
                        transform,
                        styles,
                        {
                            'aria-label': attribute_.description.label,
                            ...attrs,
                        },
                        children,
                        remaining
                    );

                case Descriptions.LivePolite:
                    return gatherAttrRecursive(
                        classes,
                        node,
                        has,
                        transform,
                        styles,
                        { 'aria-live': 'polite', ...attrs },
                        children,
                        remaining
                    );

                case Descriptions.LiveAssertive:
                    return gatherAttrRecursive(
                        classes,
                        node,
                        has,
                        transform,
                        styles,
                        { 'aria-live': 'assertive', ...attrs },
                        children,
                        remaining
                    );

                case Descriptions.Button:
                    return gatherAttrRecursive(
                        classes,
                        node,
                        has,
                        transform,
                        styles,
                        { role: 'button', ...attrs },
                        children,
                        remaining
                    );

                case Descriptions.Paragraph:
                    /** TODO:
                     * previously we rendered a <p> tag, though apparently this invalidates the html if it has <div>s inside.
                     * Since we can't guaranteee that there are no divs, we need another strategy.
                     *  While it's not documented in many places, there apparently is a paragraph aria role
                     * https://github.com/w3c/aria/blob/11f85f41a5b621fdbe85fc9bcdcd270e653a48ba/common/script/roleInfo.js
                     * Though we'll need to wait till it gets released in an official wai-aria spec to use it.
                     * If it's used at the moment, then Lighthouse complains (likely rightfully) that role paragraph is not recognized. */
                    return gatherAttrRecursive(
                        classes,
                        node,
                        has,
                        transform,
                        styles,
                        attrs,
                        children,
                        remaining
                    );
            }
            break;

        case Attributes.Class:
            if (Flag.present(attribute_.flag, has))
                return gatherAttrRecursive(
                    classes,
                    node,
                    has,
                    transform,
                    styles,
                    attrs,
                    children,
                    remaining
                );

            return gatherAttrRecursive(
                `${attribute_.class_} ${classes}`,
                node,
                Flag.add(attribute_.flag, has),
                transform,
                styles,
                attrs,
                children,
                remaining
            );

        case Attributes.StyleClass:
            if (Flag.present(attribute_.flag, has)) {
                return gatherAttrRecursive(
                    classes,
                    node,
                    has,
                    transform,
                    styles,
                    attrs,
                    children,
                    remaining
                );
            } else if (skippable(attribute_.flag, attribute_.style)) {
                return gatherAttrRecursive(
                    `${getStyleName(attribute_.style)} ${classes}`,
                    node,
                    Flag.add(attribute_.flag, has),
                    transform,
                    styles,
                    attrs,
                    children,
                    remaining
                );
            } else {
                return gatherAttrRecursive(
                    `${getStyleName(attribute_.style)} ${classes}`,
                    node,
                    Flag.add(attribute_.flag, has),
                    transform,
                    [attribute_.style, ...styles],
                    attrs,
                    children,
                    remaining
                );
            }

        case Attributes.AlignY: {
            if (Flag.present(Flag.yAlign, has))
                return gatherAttrRecursive(
                    classes,
                    node,
                    has,
                    transform,
                    styles,
                    attrs,
                    children,
                    remaining
                );

            const flags: Flag.Field[] = Flag.add(Flag.yAlign, has);
            const align: VAlign = attribute_.y;

            return gatherAttrRecursive(
                `${alignYName(align)} ${classes}`,
                node,
                (() => {
                    switch (align) {
                        case VAlign.CenterY:
                            return Flag.add(Flag.centerY, flags);

                        case VAlign.Bottom:
                            return Flag.add(Flag.alignBottom, flags);

                        default:
                            return flags;
                    }
                })(),
                transform,
                styles,
                attrs,
                children,
                remaining
            );
        }

        case Attributes.AlignX: {
            if (Flag.present(Flag.xAlign, has))
                return gatherAttrRecursive(
                    classes,
                    node,
                    has,
                    transform,
                    styles,
                    attrs,
                    children,
                    remaining
                );

            const flags: Flag.Field[] = Flag.add(Flag.xAlign, has);
            const align: HAlign = attribute_.x;

            return gatherAttrRecursive(
                `${alignXName(align)} ${classes}`,
                node,
                (() => {
                    switch (align) {
                        case HAlign.CenterX:
                            return Flag.add(Flag.centerX, flags);

                        case HAlign.Right:
                            return Flag.add(Flag.alignRight, flags);

                        default:
                            return flags;
                    }
                })(),
                transform,
                styles,
                attrs,
                children,
                remaining
            );
        }

        case Attributes.Width:
            if (Flag.present(Flag.width, has))
                return gatherAttrRecursive(
                    classes,
                    node,
                    has,
                    transform,
                    styles,
                    attrs,
                    children,
                    remaining
                );

            switch (attribute_.width.type) {
                case Lengths.Px: {
                    const val = attribute_.width.px;
                    const name = `width-px-${val}`;
                    return gatherAttrRecursive(
                        `${cls.widthExact} ${name} ${classes}`,
                        node,
                        Flag.add(Flag.width, has),
                        transform,
                        [Single(name, 'width', `${val}px`), ...styles],
                        attrs,
                        children,
                        remaining
                    );
                }

                case Lengths.Rem: {
                    const val = attribute_.width.rem;
                    const name = `width-rem-${val}`;
                    return gatherAttrRecursive(
                        `${cls.widthExact} ${name} ${classes}`,
                        node,
                        Flag.add(Flag.width, has),
                        transform,
                        [Single(name, 'width', `${val}rem`), ...styles],
                        attrs,
                        children,
                        remaining
                    );
                }

                case Lengths.Content:
                    return gatherAttrRecursive(
                        `${classes} ${cls.widthContent}`,
                        node,
                        Flag.add(Flag.widthContent, Flag.add(Flag.width, has)),
                        transform,
                        styles,
                        attrs,
                        children,
                        remaining
                    );

                case Lengths.Fill: {
                    if (attribute_.width.i === 1)
                        return gatherAttrRecursive(
                            `${classes} ${cls.widthFill}`,
                            node,
                            Flag.add(Flag.widthFill, Flag.add(Flag.width, has)),
                            transform,
                            styles,
                            attrs,
                            children,
                            remaining
                        );

                    const val = attribute_.width.i;
                    const name = `width-fill-${val}`;
                    return gatherAttrRecursive(
                        `${classes} ${cls.widthFillPortion} ${name}`,
                        node,
                        Flag.add(Flag.widthFill, Flag.add(Flag.width, has)),
                        transform,
                        [
                            Single(
                                `${cls.any}.${cls.row} > ${dot(name)}`,
                                'flex-grow',
                                `${val * 100000}`
                            ),
                            ...styles,
                        ],
                        attrs,
                        children,
                        remaining
                    );
                }

                default: {
                    const [addToFlags, newClass, newStyles] = renderWidth(
                        attribute_.width
                    );
                    return gatherAttrRecursive(
                        `${classes} ${newClass}`,
                        node,
                        [...addToFlags, ...Flag.add(Flag.width, has)],
                        transform,
                        [...newStyles, ...styles],
                        attrs,
                        children,
                        remaining
                    );
                }
            }

        case Attributes.Height:
            if (Flag.present(Flag.height, has))
                return gatherAttrRecursive(
                    classes,
                    node,
                    has,
                    transform,
                    styles,
                    attrs,
                    children,
                    remaining
                );

            switch (attribute_.height.type) {
                case Lengths.Px: {
                    const val = attribute_.height.px;
                    const name = `height-px-${val}`;
                    return gatherAttrRecursive(
                        `${cls.heightExact} ${name} ${classes}`,
                        node,
                        Flag.add(Flag.height, has),
                        transform,
                        [Single(name, 'height', `${val}px`), ...styles],
                        attrs,
                        children,
                        remaining
                    );
                }

                case Lengths.Rem: {
                    const val = attribute_.height.rem;
                    const name = `height-rem-${val}`;
                    return gatherAttrRecursive(
                        `${cls.heightExact} ${name} ${classes}`,
                        node,
                        Flag.add(Flag.height, has),
                        transform,
                        [Single(name, 'height', `${val}rem`), ...styles],
                        attrs,
                        children,
                        remaining
                    );
                }

                case Lengths.Content:
                    return gatherAttrRecursive(
                        `${classes} ${cls.heightContent}`,
                        node,
                        Flag.add(
                            Flag.heightContent,
                            Flag.add(Flag.height, has)
                        ),
                        transform,
                        styles,
                        attrs,
                        children,
                        remaining
                    );

                case Lengths.Fill: {
                    if (attribute_.height.i === 1) {
                        return gatherAttrRecursive(
                            `${classes} ${cls.heightFill}`,
                            node,
                            Flag.add(
                                Flag.heightFill,
                                Flag.add(Flag.height, has)
                            ),
                            transform,
                            styles,
                            attrs,
                            children,
                            remaining
                        );
                    }

                    const val = attribute_.height.i;
                    const name = `height-fill-${val}`;
                    return gatherAttrRecursive(
                        `${classes} ${cls.heightFillPortion} ${name}`,
                        node,
                        Flag.add(Flag.heightFill, Flag.add(Flag.height, has)),
                        transform,
                        [
                            Single(
                                `${cls.any}.${cls.row} > ${dot(name)}`,
                                'flex-grow',
                                `${val * 100000}`
                            ),
                            ...styles,
                        ],
                        attrs,
                        children,
                        remaining
                    );
                }

                default: {
                    const [addToFlags, newClass, newStyles] = renderHeight(
                        attribute_.height
                    );
                    return gatherAttrRecursive(
                        `${classes} ${newClass}`,
                        node,
                        [...addToFlags, ...Flag.add(Flag.height, has)],
                        transform,
                        [...newStyles, ...styles],
                        attrs,
                        children,
                        remaining
                    );
                }
            }

        case Attributes.Nearby: {
            const newStyles: Style[] = (() => {
                switch (attribute_.element.type) {
                    case Elements.Styled:
                        return styles.concat(attribute_.element.styles);

                    default:
                        return styles;
                }
            })();
            return gatherAttrRecursive(
                classes,
                node,
                has,
                transform,
                newStyles,
                attrs,
                addNearbyElement(
                    attribute_.location,
                    attribute_.element,
                    children
                ),
                remaining
            );
        }

        case Attributes.TransformComponent:
            return gatherAttrRecursive(
                classes,
                node,
                Flag.add(attribute_.flag, has),
                composeTransformation(transform, attribute_.component),
                styles,
                attrs,
                children,
                remaining
            );
    }
}

function addNearbyElement(
    location: Location,
    element: Element,
    existing: NearbyChildren
): NearbyChildren {
    const nearby = nearbyElement(location, element);

    switch (existing.type) {
        case NearbyChildrens.NoNearbyChildren:
            switch (location) {
                case Location.Behind:
                    return ChildrenBehind([nearby]);

                default:
                    return ChildrenInFront([nearby]);
            }

        case NearbyChildrens.ChildrenBehind:
            switch (location) {
                case Location.Behind:
                    return ChildrenBehind([nearby, ...existing.existingBehind]);

                default:
                    return ChildrenBehindAndInFront(existing.existingBehind, [
                        nearby,
                    ]);
            }

        case NearbyChildrens.ChildrenInFront:
            switch (location) {
                case Location.Behind:
                    return ChildrenBehindAndInFront(
                        [nearby],
                        existing.existingInFront
                    );

                default:
                    return ChildrenInFront([
                        nearby,
                        ...existing.existingInFront,
                    ]);
            }

        case NearbyChildrens.ChildrenBehindAndInFront:
            switch (location) {
                case Location.Behind:
                    return ChildrenBehindAndInFront(
                        [nearby, ...existing.existingBehind],
                        existing.existingInFront
                    );

                default:
                    return ChildrenBehindAndInFront(existing.existingBehind, [
                        nearby,
                        ...existing.existingInFront,
                    ]);
            }
    }
}

function nearbyElement(
    location: Location,
    element_: Element
): preact.JSX.Element {
    const common = [cls.nearby, cls.single];

    function classes_(location: Location) {
        switch (location) {
            case Location.Above:
                return [...common, cls.above].join(' ');

            case Location.Below:
                return [...common, cls.below].join(' ');

            case Location.OnRight:
                return [...common, cls.onRight].join(' ');

            case Location.OnLeft:
                return [...common, cls.onLeft].join(' ');

            case Location.InFront:
                return [...common, cls.inFront].join(' ');

            case Location.Behind:
                return [...common, cls.behind].join(' ');
        }
    }

    function child(element_: Element) {
        switch (element_.type) {
            case Elements.Empty:
                return h('', null, '');

            case Elements.Text:
                return textElement(TextElement.Text, element_.str);

            case Elements.Unstyled:
                return element_.html(asEl);

            case Elements.Styled:
                return element_.html(NoStyleSheet(), asEl);
        }
    }

    return h('div', { class: classes_(location) }, child(element_));
}

function renderWidth(w: Length): [Flag.Field[], string, Style[]] {
    switch (w.type) {
        case Lengths.Px: {
            const val = w.px;
            const name = `width-px-${val}`;
            return [
                [Flag.none],
                `${cls.widthExact} ${name}`,
                [Single(name, 'width', `${val}px`)],
            ];
        }

        case Lengths.Rem: {
            const val = w.rem;
            const name = `width-px-${val}`;
            return [
                [Flag.none],
                `${cls.widthExact} ${name}`,
                [Single(name, 'width', `${val}rem`)],
            ];
        }

        case Lengths.Content:
            return [
                Flag.add(Flag.widthContent, [Flag.none]),
                cls.widthContent,
                [],
            ];

        case Lengths.Fill: {
            if (w.i === 1)
                return [
                    Flag.add(Flag.widthFill, [Flag.none]),
                    cls.widthFill,
                    [],
                ];

            const val = w.i;
            const name = `width-fill-${val}`;
            return [
                Flag.add(Flag.widthFill, [Flag.none]),
                `${cls.widthFillPortion} ${name}`,
                [
                    Single(
                        `${cls.any}.${cls.row} > ${dot(name)}`,
                        'flex-grow',
                        `${val * 100000}`
                    ),
                ],
            ];
        }

        case Lengths.Min: {
            const minCls = `min-width-${w.min}`,
                [newFlag, newAttrs, newStyle] = renderWidth(w.length),
                minStyle = (() => {
                    switch (w.length.type) {
                        case Lengths.Rem:
                            return Single(minCls, 'min-width', `${w.min}rem`);

                        default:
                            return Single(minCls, 'min-width', `${w.min}px`);
                    }
                })();

            return [
                Flag.add(Flag.widthBetween, newFlag),
                `${minCls} ${newAttrs}`,
                [minStyle, ...newStyle],
            ];
        }

        case Lengths.Max: {
            const max = `max-width-${w.max}`,
                [newFlag, newAttrs, newStyle] = renderWidth(w.length),
                maxStyle = (() => {
                    switch (w.length.type) {
                        case Lengths.Rem:
                            return Single(max, 'max-width', `${w.max}rem`);

                        default:
                            return Single(max, 'max-width', `${w.max}px`);
                    }
                })();

            return [
                Flag.add(Flag.widthBetween, newFlag),
                `${max} ${newAttrs}`,
                [maxStyle, ...newStyle],
            ];
        }

        case Lengths.MinContent: {
            const name = 'min-width';
            return [[Flag.none], name, [Single(name, name, 'min-content')]];
        }

        case Lengths.MaxContent: {
            const name = 'max-width';
            return [[Flag.none], name, [Single(name, name, 'max-content')]];
        }
    }
}

function renderHeight(h: Length): [Flag.Field[], string, Style[]] {
    switch (h.type) {
        case Lengths.Px: {
            const val = h.px;
            const name = `height-px-${val}`;
            return [
                [Flag.none],
                `${cls.heightExact} ${name}`,
                [Single(name, 'height', `${val}px`)],
            ];
        }

        case Lengths.Rem: {
            const val = h.rem;
            const name = `height-px-${val}`;
            return [
                [Flag.none],
                `${cls.heightExact} ${name}`,
                [Single(name, 'height', `${val}rem`)],
            ];
        }

        case Lengths.Content:
            return [
                Flag.add(Flag.heightContent, [Flag.none]),
                cls.heightContent,
                [],
            ];

        case Lengths.Fill: {
            if (h.i === 1)
                return [
                    Flag.add(Flag.heightFill, [Flag.none]),
                    cls.heightFill,
                    [],
                ];

            const val = h.i;
            const name = `height-fill-${val}`;
            return [
                Flag.add(Flag.heightFill, [Flag.none]),
                `${cls.heightFillPortion} ${name}`,
                [
                    Single(
                        `${cls.any}.${cls.column} > ${dot(name)}`,
                        'flex-grow',
                        `${val * 100000}`
                    ),
                ],
            ];
        }

        case Lengths.Min: {
            const minCls = `min-height-${h.min}`,
                [newFlag, newAttrs, newStyle] = renderHeight(h.length),
                minStyle = (() => {
                    switch (h.length.type) {
                        case Lengths.Rem:
                            return Single(
                                minCls,
                                'min-height',
                                // This needs to be !important because we're using `min-height: min-content`
                                // to correct for safari's incorrect implementation of flexbox.
                                `${h.min}rem !important`
                            );

                        default:
                            return Single(
                                minCls,
                                'min-height',
                                `${h.min}px !important`
                            );
                    }
                })();

            return [
                Flag.add(Flag.heightBetween, newFlag),
                `${minCls} ${newAttrs}`,
                [minStyle, ...newStyle],
            ];
        }

        case Lengths.Max: {
            const max = `max-height-${h.max}`,
                [newFlag, newAttrs, newStyle] = renderHeight(h.length),
                maxStyle = (() => {
                    switch (h.length.type) {
                        case Lengths.Rem:
                            return Single(max, 'max-height', `${h.max}rem`);

                        default:
                            return Single(max, 'max-height', `${h.max}px`);
                    }
                })();

            return [
                Flag.add(Flag.heightBetween, newFlag),
                `${max} ${newAttrs}`,
                [maxStyle, ...newStyle],
            ];
        }

        case Lengths.MinContent: {
            const name = 'min-height';
            return [[Flag.none], name, [Single(name, name, 'min-content')]];
        }

        case Lengths.MaxContent: {
            const name = 'max-height';
            return [[Flag.none], name, [Single(name, name, 'max-content')]];
        }
    }
}

const rowClass = cls.any + ' ' + cls.row,
    columnClass = cls.any + ' ' + cls.column,
    singleClass = cls.any + ' ' + cls.single,
    gridClass = cls.any + ' ' + cls.grid,
    paragraphClass = cls.any + ' ' + cls.paragraph,
    pageClass = cls.any + ' ' + cls.page;

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

const untransformed = Untransformed();

function element(
    context: LayoutContext,
    node: NodeName,
    attributes: Attribute[],
    children: Children<Element>,
    options?: OptionObject
): Element {
    return createElement(
        context,
        children,
        gatherAttrRecursive(
            contextClasses(context),
            node,
            [Flag.none],
            untransformed,
            [],
            {},
            NoNearbyChildren(),
            attributes.reverse()
        ),
        options
    );
}

function createElement(
    context: LayoutContext,
    children: Children<Element>,
    rendered: Gathered,
    options?: OptionObject
): Element {
    function gather(
        child: Element,
        [htmls, existingStyles]: [Unkeyed<preact.ComponentChildren>, Style[]]
    ): [preact.ComponentChildren[], Style[]] {
        switch (child.type) {
            case Elements.Unstyled:
                return [
                    [child.html(context), ...htmls.unkeyed],
                    existingStyles,
                ];

            case Elements.Styled:
                return [
                    [child.html(NoStyleSheet(), context), ...htmls.unkeyed],
                    isEmpty(existingStyles)
                        ? child.styles
                        : child.styles.concat(existingStyles),
                ];

            case Elements.Text:
                // TEXT OPTIMIZATION TODO:
                // You can have raw text if the element is an el, and has `width-content` and `height-content`
                // Same if it's a column or row with one child and width-content, height-content
                // interferes with css grid
                // Maybe we could unpack text elements in a paragraph as well,
                // however, embedded elements that are larger than the line height will overlap with exisitng text.
                // I don't think that's what we want.
                // context === asEl || context === asParagraph
                //   ?[ [new DOM.Text(context === asParagraph ? child.str : child.str), ...htmls.unkeyed], existingStyles]
                //   :
                return [
                    [
                        context === asEl
                            ? textElement(TextElement.Fill, child.str)
                            : textElement(TextElement.Text, child.str),
                        ...htmls.unkeyed,
                    ],
                    existingStyles,
                ];

            case Elements.Empty:
                return [htmls.unkeyed, existingStyles];
        }
    }

    function gatherKeyed(
        [key, child]: [string, Element],
        [htmls, existingStyles]: [Keyed<preact.ComponentChildren>, Style[]]
    ): [[string, preact.ComponentChildren][], Style[]] {
        switch (child.type) {
            case Elements.Unstyled:
                return [
                    [[key, child.html(context)], ...htmls.keyed],
                    existingStyles,
                ];

            case Elements.Styled:
                return [
                    [
                        [key, child.html(NoStyleSheet(), context)],
                        ...htmls.keyed,
                    ],
                    isEmpty(existingStyles)
                        ? child.styles
                        : child.styles.concat(existingStyles),
                ];

            case Elements.Text:
                // TEXT OPTIMIZATION
                // You can have raw text if the element is an el, and has `width-content` and `height-content`
                // Same if it's a column or row with one child and width-content, height-content
                // interferes with css grid
                // Maybe we could unpack text elements in a paragraph as well,
                // however, embedded elements that are larger than the line height will overlap with exisitng text.
                // I don't think that's what we want.
                // context === asEl || context === asParagraph
                //   ?[ [[key, new DOM.Text(context === asParagraph ? child.str : child.str)], ...htmls.unkeyed], existingStyles]
                //   :
                return [
                    [
                        [
                            key,
                            context === asEl
                                ? textElement(TextElement.Fill, child.str)
                                : textElement(TextElement.Text, child.str),
                        ],
                        ...htmls.keyed,
                    ],
                    existingStyles,
                ];

            case Elements.Empty:
                return [htmls.keyed, existingStyles];
        }
    }

    switch (children.type) {
        case Childrens.Keyed: {
            const gathered = children.keyed.reduceRight(
                (
                    [keyed, styles]: [
                        [string, preact.ComponentChildren][],
                        Style[]
                    ],
                    keyed_: [string, Element]
                ) => gatherKeyed(keyed_, [Keyed(keyed), styles]),
                [[], []]
            );

            const newStyles: Style[] = isEmpty(gathered[1])
                ? rendered.styles
                : rendered.styles.concat(gathered[1]);

            if (isEmpty(newStyles)) {
                const node = finalizeNode(
                    rendered.has,
                    rendered.node,
                    rendered.attributes,
                    Keyed(
                        addKeyedChildren(
                            'nearby-element-pls',
                            gathered[0],
                            rendered.children
                        )
                    ),
                    NoStyleSheet(),
                    context
                );
                return Unstyled(() => node);
            }

            const node = finalizeNode(
                rendered.has,
                rendered.node,
                rendered.attributes,
                Keyed(
                    addKeyedChildren(
                        'nearby-element-pls',
                        gathered[0],
                        rendered.children
                    )
                ),
                typeof options === 'undefined'
                    ? NoStyleSheet()
                    : embedStyle(options, newStyles),
                context
            );
            return Styled(newStyles, () => node);
        }

        case Childrens.Unkeyed: {
            const gathered = children.unkeyed.reduceRight(
                (
                    [unkeyed, styles]: [preact.ComponentChildren[], Style[]],
                    unkeyed_: Element
                ) => gather(unkeyed_, [Unkeyed(unkeyed), styles]),
                [[], []]
            );

            const newStyles: Style[] = isEmpty(gathered[1])
                ? rendered.styles
                : rendered.styles.concat(gathered[1]);

            if (isEmpty(newStyles)) {
                const node = finalizeNode(
                    rendered.has,
                    rendered.node,
                    rendered.attributes,
                    Unkeyed(addChildren(gathered[0], rendered.children)),
                    NoStyleSheet(),
                    context
                );
                return Unstyled(() => node);
            }

            const node = finalizeNode(
                rendered.has,
                rendered.node,
                rendered.attributes,
                Unkeyed(addChildren(gathered[0], rendered.children)),
                typeof options === 'undefined'
                    ? NoStyleSheet()
                    : embedStyle(options, newStyles),
                context
            );
            return Styled(newStyles, () => node);
        }
    }
}

function addChildren(
    existing: preact.ComponentChildren[],
    nearbyChildren: NearbyChildren
): preact.ComponentChildren[] {
    switch (nearbyChildren.type) {
        case NearbyChildrens.NoNearbyChildren:
            return existing;

        case NearbyChildrens.ChildrenBehind:
            return nearbyChildren.existingBehind.concat(existing);

        case NearbyChildrens.ChildrenInFront:
            return existing.concat(nearbyChildren.existingInFront);

        case NearbyChildrens.ChildrenBehindAndInFront:
            return nearbyChildren.existingBehind
                .concat(existing)
                .concat(nearbyChildren.existingInFront);
    }
}

function addKeyedChildren(
    key: string,
    existing: [string, preact.ComponentChildren][],
    nearbyChildren: NearbyChildren
): [string, preact.ComponentChildren][] {
    switch (nearbyChildren.type) {
        case NearbyChildrens.NoNearbyChildren:
            return existing;

        case NearbyChildrens.ChildrenBehind:
            return nearbyChildren.existingBehind
                .map(
                    (
                        x: preact.ComponentChildren
                    ): [string, preact.ComponentChildren] => [key, x]
                )
                .concat(existing);

        case NearbyChildrens.ChildrenInFront:
            return existing.concat(
                nearbyChildren.existingInFront.map(
                    (
                        x: preact.ComponentChildren
                    ): [string, preact.ComponentChildren] => [key, x]
                )
            );

        case NearbyChildrens.ChildrenBehindAndInFront:
            return nearbyChildren.existingBehind
                .map(
                    (
                        x: preact.ComponentChildren
                    ): [string, preact.ComponentChildren] => [key, x]
                )
                .concat(existing)
                .concat(
                    nearbyChildren.existingInFront.map(
                        (
                            x: preact.ComponentChildren
                        ): [string, preact.ComponentChildren] => [key, x]
                    )
                );
    }
}

const focusDefaultStyle = FocusStyle(
    Nothing(),
    Just(Shadow(rgba(155 / 255, 203 / 255, 1, 1), [0, 0], 0, 3)),
    Nothing()
);

function staticRoot(options: OptionObject): preact.JSX.Element {
    switch (options.mode) {
        case RenderMode.Layout: {
            // wrap the style node in a div to prevent `Dark Reader` from blowin up the dom.
            return h('div', null, h('style', null, rules()));
        }

        case RenderMode.NoStaticStyleSheet: {
            return h('', null, '');
        }

        case RenderMode.WithVirtualCss: {
            return h(
                'espectro-static-rules',
                {
                    style: rules(),
                },
                ''
            );
        }
    }
}

// TODO: This doesn't reduce equivalent attributes completely.
function filter(attrs: Attribute[]): Attribute[] {
    return attrs.reduceRight(
        (
            [found, has]: [Attribute[], Set<string>],
            x: Attribute
        ): [Attribute[], Set<string>] => {
            switch (x.type) {
                case Attributes.NoAttribute:
                    return [found, has];

                case Attributes.Class:
                    return [[x, ...found], has];

                case Attributes.Attr:
                    return [[x, ...found], has];

                case Attributes.StyleClass:
                    return [[x, ...found], has];

                case Attributes.Width:
                    if (has.has('width')) {
                        return [found, has];
                    } else {
                        return [[x, ...found], has.add('width')];
                    }

                case Attributes.Height:
                    if (has.has('height')) {
                        return [found, has];
                    } else {
                        return [[x, ...found], has.add('height')];
                    }

                case Attributes.Describe:
                    if (has.has('described')) {
                        return [found, has];
                    } else {
                        return [[x, ...found], has.add('described')];
                    }

                case Attributes.Nearby:
                    return [[x, ...found], has];

                case Attributes.AlignX:
                    if (has.has('align-x')) {
                        return [found, has];
                    } else {
                        return [[x, ...found], has.add('align-x')];
                    }

                case Attributes.AlignY:
                    if (has.has('align-y')) {
                        return [found, has];
                    } else {
                        return [[x, ...found], has.add('align-y')];
                    }

                case Attributes.TransformComponent:
                    if (has.has('transform')) {
                        return [found, has];
                    } else {
                        return [[x, ...found], has.add('transform')];
                    }

                default:
                    return [found, has];
            }
        },
        [[], new Set('')]
    )[0];
}

function get(
    attrs: Attribute[],
    isAttr: (x: Attribute) => boolean
): Attribute[] {
    return filter(attrs).reduceRight((found: Attribute[], x: Attribute) => {
        if (isAttr(x)) return [x, ...found];
        return found;
    }, []);
}

function extractSpacingAndPadding(
    attrs: Attribute[]
): [Maybe<Padding>, Maybe<Spacing>] {
    return attrs.reduceRight(
        (
            [padding, spacing]: [Maybe<Padding>, Maybe<Spacing>],
            attr: Attribute
        ): [Maybe<Padding>, Maybe<Spacing>] => {
            return [
                (() => {
                    switch (padding.type) {
                        case MaybeType.Just:
                            return padding;

                        case MaybeType.Nothing:
                            switch (attr.type) {
                                case Attributes.StyleClass: {
                                    const { class_, top, right, bottom, left } =
                                        attr.style.type === Styles.PaddingStyle
                                            ? attr.style
                                            : PaddingStyle('', 0, 0, 0, 0);
                                    return Just(
                                        Padding(
                                            class_,
                                            top,
                                            right,
                                            bottom,
                                            left
                                        )
                                    );
                                }

                                default:
                                    return Nothing();
                            }
                    }
                })(),
                (() => {
                    switch (spacing.type) {
                        case MaybeType.Just:
                            return spacing;

                        case MaybeType.Nothing:
                            switch (attr.type) {
                                case Attributes.StyleClass: {
                                    const { class_, x, y } =
                                        attr.style.type === Styles.SpacingStyle
                                            ? attr.style
                                            : SpacingStyle('', 0, 0);
                                    return Just(Spacing(class_, x, y));
                                }

                                default:
                                    return Nothing();
                            }
                    }
                })(),
            ];
        },
        [Nothing(), Nothing()]
    );
}

function getSpacing(
    attrs: Attribute[],
    default_: [number, number]
): [number, number] {
    return withDefault(
        default_,
        attrs.reduceRight(
            (
                acc: Maybe<[number, number]>,
                attr: Attribute
            ): Maybe<[number, number]> => {
                switch (acc.type) {
                    case MaybeType.Just:
                        return acc;

                    case MaybeType.Nothing:
                        switch (attr.type) {
                            case Attributes.StyleClass: {
                                const { x, y } =
                                    attr.style.type === Styles.SpacingStyle
                                        ? attr.style
                                        : SpacingStyle('', 0, 0);
                                return Just([x, y]);
                            }

                            default:
                                return Nothing();
                        }
                }
            },
            Nothing()
        )
    );
}

function getWidth(attrs: Attribute[]): Maybe<Length> {
    return attrs.reduceRight((acc: Maybe<Length>, attr: Attribute) => {
        switch (acc.type) {
            case MaybeType.Just:
                return acc;

            case MaybeType.Nothing:
                switch (attr.type) {
                    case Attributes.Width:
                        return Just(attr.width);

                    default:
                        return Nothing();
                }
        }
    }, Nothing());
}

function getHeight(attrs: Attribute[]): Maybe<Length> {
    return attrs.reduceRight((acc: Maybe<Length>, attr: Attribute) => {
        switch (acc.type) {
            case MaybeType.Just:
                return acc;

            case MaybeType.Nothing:
                switch (attr.type) {
                    case Attributes.Height:
                        return Just(attr.height);

                    default:
                        return Nothing();
                }
        }
    }, Nothing());
}

function getLength(length: Maybe<Length>): Maybe<number> {
    const length_: Length = withDefault(Px(0), length);
    switch (length_.type) {
        case Lengths.Px:
            return Just(length_.px);

        case Lengths.Rem:
            return Just(length_.rem);

        case Lengths.Fill:
            return Just(length_.i);

        case Lengths.Min:
            return Just(length_.min);

        case Lengths.Max:
            return Just(length_.max);

        default:
            return Nothing();
    }
}

function textElement(type: TextElement, str: string): preact.JSX.Element {
    const textClasses = `${cls.any} ${cls.text} ${cls.widthContent} ${cls.heightContent}`,
        textFillClasses = `${cls.any} ${cls.text} ${cls.widthFill} ${cls.heightFill}`;

    function classes_(mode: TextElement) {
        switch (mode) {
            case TextElement.Text:
                return textClasses;

            case TextElement.Fill:
                return textFillClasses;
        }
    }

    return h('div', { class: classes_(type) }, str);
}

function toHtml(
    mode: (s: Style[]) => EmbedStyle,
    element: Element
): preact.JSX.Element {
    switch (element.type) {
        case Elements.Unstyled:
            return element.html(asEl);

        case Elements.Styled:
            return element.html(mode(element.styles), asEl);

        case Elements.Text:
            return textElement(TextElement.Text, element.str);

        case Elements.Empty:
            return textElement(TextElement.Text, '');
    }
}

function renderRoot(
    optionList: Option[],
    attributes: Attribute[],
    child: Element
): preact.JSX.Element {
    const options: OptionObject = optionsToObject(optionList);

    return toHtml(
        (s: Style[]) => embedStyle(options, s),
        element(asEl, div, attributes, Unkeyed([child]), options)
    );
}

function embedStyle(options: OptionObject, styles: Style[]): EmbedStyle {
    switch (options.mode) {
        case RenderMode.NoStaticStyleSheet:
            return OnlyDynamic(options, styles);

        default:
            return StaticRootAndDynamic(options, styles);
    }
}

const families: Font[] = [
    Typeface('Open Sans'),
    Typeface('Helvetica'),
    Typeface('Verdana'),
    SansSerif(),
];

const rootStyle: Attribute[] = [
    StyleClass(
        Flag.bgColor,
        Colored(
            `bg-${formatColorClass(0, 0, 1, 0, Notation.Hsla)}`,
            'background-color',
            Hsla(0, 0, 1, 0, Notation.Hsla)
        )
    ),
    StyleClass(
        Flag.fontColor,
        Colored(
            `fc-${formatColorClass(0, 0, 0, 1, Notation.Hsla)}`,
            'color',
            Hsla(0, 0, 0, 1, Notation.Hsla)
        )
    ),
    StyleClass(Flag.fontSize, FontSize(20)),
    StyleClass(
        Flag.fontFamily,
        FontFamily(
            families.reduce(
                (acc: string, font: Font) => renderFontClassName(font, acc),
                'font-'
            ),
            families
        )
    ),
];

function renderFontClassName(font: Font, current: string): string {
    switch (font.type) {
        case FontFamilyType.Serif:
            return current + 'serif';

        case FontFamilyType.SansSerif:
            return current + 'sans-serif';

        case FontFamilyType.Monospace:
            return current + 'monospace';

        case FontFamilyType.Typeface:
            if (isString(font))
                return current + font.name.toLowerCase().split(' ').join('-');
            return '';

        case FontFamilyType.ImportFont || FontFamilyType.FontWith:
            if (isPlainObject(font))
                return current + font.name.toLowerCase().split(' ').join('-');
            return '';

        default:
            return '';
    }
}

function renderFocusStyle(focus: FocusStyle): Style[] {
    function withDefault_(prop: Maybe<Property>) {
        return withDefault(Property('', ''), prop);
    }
    return [
        Style_(
            dot(cls.focusedWithin + ':focus-within'),
            [
                withDefault_(
                    map((color: Color): Property => {
                        const [a, b, c, d, e] = Object.values(color);
                        return Property(
                            'border-color',
                            formatColor(a, b, c, d, e)
                        );
                    }, focus.borderColor)
                ),
                withDefault_(
                    map((color: Color): Property => {
                        const [a, b, c, d, e] = Object.values(color);
                        return Property(
                            'background-color',
                            formatColor(a, b, c, d, e)
                        );
                    }, focus.backgroundColor)
                ),
                withDefault(
                    Property('', ''),
                    map(
                        (shadow: Shadow): Property =>
                            Property('box-shadow', formatBoxShadow(shadow)),
                        focus.shadow
                    )
                ),
                Property('outline', 'none'),
            ].flatMap((val) => val)
        ),
        Style_(
            `${dot(cls.any + ':focus .focusable, ')}${dot(
                cls.any + '.focusable:focus, '
            )}.ui-slide-bar:focus + ${dot(cls.any + ' .focusable-thumb')}`,
            [
                withDefault_(
                    map((color: Color): Property => {
                        const [a, b, c, d, e] = Object.values(color);
                        return Property(
                            'border-color',
                            formatColor(a, b, c, d, e)
                        );
                    }, focus.borderColor)
                ),
                withDefault_(
                    map((color: Color): Property => {
                        const [a, b, c, d, e] = Object.values(color);
                        return Property(
                            'background-color',
                            formatColor(a, b, c, d, e)
                        );
                    }, focus.backgroundColor)
                ),
                withDefault(
                    Property('', ''),
                    map(
                        (shadow: Shadow): Property =>
                            Property('box-shadow', formatBoxShadow(shadow)),
                        focus.shadow
                    )
                ),
                Property('outline', 'none'),
            ].flatMap((val) => val)
        ),
    ];
}

function optionsToObject(options: Option[]): OptionObject {
    function combine(
        opt: Option,
        object: {
            hover: Maybe<HoverSetting>;
            focus: Maybe<FocusStyle>;
            mode: Maybe<RenderMode>;
        }
    ): {
        hover: Maybe<HoverSetting>;
        focus: Maybe<FocusStyle>;
        mode: Maybe<RenderMode>;
    } {
        switch (opt.type) {
            case Options.HoverOption:
                switch (object.hover.type) {
                    case MaybeType.Nothing: {
                        object.hover = Just(opt.hover);
                        return object;
                    }

                    default:
                        return object;
                }

            case Options.FocusStyleOption:
                switch (object.focus.type) {
                    case MaybeType.Nothing: {
                        object.focus = Just(opt.focus);
                        return object;
                    }

                    default:
                        return object;
                }

            case Options.RenderModeOption:
                switch (object.mode.type) {
                    case MaybeType.Nothing: {
                        object.mode = Just(opt.mode);
                        return object;
                    }

                    default:
                        return object;
                }
        }
    }

    function andFinally(object: {
        hover: Maybe<HoverSetting>;
        focus: Maybe<FocusStyle>;
        mode: Maybe<RenderMode>;
    }): OptionObject {
        return OptionObject(
            (() => {
                switch (object.hover.type) {
                    case MaybeType.Nothing:
                        return HoverSetting.AllowHover;

                    case MaybeType.Just:
                        return object.hover.value;
                }
            })(),
            (() => {
                switch (object.focus.type) {
                    case MaybeType.Nothing:
                        return focusDefaultStyle;

                    case MaybeType.Just:
                        return object.focus.value;
                }
            })(),
            (() => {
                switch (object.mode.type) {
                    case MaybeType.Nothing:
                        return RenderMode.Layout;

                    case MaybeType.Just:
                        return object.mode.value;
                }
            })()
        );
    }

    return andFinally(
        options.reduceRight(
            (
                acc: {
                    hover: Maybe<HoverSetting>;
                    focus: Maybe<FocusStyle>;
                    mode: Maybe<RenderMode>;
                },
                opt: Option
            ): {
                hover: Maybe<HoverSetting>;
                focus: Maybe<FocusStyle>;
                mode: Maybe<RenderMode>;
            } => {
                return combine(opt, acc);
            },
            { hover: Nothing(), focus: Nothing(), mode: Nothing() }
        )
    );
}

function toStyleSheet(
    options: OptionObject,
    stylesheet: Style[]
): preact.JSX.Element {
    switch (options.mode) {
        case RenderMode.Layout:
            // wrap the style node in a div to prevent `Dark Reader` from blowin up the dom.
            return h(
                'div',
                null,
                h('style', null, toStyleSheetString(options, stylesheet))
            );

        case RenderMode.NoStaticStyleSheet:
            // wrap the style node in a div to prevent `Dark Reader` from blowin up the dom.
            return h(
                'div',
                null,
                h('style', null, toStyleSheetString(options, stylesheet))
            );

        case RenderMode.WithVirtualCss:
            return h(
                'espectro-rules',
                { style: encodeStyles(options, stylesheet) },
                ''
            );
    }
}

function renderTopLevelValues(rules: [string, Font[]][]): string {
    function withImport(font: Font): Maybe<string> {
        switch (font.type) {
            case FontFamilyType.ImportFont:
                return Just(`@import url('${font.url}');`);

            default:
                return Nothing();
        }
    }

    const allNames: string[] = rules.map((rule) => rule[0]);

    function fontImports([_name, typefaces]: [string, Font[]]): string {
        return typefaces.flatMap((typeface) => withImport(typeface)).join('\n');
    }

    function fontAdjustments([name, typefaces]: [string, Font[]]): string {
        const typefaceAdjustment_ = typefaceAdjustment(typefaces);
        switch (typefaceAdjustment_.type) {
            case MaybeType.Nothing:
                return allNames
                    .map((name_: string) =>
                        renderNullAdjustmentRule(name, name_)
                    )
                    .join('');

            case MaybeType.Just:
                return allNames
                    .map((name_: string) =>
                        renderFontAdjustmentRule(
                            name,
                            [
                                typefaceAdjustment_.value[0],
                                typefaceAdjustment_.value[1],
                            ],
                            name_
                        )
                    )
                    .join('');
        }
    }

    return (
        rules.map(fontImports).join('\n') +
        rules.map(fontAdjustments).join('\n')
    );
}

function renderNullAdjustmentRule(
    fontToAdjust: string,
    otherFontName: string
): string {
    const name: string =
        fontToAdjust === otherFontName
            ? fontToAdjust
            : `${otherFontName} .${fontToAdjust}`;
    return [
        bracket(
            `.${name}.${cls.sizeByCapital}, .${name} .${cls.sizeByCapital}`,
            [['line-height', '1']]
        ),
        bracket(
            `.${name}.${cls.sizeByCapital} > .${cls.text}, .${name} .${cls.sizeByCapital} > .${cls.text}`,
            [
                ['vertical-align', '0'],
                ['line-height', '1'],
            ]
        ),
    ].join(' ');
}

function fontRule(
    name: string,
    modifier: string,
    [parentAdj, textAdjustment]: [[string, string][], [string, string][]]
): string[] {
    return [
        bracket(`.${name}.${modifier}, .${name} .${modifier}`, parentAdj),
        bracket(
            `.${name}.${modifier} > .${cls.text}, .${name} .${modifier} > .${cls.text}`,
            textAdjustment
        ),
    ];
}

function renderFontAdjustmentRule(
    fontToAdjust: string,
    [full, capital]: [
        [[string, string][], [string, string][]],
        [[string, string][], [string, string][]]
    ],
    otherFontName: string
): string {
    const name: string =
        fontToAdjust === otherFontName
            ? fontToAdjust
            : `${otherFontName} .${fontToAdjust}`;
    return fontRule(name, cls.sizeByCapital, capital)
        .concat(fontRule(name, cls.fullSize, full))
        .join(' ');
}

function bracket(selector: string, rules: [string, string][]): string {
    function renderPair([name, value]: [string, string]) {
        return `${name}: ${value};`;
    }
    return `${selector} {${rules.map(renderPair).join('')}}`;
}

function fontAdjustmentRules(converted: {
    height: number;
    vertical: number;
    size: number;
}): [[string, string][], [string, string][]] {
    return [
        [['display', 'block']],
        [
            ['display', 'inline-block'],
            ['line-height', converted.height.toString()],
            ['vertical-align', converted.vertical.toString() + 'em'],
            ['font-size', converted.size.toString() + 'em'],
        ],
    ];
}

function typefaceAdjustment(
    typefaces: Font[]
): Maybe<[[string, string][], [string, string][]][]> {
    return typefaces.reduce(
        (
            found: Maybe<[[string, string][], [string, string][]][]>,
            face: Font
        ): Maybe<[[string, string][], [string, string][]][]> => {
            switch (found.type) {
                case MaybeType.Nothing:
                    switch (face.type) {
                        case FontFamilyType.FontWith:
                            switch (face.adjustment.type) {
                                case MaybeType.Nothing:
                                    return found;

                                case MaybeType.Just:
                                    return Just([
                                        fontAdjustmentRules(
                                            convertAdjustment(
                                                face.adjustment.value
                                            ).full
                                        ),
                                        fontAdjustmentRules(
                                            convertAdjustment(
                                                face.adjustment.value
                                            ).capital
                                        ),
                                    ]);
                            }
                            break;

                        default:
                            return found;
                    }
                    break;

                case MaybeType.Just:
                    return found;
            }
        },
        Nothing()
    );
}

function fontName(font: Font): string {
    switch (font.type) {
        case FontFamilyType.Serif:
            return 'serif';

        case FontFamilyType.SansSerif:
            return 'sans-serif';

        case FontFamilyType.Monospace:
            return 'monospace';

        case FontFamilyType.Typeface:
        case FontFamilyType.ImportFont:
        case FontFamilyType.FontWith:
            return `${font.name}`;

        default:
            return '';
    }
}

function topLevelValue(rule: Style): Maybe<[string, Font[]]> {
    switch (rule.type) {
        case Styles.FontFamily:
            return Just([rule.name, rule.typefaces]);

        default:
            return Nothing();
    }
}

function renderProps(
    force: boolean,
    property: Property,
    existing: string
): string {
    if (force)
        return `${existing}\n ${property.key}: ${property.value} !important;`;
    return `${existing}\n ${property.key}: ${property.value};`;
}

function encodeStyles(options: OptionObject, stylesheet: Style[]): string {
    const stylesheet_: [string, string][] = stylesheet.map((style: Style) => {
        const styled: string[] = renderStyleRule(options, style, Nothing());
        return [getStyleName(style), JSON.stringify(styled)];
    });
    return JSON.stringify(stylesheet_, (_key, val: [string, string]) => {
        const obj = { [val[0]]: val[1] };
        return obj;
    });
}

function toStyleSheetString(
    options: OptionObject,
    stylesheet: Style[]
): string {
    function combine(
        style: Style,
        rendered: { rules: string[]; topLevel: [string, Font[]][] }
    ): { rules: string[]; topLevel: [string, Font[]][] } {
        const topLevel: Maybe<[string, Font[]]> = topLevelValue(style);
        return {
            rules: rendered.rules.concat(
                renderStyleRule(options, style, Nothing())
            ),
            topLevel: (() => {
                switch (topLevel.type) {
                    case MaybeType.Nothing:
                        return rendered.topLevel;

                    case MaybeType.Just:
                        return [topLevel.value, ...rendered.topLevel];
                }
            })(),
        };
    }

    const rendered_: { rules: string[]; topLevel: [string, Font[]][] } =
        stylesheet.reduce(
            (
                acc: { rules: string[]; topLevel: [string, Font[]][] },
                style: Style
            ) => combine(style, acc),
            { rules: [], topLevel: [] }
        );
    const { rules, topLevel } = rendered_;

    if (rules.length > 0 || topLevel.length > 0)
        return renderTopLevelValues(topLevel) + rules.join('');
    return '';
}

function renderStyle(
    options: OptionObject,
    pseudo: Maybe<PseudoClass>,
    selector: string,
    props: Property[]
): string[] {
    switch (pseudo.type) {
        case MaybeType.Nothing:
            return [
                `${selector}{${props.reduce(
                    (acc: string, prop: Property): string =>
                        renderProps(false, prop, acc),
                    ''
                )}\n}`,
            ];

        case MaybeType.Just:
            switch (pseudo.value) {
                case PseudoClass.Hover:
                    switch (options.hover) {
                        case HoverSetting.NoHover:
                            return [];

                        case HoverSetting.ForceHover:
                            return [
                                `${selector}-hv {${props.reduce(
                                    (acc: string, prop: Property): string =>
                                        renderProps(true, prop, acc),
                                    ''
                                )}\n}`,
                            ];

                        case HoverSetting.AllowHover:
                            return [
                                `${selector}-hv:hover {${props.reduce(
                                    (acc: string, prop: Property): string =>
                                        renderProps(false, prop, acc),
                                    ''
                                )}\n}`,
                            ];
                    }
                    break;

                case PseudoClass.Focus: {
                    const renderedProps = props.reduce(
                        (acc: string, prop: Property): string =>
                            renderProps(false, prop, acc),
                        ''
                    );
                    return [
                        `${selector}-fs:focus {${renderedProps}\n}`,
                        `.${cls.any}:focus ${selector}-fs {${renderedProps}\n}`,
                        `${selector}-fs:focus-within {${renderedProps}\n}`,
                        `.ui-slide-bar:focus + ${dot(
                            cls.any + ' .focusable-thumb' + selector
                        )}-fs {${renderedProps}\n}`,
                    ];
                }

                case PseudoClass.Active:
                    return [
                        `${selector}-act:active {${props.reduce(
                            (acc: string, prop: Property): string =>
                                renderProps(false, prop, acc),
                            ''
                        )}\n}`,
                    ];
            }
    }
}

function renderStyleRule(
    options: OptionObject,
    rule: Style,
    pseudo: Maybe<PseudoClass>
): string[] {
    switch (rule.type) {
        case Styles.Style:
            return renderStyle(options, pseudo, rule.selector, rule.props);

        case Styles.Shadows:
            return renderStyle(options, pseudo, '.' + rule.name, [
                Property('box-shadow', rule.prop),
            ]);

        case Styles.Transparency: {
            const opacity: number = Math.max(
                0,
                Math.min(1, 1 - rule.transparency)
            );
            return renderStyle(options, pseudo, '.' + rule.name, [
                Property(
                    'opacity',
                    isNumber(opacity) ? opacity.toString() : '1'
                ),
            ]);
        }

        case Styles.FontSize:
            return renderStyle(options, pseudo, '.font-size-' + rule.i, [
                Property('font-size', rule.i + 'px'),
            ]);

        case Styles.FontFamily: {
            const features: string[] = rule.typefaces.flatMap((value: Font) => {
                return withDefault('', renderVariants(value));
            });
            const families: Property[] = [
                Property(
                    'font-family',
                    rule.typefaces.map(fontName).join(', ')
                ),
                features.length > 1
                    ? Property('font-feature-settings', features.join(', '))
                    : Property('font-feature-settings', 'unset'),
                Property(
                    'font-variant',
                    rule.typefaces.some(hasSmallCaps) ? 'small-caps' : 'normal'
                ),
            ];
            return renderStyle(options, pseudo, '.' + rule.name, families);
        }

        case Styles.Single:
            return renderStyle(options, pseudo, '.' + rule.class_, [
                Property(rule.prop, rule.value),
            ]);

        case Styles.Colored: {
            const [a, b, c, d, e] = Object.values(rule.color);
            return renderStyle(options, pseudo, '.' + rule.class_, [
                Property(rule.prop, formatColor(a, b, c, d, e)),
            ]);
        }

        case Styles.SpacingStyle: {
            const class_: string = '.' + rule.class_,
                halfX: string = rule.x / 2 + 'px',
                halfY: string = rule.y / 2 + 'px',
                xPx: string = rule.x + 'px',
                yPx: string = rule.y + 'px',
                row: string = '.' + cls.row,
                wrappedRow: string = '.' + cls.wrapped + row,
                column: string = '.' + cls.column,
                page: string = '.' + cls.page,
                paragraph: string = '.' + cls.paragraph,
                left: string = '.' + cls.alignLeft,
                right: string = '.' + cls.alignRight,
                any: string = '.' + cls.any;
            return renderStyle(
                options,
                pseudo,
                `${class_}${row} > ${any} + ${any}`,
                [Property('margin-left', xPx)]
            ).concat(
                // margins don't apply to last element of normal, unwrapped rows
                // renderStyle(
                //     options,
                //     pseudo,
                //     `${class_}${row} > ${any}:first-child`,
                //     [{ key: 'margin', value: '0' }]
                // For wrapped rows, margins always apply because we handle "canceling out" the other margins manually in the element.
                renderStyle(
                    options,
                    pseudo,
                    `${class_}${wrappedRow} > ${any}`,
                    [Property('margin', halfY + ' ' + halfX)]
                ),
                // renderStyle(
                //     options,
                //     pseudo,
                //     `${class_}${wrappedRow} > ${any}:last-child`,
                //     [{ key: 'margin-right', value: '0' }]
                // Columns
                renderStyle(
                    options,
                    pseudo,
                    `${class_}${column} > ${any} + ${any}`,
                    [Property('margin-top', yPx)]
                ),
                renderStyle(
                    options,
                    pseudo,
                    `${class_}${page} > ${any} + ${any}`,
                    [Property('margin-top', yPx)]
                ),
                renderStyle(options, pseudo, `${class_}${page} > ${left}`, [
                    Property('margin-right', xPx),
                ]),
                renderStyle(options, pseudo, `${class_}${page} > ${right}`, [
                    Property('margin-left', xPx),
                ]),
                renderStyle(options, pseudo, `${class_}${paragraph}`, [
                    Property('line-height', `calc(1em + ${rule.y}px)`),
                ]),
                renderStyle(options, pseudo, `textarea${any}${class_}`, [
                    Property('line-height', `calc(1em + ${rule.y}px)`),
                    Property('height', `calc(100% + ${rule.y}px)`),
                ]),
                // renderStyle(options, pseudo, `${class_}${paragraph} > ${any}`, [
                //     { key: 'margin-right', value: xPx },
                //     { key: 'margin-bottom', value: yPx },
                // ]),
                renderStyle(
                    options,
                    pseudo,
                    `${class_}${paragraph} > ${left}`,
                    [Property('margin-right', xPx)]
                ),
                renderStyle(
                    options,
                    pseudo,
                    `${class_}${paragraph} > ${right}`,
                    [Property('margin-left', xPx)]
                ),
                renderStyle(options, pseudo, `${class_}${paragraph}::after`, [
                    Property('content', `''`),
                    Property('display', `block`),
                    Property('height', `0`),
                    Property('width', `0`),
                    Property(
                        'margin-top',
                        Math.floor(-1 * (rule.y / 2)) + 'px'
                    ),
                ]),
                renderStyle(options, pseudo, `${class_}${paragraph}::before`, [
                    Property('content', `''`),
                    Property('display', `block`),
                    Property('height', `0`),
                    Property('width', `0`),
                    Property(
                        'margin-top',
                        Math.floor(-1 * (rule.y / 2)) + 'px'
                    ),
                ])
            );
        }

        case Styles.PaddingStyle:
            return renderStyle(options, pseudo, '.' + rule.class_, [
                Property(
                    'padding',
                    `${rule.top}px ${rule.right}px ${rule.bottom}px ${rule.left}px`
                ),
            ]);

        case Styles.BorderWidth:
            return renderStyle(options, pseudo, '.' + rule.class_, [
                Property(
                    'border-width',
                    `${rule.top}px ${rule.right}px ${rule.bottom}px ${rule.left}px`
                ),
            ]);

        case Styles.GridTemplateStyle: {
            const class_ = `.grid-rows-${rule.rows
                .map(lengthClassName)
                .join('-')}-cols-${rule.columns
                .map(lengthClassName)
                .join('-')}-space-x-${lengthClassName(
                rule.spacing[0]
            )}-space-y-${lengthClassName(rule.spacing[1])}`;

            const toGridLength = (x: Length): string =>
                toGridLengthHelper(Nothing(), Nothing(), x);
            const toGridLengthHelper = (
                minimum: Maybe<number>,
                maximum: Maybe<number>,
                x: Length
            ): string => {
                switch (x.type) {
                    case Lengths.Px:
                        return x.px + 'px';

                    case Lengths.Rem:
                        return x.rem + 'rem';

                    case Lengths.Content:
                        if (
                            minimum.type === MaybeType.Nothing &&
                            maximum.type === MaybeType.Nothing
                        )
                            return 'max-content';
                        if (
                            minimum.type === MaybeType.Just &&
                            maximum.type === MaybeType.Nothing
                        )
                            return `minmax(${minimum}px, max-content)`;
                        if (
                            minimum.type === MaybeType.Nothing &&
                            maximum.type === MaybeType.Just
                        )
                            return `minmax(max-content, ${maximum}px)`;
                        if (
                            minimum.type === MaybeType.Just &&
                            maximum.type === MaybeType.Just
                        )
                            return `minmax(${minimum}px, ${maximum}px)`;
                        break;

                    case Lengths.Fill:
                        if (
                            minimum.type === MaybeType.Nothing &&
                            maximum.type === MaybeType.Nothing
                        )
                            return x.i + 'fr';
                        if (
                            minimum.type === MaybeType.Just &&
                            maximum.type === MaybeType.Nothing
                        )
                            // TODO: Check frfr
                            return `minmax(${minimum}px, ${x.i}frfr)`;
                        if (
                            minimum.type === MaybeType.Nothing &&
                            maximum.type === MaybeType.Just
                        )
                            return `minmax(max-content, ${maximum}px)`;
                        if (
                            minimum.type === MaybeType.Just &&
                            maximum.type === MaybeType.Just
                        )
                            return `minmax(${minimum}px, ${maximum}px)`;
                        break;

                    case Lengths.Min:
                        return toGridLengthHelper(
                            Just(x.min),
                            maximum,
                            x.length
                        );

                    case Lengths.Max:
                        return toGridLengthHelper(
                            minimum,
                            Just(x.max),
                            x.length
                        );

                    case Lengths.MinContent:
                        return 'min-content';

                    case Lengths.MaxContent:
                        return 'max-content';
                }
                return '';
            };

            const ySpacing: string = toGridLength(rule.spacing[1]);
            const xSpacing: string = toGridLength(rule.spacing[0]);

            const msColumns = `-ms-grid-columns: ${rule.columns
                .map(toGridLength)
                .join(ySpacing)};`;
            const msRows = `-ms-grid-rows: ${rule.rows
                .map(toGridLength)
                .join(xSpacing)};`;
            const base = `${class_}{${msColumns}${msRows}}`;

            const columns = `grid-template-columns: ${rule.columns
                .map(toGridLength)
                .join(' ')};`;
            const rows = `grid-template-rows: ${rule.rows
                .map(toGridLength)
                .join(' ')};`;

            const gapX = `grid-column-gap:${toGridLength(rule.spacing[0])};`;
            const gapY = `grid-row-gap:${toGridLength(rule.spacing[1])};`;

            const modernGrid = `${class_}{${columns}${rows}${gapX}${gapY}}`;
            const supports = `@supports (display:grid) {${modernGrid}}`;

            return [base, supports];
        }

        case Styles.GridPosition: {
            const class_ = `.grid-pos-${rule.row}-${rule.column}-${rule.width}-${rule.height}`;
            const msPosition = [
                '-ms-grid-row: ' + rule.row + ';',
                '-ms-grid-row-span: ' + rule.height + ';',
                '-ms-grid-column: ' + rule.column + ';',
                '-ms-grid-column-span: ' + rule.width + ';',
            ].join(' ');
            const base = `${class_}{${msPosition}}`;

            const modernPosition = [
                'grid-row: ' +
                    rule.row +
                    ' / ' +
                    (rule.row + rule.height) +
                    ';',
                'grid-column: ' +
                    rule.column +
                    ' / ' +
                    (rule.column + rule.width) +
                    ';',
            ].join(' ');
            const modernGrid = `${class_}{${modernPosition}}`;
            const supports = `@supports (display:grid) {${modernGrid}}`;

            return [base, supports];
        }

        case Styles.PseudoSelector: {
            const renderPseudoRule = (style: Style): string[] =>
                renderStyleRule(options, style, Just(rule.class_));
            return rule.styles.flatMap((style: Style): string[] =>
                renderPseudoRule(style)
            );
        }

        case Styles.Transform: {
            const value: Maybe<string> = transformValue(rule.transform);
            const class_: Maybe<string> = transformClass(rule.transform);
            const cls_: string = withDefault('', class_);
            const v: string = withDefault('', value);
            if (class_.type === MaybeType.Just && value.type === MaybeType.Just)
                return renderStyle(options, pseudo, '.' + cls_, [
                    Property('transform', v),
                ]);
            return [];
        }
    }
}

function lengthClassName(x: Length): string {
    switch (x.type) {
        case Lengths.Px:
            return `${x.px}px`;

        case Lengths.Rem:
            return `${x.rem}rem`;

        case Lengths.Content:
            return `auto`;

        case Lengths.Fill:
            return `${x.i}fr`;

        case Lengths.Min:
            return `min${x.min}${lengthClassName(x)}`;

        case Lengths.Max:
            return `max${x.max}${lengthClassName(x)}`;

        case Lengths.MinContent:
            return `min-content`;

        case Lengths.MaxContent:
            return `max-content`;
    }
}

function formatDropShadow(shadow: Shadow): string {
    const [a, b, c, d, e] = Object.values(shadow.color);
    return `${shadow.offset[0]}px ${shadow.offset[1]}px ${floatClass(
        shadow.blur
    )}px ${formatColor(a, b, c, d, e)}`;
}

function formatTextShadow(shadow: Shadow): string {
    const [a, b, c, d, e] = Object.values(shadow.color);
    return `${shadow.offset[0]}px ${shadow.offset[1]}px ${floatClass(
        shadow.blur
    )}px ${formatColor(a, b, c, d, e)}`;
}

function textShadowClass(shadow: Shadow): string {
    const [a, b, c, d, e] = Object.values(shadow.color);
    return `txt${floatClass(shadow.offset[0])}px${floatClass(
        shadow.offset[1]
    )}px${floatClass(shadow.blur)}px${formatColorClass(a, b, c, d, e)}`;
}

function formatBoxShadow(shadow: Shadow): string {
    const [a, b, c, d, e] = Object.values(shadow.color);
    return `${shadow.inset ? 'inset' : ''} ${shadow.offset[0]}px ${
        shadow.offset[1]
    }px ${shadow.blur}px ${shadow.size}px ${formatColor(a, b, c, d, e)}`;
}

function boxShadowClass(shadow: Shadow): string {
    const [a, b, c, d, e] = Object.values(shadow.color);
    return `${shadow.inset ? 'box-inset' : 'box-'}${floatClass(
        shadow.offset[0]
    )}px${floatClass(shadow.offset[1])}px${floatClass(
        shadow.blur
    )}px${floatClass(shadow.size)}px${formatColorClass(a, b, c, d, e)}`;
}

function floatClass(x: number): string {
    return Math.round(x * 255).toString();
}

// TODO: Review colors format
function formatColor(
    a: number,
    b: number,
    c: number,
    d: number,
    type: Notation = Notation.Hsl
): string {
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
): string {
    switch (type) {
        case Notation.Hsl:
            return `${a}-${b * 100}-${c * 100}`;

        case Notation.Hsla:
            return `${a}-${b * 100}-${c * 100}-${d * 100}`;

        case Notation.Rgb:
            return `${floatClass(a)}-${floatClass(b)}-${floatClass(c)}`;

        case Notation.Rgba:
            return `${floatClass(a)}-${floatClass(b)}-${floatClass(
                c
            )}-${floatClass(d)}`;

        case Notation.Rgb255:
            return `${a}-${b}-${c}`;

        case Notation.Rgba255:
            return `${a}-${b}-${c}-${d * 100}`;
    }
}

function spacingName(x: number, y: number): string {
    return `spacing-${x}-${y}`;
}

function paddingName(
    top: number,
    right: number,
    bottom: number,
    left: number
): string {
    return `pad-${top}-${right}-${bottom}-${left}`;
}

function paddingNameFloat(
    top: number,
    right: number,
    bottom: number,
    left: number
): string {
    return `pad-${floatClass(top)}-${floatClass(right)}-${floatClass(
        bottom
    )}-${floatClass(left)}`;
}

function getStyleName(style: Style): string {
    function name(selector: PseudoClass): string {
        switch (selector) {
            case PseudoClass.Focus:
                return 'fs';

            case PseudoClass.Hover:
                return 'hv';

            case PseudoClass.Active:
                return 'act';
        }
    }

    switch (style.type) {
        case Styles.Style:
            return style.selector;

        case Styles.FontFamily:
            return style.name;

        case Styles.FontSize:
            return `font-size-${style.i}`;

        case Styles.Single:
            return style.class_;

        case Styles.Colored:
            return style.class_;

        case Styles.SpacingStyle:
            return style.class_;

        case Styles.BorderWidth:
            return style.class_;

        case Styles.PaddingStyle:
            return style.class_;

        case Styles.GridTemplateStyle:
            return `grid-rows-${style.rows
                .map(lengthClassName)
                .join('-')}-cols-${style.columns
                .map(lengthClassName)
                .join('-')}-space-x-${lengthClassName(
                style.spacing[0]
            )}-space-y-${lengthClassName(style.spacing[1])}`;

        case Styles.GridPosition:
            return `gp grid-pos-${style.row}-${style.column}-${style.width}-${style.height}`;

        case Styles.Transform: {
            return withDefault('', transformClass(style.transform));
        }

        case Styles.PseudoSelector: {
            return style.styles
                .map((sty: Style) => {
                    switch (getStyleName(sty)) {
                        case '':
                            return '';

                        default:
                            return `${getStyleName(sty)}-${name(style.class_)}`;
                    }
                })
                .join(' ');
        }

        case Styles.Transparency:
            return style.name;

        case Styles.Shadows:
            return style.name;
    }
}

// Mapping

function unwrapDecorations(attrs: Attribute[]): Style[] {
    const [styles, transform]: [Style[], Transformation] = attrs.reduce(
        ([styles_, trans]: [Style[], Transformation], attr: Attribute) =>
            unwrapDecsHelper(attr, [styles_, trans]),
        [[], Untransformed()]
    );
    return [Transform(transform), ...styles];
}

function unwrapDecsHelper(
    attr: Attribute,
    [styles, trans]: [Style[], Transformation]
): [Style[], Transformation] {
    switch (attr.type) {
        case Attributes.StyleClass:
            return [[attr.style, ...styles], trans];

        case Attributes.TransformComponent:
            return [styles, composeTransformation(trans, attr.component)];

        default:
            return [styles, trans];
    }
}

// Font Adjustments

function convertAdjustment(adjustment: Adjustment): {
    full: {
        vertical: number;
        height: number;
        size: number;
    };
    capital: {
        vertical: number;
        height: number;
        size: number;
    };
} {
    const lines: number[] = [
            adjustment.capital,
            adjustment.baseline,
            adjustment.descender,
            adjustment.lowercase,
        ],
        // lineHeight: number = 1.5,
        // base: number = lineHeight,
        // normalDescender: number = (lineHeight - 1) / 2,
        // oldMiddle: number = lineHeight / 2,
        ascender: number =
            Math.max(...lines) === undefined
                ? adjustment.capital
                : Math.max(...lines),
        descender: number =
            Math.min(...lines) === undefined
                ? adjustment.descender
                : Math.min(...lines),
        baseLine: number = Math.min(
            ...lines.filter((value: number) => value !== descender)
        ),
        newBaseLine: number =
            baseLine === undefined ? adjustment.baseline : baseLine,
        // newCapitalMiddle: number = (ascender - newBaseLine) / 2 + newBaseLine,
        // newFullMiddle: number = (ascender - descender) / 2 + descender,
        capitalVertical: number = isNumber(ascender) ? 1 - ascender : 0,
        capitalSize: number = isNumber(ascender)
            ? 1 / (ascender - newBaseLine)
            : 0,
        fullSize: number =
            isNumber(ascender) && isNumber(descender)
                ? 1 / (ascender - descender)
                : 0,
        // TODO: Same as capitalVertical
        fullVertical: number = isNumber(ascender) ? 1 - ascender : 0;

    return {
        full: adjust(
            fullSize,
            isNumber(ascender) && isNumber(descender)
                ? ascender - descender
                : 0,
            fullVertical
        ),
        capital: adjust(
            capitalSize,
            isNumber(ascender) ? ascender - newBaseLine : 0,
            capitalVertical
        ),
    };
}

function adjust(
    size: number,
    height: number,
    vertical: number
): {
    vertical: number;
    height: number;
    size: number;
} {
    return {
        vertical: vertical,
        height: height / size,
        size: size,
    };
}

export {
    addNodeName,
    alignXName,
    alignYName,
    boxShadowClass,
    columnClass,
    composeTransformation,
    contextClasses,
    createElement,
    div,
    element,
    embedKeyed,
    embedWith,
    filter,
    extractSpacingAndPadding,
    finalizeNode,
    floatClass,
    focusDefaultStyle,
    formatBoxShadow,
    formatColor,
    formatColorClass,
    formatDropShadow,
    formatTextShadow,
    gatherAttrRecursive,
    get,
    getHeight,
    getLength,
    getSpacing,
    getStyleName,
    getWidth,
    gridClass,
    htmlClass,
    lengthClassName,
    map,
    noStyleSheet,
    optionsToObject,
    paddingName,
    paddingNameFloat,
    pageClass,
    paragraphClass,
    reduceStyles,
    renderFontClassName,
    renderHeight,
    renderRoot,
    renderVariant,
    renderWidth,
    rootStyle,
    rowClass,
    singleClass,
    spacingName,
    textShadowClass,
    toHtml,
    toStyleSheet,
    transformClass,
    unstyled,
    unwrapDecorations,
    variantName,
};

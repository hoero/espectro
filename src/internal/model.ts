import { DOM } from '../deps.ts';
import { elmish } from '../deps.ts';
import _ from 'lodash';

import {
    Field,
    Flag,
    bgColor,
    fontColor,
    fontSize,
    fontFamily,
    present,
    xAlign,
    yAlign,
    add,
    centerX,
    centerY,
    alignRight,
    alignBottom,
    borderWidth,
    width,
    widthContent,
    widthFill,
    none,
    widthBetween,
    heightContent,
    heightFill,
    heightBetween,
    merge,
    height,
} from './flag.ts';
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
    asParagraph,
    OptionObject,
    FocusStyle,
    Style_,
    Property,
    Option,
    HoverSetting,
    Adjustment,
    Maybe,
    RenderMode,
    Rgba,
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
} from './data.ts';
import { attribute, attributes } from '../dom/attribute.ts';
import domElement from '../dom/element.ts';

const { Just, Nothing, map, withDefault } = elmish.Maybe;

const noStyleSheet = NoStyleSheet();

function renderVariant(variant: Variant): string {
    switch (variant.type) {
        case Variants.VariantActive:
            if (_.isString(variant.name)) {
                return `\'${variant.name}\'`;
            }
            return '';

        case Variants.VariantOff:
            if (_.isString(variant.name)) {
                return `\'${variant.name}\' 0`;
            }
            return '';

        case Variants.VariantIndexed:
            if (_.isObject(variant)) {
                return `\'${variant.name}\' ${variant.index}`;
            }
            return '';
    }
}

function variantName(variant: Variant): string {
    switch (variant.type) {
        case Variants.VariantActive:
            if (_.isString(variant.name)) {
                return variant.name;
            }
            return '';

        case Variants.VariantOff:
            if (_.isString(variant.name)) {
                return `${variant.name}-0`;
            }
            return '';

        case Variants.VariantIndexed:
            if (_.isObject(variant)) {
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
            if (_.isString(variant.name)) {
                return variant.name === 'smcp';
            }
            return false;

        case Variants.VariantOff:
            return false;

        case Variants.VariantIndexed:
            if (_.isObject(variant)) {
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
    return Attr(attribute('class', cls));
}

function unstyled(node: DOM.Node): Element {
    return Unstyled(() => node);
}

function finalizeNode(
    has: Field,
    node: NodeName,
    attributes: DOM.Attr[],
    children: Children<DOM.Node>,
    embedMode: EmbedStyle,
    parentContext: LayoutContext
): DOM.Node {
    const attributes_: [string, string][] = attributes.map((x: DOM.Attr) => [
        x.name,
        x.value,
    ]);
    const html: DOM.Node = (() => {
        switch (node.type) {
            case NodeNames.Generic:
                return createNode('div', attributes_);

            case NodeNames.NodeName:
                return createNode(node.nodeName, attributes_);

            case NodeNames.Embedded: {
                const el = domElement(node.nodeName, attributes_);
                const child = domElement(
                    node.internal,
                    [['class', cls.any + ' ' + cls.single]],
                    el
                );
                el.append(child);
                return el;
            }
        }
    })();

    function createNode(nodeName: string, attrs: [string, string][]): DOM.Node {
        switch (children.type) {
            case Childrens.Keyed: {
                const keyedNode = domElement(nodeName, attrs);
                const child = (embedMode: EmbedStyle): [string, DOM.Node][] => {
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

                child(embedMode).map((value: [string, DOM.Node]) => {
                    const html = domElement(value[0], [], keyedNode);
                    html.append(value[1]);
                    keyedNode.append(html);
                });
                return keyedNode;
            }

            case Childrens.Unkeyed: {
                const unkeyedNode: DOM.Element = (() => {
                    switch (nodeName) {
                        case 'div':
                            return domElement('div', attrs);

                        case 'p':
                            return domElement('p', attrs);

                        default:
                            return domElement(nodeName, attrs);
                    }
                })();
                const child = (embedMode: EmbedStyle): DOM.Node[] => {
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

                child(embedMode).map((value: DOM.Node) =>
                    unkeyedNode.append(value)
                );
                return unkeyedNode;
            }
        }
    }

    switch (parentContext) {
        case LayoutContext.AsRow:
            if (present(widthFill, has) && !present(widthBetween, has)) {
                return html;
            } else if (present(alignRight, has)) {
                const el = domElement('u', [
                    [
                        'class',
                        [
                            cls.any,
                            cls.single,
                            cls.container,
                            cls.contentCenterY,
                            cls.alignContainerRight,
                        ].join(' '),
                    ],
                ]);
                el.append(html);
                return el;
            } else if (present(centerX, has)) {
                const el = domElement('s', [
                    [
                        'class',
                        [
                            cls.any,
                            cls.single,
                            cls.container,
                            cls.contentCenterY,
                            cls.alignContainerCenterX,
                        ].join(' '),
                    ],
                ]);
                el.append(html);
                return el;
            } else {
                return html;
            }

        case LayoutContext.AsColumn:
            if (present(heightFill, has) && !present(heightBetween, has)) {
                return html;
            } else if (present(centerY, has)) {
                const el = domElement('s', [
                    [
                        'class',
                        [
                            cls.any,
                            cls.single,
                            cls.container,
                            cls.alignContainerCenterY,
                        ].join(' '),
                    ],
                ]);
                el.append(html);
                return el;
            } else if (present(alignBottom, has)) {
                const el = domElement('u', [
                    [
                        'class',
                        [
                            cls.any,
                            cls.single,
                            cls.container,
                            cls.alignContainerBottom,
                        ].join(' '),
                    ],
                ]);
                el.append(html);
                return el;
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
    children: DOM.Node[]
): DOM.Node[] {
    const dinamicStyleSheet: DOM.Node = toStyleSheet(
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
    children: [string, DOM.Node][]
): [string, DOM.Node][] {
    const dinamicStyleSheet: DOM.Node = toStyleSheet(
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

function addNodeName(newNode: string, old: NodeName): NodeName {
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
            return `${cls.alignedHorizontally} ${cls.alignTop}`;

        case VAlign.CenterY:
            return `${cls.alignedHorizontally} ${cls.alignCenterY}`;

        case VAlign.Bottom:
            return `${cls.alignedHorizontally} ${cls.alignBottom}`;
    }
}

function transformClass(transform: Transformation): Maybe<string> {
    switch (transform.type) {
        case Transformations.Untransformed:
            return Nothing();

        case Transformations.Moved:
            if (_.isArray(transform.xyz)) {
                return Just(
                    `mv-${floatClass(transform.xyz[0])}-${floatClass(
                        transform.xyz[1]
                    )}-${floatClass(transform.xyz[2])}`
                );
            }
            break;

        case Transformations.FullTransform:
            if (_.isObject(transform) && !_.isArray(transform)) {
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
            break;
    }
    return Just('');
}

function transformValue(transform: Transformation): Maybe<string> {
    switch (transform.type) {
        case Transformations.Untransformed:
            return Nothing();

        case Transformations.Moved:
            if (_.isArray(transform.xyz)) {
                return Just(
                    `translate3d(${transform.xyz[0]}px, ${transform.xyz[1]}px, ${transform.xyz[2]}px)`
                );
            }
            break;

        case Transformations.FullTransform:
            if (_.isObject(transform) && !_.isArray(transform)) {
                const translate = `translate3d(${transform.translate[0]}px, ${transform.translate[1]}px, ${transform.translate[2]}px)`;
                const scale = `scale3d(${transform.scale[0]}px, ${transform.scale[1]}px, ${transform.scale[2]}px)`;
                const rotate = `rotate3d(${transform.rotate[0]}px, ${transform.rotate[1]}px, ${transform.rotate[2]}px)`;
                return Just(`${translate} ${scale} ${rotate}`);
            }
            break;
    }
    return Just('');
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
            if (_.isArray(transform.xyz)) {
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
            if (_.isObject(transform) && !_.isArray(transform)) {
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

function skippable(flag: Flag, style: Style) {
    if (flag === borderWidth) {
        switch (style.type) {
            case Styles.Single:
                switch (style.value) {
                    case '0px':
                        return true;

                    case '1px':
                        return true;

                    case '2px':
                        return true;

                    case '3px':
                        return true;

                    case '4px':
                        return true;

                    case '5px':
                        return true;

                    case '6px':
                        return true;

                    default:
                        return false;
                }

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
    has: Field,
    transform: Transformation,
    styles: Style[],
    attrs: DOM.Attr[],
    children: NearbyChildren,
    elementAttrs: Attribute[]
): Gathered {
    switch (elementAttrs) {
        case []:
            switch (transformClass(transform)) {
                case Nothing():
                    return Gathered(
                        node,
                        [attribute('class', classes), ...attributes(attrs)],
                        styles,
                        children,
                        has
                    );

                default: {
                    const class_ = transformClass(transform);
                    return Gathered(
                        node,
                        [
                            attribute('class', `${classes} ${class_}`),
                            ...attributes(attrs),
                        ],
                        [Transform(transform), ...styles],
                        children,
                        has
                    );
                }
            }

        default:
            for (const attr of elementAttrs) {
                switch (attr.type) {
                    case Attributes.NoAttribute:
                        return gatherAttrRecursive(
                            classes,
                            node,
                            has,
                            transform,
                            styles,
                            attrs,
                            children,
                            elementAttrs.filter(
                                (attr_) => attr_.type !== attr.type
                            )
                        );

                    case Attributes.Attr:
                        return gatherAttrRecursive(
                            classes,
                            node,
                            has,
                            transform,
                            styles,
                            [attr.attr, ...attrs],
                            children,
                            elementAttrs.filter(
                                (attr_) => attr_.type !== attr.type
                            )
                        );

                    case Attributes.Describe:
                        switch (attr.description.type) {
                            case Descriptions.Main:
                                return gatherAttrRecursive(
                                    classes,
                                    addNodeName('main', node),
                                    has,
                                    transform,
                                    styles,
                                    attrs,
                                    children,
                                    elementAttrs.filter(
                                        (attr_) => attr_.type !== attr.type
                                    )
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
                                    elementAttrs.filter(
                                        (attr_) => attr_.type !== attr.type
                                    )
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
                                    elementAttrs.filter(
                                        (attr_) => attr_.type !== attr.type
                                    )
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
                                    elementAttrs.filter(
                                        (attr_) => attr_.type !== attr.type
                                    )
                                );

                            case Descriptions.Heading:
                                if (attr.description.i <= 1) {
                                    return gatherAttrRecursive(
                                        classes,
                                        addNodeName('h1', node),
                                        has,
                                        transform,
                                        styles,
                                        attrs,
                                        children,
                                        elementAttrs.filter(
                                            (attr_) => attr_.type !== attr.type
                                        )
                                    );
                                } else if (attr.description.i < 7) {
                                    return gatherAttrRecursive(
                                        classes,
                                        addNodeName(
                                            `h${attr.description.i}`,
                                            node
                                        ),
                                        has,
                                        transform,
                                        styles,
                                        attrs,
                                        children,
                                        elementAttrs.filter(
                                            (attr_) => attr_.type !== attr.type
                                        )
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
                                        elementAttrs.filter(
                                            (attr_) => attr_.type !== attr.type
                                        )
                                    );
                                }

                            case Descriptions.Label:
                                return gatherAttrRecursive(
                                    classes,
                                    node,
                                    has,
                                    transform,
                                    styles,
                                    [
                                        attribute(
                                            'aria-label',
                                            attr.description.label
                                        ),
                                        ...attrs,
                                    ],
                                    children,
                                    elementAttrs.filter(
                                        (attr_) => attr_.type !== attr.type
                                    )
                                );

                            case Descriptions.LivePolite:
                                return gatherAttrRecursive(
                                    classes,
                                    node,
                                    has,
                                    transform,
                                    styles,
                                    [
                                        attribute('aria-live', 'polite'),
                                        ...attrs,
                                    ],
                                    children,
                                    elementAttrs.filter(
                                        (attr_) => attr_.type !== attr.type
                                    )
                                );

                            case Descriptions.LiveAssertive:
                                return gatherAttrRecursive(
                                    classes,
                                    node,
                                    has,
                                    transform,
                                    styles,
                                    [
                                        attribute('aria-live', 'assertive'),
                                        ...attrs,
                                    ],
                                    children,
                                    elementAttrs.filter(
                                        (attr_) => attr_.type !== attr.type
                                    )
                                );

                            case Descriptions.Button:
                                return gatherAttrRecursive(
                                    classes,
                                    node,
                                    has,
                                    transform,
                                    styles,
                                    [attribute('role', 'button'), ...attrs],
                                    children,
                                    elementAttrs.filter(
                                        (attr_) => attr_.type !== attr.type
                                    )
                                );

                            case Descriptions.Paragraph:
                                /**
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
                                    elementAttrs.filter(
                                        (attr_) => attr_.type !== attr.type
                                    )
                                );
                        }
                        break;

                    case Attributes.Class:
                        if (present(attr.flag, has)) {
                            return gatherAttrRecursive(
                                classes,
                                node,
                                has,
                                transform,
                                styles,
                                attrs,
                                children,
                                elementAttrs.filter(
                                    (attr_) => attr_.type !== attr.type
                                )
                            );
                        }

                        return gatherAttrRecursive(
                            `${attr.class_} ${classes}`,
                            node,
                            add(attr.flag, has),
                            transform,
                            styles,
                            attrs,
                            children,
                            elementAttrs.filter(
                                (attr_) => attr_.type !== attr.type
                            )
                        );

                    case Attributes.StyleClass:
                        if (present(attr.flag, has)) {
                            return gatherAttrRecursive(
                                classes,
                                node,
                                has,
                                transform,
                                styles,
                                attrs,
                                children,
                                elementAttrs.filter(
                                    (attr_) => attr_.type !== attr.type
                                )
                            );
                        } else if (skippable(attr.flag, attr.style)) {
                            return gatherAttrRecursive(
                                `${getStyleName(attr.style)} ${classes}`,
                                node,
                                add(attr.flag, has),
                                transform,
                                styles,
                                attrs,
                                children,
                                elementAttrs.filter(
                                    (attr_) => attr_.type !== attr.type
                                )
                            );
                        } else {
                            return gatherAttrRecursive(
                                `${getStyleName(attr.style)} ${classes}`,
                                node,
                                add(attr.flag, has),
                                transform,
                                [attr.style, ...styles],
                                attrs,
                                children,
                                elementAttrs.filter(
                                    (attr_) => attr_.type !== attr.type
                                )
                            );
                        }

                    case Attributes.AlignY: {
                        if (present(yAlign, has)) {
                            return gatherAttrRecursive(
                                classes,
                                node,
                                has,
                                transform,
                                styles,
                                attrs,
                                children,
                                elementAttrs.filter(
                                    (attr_) => attr_.type !== attr.type
                                )
                            );
                        }

                        const flags: Field = add(yAlign, has);
                        const align: VAlign = attr.y;

                        const has_ = (): Field => {
                            switch (align) {
                                case VAlign.CenterY:
                                    return add(centerY, flags);

                                case VAlign.Bottom:
                                    return add(alignBottom, flags);

                                default:
                                    return flags;
                            }
                        };

                        return gatherAttrRecursive(
                            `${alignYName(attr.y)} ${classes}`,
                            node,
                            has_(),
                            transform,
                            styles,
                            attrs,
                            children,
                            elementAttrs.filter(
                                (attr_) => attr_.type !== attr.type
                            )
                        );
                    }

                    case Attributes.AlignX: {
                        if (present(xAlign, has)) {
                            return gatherAttrRecursive(
                                classes,
                                node,
                                has,
                                transform,
                                styles,
                                attrs,
                                children,
                                elementAttrs.filter(
                                    (attr_) => attr_.type !== attr.type
                                )
                            );
                        }

                        const flags: Field = add(xAlign, has);
                        const align: HAlign = attr.x;

                        const has_ = (): Field => {
                            switch (align) {
                                case HAlign.CenterX:
                                    return add(centerX, flags);

                                case HAlign.Right:
                                    return add(alignRight, flags);

                                default:
                                    return flags;
                            }
                        };

                        return gatherAttrRecursive(
                            `${alignXName(attr.x)} ${classes}`,
                            node,
                            has_(),
                            transform,
                            styles,
                            attrs,
                            children,
                            elementAttrs.filter(
                                (attr_) => attr_.type !== attr.type
                            )
                        );
                    }

                    case Attributes.Width:
                        if (present(width, has)) {
                            return gatherAttrRecursive(
                                classes,
                                node,
                                has,
                                transform,
                                styles,
                                attrs,
                                children,
                                elementAttrs.filter(
                                    (attr_) => attr_.type !== attr.type
                                )
                            );
                        }

                        switch (attr.width.type) {
                            case Lengths.Px:
                                return gatherAttrRecursive(
                                    `${cls.widthExact} width-px-${attr.width.px} ${classes}`,
                                    node,
                                    add(width, has),
                                    transform,
                                    [
                                        Single(
                                            `width-px-${attr.width.px}`,
                                            'width',
                                            `${attr.width.px}px`
                                        ),
                                        ...styles,
                                    ],
                                    attrs,
                                    children,
                                    elementAttrs.filter(
                                        (attr_) => attr_.type !== attr.type
                                    )
                                );

                            case Lengths.Rem:
                                return gatherAttrRecursive(
                                    `${cls.widthExact} width-rem-${attr.width.rem} ${classes}`,
                                    node,
                                    add(width, has),
                                    transform,
                                    [
                                        Single(
                                            `width-rem-${attr.width.rem}`,
                                            'width',
                                            `${attr.width.rem}rem`
                                        ),
                                        ...styles,
                                    ],
                                    attrs,
                                    children,
                                    elementAttrs.filter(
                                        (attr_) => attr_.type !== attr.type
                                    )
                                );

                            case Lengths.Content:
                                return gatherAttrRecursive(
                                    `${classes} ${cls.widthContent}`,
                                    node,
                                    add(widthContent, add(width, has)),
                                    transform,
                                    styles,
                                    attrs,
                                    children,
                                    elementAttrs.filter(
                                        (attr_) => attr_.type !== attr.type
                                    )
                                );

                            case Lengths.Fill:
                                if (attr.width.i === 1) {
                                    return gatherAttrRecursive(
                                        `${classes} ${cls.widthFill}`,
                                        node,
                                        add(widthFill, add(width, has)),
                                        transform,
                                        styles,
                                        attrs,
                                        children,
                                        elementAttrs.filter(
                                            (attr_) => attr_.type !== attr.type
                                        )
                                    );
                                }

                                return gatherAttrRecursive(
                                    `${classes} ${cls.widthFillPortion} width-fill-${attr.width.i}`,
                                    node,
                                    add(widthFill, add(width, has)),
                                    transform,
                                    [
                                        Single(
                                            `${cls.any}.${cls.row} > ${dot(
                                                `width-fill-${attr.width.i}`
                                            )}`,
                                            'flex-grow',
                                            `${attr.width.i * 100000}`
                                        ),
                                        ...styles,
                                    ],
                                    attrs,
                                    children,
                                    elementAttrs.filter(
                                        (attr_) => attr_.type !== attr.type
                                    )
                                );

                            default: {
                                const [addToFlags, newClass, newStyles] =
                                    renderWidth(attr.width);
                                return gatherAttrRecursive(
                                    `${classes} ${newClass}`,
                                    node,
                                    merge(addToFlags, add(width, has)),
                                    transform,
                                    [...newStyles, ...styles],
                                    attrs,
                                    children,
                                    elementAttrs.filter(
                                        (attr_) => attr_.type !== attr.type
                                    )
                                );
                            }
                        }

                    case Attributes.Height:
                        if (present(height, has)) {
                            return gatherAttrRecursive(
                                classes,
                                node,
                                has,
                                transform,
                                styles,
                                attrs,
                                children,
                                elementAttrs.filter(
                                    (attr_) => attr_.type !== attr.type
                                )
                            );
                        }

                        switch (attr.height.type) {
                            case Lengths.Px:
                                return gatherAttrRecursive(
                                    `${cls.heightExact} height-px-${attr.height.px} ${classes}`,
                                    node,
                                    add(height, has),
                                    transform,
                                    [
                                        Single(
                                            `height-px-${attr.height.px}`,
                                            'height',
                                            `${attr.height.px}px`
                                        ),
                                        ...styles,
                                    ],
                                    attrs,
                                    children,
                                    elementAttrs.filter(
                                        (attr_) => attr_.type !== attr.type
                                    )
                                );

                            case Lengths.Rem:
                                return gatherAttrRecursive(
                                    `${cls.heightExact} height-rem-${attr.height.rem} ${classes}`,
                                    node,
                                    add(height, has),
                                    transform,
                                    [
                                        Single(
                                            `height-rem-${attr.height.rem}`,
                                            'height',
                                            `${attr.height.rem}rem`
                                        ),
                                        ...styles,
                                    ],
                                    attrs,
                                    children,
                                    elementAttrs.filter(
                                        (attr_) => attr_.type !== attr.type
                                    )
                                );

                            case Lengths.Content:
                                return gatherAttrRecursive(
                                    `${classes} ${cls.heightContent}`,
                                    node,
                                    add(heightContent, add(height, has)),
                                    transform,
                                    styles,
                                    attrs,
                                    children,
                                    elementAttrs.filter(
                                        (attr_) => attr_.type !== attr.type
                                    )
                                );

                            case Lengths.Fill:
                                if (attr.height.i === 1) {
                                    return gatherAttrRecursive(
                                        `${classes} ${cls.heightFill}`,
                                        node,
                                        add(heightFill, add(height, has)),
                                        transform,
                                        styles,
                                        attrs,
                                        children,
                                        elementAttrs.filter(
                                            (attr_) => attr_.type !== attr.type
                                        )
                                    );
                                }

                                return gatherAttrRecursive(
                                    `${classes} ${cls.heightFillPortion} height-fill-${attr.height.i}`,
                                    node,
                                    add(heightFill, add(height, has)),
                                    transform,
                                    [
                                        Single(
                                            `${cls.any}.${cls.row} > ${dot(
                                                `height-fill-${attr.height.i}`
                                            )}`,
                                            'flex-grow',
                                            `${attr.height.i * 100000}`
                                        ),
                                        ...styles,
                                    ],
                                    attrs,
                                    children,
                                    elementAttrs.filter(
                                        (attr_) => attr_.type !== attr.type
                                    )
                                );

                            default: {
                                const [addToFlags, newClass, newStyles] =
                                    renderHeight(attr.height);
                                return gatherAttrRecursive(
                                    `${classes} ${newClass}`,
                                    node,
                                    merge(addToFlags, add(width, has)),
                                    transform,
                                    [...newStyles, ...styles],
                                    attrs,
                                    children,
                                    elementAttrs.filter(
                                        (attr_) => attr_.type !== attr.type
                                    )
                                );
                            }
                        }

                    case Attributes.Nearby:
                        return gatherAttrRecursive(
                            classes,
                            node,
                            has,
                            transform,
                            styles,
                            attrs,
                            addNearbyElement(
                                attr.location,
                                attr.element,
                                children
                            ),
                            elementAttrs.filter(
                                (attr_) => attr_.type !== attr.type
                            )
                        );

                    case Attributes.TransformComponent:
                        return gatherAttrRecursive(
                            classes,
                            node,
                            add(attr.flag, has),
                            composeTransformation(transform, attr.component),
                            styles,
                            attrs,
                            children,
                            elementAttrs.filter(
                                (attr_) => attr_.type !== attr.type
                            )
                        );
                }
            }
    }
    return Gathered(
        node,
        [attribute('class', classes), ...attributes(attrs)],
        styles,
        children,
        has
    );
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

function nearbyElement(location: Location, element_: Element): DOM.Element {
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
                return new DOM.Text('');

            case Elements.Text:
                return textElement(TextElement.Text, element_.str);

            case Elements.Unstyled:
                return element_.html(asEl);

            case Elements.Styled:
                return element_.html(NoStyleSheet(), asEl);
        }
    }

    const el = domElement('div', [['class', classes_(location)]]);
    el.append(child(element_));

    return el;
}

function renderWidth(w: Length): [Field, string, Style[]] {
    switch (w.type) {
        case Lengths.Px:
            return [
                none,
                `${cls.widthExact} width-px-${w.px}`,
                [Single(`width-px-${w.px}`, 'width', `${w.px}px`)],
            ];

        case Lengths.Rem:
            return [
                none,
                `${cls.widthExact} width-rem-${w.rem}`,
                [Single(`width-rem-${w.rem}`, 'width', `${w.rem}rem`)],
            ];

        case Lengths.Content:
            return [add(widthContent, none), cls.widthContent, []];

        case Lengths.Fill:
            if (w.i === 1) {
                return [add(widthFill, none), cls.widthFill, []];
            }

            return [
                add(widthFill, none),
                `${cls.widthFillPortion} width-fill-${w.i}`,
                [
                    Single(
                        `${cls.any}.${cls.row} > ${dot(`width-fill-${w.i}`)}`,
                        'flex-grow',
                        `${w.i * 100000}`
                    ),
                ],
            ];

        case Lengths.Min: {
            const minCls = `min-width-${w.min}`,
                minStyle = Single(minCls, 'min-width', `${w.min}px`),
                [minFlag, minAttrs, newMinStyle] = renderWidth(w.length);

            return [
                add(widthBetween, minFlag),
                `${minCls} ${minAttrs}`,
                [minStyle, ...newMinStyle],
            ];
        }

        case Lengths.Max: {
            const max = `max-width-${w.max}`,
                maxStyle = Single(max, 'max-width', `${w.max}px`),
                [maxFlag, maxAttrs, newMaxStyle] = renderWidth(w.length);

            return [
                add(widthBetween, maxFlag),
                `${max} ${maxAttrs}`,
                [maxStyle, ...newMaxStyle],
            ];
        }

        case Lengths.MinContent:
            return [
                none,
                'min-width',
                [Single('min-width', 'min-width', 'min-content')],
            ];

        case Lengths.MaxContent:
            return [
                none,
                'max-width',
                [Single('max-width', 'max-width', 'max-content')],
            ];
    }
}

function renderHeight(h: Length): [Field, string, Style[]] {
    switch (h.type) {
        case Lengths.Px:
            return [
                none,
                `${cls.heightExact} height-px-${h.px}`,
                [Single(`height-px-${h.px}`, 'height', `${h.px}px`)],
            ];

        case Lengths.Rem:
            return [
                none,
                `${cls.heightExact} height-rem-${h.rem}`,
                [Single(`height-rem-${h.rem}`, 'height', `${h.rem}rem`)],
            ];

        case Lengths.Content:
            return [add(heightContent, none), cls.heightContent, []];

        case Lengths.Fill:
            if (h.i === 1) {
                return [add(heightFill, none), cls.heightFill, []];
            }

            return [
                add(heightFill, none),
                `${cls.heightFillPortion} height-fill-${h.i}`,
                [
                    Single(
                        `${cls.any}.${cls.column} > ${dot(
                            `height-fill-${h.i}`
                        )}`,
                        'flex-grow',
                        `${h.i * 100000}`
                    ),
                ],
            ];

        case Lengths.Min: {
            const minCls = `min-height-${h.min}`,
                minStyle = Single(
                    minCls,
                    'min-height',
                    // This needs to be !important because we're using `min-height: min-content`
                    // to correct for safari's incorrect implementation of flexbox.
                    `${h.min}px !important`
                ),
                [minFlag, minAttrs, newMinStyle] = renderHeight(h.length);

            return [
                add(heightBetween, minFlag),
                `${minCls} ${minAttrs}`,
                [minStyle, ...newMinStyle],
            ];
        }

        case Lengths.Max: {
            const max = `max-height-${h.max}`,
                maxStyle = Single(max, 'max-height', `${h.max}px`),
                [maxFlag, maxAttrs, newMaxStyle] = renderHeight(h.length);

            return [
                add(heightBetween, maxFlag),
                `${max} ${maxAttrs}`,
                [maxStyle, ...newMaxStyle],
            ];
        }

        case Lengths.MinContent:
            return [
                none,
                'min-height',
                [Single('min-height', 'min-height', 'min-content')],
            ];

        case Lengths.MaxContent:
            return [
                none,
                'max-height',
                [Single('max-height', 'max-height', 'max-content')],
            ];
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
    children: Children<Element>
): Element {
    return createElement(
        context,
        children,
        gatherAttrRecursive(
            contextClasses(context),
            node,
            none,
            untransformed,
            [],
            [],
            NoNearbyChildren(),
            attributes.reverse()
        )
    );
}

function createElement(
    context: LayoutContext,
    children: Children<Element>,
    rendered: Gathered
): Element {
    function gather(
        child: Element,
        [htmls, existingStyles]: [Unkeyed<DOM.Node>, Style[]]
    ): [DOM.Node[], Style[]] {
        switch (child.type) {
            case Elements.Unstyled:
                if (context === asParagraph)
                    return [
                        [child.html(context), ...htmls.unkeyed],
                        existingStyles,
                    ];
                return [
                    [child.html(context), ...htmls.unkeyed],
                    existingStyles,
                ];

            case Elements.Styled:
                if (context === asParagraph)
                    return [
                        [child.html(NoStyleSheet(), context), ...htmls.unkeyed],
                        _.isEmpty(existingStyles)
                            ? child.styles
                            : child.styles.concat(existingStyles),
                    ];
                return [
                    [child.html(NoStyleSheet(), context), ...htmls.unkeyed],
                    _.isEmpty(existingStyles)
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
        [htmls, existingStyles]: [Keyed<DOM.Node>, Style[]]
    ): [[string, DOM.Node][], Style[]] {
        switch (child.type) {
            case Elements.Unstyled:
                if (context === asParagraph)
                    return [
                        [[key, child.html(context)], ...htmls.keyed],
                        existingStyles,
                    ];
                return [
                    [[key, child.html(context)], ...htmls.keyed],
                    existingStyles,
                ];

            case Elements.Styled:
                if (context === asParagraph)
                    return [
                        [
                            [key, child.html(NoStyleSheet(), context)],
                            ...htmls.keyed,
                        ],
                        _.isEmpty(existingStyles)
                            ? child.styles
                            : child.styles.concat(existingStyles),
                    ];
                return [
                    [
                        [key, child.html(NoStyleSheet(), context)],
                        ...htmls.keyed,
                    ],
                    _.isEmpty(existingStyles)
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
                    [keyed, styles]: [[string, DOM.Node][], Style[]],
                    keyed_: [string, Element]
                ) => gatherKeyed(keyed_, [Keyed(keyed), styles]),
                [[], []]
            );

            switch (gathered) {
                default: {
                    const newStyles: Style[] = _.isEmpty(gathered[1])
                        ? rendered.styles
                        : rendered.styles.concat(gathered[1]);
                    switch (newStyles) {
                        case []:
                            return Unstyled(() =>
                                finalizeNode(
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
                                )
                            );

                        default:
                            return Styled(newStyles, () =>
                                finalizeNode(
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
                                )
                            );
                    }
                }
            }
        }

        case Childrens.Unkeyed: {
            const gathered = children.unkeyed.reduceRight(
                ([unkeyed, styles]: [DOM.Node[], Style[]], unkeyed_: Element) =>
                    gather(unkeyed_, [Unkeyed(unkeyed), styles]),
                [[], []]
            );

            switch (gathered) {
                default: {
                    const newStyles: Style[] = _.isEmpty(gathered[1])
                        ? rendered.styles
                        : rendered.styles.concat(gathered[1]);
                    switch (newStyles) {
                        case []:
                            return Unstyled(() =>
                                finalizeNode(
                                    rendered.has,
                                    rendered.node,
                                    rendered.attributes,
                                    Unkeyed(
                                        addChildren(
                                            gathered[0],
                                            rendered.children
                                        )
                                    ),
                                    NoStyleSheet(),
                                    context
                                )
                            );

                        default:
                            return Styled(newStyles, () =>
                                finalizeNode(
                                    rendered.has,
                                    rendered.node,
                                    rendered.attributes,
                                    Unkeyed(
                                        addChildren(
                                            gathered[0],
                                            rendered.children
                                        )
                                    ),
                                    NoStyleSheet(),
                                    context
                                )
                            );
                    }
                }
            }
        }
    }
}

function addChildren(
    existing: DOM.Node[],
    nearbyChildren: NearbyChildren
): DOM.Node[] {
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
    existing: [string, DOM.Node][],
    nearbyChildren: NearbyChildren
): [string, DOM.Node][] {
    switch (nearbyChildren.type) {
        case NearbyChildrens.NoNearbyChildren:
            return existing;

        case NearbyChildrens.ChildrenBehind:
            return nearbyChildren.existingBehind
                .map((x: DOM.Node): [string, DOM.Node] => [key, x])
                .concat(existing);

        case NearbyChildrens.ChildrenInFront:
            return existing.concat(
                nearbyChildren.existingInFront.map(
                    (x: DOM.Node): [string, DOM.Node] => [key, x]
                )
            );

        case NearbyChildrens.ChildrenBehindAndInFront:
            return nearbyChildren.existingBehind
                .map((x: DOM.Node): [string, DOM.Node] => [key, x])
                .concat(existing)
                .concat(
                    nearbyChildren.existingInFront.map(
                        (x: DOM.Node): [string, DOM.Node] => [key, x]
                    )
                );
    }
}

const focusDefaultStyle = FocusStyle(
    Nothing(),
    Just(Shadow(Rgba(155 / 255, 203 / 255, 1, 1, Notation.Rgba), [0, 0], 0, 3)),
    Nothing()
);

function staticRoot(options: OptionObject): DOM.Node {
    switch (options.mode) {
        case RenderMode.Layout: {
            // wrap the style node in a div to prevent `Dark Reader` from blowin up the dom.
            const div = domElement('div', []),
                style = domElement('style', [], div);
            style.append(new DOM.Text(rules()));
            div.append(style);
            return div;
        }

        case RenderMode.NoStaticStyleSheet: {
            return new DOM.Text('');
        }

        case RenderMode.WithVirtualCss: {
            const staticRules = domElement('espectro-static-rules', []),
                rules_ = attribute('rules', JSON.stringify(rules()));
            staticRules.append(rules_);
            return staticRules;
        }
    }
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
                    switch (padding) {
                        case Nothing():
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

                        default:
                            return padding;
                    }
                })(),
                (() => {
                    switch (spacing) {
                        case Nothing():
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

                        default:
                            return spacing;
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
                switch (acc) {
                    case Nothing():
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

                    default:
                        return acc;
                }
            },
            Nothing()
        )
    );
}

function getWidth(attrs: Attribute[]): Maybe<Length> {
    return attrs.reduceRight((acc: Maybe<Length>, attr: Attribute) => {
        switch (acc) {
            case Nothing():
                switch (attr.type) {
                    case Attributes.Width:
                        return Just(attr.width);

                    default:
                        return Nothing();
                }

            default:
                return acc;
        }
    }, Nothing());
}

function getHeight(attrs: Attribute[]): Maybe<Length> {
    return attrs.reduceRight((acc: Maybe<Length>, attr: Attribute) => {
        switch (acc) {
            case Nothing():
                switch (attr.type) {
                    case Attributes.Height:
                        return Just(attr.height);

                    default:
                        return Nothing();
                }

            default:
                return acc;
        }
    }, Nothing());
}

function textElement(type: TextElement, str: string): DOM.Element {
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

    const element_ = domElement('div', [['class', classes_(type)]]);
    element_.append(new DOM.Text(str));

    return element_;
}

function toHtml(mode: (a: Style[]) => EmbedStyle, element: Element): DOM.Node {
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
): DOM.Node {
    const options: OptionObject = optionsToObject(optionList);

    function embedStyle(styles: Style[]): EmbedStyle {
        switch (options.mode) {
            case RenderMode.NoStaticStyleSheet:
                return OnlyDynamic(options, styles);

            default:
                return StaticRootAndDynamic(options, styles);
        }
    }

    return toHtml(
        (a: Style[]) => embedStyle(a),
        element(asEl, div, attributes, Unkeyed([child]))
    );
}

const families: Font[] = [
    Typeface('Open Sans'),
    Typeface('Helvetica'),
    Typeface('Verdana'),
    SansSerif(),
];

const rootStyle: Attribute[] = [
    StyleClass(
        bgColor,
        Colored(
            `bg-${formatColorClass(0, 0, 1, 0)}`,
            'background-color',
            formatColor(0, 0, 1, 0)
        )
    ),
    StyleClass(
        fontColor,
        Colored(
            `fc-${formatColorClass(0, 0, 0, 1)}`,
            'color',
            formatColor(0, 0, 0, 1)
        )
    ),
    StyleClass(fontSize, FontSize(20)),
    StyleClass(
        fontFamily,
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
            if (_.isString(font)) {
                return current + font.name.toLowerCase().split(' ').join('-');
            }
            return '';

        case FontFamilyType.ImportFont || FontFamilyType.FontWith:
            if (_.isObject(font)) {
                return current + font.name.toLowerCase().split(' ').join('-');
            }
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
        Style_(dot(cls.focusedWithin + ':focus-within'), [
            withDefault_(
                map((color: Color): Property => {
                    const [a, b, c, d, e] = Object.values(color);
                    return Property('border-color', formatColor(a, b, c, d, e));
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
            withDefault_(
                map((shadow: Shadow): Property => {
                    return Property('box-shadow', formatBoxShadow(shadow));
                }, focus.shadow)
            ),
            Property('outline', 'none'),
        ]),
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
                withDefault_(
                    map((shadow: Shadow): Property => {
                        if (shadow) {
                            return Property(
                                'box-shadow',
                                formatBoxShadow(shadow)
                            );
                        }
                        return Property('', '');
                    }, focus.shadow)
                ),
                Property('outline', 'none'),
            ]
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
                switch (object.hover) {
                    case Nothing(): {
                        object.hover = Just(opt.hover);
                        return object;
                    }

                    default:
                        return object;
                }

            case Options.FocusStyleOption:
                switch (object.focus) {
                    case Nothing(): {
                        object.focus = Just(opt.focus);
                        return object;
                    }

                    default:
                        return object;
                }

            case Options.RenderModeOption:
                switch (object.mode) {
                    case Nothing(): {
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
                switch (object.hover) {
                    case Nothing():
                        return HoverSetting.AllowHover;

                    default:
                        return withDefault(
                            HoverSetting.AllowHover,
                            object.hover
                        );
                }
            })(),
            (() => {
                switch (object.focus) {
                    case Nothing():
                        return focusDefaultStyle;

                    default:
                        return withDefault(focusDefaultStyle, object.focus);
                }
            })(),
            (() => {
                switch (object.mode) {
                    case Nothing():
                        return RenderMode.Layout;

                    default:
                        return withDefault(RenderMode.Layout, object.mode);
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

function toStyleSheet(options: OptionObject, stylesheet: Style[]): DOM.Node {
    switch (options.mode) {
        case RenderMode.Layout: {
            // wrap the style node in a div to prevent `Dark Reader` from blowin up the dom.
            const div = domElement('div', []),
                style = domElement('style', [], div);
            style.append(new DOM.Text(toStyleSheetString(options, stylesheet)));
            div.append(style);
            return div;
        }

        case RenderMode.NoStaticStyleSheet: {
            // wrap the style node in a div to prevent `Dark Reader` from blowin up the dom.
            const div = domElement('div', []),
                style = domElement('style', [], div);
            style.append(new DOM.Text(toStyleSheetString(options, stylesheet)));
            div.append(style);
            return div;
        }

        case RenderMode.WithVirtualCss: {
            const rules = domElement('espectro-rules', []),
                rules_ = attribute('rules', encodeStyles(options, stylesheet));
            rules.append(rules_);
            return rules;
        }
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
        return typefaces.filter((typeface) => withImport(typeface)).join('\n');
    }

    function fontAdjustments([name, typefaces]: [string, Font[]]): string {
        switch (typefaceAdjustment(typefaces)) {
            case Nothing():
                return allNames
                    .map((name_: string) =>
                        renderNullAdjustmentRule(name, name_)
                    )
                    .join('');

            default: {
                const adjustment: [[string, string][], [string, string][]][] =
                    withDefault(
                        [
                            [[['', '']], [['', '']]],
                            [[['', '']], [['', '']]],
                        ],
                        typefaceAdjustment(typefaces)
                    );
                return allNames
                    .map((name_: string) =>
                        renderFontAdjustmentRule(
                            name,
                            [adjustment[0], adjustment[1]],
                            name_
                        )
                    )
                    .join('');
            }
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
            switch (found) {
                case Nothing():
                    switch (face.type) {
                        case FontFamilyType.FontWith:
                            switch (face.adjustment) {
                                case Nothing():
                                    return found;

                                default:
                                    return Just([
                                        fontAdjustmentRules(
                                            convertAdjustment(
                                                withDefault(
                                                    Adjustment(0, 0, 0, 0),
                                                    face.adjustment
                                                )
                                            ).full
                                        ),
                                        fontAdjustmentRules(
                                            convertAdjustment(
                                                withDefault(
                                                    Adjustment(0, 0, 0, 0),
                                                    face.adjustment
                                                )
                                            ).capital
                                        ),
                                    ]);
                            }

                        default:
                            return found;
                    }

                default:
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

        case FontFamilyType.Typeface ||
            FontFamilyType.ImportFont ||
            FontFamilyType.FontWith:
            return `"${font.name}"`;

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
    if (force) {
        return `${existing} \n ${property.key}: ${property.value} !important;`;
    }
    return `${existing} \n ${property.key}: ${property.value};`;
}

function encodeStyles(options: OptionObject, stylesheet: Style[]): string {
    const stylesheet_: [string, string][] = stylesheet.map(
        (style: Style): [string, string] => {
            const styled: string[] = renderStyleRule(options, style, Nothing());
            return [getStyleName(style), JSON.stringify(styled)];
        }
    );
    return JSON.stringify(stylesheet_);
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
                switch (topLevel) {
                    case Nothing():
                        return rendered.topLevel;

                    default: {
                        return [
                            withDefault(['', []], topLevel),
                            ...rendered.topLevel,
                        ];
                    }
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

    switch (rendered_) {
        default: {
            const { rules, topLevel } = rendered_;
            return renderTopLevelValues(topLevel) + rules.join('');
        }
    }
}

function renderStyle(
    options: OptionObject,
    pseudo: Maybe<PseudoClass>,
    selector: string,
    props: Property[]
): string[] {
    switch (pseudo) {
        case Nothing():
            return [
                `${selector}{${props.reduce(
                    (acc: string, prop: Property): string =>
                        renderProps(false, prop, acc),
                    ''
                )}\n}`,
            ];

        case Just(PseudoClass.Hover):
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

        case Just(PseudoClass.Focus): {
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

        case Just(PseudoClass.Active):
            return [
                `${selector}-act:active {${props.reduce(
                    (acc: string, prop: Property): string =>
                        renderProps(false, prop, acc),
                    ''
                )}\n}`,
            ];
    }
    return [];
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
                    _.isNumber(opacity) ? opacity.toString() : '1'
                ),
            ]);
        }

        case Styles.FontSize:
            return renderStyle(
                options,
                pseudo,
                '.font-size-' + rule.i.toString(),
                [Property('font-size', rule.i.toString() + 'px')]
            );

        case Styles.FontFamily: {
            const features: string = rule.typefaces
                .filter((value: Font) => {
                    return renderVariants(value);
                })
                .join(', ');
            const families: Property[] = [
                Property(
                    'font-family',
                    rule.typefaces.map(fontName).join(', ')
                ),
                Property('font-feature-settings', features),
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
                halfX: string = (rule.x / 2).toString() + 'px',
                halfY: string = (rule.y / 2).toString() + 'px',
                xPx: string = rule.x.toString() + 'px',
                yPx: string = rule.y.toString() + 'px',
                row: string = '.' + cls.row,
                wrappedRow: string = '.' + cls.wrapped + row,
                column: string = '.' + cls.column,
                page: string = '.' + cls.page,
                paragraph: string = '.' + cls.paragraph,
                left: string = '.' + cls.alignLeft,
                right: string = '.' + cls.alignRight,
                any: string = '.' + cls.any;
            // single: string = '.' + cls.single;
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
                    Property(
                        'line-height',
                        `calc(1em + ${rule.y.toString()}px)`
                    ),
                ]),
                renderStyle(options, pseudo, `textarea${any}${class_}`, [
                    Property(
                        'line-height',
                        `calc(1em + ${rule.y.toString()}px)`
                    ),
                    Property('height', `calc(100% + ${rule.y.toString()}px)`),
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
                        Math.floor(-1 * (rule.y / 2)).toString() + 'px'
                    ),
                ]),
                renderStyle(options, pseudo, `${class_}${paragraph}::before`, [
                    Property('content', `''`),
                    Property('display', `block`),
                    Property('height', `0`),
                    Property('width', `0`),
                    Property(
                        'margin-top',
                        Math.floor(-1 * (rule.y / 2)).toString() + 'px'
                    ),
                ])
            );
        }

        case Styles.PaddingStyle:
            return renderStyle(options, pseudo, '.' + rule.class_, [
                Property(
                    'padding',
                    `${rule.top.toString()}px ${rule.right.toString()}px ${rule.bottom.toString()}px ${rule.left.toString()}px`
                ),
            ]);

        case Styles.BorderWidth:
            return renderStyle(options, pseudo, '.' + rule.class_, [
                Property(
                    'padding',
                    `${rule.top.toString()}px ${rule.right.toString()}px ${rule.bottom.toString()}px ${rule.left.toString()}px`
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
                        return x.px.toString() + 'px';

                    case Lengths.Rem:
                        return x.rem.toString() + 'rem';

                    case Lengths.Content:
                        switch ([minimum, maximum]) {
                            case [Nothing(), Nothing()]:
                                return 'max-content';

                            case [minimum, Nothing()]:
                                return `minmax(${minimum.toString()}px, max-content)`;

                            case [Nothing(), maximum]:
                                return `minmax(max-content, ${maximum.toString()}px)`;

                            case [minimum, maximum]:
                                return `minmax(${minimum.toString()}px, ${maximum.toString()}px)`;
                        }
                        break;

                    case Lengths.Fill:
                        switch ([minimum, maximum]) {
                            case [Nothing(), Nothing()]:
                                return x.i.toString() + 'fr';

                            case [minimum, Nothing()]:
                                // TODO: Check frfr
                                return `minmax(${minimum.toString()}px, ${x.i.toString()}frfr)`;

                            case [Nothing(), maximum]:
                                return `minmax(max-content, ${maximum.toString()}px)`;

                            case [minimum, maximum]:
                                return `minmax(${minimum.toString()}px, ${maximum.toString()}px)`;
                        }
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

            const gapX = `grid-column-gap:${toGridLength(rule.spacing[0])}`;
            const gapY = `grid-row-gap:${toGridLength(rule.spacing[1])}`;

            const modernGrid = `${class_}{${columns}${rows}${gapX}${gapY}}`;
            const supports = `@supports (display:grid) {${modernGrid}}`;

            return [base, supports];
        }

        case Styles.GridPosition: {
            const class_ = `.grid-pos-${rule.row}-${rule.column}-${rule.width}-${rule.height}`;
            const msPosition = [
                '-ms-grid-row: ' + rule.row.toString() + ';',
                '-ms-grid-row-span: ' + rule.height.toString() + ';',
                '-ms-grid-column: ' + rule.column.toString() + ';',
                '-ms-grid-column-span: ' + rule.width.toString() + ';',
            ].join(' ');
            const base = `${class_}{${msPosition}}`;

            const modernPosition = [
                'grid-row: ' +
                    rule.row.toString() +
                    ' / ' +
                    (rule.row + rule.height).toString() +
                    ';',
                'grid-column: ' +
                    rule.column.toString() +
                    ' / ' +
                    (rule.column + rule.width).toString() +
                    ';',
            ].join(' ');
            const modernGrid = `${class_}{${modernPosition}}`;
            const supports = `@supports (display:grid) {${modernGrid}}`;

            return [base, supports];
        }

        case Styles.PseudoSelector: {
            const renderPseudoRule = (style: Style): string[] =>
                renderStyleRule(options, style, Just(rule.class_));
            return rule.styles.flatMap((style: Style): string[] => {
                const render = renderPseudoRule(style);
                if (typeof render !== 'undefined') {
                    return render;
                }
                return [];
            });
        }

        case Styles.Transform: {
            const value: Maybe<string> = transformValue(rule.transform);
            const class_: Maybe<string> = transformClass(rule.transform);

            switch ([class_, value]) {
                case [class_, value]:
                    if (
                        typeof class_ === 'string' &&
                        typeof value === 'string'
                    ) {
                        return renderStyle(options, pseudo, '.' + class_, [
                            Property('transform', value),
                        ]);
                    }
                    break;

                default:
                    return [];
            }
        }
    }
    return [];
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
    }px ${floatClass(shadow.blur)}px ${floatClass(shadow.size)}px ${formatColor(
        a,
        b,
        c,
        d,
        e
    )}`;
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

function formatColor(
    a: number,
    b: number,
    c: number,
    d: number,
    type: Notation = Notation.Hsla
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
    type: Notation = Notation.Hsla
): string {
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

// TODO: Review Mapping functions of elm-ui

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
        capitalVertical: number = _.isNumber(ascender) ? 1 - ascender : 0,
        capitalSize: number = _.isNumber(ascender)
            ? 1 / (ascender - newBaseLine)
            : 0,
        fullSize: number =
            _.isNumber(ascender) && _.isNumber(descender)
                ? 1 / (ascender - descender)
                : 0,
        // TODO: Same as capitalVertical
        fullVertical: number = _.isNumber(ascender) ? 1 - ascender : 0;

    return {
        full: adjust(
            fullSize,
            _.isNumber(ascender) && _.isNumber(descender)
                ? ascender - descender
                : 0,
            fullVertical
        ),
        capital: adjust(
            capitalSize,
            _.isNumber(ascender) ? ascender - newBaseLine : 0,
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
    getHeight,
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
    variantName,
};

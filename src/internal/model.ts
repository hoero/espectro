import { classValidator } from '../deps.ts';
import { _ } from '../deps.ts';
import { DOM } from '../deps.ts';
import { DOMelement } from '../deps.ts';
import { CTOR_KEY } from '../deps.ts';

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
    value,
} from './flag.ts';
import { classes as cls, dot } from './style.ts';
import {
    Elements,
    Element,
    Styles,
    Style,
    Transformations,
    Transformation,
    FontFamilyType,
    FontWith,
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
    OptionRecord,
    FocusStyle,
    Style_,
    Property,
    Option,
    HoverSetting,
} from './data.ts';

const min = {
    message:
        'Invalid value. Channel should be more or equal to $constraint1, but actual value is $value.',
};
const max = {
    message:
        'Invalid value. Channel should be less or equal to $constraint1, but actual value is $value.',
};

class ChannelsColor {
    @classValidator.Min(0, min)
    private a: number;
    @classValidator.Min(0, min)
    private b: number;
    @classValidator.Min(0, min)
    private c: number;
    @classValidator.Min(0, min)
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
    @classValidator.Max(360, max)
    hue: number;
    @classValidator.Max(1, max)
    saturation: number;
    @classValidator.Max(1, max)
    lightness: number;
    @classValidator.Max(1, max)
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
    @classValidator.Max(1, max)
    red: number;
    @classValidator.Max(1, max)
    green: number;
    @classValidator.Max(1, max)
    blue: number;
    @classValidator.Max(1, max)
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
    @classValidator.Max(255)
    red: number;
    @classValidator.Max(255)
    green: number;
    @classValidator.Max(255)
    blue: number;
    @classValidator.Max(1, max)
    alpha: number;

    constructor(red: number, green: number, blue: number, alpha: number) {
        super(Notation.Rgba, red, green, blue, alpha);
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
    }
}

const noStyleSheet = { type: EmbedStyles.NoStyleSheet };

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

function renderVariants(typeface: Font): string | null {
    switch (typeface.type) {
        case FontFamilyType.FontWith: {
            const variants = typeface.variants.map((variant) => {
                return renderVariant(variant);
            });
            return variants.join(', ');
        }

        default:
            return null;
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
            return _.some(typeface.variants, isSmallCaps);

        default:
            return false;
    }
}

const div = { type: NodeNames.Generic };

function htmlClass(cls: string): Attribute {
    return { type: Attributes.Attr, attr: createAttribute('class', cls) };
}

function unstyled(node: (a: LayoutContext) => DOM.Node): Element {
    return { type: Elements.Unstyled, html: node };
}

function finalizeNode(
    has: Field,
    node: NodeName,
    attributes: Attr,
    children: Children,
    embedMode: EmbedStyle,
    parentContext: LayoutContext
) {
    function createNode(nodeName: string, attrs: Attr) {
        switch (children.type) {
            case Childrens.Keyed:
                break;

            case Childrens.Unkeyed:
                break;
        }
    }
}

function embedWith(
    static_: boolean,
    opts: OptionRecord,
    styles: Style[],
    children: any[]
) {
    // const dinamicStyleSheet = _.reduce(styles);
}

function embedKeyed(
    static_: boolean,
    opts: OptionRecord,
    styles: Style[],
    children: [string, any][]
) {}

function reduceStylesRecursive(
    cache: Set<string>,
    found: Style[],
    styles: Style[]
): Style[] {
    const head = styles[0],
        remaining = styles;
    remaining.shift();

    switch (styles) {
        case []:
            return found;

        default: {
            const styleName = getStyleName(head);

            if (cache.has(styleName)) {
                return reduceStylesRecursive(cache, found, remaining);
            }

            return reduceStylesRecursive(
                cache.add(styleName),
                [head].concat(found),
                remaining
            );
        }
    }
}

function reduceStyles(
    style: Style,
    nevermind: [Set<string>, Style[]]
): [Set<string>, Style[]] {
    const styleName = getStyleName(style);

    if (nevermind[0].has(styleName)) {
        return nevermind;
    }

    return [nevermind[0].add(styleName), [style].concat(nevermind[1])];
}

function addNodeName(newNode: string, old: NodeName): NodeName {
    switch (old.type) {
        case NodeNames.Generic:
            return { type: NodeNames.NodeName, nodeName: newNode };

        case NodeNames.NodeName:
            return {
                type: NodeNames.Embedded,
                nodeName: old.nodeName,
                internal: newNode,
            };

        case NodeNames.Embedded:
            return {
                type: NodeNames.Embedded,
                nodeName: old.nodeName,
                internal: old.internal,
            };
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

function transformClass(transform: Transformation) {
    switch (transform.type) {
        case Transformations.Untransformed:
            return null;

        case Transformations.Moved:
            if (_.isArray(transform.xyz)) {
                return `mv-${floatClass(transform.xyz[0])}-${floatClass(
                    transform.xyz[1]
                )}-${floatClass(transform.xyz[2])}`;
            }
            return null;

        case Transformations.FullTransform:
            if (_.isObject(transform) && !_.isArray(transform)) {
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

function transformValue(transform: Transformation) {
    switch (transform.type) {
        case Transformations.Untransformed:
            return null;

        case Transformations.Moved:
            if (_.isArray(transform.xyz)) {
                return `translate3d(${transform.xyz[0]}px, ${transform.xyz[1]}px, ${transform.xyz[2]}px)`;
            }
            return null;

        case Transformations.FullTransform:
            if (_.isObject(transform) && !_.isArray(transform)) {
                const translate = `translate3d(${transform.translate[0]}px, ${transform.translate[1]}px, ${transform.translate[2]}px)`;
                const scale = `scale3d(${transform.scale[0]}px, ${transform.scale[1]}px, ${transform.scale[2]}px)`;
                const rotate = `rotate3d(${transform.rotate[0]}px, ${transform.rotate[1]}px, ${transform.rotate[2]}px)`;
                return `${translate} ${scale} ${rotate}`;
            }
            return null;
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
                    return {
                        type: Transformations.Moved,
                        xyz: [component.x, 0, 0],
                    };

                case TransformComponents.MoveY:
                    return {
                        type: Transformations.Moved,
                        xyz: [0, component.y, 0],
                    };

                case TransformComponents.MoveZ:
                    return {
                        type: Transformations.Moved,
                        xyz: [0, 0, component.z],
                    };

                case TransformComponents.MoveXYZ:
                    return {
                        type: Transformations.Moved,
                        xyz: component.xyz,
                    };

                case TransformComponents.Rotate:
                    return {
                        type: Transformations.FullTransform,
                        translate: [0, 0, 0],
                        scale: [1, 1, 1],
                        rotate: component.xyz,
                        angle: component.angle,
                    };

                case TransformComponents.Scale:
                    return {
                        type: Transformations.FullTransform,
                        translate: [0, 0, 0],
                        scale: component.xyz,
                        rotate: [0, 0, 1],
                        angle: 0,
                    };
            }
            break;

        case Transformations.Moved:
            if (_.isArray(transform.xyz)) {
                switch (component.type) {
                    case TransformComponents.MoveX:
                        return {
                            type: Transformations.Moved,
                            xyz: [
                                component.x,
                                transform.xyz[1],
                                transform.xyz[2],
                            ],
                        };

                    case TransformComponents.MoveY:
                        return {
                            type: Transformations.Moved,
                            xyz: [
                                transform.xyz[0],
                                component.y,
                                transform.xyz[2],
                            ],
                        };

                    case TransformComponents.MoveZ:
                        return {
                            type: Transformations.Moved,
                            xyz: [
                                transform.xyz[0],
                                transform.xyz[1],
                                component.z,
                            ],
                        };

                    case TransformComponents.MoveXYZ:
                        return {
                            type: Transformations.Moved,
                            xyz: component.xyz,
                        };

                    case TransformComponents.Rotate:
                        return {
                            type: Transformations.FullTransform,
                            translate: transform.xyz,
                            scale: [1, 1, 1],
                            rotate: component.xyz,
                            angle: component.angle,
                        };

                    case TransformComponents.Scale:
                        return {
                            type: Transformations.FullTransform,
                            translate: transform.xyz,
                            scale: component.xyz,
                            rotate: [0, 0, 1],
                            angle: 0,
                        };
                }
            }
            return {
                type: Transformations.Untransformed,
            };

        case Transformations.FullTransform:
            if (_.isObject(transform) && !_.isArray(transform)) {
                switch (component.type) {
                    case TransformComponents.MoveX:
                        return {
                            type: Transformations.FullTransform,
                            translate: [
                                component.x,
                                transform.translate[1],
                                transform.translate[2],
                            ],
                            scale: transform.scale,
                            rotate: transform.rotate,
                            angle: transform.angle,
                        };

                    case TransformComponents.MoveY:
                        return {
                            type: Transformations.FullTransform,
                            translate: [
                                transform.translate[0],
                                component.y,
                                transform.translate[2],
                            ],
                            scale: transform.scale,
                            rotate: transform.rotate,
                            angle: transform.angle,
                        };

                    case TransformComponents.MoveZ:
                        return {
                            type: Transformations.FullTransform,
                            translate: [
                                transform.translate[0],
                                transform.translate[1],
                                component.z,
                            ],
                            scale: transform.scale,
                            rotate: transform.rotate,
                            angle: transform.angle,
                        };

                    case TransformComponents.MoveXYZ:
                        return {
                            type: Transformations.FullTransform,
                            translate: component.xyz,
                            scale: transform.scale,
                            rotate: transform.rotate,
                            angle: transform.angle,
                        };

                    case TransformComponents.Rotate:
                        return {
                            type: Transformations.FullTransform,
                            translate: transform.translate,
                            scale: transform.scale,
                            rotate: component.xyz,
                            angle: component.angle,
                        };

                    case TransformComponents.Scale:
                        return {
                            type: Transformations.FullTransform,
                            translate: transform.translate,
                            scale: component.xyz,
                            rotate: transform.rotate,
                            angle: transform.angle,
                        };
                }
            }
            return {
                type: Transformations.Untransformed,
            };
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
    attrs: Attr[],
    children: NearbyChildren,
    elementAttrs: Attribute[]
): Gathered {
    switch (elementAttrs) {
        case []:
            switch (transformClass(transform)) {
                case null:
                    return {
                        node: node,
                        attributes: [
                            createAttribute('class', classes),
                            ...createAttributes(attrs),
                        ],
                        styles: styles,
                        children: children,
                        has: has,
                    };

                default: {
                    const class_ = transformClass(transform);
                    return {
                        node: node,
                        attributes: [
                            createAttribute('class', `${classes} ${class_}`),
                            ...createAttributes(attrs),
                        ],
                        styles: [
                            { type: Styles.Transform, transform: transform },
                            ...styles,
                        ],
                        children: children,
                        has: has,
                    };
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
                                        createAttribute(
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
                                        createAttribute('aria-live', 'polite'),
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
                                        createAttribute(
                                            'aria-live',
                                            'assertive'
                                        ),
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
                                    [
                                        createAttribute('role', 'button'),
                                        ...attrs,
                                    ],
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
                            `${attr.class} ${classes}`,
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

                        const flags = add(yAlign, has);
                        const align = attr.y;

                        // deno-lint-ignore no-inner-declarations
                        function has_() {
                            switch (align) {
                                case VAlign.CenterY:
                                    return add(centerY, flags);

                                case VAlign.Bottom:
                                    return add(alignBottom, flags);

                                default:
                                    return flags;
                            }
                        }

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

                        const flags = add(xAlign, has);
                        const align = attr.x;

                        // deno-lint-ignore no-inner-declarations no-redeclare
                        function has_() {
                            switch (align) {
                                case HAlign.CenterX:
                                    return add(centerX, flags);

                                case HAlign.Right:
                                    return add(alignRight, flags);

                                default:
                                    return flags;
                            }
                        }

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
                                        {
                                            type: Styles.Single,
                                            class: `width-px-${attr.width.px}`,
                                            prop: 'width',
                                            value: `${attr.width.px}px`,
                                        },
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
                                        {
                                            type: Styles.Single,
                                            class: `width-rem-${attr.width.rem}`,
                                            prop: 'width',
                                            value: `${attr.width.rem}rem`,
                                        },
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
                                        {
                                            type: Styles.Single,
                                            class: `${cls.any}.${
                                                cls.row
                                            } > ${dot(
                                                `width-fill-${attr.width.i}`
                                            )}`,
                                            prop: 'flex-grow',
                                            value: `${attr.width.i * 100000}`,
                                        },
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
                                        {
                                            type: Styles.Single,
                                            class: `height-px-${attr.height.px}`,
                                            prop: 'height',
                                            value: `${attr.height.px}px`,
                                        },
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
                                        {
                                            type: Styles.Single,
                                            class: `height-rem-${attr.height.rem}`,
                                            prop: 'height',
                                            value: `${attr.height.rem}rem`,
                                        },
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
                                        {
                                            type: Styles.Single,
                                            class: `${cls.any}.${
                                                cls.row
                                            } > ${dot(
                                                `height-fill-${attr.height.i}`
                                            )}`,
                                            prop: 'flex-grow',
                                            value: `${attr.height.i * 100000}`,
                                        },
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
    return {
        node: node,
        attributes: [
            createAttribute('class', classes),
            ...createAttributes(attrs),
        ],
        styles: styles,
        children: children,
        has: has,
    };
}

function createAttribute(attribute: string, value: string): Attr {
    const attr = document.createAttribute(attribute);
    attr.value = value;
    return attr;
}

function createAttributes(attributes: Attr[]): Attr[] {
    const attrs = [];

    for (const { name, value } of attributes) {
        const attr = createAttribute(name, value);
        attrs.push(attr);
    }

    return attrs;
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
                    return {
                        type: NearbyChildrens.ChildrenBehind,
                        existingBehind: [nearby],
                    };

                default:
                    return {
                        type: NearbyChildrens.ChildrenInFront,
                        existingInFront: [nearby],
                    };
            }

        case NearbyChildrens.ChildrenBehind:
            switch (location) {
                case Location.Behind:
                    return {
                        type: NearbyChildrens.ChildrenBehind,
                        existingBehind: [nearby, ...existing.existingBehind],
                    };

                default:
                    return {
                        type: NearbyChildrens.ChildrenBehindAndInFront,
                        existingBehind: existing.existingBehind,
                        existingInFront: [nearby],
                    };
            }

        case NearbyChildrens.ChildrenInFront:
            switch (location) {
                case Location.Behind:
                    return {
                        type: NearbyChildrens.ChildrenBehindAndInFront,
                        existingBehind: [nearby],
                        existingInFront: existing.existingInFront,
                    };

                default:
                    return {
                        type: NearbyChildrens.ChildrenInFront,
                        existingInFront: [nearby, ...existing.existingInFront],
                    };
            }

        case NearbyChildrens.ChildrenBehindAndInFront:
            switch (location) {
                case Location.Behind:
                    return {
                        type: NearbyChildrens.ChildrenBehindAndInFront,
                        existingBehind: [nearby, ...existing.existingBehind],
                        existingInFront: existing.existingInFront,
                    };

                default:
                    return {
                        type: NearbyChildrens.ChildrenBehindAndInFront,
                        existingBehind: existing.existingBehind,
                        existingInFront: [nearby, ...existing.existingInFront],
                    };
            }
    }
}

function nearbyElement(location: Location, element: Element): DOM.Element {
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

    function child(element: Element) {
        switch (element.type) {
            case Elements.Empty:
                return new DOM.Text('');

            case Elements.Text:
                return textElement(TextElement.Text, element.str);

            case Elements.Unstyled:
                return element.html(asEl);

            case Elements.Styled:
                return element.html(EmbedStyles.NoStyleSheet, asEl);
        }
    }

    const element_ = new DOMelement.Element(
        'div',
        null,
        [['class', classes_(location)]],
        CTOR_KEY.CTOR_KEY
    );
    element_.append(child(element));

    return element_;
}

function renderWidth(w: Length): [Field, string, Style[]] {
    switch (w.type) {
        case Lengths.Px:
            return [
                none,
                `${cls.widthExact} width-px-${w.px}`,
                [
                    {
                        type: Styles.Single,
                        class: `width-px-${w.px}`,
                        prop: 'width',
                        value: `${w.px}px`,
                    },
                ],
            ];

        case Lengths.Rem:
            return [
                none,
                `${cls.widthExact} width-rem-${w.rem}`,
                [
                    {
                        type: Styles.Single,
                        class: `width-rem-${w.rem}`,
                        prop: 'width',
                        value: `${w.rem}rem`,
                    },
                ],
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
                    {
                        type: Styles.Single,
                        class: `${cls.any}.${cls.row} > ${dot(
                            `width-fill-${w.i}`
                        )}`,
                        prop: 'flex-grow',
                        value: `${w.i * 100000}`,
                    },
                ],
            ];

        case Lengths.Min: {
            const minCls = `min-width-${w.min}`,
                minStyle: Single = {
                    type: Styles.Single,
                    class: minCls,
                    prop: 'min-width',
                    value: `${w.min}px`,
                },
                [minFlag, minAttrs, newMinStyle] = renderWidth(w.length);

            return [
                add(widthBetween, minFlag),
                `${minCls} ${minAttrs}`,
                [minStyle, ...newMinStyle],
            ];
        }

        case Lengths.Max: {
            const max = `max-width-${w.max}`,
                maxStyle: Single = {
                    type: Styles.Single,
                    class: max,
                    prop: 'max-width',
                    value: `${w.max}px`,
                },
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
                [
                    {
                        type: Styles.Single,
                        class: 'min-width',
                        prop: 'min-width',
                        value: 'min-content',
                    },
                ],
            ];

        case Lengths.MaxContent:
            return [
                none,
                'max-width',
                [
                    {
                        type: Styles.Single,
                        class: 'max-width',
                        prop: 'max-width',
                        value: 'max-content',
                    },
                ],
            ];
    }
}

function renderHeight(h: Length): [Field, string, Style[]] {
    switch (h.type) {
        case Lengths.Px:
            return [
                none,
                `${cls.heightExact} height-px-${h.px}`,
                [
                    {
                        type: Styles.Single,
                        class: `height-px-${h.px}`,
                        prop: 'height',
                        value: `${h.px}px`,
                    },
                ],
            ];

        case Lengths.Rem:
            return [
                none,
                `${cls.heightExact} height-rem-${h.rem}`,
                [
                    {
                        type: Styles.Single,
                        class: `height-rem-${h.rem}`,
                        prop: 'height',
                        value: `${h.rem}rem`,
                    },
                ],
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
                    {
                        type: Styles.Single,
                        class: `${cls.any}.${cls.column} > ${dot(
                            `height-fill-${h.i}`
                        )}`,
                        prop: 'flex-grow',
                        value: `${h.i * 100000}`,
                    },
                ],
            ];

        case Lengths.Min: {
            const minCls = `min-height-${h.min}`,
                minStyle: Single = {
                    type: Styles.Single,
                    class: minCls,
                    prop: 'min-height',
                    // This needs to be !important because we're using `min-height: min-content`
                    // to correct for safari's incorrect implementation of flexbox.
                    value: `${h.min}px !important`,
                },
                [minFlag, minAttrs, newMinStyle] = renderHeight(h.length);

            return [
                add(heightBetween, minFlag),
                `${minCls} ${minAttrs}`,
                [minStyle, ...newMinStyle],
            ];
        }

        case Lengths.Max: {
            const max = `max-height-${h.max}`,
                maxStyle: Single = {
                    type: Styles.Single,
                    class: max,
                    prop: 'max-height',
                    value: `${h.max}px`,
                },
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
                [
                    {
                        type: Styles.Single,
                        class: 'min-height',
                        prop: 'min-height',
                        value: 'min-content',
                    },
                ],
            ];

        case Lengths.MaxContent:
            return [
                none,
                'max-height',
                [
                    {
                        type: Styles.Single,
                        class: 'max-height',
                        prop: 'max-height',
                        value: 'max-content',
                    },
                ],
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

    const element = new DOMelement.Element(
        'div',
        null,
        [['class', classes_(type)]],
        CTOR_KEY.CTOR_KEY
    );
    element.append(new DOM.Text(str));

    return element;
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
            name: _.reduce(
                families,
                (acc: string, font: Font) => {
                    return renderFontClassName(font, acc);
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
            if (_.isString(font)) {
                return current + _.words(font.name.toLowerCase()).join('-');
            }
            return '';

        case FontFamilyType.ImportFont || FontFamilyType.FontWith:
            if (_.isObject(font)) {
                return current + _.words(font.name.toLowerCase()).join('-');
            }
            return '';

        default:
            return '';
    }
}

function renderFocusStyle(focus: FocusStyle): Style_[] {
    return [
        {
            type: Styles.Style,
            selector: dot(cls.focusedWithin + ':focus-within'),
            props: [
                ((color: Color | null): Property => {
                    if (color) {
                        const [a, b, c, d, e] = Object.values(color);
                        return {
                            key: 'border-color',
                            value: formatColor(a, b, c, d, e),
                        };
                    }
                    return { key: '', value: '' };
                })(focus.borderColor),
                ((color: Color | null): Property => {
                    if (color) {
                        const [a, b, c, d, e] = Object.values(color);
                        return {
                            key: 'background-color',
                            value: formatColor(a, b, c, d, e),
                        };
                    }
                    return { key: '', value: '' };
                })(focus.backgroundColor),
                ((shadow: Shadow | null): Property => {
                    if (shadow) {
                        return {
                            key: 'box-shadow',
                            value: formatBoxShadow(shadow),
                        };
                    }
                    return { key: '', value: '' };
                })(focus.shadow),
                { key: 'outline', value: 'none' },
            ],
        },
        {
            type: Styles.Style,
            selector: `${dot(cls.any + ':focus .focusable, ')}${dot(
                cls.any + '.focusable:focus, '
            )}.ui-slide-bar:focus + ${dot(cls.any + ' .focusable-thumb')}`,
            props: [
                ((color: Color | null): Property => {
                    if (color) {
                        const [a, b, c, d, e] = Object.values(color);
                        return {
                            key: 'border-color',
                            value: formatColor(a, b, c, d, e),
                        };
                    }
                    return { key: '', value: '' };
                })(focus.borderColor),
                ((color: Color | null): Property => {
                    if (color) {
                        const [a, b, c, d, e] = Object.values(color);
                        return {
                            key: 'background-color',
                            value: formatColor(a, b, c, d, e),
                        };
                    }
                    return { key: '', value: '' };
                })(focus.backgroundColor),
                ((shadow: Shadow | null): Property => {
                    if (shadow) {
                        return {
                            key: 'box-shadow',
                            value: formatBoxShadow(shadow),
                        };
                    }
                    return { key: '', value: '' };
                })(focus.shadow),
                { key: 'outline', value: 'none' },
            ],
        },
    ];
}

const focusDefaultStyle: FocusStyle = {
    backgroundColor: null,
    borderColor: null,
    shadow: {
        color: {
            red: 155 / 255,
            green: 203 / 255,
            blue: 1,
            alpha: 1,
            type: Notation.Rgba,
        },
        offset: [0, 0],
        blur: 0,
        size: 3,
    },
};

// function toStyleSheet(
//     options: OptionRecord,
//     styleSheet: Style_[]
// ): DOM.Element {}

function bracket(selector: string, rules: [string, string][]): string {
    function renderPair(rule: [string, string]) {
        return `${rule[0]}: ${rule[1]};`;
    }
    return `${selector} {${rules
        .map((rule: [string, string]): string => renderPair(rule))
        .join('')}}`;
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

function topLevelValue(rule: Style): (string | Font[])[] | null {
    switch (rule.type) {
        case Styles.FontFamily:
            return [rule.name, rule.typefaces];

        default:
            return null;
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

// function toStyleSheetString(
//     options: OptionRecord,
//     styleSheet: Style_[]
// ): string {
//     // function combine(params: type) {}
// }

function renderStyle(
    options: OptionRecord,
    pseudo: PseudoClass | null,
    selector: string,
    props: Property[]
): string[] {
    switch (pseudo) {
        case null:
            return [
                `${selector}{${_.reduce(
                    props,
                    (acc: string, prop: Property): string => {
                        return renderProps(false, prop, acc);
                    },
                    ''
                )}\n}`,
            ];

        case PseudoClass.Hover:
            switch (options.hover) {
                case HoverSetting.NoHover:
                    return [];

                case HoverSetting.ForceHover:
                    return [
                        `${selector}-hv {${_.reduce(
                            props,
                            (acc: string, prop: Property): string => {
                                return renderProps(true, prop, acc);
                            }
                        )}\n}`,
                    ];

                case HoverSetting.AllowHover:
                    return [
                        `${selector}-hv:hover {${_.reduce(
                            props,
                            (acc: string, prop: Property): string => {
                                return renderProps(false, prop, acc);
                            }
                        )}\n}`,
                    ];
            }
            break;

        case PseudoClass.Focus: {
            const renderedProps = _.reduce(
                props,
                (acc: string, prop: Property): string => {
                    return renderProps(false, prop, acc);
                },
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
                `${selector}-act:active {${_.reduce(
                    props,
                    (acc: string, prop: Property): string => {
                        return renderProps(false, prop, acc);
                    },
                    ''
                )}\n}`,
            ];
    }
}

function renderStyleRule(
    options: OptionRecord,
    rule: Style,
    pseudo: PseudoClass | null
): string[] | undefined {
    switch (rule.type) {
        case Styles.Style:
            return renderStyle(options, pseudo, rule.selector, rule.props);

        case Styles.Shadows:
            return renderStyle(options, pseudo, '.' + rule.name, [
                { key: 'box-shadow', value: rule.prop },
            ]);

        case Styles.Transparency: {
            const opacity: number = _.max(0, _.min(1, 1 - rule.transparency));
            return renderStyle(options, pseudo, '.' + rule.name, [
                { key: 'opacity', value: opacity.toString() },
            ]);
        }

        case Styles.FontSize:
            return renderStyle(
                options,
                pseudo,
                '.font-size-' + rule.i.toString(),
                [{ key: 'font-size', value: rule.i.toString() + 'px' }]
            );

        case Styles.FontFamily: {
            const features: string = rule.typefaces
                .filter((value: Font) => {
                    return renderVariants(value);
                })
                .join(', ');
            const families: Property[] = [
                {
                    key: 'font-family',
                    value: rule.typefaces
                        .map((value: Font) => {
                            return fontName(value);
                        })
                        .join(', '),
                },
                { key: 'font-feature-settings', value: features },
                {
                    key: 'font-variant',
                    value: _.some(rule.typefaces, hasSmallCaps)
                        ? 'small-caps'
                        : 'normal',
                },
            ];
            return renderStyle(options, pseudo, '.' + rule.name, families);
        }

        case Styles.Single:
            return renderStyle(options, pseudo, '.' + rule.class, [
                { key: rule.prop, value: rule.value },
            ]);

        case Styles.Colored: {
            const [a, b, c, d, e] = Object.values(rule.color);
            return renderStyle(options, pseudo, '.' + rule.class, [
                { key: rule.prop, value: formatColor(a, b, c, d, e) },
            ]);
        }

        case Styles.SpacingStyle: {
            const class_: string = '.' + rule.class,
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
                any: string = '.' + cls.any,
                single: string = '.' + cls.single;
            return renderStyle(
                options,
                pseudo,
                `${class_}${row} > ${any} + ${any}`,
                [{ key: 'margin-left', value: xPx }]
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
                    [{ key: 'margin', value: halfY + ' ' + halfX }]
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
                    [{ key: 'margin-top', value: yPx }]
                ),
                renderStyle(
                    options,
                    pseudo,
                    `${class_}${page} > ${any} + ${any}`,
                    [{ key: 'margin-top', value: yPx }]
                ),
                renderStyle(options, pseudo, `${class_}${page} > ${left}`, [
                    { key: 'margin-right', value: xPx },
                ]),
                renderStyle(options, pseudo, `${class_}${page} > ${right}`, [
                    { key: 'margin-left', value: xPx },
                ]),
                renderStyle(options, pseudo, `${class_}${paragraph}`, [
                    {
                        key: 'line-height',
                        value: `calc(1em + ${rule.y.toString()}px)`,
                    },
                ]),
                renderStyle(options, pseudo, `textarea${any}${class_}`, [
                    {
                        key: 'line-height',
                        value: `calc(1em + ${rule.y.toString()}px)`,
                    },
                    {
                        key: 'height',
                        value: `calc(100% + ${rule.y.toString()}px)`,
                    },
                ]),
                // renderStyle(options, pseudo, `${class_}${paragraph} > ${any}`, [
                //     { key: 'margin-right', value: xPx },
                //     { key: 'margin-bottom', value: yPx },
                // ]),
                renderStyle(
                    options,
                    pseudo,
                    `${class_}${paragraph} > ${left}`,
                    [{ key: 'margin-right', value: xPx }]
                ),
                renderStyle(
                    options,
                    pseudo,
                    `${class_}${paragraph} > ${right}`,
                    [{ key: 'margin-left', value: xPx }]
                ),
                renderStyle(options, pseudo, `${class_}${paragraph}::after`, [
                    {
                        key: 'content',
                        value: `''`,
                    },
                    {
                        key: 'display',
                        value: 'block',
                    },
                    {
                        key: 'height',
                        value: '0',
                    },
                    {
                        key: 'width',
                        value: '0',
                    },
                    {
                        key: 'margin-top',
                        value: _.floor(-1 * (rule.y / 2)).toString() + 'px',
                    },
                ]),
                renderStyle(options, pseudo, `${class_}${paragraph}::before`, [
                    {
                        key: 'content',
                        value: `''`,
                    },
                    {
                        key: 'display',
                        value: 'block',
                    },
                    {
                        key: 'height',
                        value: '0',
                    },
                    {
                        key: 'width',
                        value: '0',
                    },
                    {
                        key: 'margin-bottom',
                        value: _.floor(-1 * (rule.y / 2)).toString() + 'px',
                    },
                ])
            );
        }

        case Styles.PaddingStyle:
            return renderStyle(options, pseudo, '.' + rule.class, [
                {
                    key: 'padding',
                    value: `${rule.top.toString()}px ${rule.right.toString()}px ${rule.bottom.toString()}px ${rule.left.toString()}px`,
                },
            ]);

        case Styles.BorderWidth:
            return renderStyle(options, pseudo, '.' + rule.class, [
                {
                    key: 'padding',
                    value: `${rule.top.toString()}px ${rule.right.toString()}px ${rule.bottom.toString()}px ${rule.left.toString()}px`,
                },
            ]);

        case Styles.GridTemplateStyle: {
            const class_ = `.grid-rows-${rule.rows
                .map((row: Length): string => lengthClassName(row))
                .join('-')}-cols-${rule.columns
                .map((column: Length): string => lengthClassName(column))
                .join('-')}-space-x-${lengthClassName(
                rule.spacing[0]
            )}-space-y-${lengthClassName(rule.spacing[1])}`;

            const toGridLength = (x: Length): string | undefined =>
                toGridLengthHelper(null, null, x);
            const toGridLengthHelper = (
                minimum: number | null,
                maximum: number | null,
                x: Length
            ): string | undefined => {
                switch (x.type) {
                    case Lengths.Px:
                        return x.px.toString() + 'px';

                    case Lengths.Rem:
                        return x.rem.toString() + 'rem';

                    case Lengths.Content:
                        switch ([minimum, maximum]) {
                            case [null, null]:
                                return 'max-content';

                            case [minimum, null]:
                                if (typeof minimum === 'number') {
                                    return `minmax(${minimum.toString()}px, max-content)`;
                                }
                                break;

                            case [null, maximum]:
                                if (typeof maximum === 'number') {
                                    return `minmax(max-content, ${maximum.toString()}px)`;
                                }
                                break;

                            case [minimum, maximum]:
                                if (
                                    typeof minimum === 'number' &&
                                    typeof maximum === 'number'
                                ) {
                                    return `minmax(${minimum.toString()}px, ${maximum.toString()}px)`;
                                }
                                break;
                        }
                        break;

                    case Lengths.Fill:
                        switch ([minimum, maximum]) {
                            case [null, null]:
                                return x.i.toString() + 'fr';

                            case [minimum, null]:
                                if (typeof minimum === 'number') {
                                    return `minmax(${minimum.toString()}px, ${x.i.toString()}frfr)`;
                                }
                                break;

                            case [null, maximum]:
                                if (typeof maximum === 'number') {
                                    return `minmax(max-content, ${maximum.toString()}px)`;
                                }
                                break;

                            case [minimum, maximum]:
                                if (
                                    typeof minimum === 'number' &&
                                    typeof maximum === 'number'
                                ) {
                                    return `minmax(${minimum.toString()}px, ${maximum.toString()}px)`;
                                }
                                break;
                        }
                        break;

                    case Lengths.Min:
                        return toGridLengthHelper(x.min, maximum, x.length);

                    case Lengths.Max:
                        return toGridLengthHelper(minimum, x.max, x.length);

                    case Lengths.MinContent:
                        return 'min-content';

                    case Lengths.MaxContent:
                        return 'max-content';
                }
            };

            const ySpacing = toGridLength(rule.spacing[1]);
            const xSpacing = toGridLength(rule.spacing[0]);

            const msColumns = `-ms-grid-columns: ${rule.columns
                .map((column: Length): string | undefined =>
                    toGridLength(column)
                )
                .join(ySpacing)};`;
            const msRows = `-ms-grid-rows: ${rule.rows
                .map((row: Length): string | undefined => toGridLength(row))
                .join(xSpacing)};`;
            const base = `${class_}{${msColumns}${msRows}}`;

            const columns = `grid-template-columns: ${rule.columns
                .map((column: Length): string | undefined =>
                    toGridLength(column)
                )
                .join(' ')};`;
            const rows = `grid-template-rows: ${rule.rows
                .map((row: Length): string | undefined => toGridLength(row))
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
            const renderPseudoRule = (style: Style_): string[] | undefined =>
                renderStyleRule(options, style, rule.class);
            return rule.styles.flatMap((style: Style_): string[] => {
                const render = renderPseudoRule(style);
                if (typeof render !== 'undefined') {
                    return render;
                }
                return [];
            });
        }

        case Styles.Transform: {
            const value: string | null = transformValue(rule.transform);
            const class_: string | null = transformClass(rule.transform);

            switch ([class_, value]) {
                case [class_, value]:
                    if (
                        typeof class_ === 'string' &&
                        typeof value === 'string'
                    ) {
                        return renderStyle(options, pseudo, '.' + class_, [
                            {
                                key: 'transform',
                                value: value,
                            },
                        ]);
                    }
                    break;

                default:
                    return [];
            }
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

function formatDropShadow(shadow: Shadow) {
    const [a, b, c, d, e] = Object.values(shadow.color);
    return `${shadow.offset[0]}px ${shadow.offset[1]}px ${floatClass(
        shadow.blur
    )}px ${formatColor(a, b, c, d, e)}`;
}

function formatTextShadow(shadow: Shadow) {
    const [a, b, c, d, e] = Object.values(shadow.color);
    return `${shadow.offset[0]}px ${shadow.offset[1]}px ${floatClass(
        shadow.blur
    )}px ${formatColor(a, b, c, d, e)}`;
}

function textShadowClass(shadow: Shadow) {
    const [a, b, c, d, e] = Object.values(shadow.color);
    return `txt${floatClass(shadow.offset[0])}px${floatClass(
        shadow.offset[1]
    )}px${floatClass(shadow.blur)}px${formatColorClass(a, b, c, d, e)}`;
}

function formatBoxShadow(shadow: Shadow) {
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

function boxShadowClass(shadow: Shadow) {
    const [a, b, c, d, e] = Object.values(shadow.color);
    return `${shadow.inset ? 'box-inset' : 'box-'}${floatClass(
        shadow.offset[0]
    )}px${floatClass(shadow.offset[1])}px${floatClass(
        shadow.blur
    )}px${floatClass(shadow.size)}px${formatColorClass(a, b, c, d, e)}`;
}

function floatClass(x: number) {
    return Math.round(x * 255).toString();
}

function formatColor(
    a: number,
    b: number,
    c: number,
    d: number,
    type: Notation = Notation.Hsla
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
    type: Notation = Notation.Hsla
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

function spacingName(x: number, y: number) {
    return `spacing-${x}-${y}`;
}

function paddingName(top: number, right: number, bottom: number, left: number) {
    return `pad-${top}-${right}-${bottom}-${left}`;
}

function paddingNameFloat(
    top: number,
    right: number,
    bottom: number,
    left: number
) {
    return `pad-${floatClass(top)}-${floatClass(right)}-${floatClass(
        bottom
    )}-${floatClass(left)}`;
}

function getStyleName(style: Style): string {
    function name(selector: PseudoClass) {
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
            return style.class;

        case Styles.Colored:
            return style.class;

        case Styles.SpacingStyle:
            return style.class;

        case Styles.BorderWidth:
            return style.class;

        case Styles.PaddingStyle:
            return style.class;

        case Styles.GridTemplateStyle:
            return `grid-rows-${_.map(style.rows, lengthClassName).join(
                '-'
            )}-cols-${_.map(style.columns, lengthClassName).join(
                '-'
            )}-space-x-${lengthClassName(
                style.spacing[0]
            )}-space-y-${lengthClassName(style.spacing[1])}`;

        case Styles.GridPosition:
            return `gp grid-pos-${style.row}-${style.column}-${style.width}-${style.height}`;

        case Styles.Transform: {
            const transform = transformClass(style.transform);
            return transform ? transform : '';
        }

        case Styles.PseudoSelector: {
            return _.map(style.styles, (sty: Style) => {
                switch (getStyleName(sty)) {
                    case '':
                        return '';

                    default:
                        return `${getStyleName(sty)}-${name(style.class)}`;
                }
            }).join(' ');
        }

        case Styles.Transparency:
            return style.name;

        case Styles.Shadows:
            return style.name;
    }
}

export {
    ChannelsColor,
    HslaColor,
    RgbaColor,
    Rgba255Color,
    noStyleSheet,
    variantName,
    renderVariants,
    isSmallCaps,
    hasSmallCaps,
    div,
    htmlClass,
    unstyled,
    addNodeName,
    alignXName,
    alignYName,
    transformClass,
    transformValue,
    composeTransformation,
    skippable,
    gatherAttrRecursive,
    createAttribute,
    createAttributes,
    addNearbyElement,
    renderWidth,
    renderHeight,
    contextClasses,
    families,
    rootStyle,
    renderFontClassName,
    lengthClassName,
    formatDropShadow,
    formatTextShadow,
    textShadowClass,
    formatBoxShadow,
    boxShadowClass,
    floatClass,
    formatColor,
    formatColorClass,
    spacingName,
    paddingName,
    paddingNameFloat,
    getStyleName,
};

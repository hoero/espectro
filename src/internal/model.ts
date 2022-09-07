import { Min, Max } from 'class-validator';
import {
    reduce as foldl,
    words,
    some as any,
    isArray,
    isString,
    isObject,
    map,
    template,
} from 'lodash';

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
} from './flag';
import { classes as cls, dot } from './style';
import NearbyElement from './NearbyElement.svelte';
import {
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
    SvelteComponentProps,
    HAlign,
    VAlign,
    TransformComponent,
    TransformComponents,
    Shadow,
    PseudoClass,
    Single,
} from './data';

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

const div = NodeNames.Generic;

const noStyleSheet = EmbedStyles.NoStyleSheet;

function renderVariant(variant: Variant) {
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
            if (isObject(variant)) {
                return `\'${variant.name}\' ${variant.index}`;
            }
            return '';
    }
}

function variantName(variant: Variant) {
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
            if (isString(variant.name)) {
                return variant.name === 'smcp';
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

function transformValue(transform: Transformation) {
    switch (transform.type) {
        case Transformations.Untransformed:
            return null;

        case Transformations.Moved:
            if (isArray(transform.xyz)) {
                return `translate3d(${transform.xyz[0]}px, ${transform.xyz[1]}px, ${transform.xyz[2]}px)`;
            }
            return null;

        case Transformations.FullTransform:
            if (isObject(transform) && !isArray(transform)) {
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

        case Transformations.Moved:
            if (isArray(transform.xyz)) {
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
            if (isObject(transform) && !isArray(transform)) {
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
    } else {
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
}

function gatherAttrRecursive(
    classes: string,
    node: NodeName,
    has: Field,
    transform: Transformation,
    styles: Style[],
    attrs: globalThis.Attr[],
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

                default:
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

                            case Descriptions.LivePolite:
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
                        } else {
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
                        }

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

                    case Attributes.AlignY:
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
                        } else {
                            const flags = add(yAlign, has);
                            const align = attr.y;

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

                    case Attributes.AlignX:
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
                        } else {
                            const flags = add(xAlign, has);
                            const align = attr.x;

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
                        } else {
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
                                                (attr_) =>
                                                    attr_.type !== attr.type
                                            )
                                        );
                                    } else {
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
                                                    value: `${
                                                        attr.width.i * 100000
                                                    }`,
                                                },
                                                ...styles,
                                            ],
                                            attrs,
                                            children,
                                            elementAttrs.filter(
                                                (attr_) =>
                                                    attr_.type !== attr.type
                                            )
                                        );
                                    }

                                default:
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
                        } else {
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
                                                (attr_) =>
                                                    attr_.type !== attr.type
                                            )
                                        );
                                    } else {
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
                                                    value: `${
                                                        attr.height.i * 100000
                                                    }`,
                                                },
                                                ...styles,
                                            ],
                                            attrs,
                                            children,
                                            elementAttrs.filter(
                                                (attr_) =>
                                                    attr_.type !== attr.type
                                            )
                                        );
                                    }

                                default:
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

function createAttribute(attribute: string, value: string) {
    const attr = document.createAttribute(attribute);
    attr.value = value;
    return attr;
}

function createAttributes(attributes: globalThis.Attr[]) {
    let attrs = [];

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
    type Props = SvelteComponentProps<typeof NearbyElement>;

    let props: Props = {
        location,
        element,
    };

    let nearby = new NearbyElement({
        target: new Element(),
        props,
    });

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
            } else {
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
            }

        case Lengths.MinContent:
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

        case Lengths.MaxContent:
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
}

function renderHeight(w: Length): [Field, string, Style[]] {
    switch (w.type) {
        case Lengths.Px:
            return [
                none,
                `${cls.heightExact} height-px-${w.px}`,
                [
                    {
                        type: Styles.Single,
                        class: `height-px-${w.px}`,
                        prop: 'height',
                        value: `${w.px}px`,
                    },
                ],
            ];

        case Lengths.Rem:
            return [
                none,
                `${cls.heightExact} height-rem-${w.rem}`,
                [
                    {
                        type: Styles.Single,
                        class: `height-rem-${w.rem}`,
                        prop: 'height',
                        value: `${w.rem}rem`,
                    },
                ],
            ];

        case Lengths.Content:
            return [add(heightContent, none), cls.heightContent, []];

        case Lengths.Fill:
            if (w.i === 1) {
                return [add(heightFill, none), cls.heightFill, []];
            } else {
                return [
                    add(heightFill, none),
                    `${cls.heightFillPortion} height-fill-${w.i}`,
                    [
                        {
                            type: Styles.Single,
                            class: `${cls.any}.${cls.column} > ${dot(
                                `height-fill-${w.i}`
                            )}`,
                            prop: 'flex-grow',
                            value: `${w.i * 100000}`,
                        },
                    ],
                ];
            }

        case Lengths.MinContent:
            const minCls = `min-height-${w.min}`,
                minStyle: Single = {
                    type: Styles.Single,
                    class: minCls,
                    prop: 'min-height',
                    // This needs to be !important because we're using `min-height: min-content`
                    // to correct for safari's incorrect implementation of flexbox.
                    value: `${w.min}px !important`,
                },
                [minFlag, minAttrs, newMinStyle] = renderHeight(w.length);

            return [
                add(heightBetween, minFlag),
                `${minCls} ${minAttrs}`,
                [minStyle, ...newMinStyle],
            ];

        case Lengths.MaxContent:
            const max = `max-height-${w.max}`,
                maxStyle: Single = {
                    type: Styles.Single,
                    class: max,
                    prop: 'max-height',
                    value: `${w.max}px`,
                },
                [maxFlag, maxAttrs, newMaxStyle] = renderHeight(w.length);

            return [
                add(heightBetween, maxFlag),
                `${max} ${maxAttrs}`,
                [maxStyle, ...newMaxStyle],
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

        case Lengths.MinContent:
            return `min${x.min}${lengthClassName(x)}`;

        case Lengths.MaxContent:
            return `max${x.max}${lengthClassName(x)}`;
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
            return style.name;

        case Styles.BorderWidth:
            return style.class;

        case Styles.PaddingStyle:
            return style.name;

        case Styles.GridTemplateStyle:
            return `grid-rows-${map(style.rows, lengthClassName).join(
                '-'
            )}-cols-${map(style.columns, lengthClassName).join(
                '-'
            )}-space-x-${lengthClassName(
                style.spacing[0]
            )}-space-y-${lengthClassName(style.spacing[1])}`;

        case Styles.GridPosition:
            return `gp grid-pos-${style.row}-${style.column}-${style.width}-${style.height}`;

        case Styles.Transform:
            const transform = transformClass(style.transform);
            return transform ? transform : '';

        case Styles.PseudoSelector:
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
            return map(style.styles, (sty) => {
                switch (getStyleName(sty)) {
                    case '':
                        return '';

                    default:
                        return `${getStyleName(sty)}-${name(style.class)}`;
                }
            }).join(' ');

        case Styles.Transparency:
            return style.name;

        case Styles.Shadows:
            return style.name;
    }
}

export {
    Notation,
    ChannelsColor,
    HslaColor,
    RgbaColor,
    Rgba255Color,
    rootStyle,
    Lengths,
};

/**TODO:
 * @docs color


## Border Widths

@docs width, widthXY, widthEach


## Border Styles

@docs solid, dashed, dotted


## Rounded Corners

@docs rounded, roundEach


## Shadows

@docs glow, innerGlow, shadow, innerShadow
 */

import {
    Attribute,
    BorderWidth,
    Class,
    Color,
    Colored,
    Shadow,
    Single,
    StyleClass,
} from '../internal/data.ts';
import {
    borderColor as borderColor_,
    borderRound,
    borderStyle,
    borderWidth,
    shadows,
} from '../internal/flag.ts';
import {
    boxShadowClass,
    formatBoxShadow,
    formatColorClass,
} from '../internal/model.ts';
import { classes } from '../internal/style.ts';

const solid: Attribute = Class(borderStyle, classes.borderSolid),
    dashed: Attribute = Class(borderStyle, classes.borderDashed),
    dotted: Attribute = Class(borderStyle, classes.borderDotted);

/**TODO:
 *
 * @param clr
 * @returns
 */
function color(borderColor: Color): Attribute {
    if (typeof borderColor === 'string')
        throw new Error('Please do not provide a color as a string.');
    const [a, b, c, d, e] = Object.values(borderColor);
    return StyleClass(
        borderColor_,
        Colored(
            `bc-${formatColorClass(a, b, c, d, e)}`,
            'border-color',
            borderColor
        )
    );
}

/**TODO:
 *
 * @param v
 * @returns
 */
function width(v: number): Attribute {
    return StyleClass(borderWidth, BorderWidth('b-' + v, v, v, v, v));
}

/** TODO:
 * Set horizontal and vertical borders.
 * @param x
 * @param y
 * @returns
 */
function widthXY(x: number, y: number): Attribute {
    return StyleClass(borderWidth, BorderWidth('b-' + x + '-' + y, y, x, y, x));
}

/**TODO:
 *
 * @param param0
 * @returns
 */
function widthEach({
    bottom,
    left,
    right,
    top,
}: {
    bottom: number;
    left: number;
    right: number;
    top: number;
}): Attribute {
    if (top === bottom && left === right) {
        if (top === right) return width(top);
        return widthXY(left, top);
    } else {
        return StyleClass(
            borderWidth,
            BorderWidth(
                `b-${top}-${right}-${bottom}-${left}`,
                top,
                right,
                bottom,
                right
            )
        );
    }
}

/**TODO:
 * Round all corners.
 * @param radius
 * @returns
 */
function rounded(radius: number): Attribute {
    return StyleClass(
        borderRound,
        Single('br-' + radius, 'border-radius', radius + 'px')
    );
}

/**TODO:
 * Round all corners.
 * @param radius
 * @returns
 */
function roundEach({
    topLeft,
    topRight,
    bottomLeft,
    bottomRight,
}: {
    topLeft: number;
    topRight: number;
    bottomLeft: number;
    bottomRight: number;
}): Attribute {
    return StyleClass(
        borderRound,
        Single(
            `br-${topLeft}-${topRight}${bottomLeft}-${bottomRight}`,
            'border-radius',
            `${topLeft}px ${topRight}px ${bottomRight}px ${bottomLeft}px `
        )
    );
}

/**
 * TODO:
 * @param clr
 * @param size
 * @returns
 */
function glow(clr: Color, size: number): Attribute {
    if (typeof clr === 'string')
        throw new Error('Please do not provide a color as a string.');
    return shadow(Shadow(clr, [0, 0], size * 2, size));
}

/**
 * TODO:
 * @param clr
 * @param size
 * @returns
 */
function innerGlow(clr: Color, size: number): Attribute {
    if (typeof clr === 'string')
        throw new Error('Please do not provide a color as a string.');
    return innerShadow(Shadow(clr, [0, 0], size * 2, size));
}

/**
 * TODO:
 * @param param0
 * @returns
 */
function shadow({
    offset,
    size,
    blur,
    color,
}: {
    offset: [number, number];
    size: number;
    blur: number;
    color: Color;
}): Attribute {
    if (typeof color === 'string')
        throw new Error('Please do not provide a color as a string.');
    const shade = Shadow(color, offset, blur, size, false);
    return StyleClass(
        shadows,
        Single(boxShadowClass(shade), 'box-shadow', formatBoxShadow(shade))
    );
}

/**
 * TODO:
 * @param param0
 * @returns
 */
function innerShadow({
    offset,
    size,
    blur,
    color,
}: {
    offset: [number, number];
    size: number;
    blur: number;
    color: Color;
}): Attribute {
    if (typeof color === 'string')
        throw new Error('Please do not provide a color as a string.');
    const shade = Shadow(color, offset, blur, size, true);
    return StyleClass(
        shadows,
        Single(boxShadowClass(shade), 'box-shadow', formatBoxShadow(shade))
    );
}

export {
    color,
    width,
    widthXY,
    widthEach,
    solid,
    dashed,
    dotted,
    rounded,
    roundEach,
    glow,
    innerGlow,
    shadow,
    innerShadow,
};

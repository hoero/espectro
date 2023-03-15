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
    Colored,
    Hsla,
    Rgba,
    Shadow,
    Single,
    StyleClass,
} from '../internal/data.ts';
import * as Flag from '../internal/flag.ts';
import * as Internal from '../internal/model.ts';
import { classes } from '../internal/style.ts';

const solid: Attribute = Class(Flag.borderStyle, classes.borderSolid),
    dashed: Attribute = Class(Flag.borderStyle, classes.borderDashed),
    dotted: Attribute = Class(Flag.borderStyle, classes.borderDotted);

/**TODO:
 *
 * @param clr
 * @returns
 */
async function color(borderColor: Promise<Hsla | Rgba>): Promise<Attribute> {
    const val = await borderColor;
    const [a, b, c, d, e] = Object.values(val);
    return StyleClass(
        Flag.borderColor,
        Colored(
            `bc-${Internal.formatColorClass(a, b, c, d, e)}`,
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
    return StyleClass(Flag.borderWidth, BorderWidth('b-' + v, v, v, v, v));
}

/** TODO:
 * Set horizontal and vertical borders.
 * @param x
 * @param y
 * @returns
 */
function widthXY(x: number, y: number): Attribute {
    return StyleClass(
        Flag.borderWidth,
        BorderWidth('b-' + x + '-' + y, y, x, y, x)
    );
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
            Flag.borderWidth,
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
        Flag.borderRound,
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
        Flag.borderRound,
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
async function glow(
    clr: Promise<Hsla | Rgba>,
    size: number
): Promise<Attribute> {
    return await shadow(Shadow(clr, [0, 0], size * 2, size));
}

/**
 * TODO:
 * @param clr
 * @param size
 * @returns
 */
async function innerGlow(
    clr: Promise<Hsla | Rgba>,
    size: number
): Promise<Attribute> {
    return await innerShadow(Shadow(clr, [0, 0], size * 2, size));
}

/**
 * TODO:
 * @param param0
 * @returns
 */
async function shadow({
    offset,
    size,
    blur,
    color,
}: {
    offset: [number, number];
    size: number;
    blur: number;
    color: Promise<Hsla | Rgba>;
}): Promise<Attribute> {
    const shade = Shadow(color, offset, blur, size, false);
    return StyleClass(
        Flag.shadows,
        Single(
            await Internal.boxShadowClass(shade),
            'box-shadow',
            await Internal.formatBoxShadow(shade)
        )
    );
}

/**
 * TODO:
 * @param param0
 * @returns
 */
async function innerShadow({
    offset,
    size,
    blur,
    color,
}: {
    offset: [number, number];
    size: number;
    blur: number;
    color: Promise<Hsla | Rgba>;
}): Promise<Attribute> {
    const shade = Shadow(color, offset, blur, size, true);
    return StyleClass(
        Flag.shadows,
        Single(
            await Internal.boxShadowClass(shade),
            'box-shadow',
            await Internal.formatBoxShadow(shade)
        )
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

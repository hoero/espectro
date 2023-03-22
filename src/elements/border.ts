/**
 * @docs color
 *
 * ## Border Widths
 *
 * @docs width, widthXY, widthEach
 *
 * ## Border Styles
 *
 * @docs solid, dashed, dotted
 *
 * ## Rounded Corners
 *
 * @docs rounded, roundEach
 *
 * ## Shadows
 *
 * @docs glow, innerGlow, shadow, innerShadow
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
import * as Flag from '../internal/flag.ts';
import * as Internal from '../internal/model.ts';
import { classes } from '../internal/style.ts';

const solid: Attribute = Class(Flag.borderStyle, classes.borderSolid),
    dashed: Attribute = Class(Flag.borderStyle, classes.borderDashed),
    dotted: Attribute = Class(Flag.borderStyle, classes.borderDotted);

async function color(borderColor: Promise<Color>): Promise<Attribute> {
    const val = await borderColor;
    const [a, b, c, d, e] = Object.values(val);
    return StyleClass(
        Flag.borderColor,
        Colored(
            `bc-${Internal.formatColorClass(a, b, c, d, e)}`,
            'border-color',
            val
        )
    );
}

function width(v: number): Attribute {
    return StyleClass(Flag.borderWidth, BorderWidth('b-' + v, v, v, v, v));
}

/** Set horizontal and vertical borders. */
function widthXY(x: number, y: number): Attribute {
    return StyleClass(
        Flag.borderWidth,
        BorderWidth('b-' + x + '-' + y, y, x, y, x)
    );
}

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

/** Round all corners. */
function rounded(radius: number): Attribute {
    return StyleClass(
        Flag.borderRound,
        Single('br-' + radius, 'border-radius', radius + 'px')
    );
}

/** Round all corners. */
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

async function glow(clr: Promise<Color>, size: number): Promise<Attribute> {
    return await shadow(Shadow(clr, [0, 0], size * 2, size));
}

async function innerGlow(
    clr: Promise<Color>,
    size: number
): Promise<Attribute> {
    return await innerShadow(Shadow(clr, [0, 0], size * 2, size));
}

async function shadow({
    offset,
    size,
    blur,
    color,
}: {
    offset: [number, number];
    size: number;
    blur: number;
    color: Promise<Color>;
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

async function innerShadow({
    offset,
    size,
    blur,
    color,
}: {
    offset: [number, number];
    size: number;
    blur: number;
    color: Promise<Color>;
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

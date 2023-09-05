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
    Rem,
    Shadow,
    Single,
    StyleClass,
} from '../internal/data.ts';
import * as Flag from '../internal/flag.ts';
import * as Internal from '../internal/model.ts';
import { classes } from '../internal/style.ts';
import { oneRem } from '../units/rem.ts';

const solid: Attribute = Class(Flag.borderStyle, classes.borderSolid),
    dashed: Attribute = Class(Flag.borderStyle, classes.borderDashed),
    dotted: Attribute = Class(Flag.borderStyle, classes.borderDotted);

function color(borderColor: Color): Attribute {
    const [a, b, c, d, e] = Object.values(borderColor);
    return StyleClass(
        Flag.borderColor,
        Colored(
            `bc-${Internal.formatColorClass(a, b, c, d, e)}`,
            'border-color',
            borderColor
        )
    );
}

function width(v: number | Rem): Attribute {
    return StyleClass(
        Flag.borderWidth,
        BorderWidth(
            typeof v !== 'number'
                ? `b-${Math.round(v.rem * oneRem)}-rem`
                : `b-${v}`,
            v,
            v,
            v,
            v
        )
    );
}

/** Set horizontal and vertical borders. */
function widthXY(x: number | Rem, y: number | Rem): Attribute {
    return StyleClass(
        Flag.borderWidth,
        BorderWidth(
            typeof x !== 'number' && typeof y !== 'number'
                ? `b-${Math.round(x.rem * oneRem)}-${Math.round(
                      y.rem * oneRem
                  )}-rem`
                : `b-${x}-${y}`,
            y,
            x,
            y,
            x
        )
    );
}

function widthEach({
    bottom,
    left,
    right,
    top,
}:
    | {
          bottom: number;
          left: number;
          right: number;
          top: number;
      }
    | {
          bottom: Rem;
          left: Rem;
          right: Rem;
          top: Rem;
      }): Attribute {
    if (
        (top === bottom && left === right) ||
        (typeof bottom !== 'number' &&
            typeof left !== 'number' &&
            typeof right !== 'number' &&
            typeof top !== 'number' &&
            top.rem === bottom.rem &&
            left.rem === right.rem)
    ) {
        if (
            top === right ||
            (typeof bottom !== 'number' &&
                typeof left !== 'number' &&
                typeof right !== 'number' &&
                typeof top !== 'number' &&
                top.rem === right.rem)
        )
            return width(top);
        return widthXY(left, top);
    } else {
        return StyleClass(
            Flag.borderWidth,
            BorderWidth(
                typeof bottom !== 'number' &&
                    typeof left !== 'number' &&
                    typeof right !== 'number' &&
                    typeof top !== 'number'
                    ? `b-${Math.round(top.rem * oneRem)}-${Math.round(
                          right.rem * oneRem
                      )}-${Math.round(bottom.rem * oneRem)}-${Math.round(
                          left.rem * oneRem
                      )}-rem`
                    : `b-${top}-${right}-${bottom}-${left}`,
                top,
                right,
                bottom,
                left
            )
        );
    }
}

/** Round all corners. */
function rounded(radius: number | Rem): Attribute {
    return StyleClass(
        Flag.borderRound,
        Single(
            typeof radius !== 'number'
                ? `br-${Math.round(radius.rem * oneRem)}-rem`
                : `br-${radius}`,
            'border-radius',
            typeof radius !== 'number' ? `${radius.rem}rem` : `${radius}px`
        )
    );
}

/** Round all corners. */
function roundEach({
    topLeft,
    topRight,
    bottomLeft,
    bottomRight,
}: {
    topLeft: number | Rem;
    topRight: number | Rem;
    bottomLeft: number | Rem;
    bottomRight: number | Rem;
}): Attribute {
    return StyleClass(
        Flag.borderRound,
        Single(
            typeof topLeft !== 'number' &&
                typeof topRight !== 'number' &&
                typeof bottomLeft !== 'number' &&
                typeof bottomRight !== 'number'
                ? `br-${Math.round(topLeft.rem * oneRem)}-${Math.round(
                      topRight.rem * oneRem
                  )}${Math.round(bottomLeft.rem * oneRem)}-${Math.round(
                      bottomRight.rem * oneRem
                  )}-rem`
                : `br-${topLeft}-${topRight}${bottomLeft}-${bottomRight}`,
            'border-radius',
            `${topLeft}px ${topRight}px ${bottomRight}px ${bottomLeft}px `
        )
    );
}

function glow(clr: Color, size: number): Attribute {
    return shadow(Shadow(clr, [0, 0], size * 2, size));
}

function innerGlow(clr: Color, size: number): Attribute {
    return innerShadow(Shadow(clr, [0, 0], size * 2, size));
}

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
    const shade = Shadow(color, offset, blur, size, false);
    return StyleClass(
        Flag.shadows,
        Single(
            Internal.boxShadowClass(shade),
            'box-shadow',
            Internal.formatBoxShadow(shade)
        )
    );
}

function shadows(shadows: Shadow[]): Attribute {
    const shade = shadows[0];
    return StyleClass(
        Flag.shadows,
        Single(
            'shadows-' + Internal.boxShadowClass(shade),
            'box-shadow',
            shadows.map((shade) => Internal.formatBoxShadow(shade)).join(', ')
        )
    );
}

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
    const shade = Shadow(color, offset, blur, size, true);
    return StyleClass(
        Flag.shadows,
        Single(
            Internal.boxShadowClass(shade),
            'box-shadow',
            Internal.formatBoxShadow(shade)
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
    shadows,
};

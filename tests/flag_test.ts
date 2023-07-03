import {
    Field,
    Flag,
    Flags,
    active,
    add,
    behind,
    bgColor,
    borderColor,
    borderRound,
    borderStyle,
    borderWidth,
    centerX,
    cursor,
    flag,
    focus,
    fontFamily,
    fontSize,
    height,
    heightContent,
    hover,
    moveX,
    moveY,
    none,
    padding,
    present,
    scale,
    shadows,
    spacing,
    transparency,
    width,
    widthFill,
    xAlign,
} from '../src/internal/flag.ts';
import { asserts } from '../test_deps.ts';

const flags: Flag[] = [
        padding,
        spacing,
        fontSize,
        fontFamily,
        width,
        height,
        bgColor,
        borderStyle,
        borderRound,
        shadows,
        cursor,
        scale,
        moveX,
        moveY,
        borderWidth,
        borderColor,
        xAlign,
        focus,
        active,
        hover,
        widthFill,
        heightContent,
        centerX,
    ],
    fields: Field[] = [];

flags.map((flag) => add(flag, fields));

Deno.test('No flag', () => {
    asserts.assertEquals(present(flag(1), [none]), false);
});

Deno.test('Is transparent?', () => {
    asserts.assertEquals(present(transparency, fields), false);
});

Deno.test('Is behind?', () => {
    asserts.assertEquals(present(behind, fields), false);
});

Deno.test('Is flag?', () => {
    asserts.assertStrictEquals(width.type, Flags.Flag);
});

Deno.test('Is second?', () => {
    asserts.assertStrictEquals(active.type, Flags.Second);
});

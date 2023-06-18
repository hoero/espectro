import { asserts } from '../test_deps.ts';
import {
    fromHsl,
    fromHsla,
    fromRgb,
    fromRgba,
    hsl,
    hsla,
    rgb,
    rgb255,
    rgba,
    rgba255,
    toHsl,
    toHsla,
    toRgb,
    toRgb255,
    toRgba,
    toRgba255,
} from '../src/color.ts';
import { Hsla, Rgba, Notation } from '../src/internal/data.ts';

// HSL

Deno.test('Is hsl', () => {
    const color = hsl(0, 0, 0);
    asserts.assertStrictEquals(color.type, Notation.Hsl);
});

Deno.test('Is hsla', () => {
    const color = hsla(0, 0, 0, 1);
    asserts.assertStrictEquals(color.type, Notation.Hsla);
});

Deno.test('From hsl', () => {
    const [hue, saturation, lightness] = fromHsl(
        Hsla(0, 0, 100, 1, Notation.Hsl)
    );
    const _color = hsl(hue, saturation, lightness);
    asserts.assertArrayIncludes(
        [hue, saturation, lightness, 1],
        [0, 0, 100, 1]
    );
});

Deno.test('From hsla', () => {
    const from = fromHsla(Hsla(0, 0, 100, 1, Notation.Hsla));
    const _color = hsla(...from);
    asserts.assertArrayIncludes(from, [0, 0, 100, 1]);
});

Deno.test('To hsl', () => {
    const color = toHsl([0, 0, 100, 1]);
    asserts.assertStrictEquals(color.type, Notation.Hsl);
});

Deno.test('To hsla', () => {
    const color = toHsla([0, 0, 100, 1]);
    asserts.assertStrictEquals(color.type, Notation.Hsla);
});

// RGB

Deno.test('Is rgb', () => {
    const color = rgb(0, 0, 0);
    asserts.assertStrictEquals(color.type, Notation.Rgb);
});

Deno.test('Is rgba', () => {
    const color = rgba(0, 0, 0, 1);
    asserts.assertStrictEquals(color.type, Notation.Rgba);
});

Deno.test('Is rgb255', () => {
    const color = rgb255(0, 0, 0);
    asserts.assertStrictEquals(color.type, Notation.Rgb255);
});

Deno.test('Is rgba255', () => {
    const color = rgba255(0, 0, 0, 1);
    asserts.assertStrictEquals(color.type, Notation.Rgba255);
});

Deno.test('From rgb', () => {
    const [red, green, blue] = fromRgb(Rgba(0, 0, 0, 1, Notation.Rgb));
    const _color = rgb(red, green, blue);
    asserts.assertArrayIncludes([red, green, blue, 1], [0, 0, 0, 1]);
});

Deno.test('From rgba', () => {
    const from = fromRgba(Rgba(0, 0, 0, 1, Notation.Rgb));
    const _color = rgba(...from);
    asserts.assertArrayIncludes(from, [0, 0, 0, 1]);
});

Deno.test('To rgb', () => {
    const color = toRgb([0, 0, 0, 1]);
    asserts.assertStrictEquals(color.type, Notation.Rgb);
});

Deno.test('To rgba', () => {
    const color = toRgba([0, 0, 0, 1]);
    asserts.assertStrictEquals(color.type, Notation.Rgba);
});

Deno.test('To rgb255', () => {
    const color = toRgb255([0, 0, 0, 1]);
    asserts.assertStrictEquals(color.type, Notation.Rgb255);
});

Deno.test('To rgba255', () => {
    const color = toRgba255([0, 0, 0, 1]);
    asserts.assertStrictEquals(color.type, Notation.Rgba255);
});

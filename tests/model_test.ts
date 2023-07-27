import { elmish } from '../deps.ts';
import { hsl } from '../src/color.ts';
import {
    FullTransform,
    Moved,
    Notation,
    Rem,
    Shadow,
    VariantActive,
    VariantIndexed,
    VariantOff,
} from '../src/internal/data.ts';
import {
    formatBoxShadow,
    formatColor,
    formatColorClass,
    formatShadow,
    paddingName,
    paddingNameFloat,
    renderVariant,
    spacingName,
    textShadowClass,
    transformClass,
    variantName,
} from '../src/internal/model.ts';
import { asserts } from '../test_deps.ts';

const { withDefault } = elmish.Maybe;

const active = VariantActive('smcp'),
    off = VariantOff('smcp'),
    indexed = VariantIndexed('smcp', 1);

const moved = Moved([11, 5, 0]),
    movedRem = Moved([Rem(1.1), Rem(0.5), Rem(0)]);

const fullTransform = FullTransform(
        [11, 5, 0],
        [1, 1, 1],
        [0, 0, 1],
        -0.7853981634
    ),
    fullTransformRem = FullTransform(
        [Rem(1.1), Rem(0.5), Rem(0)],
        [1, 1, 1],
        [0, 0, 1],
        -0.7853981634
    );

const shadow = Shadow(hsl(0, 0, 93), [0, 0], 1, 1);

const white = [0, 0, 100, 1, Notation.Hsl],
    charcoal = [84, 2, 53, 0.8, Notation.Hsla],
    black = [0, 0, 0, Notation.Rgb],
    grayDarkest = [0.1, 0.1, 0.1, 0.5, Notation.Rgba],
    body = [40, 40, 40, Notation.Rgb255],
    heading = [230, 150, 20, 1, Notation.Rgba255];

Deno.test('Render variant active', () => {
    asserts.assertEquals(renderVariant(active), "'smcp'");
});

Deno.test('Render variant off', () => {
    asserts.assertEquals(renderVariant(off), "'smcp' 0");
});

Deno.test('Render variant indexed', () => {
    asserts.assertEquals(renderVariant(indexed), "'smcp' 1");
});

Deno.test('Variant active name', () => {
    asserts.assertEquals(variantName(active), 'smcp');
});

Deno.test('Variant off name', () => {
    asserts.assertEquals(variantName(off), 'smcp-0');
});

Deno.test('Variant indexed name', () => {
    asserts.assertEquals(variantName(indexed), 'smcp-1');
});

Deno.test('Move class', () => {
    const cls = withDefault('', transformClass(moved));
    asserts.assertEquals(cls, 'mv-2805-1275-0');
});

Deno.test('Move class rem', () => {
    const cls = withDefault('', transformClass(movedRem));
    asserts.assertEquals(cls, 'mv-2805-1275-0');
});

Deno.test('Full transform class', () => {
    const cls = withDefault('', transformClass(fullTransform));
    asserts.assertEquals(cls, 'tfrm-2805-1275-0-255-255-255-0-0-255--200');
});

Deno.test('Full transform class rem', () => {
    const cls = withDefault('', transformClass(fullTransformRem));
    asserts.assertEquals(cls, 'tfrm-2805-1275-0-255-255-255-0-0-255--200');
});

Deno.test('Format shadow', () => {
    asserts.assertEquals(formatShadow(shadow), '0px 0px 1px hsl(0, 0%, 93%)');
});

Deno.test('Text shadow class', () => {
    asserts.assertEquals(textShadowClass(shadow), 'txt-0-0-255-0-0-93');
});

Deno.test('Format box shadow', () => {
    asserts.assertEquals(
        formatBoxShadow(shadow),
        '0px 0px 1px 1px hsl(0, 0%, 93%)'
    );
});

Deno.test('Box shadow class', () => {
    asserts.assertEquals(textShadowClass(shadow), 'txt-0-0-255-0-0-93');
});

Deno.test('Format color hsl', () => {
    const [a, b, c, d] = white;
    asserts.assertEquals(formatColor(a, b, c, d), 'hsl(0, 0%, 100%)');
});

Deno.test('Format color hsla', () => {
    const [a, b, c, d, e] = charcoal;
    asserts.assertEquals(formatColor(a, b, c, d, e), 'hsla(84, 2%, 53%, 0.8)');
});

Deno.test('Format color rgb', () => {
    const [a, b, c, d] = black;
    asserts.assertEquals(formatColor(a, b, c, 1, d), 'rgb(0, 0, 0)');
});

Deno.test('Format color rgba', () => {
    const [a, b, c, d, e] = grayDarkest;
    asserts.assertEquals(formatColor(a, b, c, d, e), 'rgba(26, 26, 26, 0.5)');
});

Deno.test('Format color rgb255', () => {
    const [a, b, c, d] = body;
    asserts.assertEquals(formatColor(a, b, c, 1, d), 'rgb(40, 40, 40)');
});

Deno.test('Format color rgba255', () => {
    const [a, b, c, d, e] = heading;
    asserts.assertEquals(formatColor(a, b, c, d, e), 'rgba(230, 150, 20, 1)');
});

Deno.test('Format color class hsl', () => {
    const [a, b, c, d] = white;
    asserts.assertEquals(formatColorClass(a, b, c, d), '0-0-100');
});

Deno.test('Format color class hsla', () => {
    const [a, b, c, d, e] = charcoal;
    asserts.assertEquals(formatColorClass(a, b, c, d, e), '84-2-53-80');
});

Deno.test('Format color class rgb', () => {
    const [a, b, c, d] = black;
    asserts.assertEquals(formatColorClass(a, b, c, 1, d), '0-0-0');
});

Deno.test('Format color class rgba', () => {
    const [a, b, c, d, e] = grayDarkest;
    asserts.assertEquals(formatColorClass(a, b, c, d, e), '26-26-26-128');
});

Deno.test('Format color class rgb255', () => {
    const [a, b, c, d] = body;
    asserts.assertEquals(formatColorClass(a, b, c, 1, d), '40-40-40');
});

Deno.test('Format color class rgba255', () => {
    const [a, b, c, d, e] = heading;
    asserts.assertEquals(formatColorClass(a, b, c, d, e), '230-150-20-100');
});

Deno.test('Spacing name', () => {
    asserts.assertEquals(spacingName(8, 8), 'spacing-8-8');
});

Deno.test('Spacing name rem', () => {
    asserts.assertEquals(spacingName(Rem(8), Rem(8)), 'spacing-80-80-rem');
});

Deno.test('Padding name', () => {
    asserts.assertEquals(paddingName(8, 8, 8, 8), 'pad-8-8-8-8');
});

Deno.test('Padding name rem', () => {
    asserts.assertEquals(
        paddingName(Rem(1), Rem(1), Rem(1), Rem(1)),
        'pad-10-10-10-10-rem'
    );
});

Deno.test('Padding name float', () => {
    asserts.assertEquals(
        paddingNameFloat(8, 8, 8, 8),
        'pad-2040-2040-2040-2040'
    );
});

Deno.test('Padding name float rem', () => {
    asserts.assertEquals(
        paddingNameFloat(Rem(1), Rem(1), Rem(1), Rem(1)),
        'pad-2550-2550-2550-2550'
    );
});

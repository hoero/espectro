/**TODO:
 * 
    import Element
    import Element.Font as Font

    view =
        Element.el
            [ Font.color (Element.rgb 0 0 1)
            , Font.size 18
            , Font.family
                [ Font.typeface "Open Sans"
                , Font.sansSerif
                ]
            ]
            (Element.text "Woohoo, I'm stylish text")

**Note:** `Font.color`, `Font.size`, and `Font.family` are inherited, meaning you can set them at the top of your view and all subsequent nodes will have that value.

**Other Note:** If you're looking for something like `line-height`, it's handled by `Element.spacing` on a `paragraph`.

@docs color, size


## Typefaces

@docs family, Font, typeface, serif, sansSerif, monospace

@docs external


## Alignment and Spacing

@docs alignLeft, alignRight, center, justify, letterSpacing, wordSpacing


## Font Styles

@docs underline, strike, italic, unitalicized


## Font Weight

@docs heavy, extraBold, bold, semiBold, medium, regular, light, extraLight, hairline


## Variants

@docs Variant, variant, variantList, smallCaps, slashedZero, ligatures, ordinal, tabularNumbers, stackedFractions, diagonalFractions, swash, feature, indexed


## Shadows

@docs glow, shadow
 */

import {
    Adjustment,
    Attribute,
    Class,
    Color,
    Colored,
    Font,
    FontFamily,
    FontSize,
    FontWith,
    ImportFont,
    Maybe,
    Monospace,
    Property,
    SansSerif,
    Serif,
    Shadow,
    Single,
    StyleClass,
    Style_,
    Typeface,
    Variant,
    VariantActive,
    VariantIndexed,
    Variants,
} from '../internal/data.ts';
import {
    fontAlignment,
    fontColor as fontColor_,
    fontFamily,
    fontSize,
    fontVariant,
    fontWeight,
    letterSpacing as letterSpacing_,
    txtShadows,
    wordSpacing as wordSpacing_,
} from '../internal/flag.ts';
import {
    floatClass,
    formatColorClass,
    formatTextShadow,
    htmlClass,
    renderFontClassName,
    renderVariant,
    textShadowClass,
    variantName,
} from '../internal/model.ts';
import { classes } from '../internal/style.ts';

// Font
const serif: Font = Serif(),
    sansSerif: Font = SansSerif(),
    monospace: Font = Monospace();

// Size
const _sizeByCapital: Attribute = htmlClass(classes.sizeByCapital),
    _full: Attribute = htmlClass(classes.fullSize);

// Alignment
/**
 * Align the font to the left.
 */
const alignLeft: Attribute = Class(fontAlignment, classes.textLeft);

/**
 * Align the font to the right.
 */
const alignRight: Attribute = Class(fontAlignment, classes.textRight);

/**
 * Center align the font.
 */
const center: Attribute = Class(fontAlignment, classes.textCenter);

const justify: Attribute = Class(fontAlignment, classes.textJustify);

const underline: Attribute = htmlClass(classes.underline),
    strike: Attribute = htmlClass(classes.strike),
    italic: Attribute = htmlClass(classes.italic);

// Font Weight
const hairline: Attribute = Class(fontWeight, classes.textThin),
    thin: Attribute = hairline,
    extraLight: Attribute = Class(fontWeight, classes.textExtraLight),
    ultraLight: Attribute = extraLight,
    light: Attribute = Class(fontWeight, classes.textLight),
    normal: Attribute = Class(fontWeight, classes.textNormalWeight),
    book: Attribute = normal,
    regular: Attribute = normal,
    medium: Attribute = Class(fontWeight, classes.textMedium),
    semiBold: Attribute = Class(fontWeight, classes.textSemiBold),
    demiBold: Attribute = semiBold,
    bold: Attribute = Class(fontWeight, classes.bold),
    extraBold: Attribute = Class(fontWeight, classes.textExtraBold),
    ultraBold: Attribute = extraBold,
    black: Attribute = Class(fontWeight, classes.textHeavy),
    heavy: Attribute = black;

/**
 * This will reset bold and italic.
 */
const unitalicized: Attribute = htmlClass(classes.textUnitalicized);

// Variants
/**
 * [Small caps](https://en.wikipedia.org/wiki/Small_caps) are rendered using uppercase glyphs, but at the size of lowercase glyphs.
 */
const smallCaps: Variant = VariantActive('smcp');

/**
 * Add a slash when rendering `0`
 */
const slashedZero: Variant = VariantActive('zero');

/**
 * TODO:
 */
const ligatures: Variant = VariantActive('liga');

/**
 * Oridinal markers like `1st` and `2nd` will receive special glyphs.
 */
const ordinal: Variant = VariantActive('ordn');

/**
 * Number figures will each take up the same space, allowing them to be easily aligned, such as in tables.
 */
const tabularNumbers: Variant = VariantActive('tnum');

/**
 * Render fractions with the numerator stacked on top of the denominator.
 */
const stackedFractions: Variant = VariantActive('afrc');

/**
 * Render fractions
 */
const diagonalFractions: Variant = VariantActive('frac');

/**
 * TODO:
 */
const swash: Variant = VariantActive('swsh');

/**TODO:
 *
 * @param clr
 * @returns
 */
function color(fontColor: Color): Attribute {
    if (typeof fontColor === 'string')
        throw new Error('Please do not provide a color as a string.');
    const [a, b, c, d, e] = Object.values(fontColor);
    return StyleClass(
        fontColor_,
        Colored(`fc-${formatColorClass(a, b, c, d, e)}`, 'color', fontColor)
    );
}

/** TODO:
 * import Element
    import Element.Font as Font

    myElement =
        Element.el
            [ Font.family
                [ Font.typeface "Helvetica"
                , Font.sansSerif
                ]
            ]
            (text "")
 * @param families 
 * @returns 
 */
function family(families: Font[]): Attribute {
    return StyleClass(
        fontFamily,
        FontFamily(
            families.reduce(
                (acc: string, font: Font) => renderFontClassName(font, acc),
                'ff-'
            ),
            families
        )
    );
}

/**TODO:
 *
 * @param name
 * @returns
 */
function typeface(name: string): Font {
    return Typeface(name);
}

/**
 * TODO:
 * @param param0
 * @returns
 */
function _fontWith({
    name,
    adjustment,
    variants,
}: {
    name: string;
    adjustment: Maybe<Adjustment>;
    variants: Variant[];
}): Font {
    return FontWith(name, adjustment, variants);
}

/**TODO:
 * **Note** it's likely that `Font.external` will cause a flash on your page on loading.

To bypass this, import your fonts using a separate stylesheet and just use `Font.typeface`.

It's likely that `Font.external` will be removed or redesigned in the future to avoid the flashing.

`Font.external` can be used to import font files. Let's say you found a neat font on <http://fonts.google.com>:

    import Element
    import Element.Font as Font

    view =
        Element.el
            [ Font.family
                [ Font.external
                    { name = "Roboto"
                    , url = "https://fonts.googleapis.com/css?family=Roboto"
                    }
                , Font.sansSerif
                ]
            ]
            (Element.text "Woohoo, I'm stylish text")
 * @param param0 
 * @returns 
 */
function external({ url, name }: { url: string; name: string }): Font {
    return ImportFont(name, url);
}

/**TODO:
 * Font sizes are always given as `px`.
 * @param i
 * @returns
 */
function size(i: number): Attribute {
    return StyleClass(fontSize, FontSize(i));
}

/**TODO:
 * In `px`.
 * @param offset
 * @returns
 */
function letterSpacing(offset: number): Attribute {
    return StyleClass(
        letterSpacing_,
        Single('ls-' + floatClass(offset), 'letter-spacing', offset + 'px')
    );
}

/**TODO:
 * In `px`.
 * @param offset
 * @returns
 */
function wordSpacing(offset: number): Attribute {
    return StyleClass(
        wordSpacing_,
        Single('ws-' + floatClass(offset), 'word-spacing', offset + 'px')
    );
}

/**
 * TODO:
 * @param param0
 * @returns
 */
function shadow({
    offset,
    blur,
    color,
}: {
    offset: [number, number];
    blur: number;
    color: Color;
}): Attribute {
    if (typeof color === 'string')
        throw new Error('Please do not provide a color as a string.');
    const shade = Shadow(color, offset, blur, 0, false);
    return StyleClass(
        txtShadows,
        Single(textShadowClass(shade), 'text-shadow', formatTextShadow(shade))
    );
}

/**
 * TODO:
 * A glow is just a simplified shadow.
 * @param param0
 * @returns
 */
function glow(color: Color, i: number): Attribute {
    if (typeof color === 'string')
        throw new Error('Please do not provide a color as a string.');
    const shade = Shadow(color, [0, 0], i * 2, 0, false);
    return StyleClass(
        txtShadows,
        Single(textShadowClass(shade), 'text-shadow', formatTextShadow(shade))
    );
}

/**TODO:
 * You can use this to set a single variant on an element itself such as:

    el
        [ Font.variant Font.smallCaps
        ]
        (text "rendered with smallCaps")

**Note** These will **not** stack. If you want multiple variants, you should use `Font.variantList`.
 * @param variant_ 
 * @returns 
 */
function variant(variant_: Variant): Attribute {
    switch (variant_.type) {
        case Variants.VariantActive:
            return Class(fontVariant, 'v-' + variant_.name);

        case Variants.VariantOff:
            return Class(fontVariant, 'v-' + variant_.name + '-off');

        case Variants.VariantIndexed:
            return StyleClass(
                fontVariant,
                Single(
                    `v-${variant_.name}-${variant_.index.toString()}`,
                    'font-feature-settings',
                    `"${variant_.name}" ${variant_.index.toString()}`
                )
            );
    }
}

/**
 * TODO:
 * @param x
 * @returns
 */
function isSmallCaps(x: Variant): boolean {
    switch (x.type) {
        case Variants.VariantActive:
            return x.name === 'smcp';

        default:
            return false;
    }
}

/**
 * TODO:
 * @param vars
 * @returns
 */
function variantList(vars: Variant[]): Attribute {
    const features: string[] = vars.map(renderVariant),
        hasSmallCaps: boolean = vars.every(isSmallCaps),
        name: string = hasSmallCaps
            ? `${vars.map(variantName).join('-')}-sc`
            : vars.map(variantName).join('-'),
        featureString: string = features.join(', ');
    return StyleClass(
        fontVariant,
        Style_('v-' + name, [
            Property('font-feature-settings', featureString),
            Property('font-variant', hasSmallCaps ? 'small-caps' : 'normal'),
        ])
    );
}

/**TODO:
 * Set a feature by name and whether it should be on or off.

Feature names are four-letter names as defined in the [OpenType specification](https://docs.microsoft.com/en-us/typography/opentype/spec/featurelist).
 * @param name 
 * @param on 
 * @returns 
 */
function feature(name: string, on: boolean): Variant {
    if (on) return VariantIndexed(name, 1);
    return VariantIndexed(name, 0);
}

/** TODO:
 *A font variant might have multiple versions within the font.

In these cases we need to specify the index of the version we want.
 * @param name
 * @param on
 * @returns
 */
function indexed(name: string, on: number): Variant {
    return VariantIndexed(name, on);
}

export {
    color,
    size,
    family,
    typeface,
    serif,
    sansSerif,
    monospace,
    external,
    alignLeft,
    alignRight,
    center,
    justify,
    letterSpacing,
    wordSpacing,
    underline,
    strike,
    italic,
    unitalicized,
    heavy,
    extraBold,
    ultraBold,
    bold,
    semiBold,
    demiBold,
    medium,
    book,
    regular,
    light,
    extraLight,
    ultraLight,
    hairline,
    thin,
    variant,
    variantList,
    smallCaps,
    slashedZero,
    ligatures,
    ordinal,
    tabularNumbers,
    stackedFractions,
    diagonalFractions,
    swash,
    feature,
    indexed,
    glow,
    shadow,
};

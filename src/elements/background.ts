/** TODO:
 * @docs color, gradient


# Images

@docs image, uncropped, tiled, tiledX, tiledY

**Note** if you want more control over a background image than is provided here, you should try just using a normal `Element.image` with something like `Element.behindContent`.
 */

import { attribute } from '../dom/attribute.ts';
import {
    Attr,
    Attribute,
    Color,
    Colored,
    NoAttribute,
    Single,
    StyleClass,
} from '../internal/data.ts';
import { bgColor, bgGradient } from '../internal/flag.ts';
import {
    floatClass,
    formatColor,
    formatColorClass,
} from '../internal/model.ts';

/**
 * TODO:
 * @param clr
 * @returns
 */
function color(backgroundColor: Color): Attribute {
    if (typeof backgroundColor === 'string')
        throw new Error('Please do not provide a color as a string.');
    const [a, b, c, d, e] = Object.values(backgroundColor);
    return StyleClass(
        bgColor,
        Colored(
            `bg-${formatColorClass(a, b, c, d, e)}`,
            'background-color',
            backgroundColor
        )
    );
}

/** TODO:
 * Resize the image to fit the containing element while maintaining proportions and cropping the overflow.
 * @param src
 * @returns
 */
function image(src: string): Attribute {
    return Attr(
        attribute('style', `background: url('${src}') center / cover no-repeat`)
    );
}

/** TODO:
 * A centered background image that keeps its natural proportions, but scales to fit the space.
 * @param src
 * @returns
 */
function uncropped(src: string): Attribute {
    return Attr(
        attribute(
            'style',
            `background: url('${src}') center / contain no-repeat`
        )
    );
}

/** TODO:
 * Tile an image in the x and y axes.
 * @param src
 * @returns
 */
function tiled(src: string): Attribute {
    return Attr(attribute('style', `background: url('${src}') repeat`));
}

/** TODO:
 * Tile an image in the x axis.
 * @param src
 * @returns
 */
function tiledX(src: string): Attribute {
    return Attr(attribute('style', `background: url('${src}') repeat-x`));
}

/** TODO:
 * Tile an image in the Y axis.
 * @param src
 * @returns
 */
function tiledY(src: string): Attribute {
    return Attr(attribute('style', `background: url('${src}') repeat-y`));
}

function gradient(angle: number, steps: Color[]): Attribute {
    switch (steps) {
        case []:
            return NoAttribute();

        case [steps[0]]:
            return color(steps[0]);

        default:
            return StyleClass(
                bgGradient,
                Single(
                    `bg-grad-${[floatClass(angle)]
                        .concat(
                            steps.map((clr: Color) => {
                                const [a, b, c, d, e] = Object.values(clr);
                                return formatColorClass(a, b, c, d, e);
                            })
                        )
                        .join('-')}`,
                    'background-image',
                    `linear-gradient(${[angle + 'rad']
                        .concat(
                            steps.map((clr: Color) => {
                                const [a, b, c, d, e] = Object.values(clr);
                                return formatColor(a, b, c, d, e);
                            })
                        )
                        .join(', ')}`
                )
            );
    }
}

export { color, gradient, image, uncropped, tiled, tiledX, tiledY };

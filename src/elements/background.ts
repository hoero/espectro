/** TODO:
 * @docs color, gradient


# Images

@docs image, uncropped, tiled, tiledX, tiledY

**Note** if you want more control over a background image than is provided here, you should try just using a normal `Element.image` with something like `Element.behindContent`.
 */

import {
    Attribute,
    Colored,
    Hsla,
    NoAttribute,
    Rgba,
    Single,
    StyleClass,
} from '../internal/data.ts';
import * as Flag from '../internal/flag.ts';
import * as Internal from '../internal/model.ts';
import { style } from './attributes.ts';

/**
 * TODO:
 * @param clr
 * @returns
 */
function color(backgroundColor: Promise<Hsla | Rgba>): Attribute {
    const [a, b, c, d, e] = Object.values(backgroundColor);
    return StyleClass(
        Flag.bgColor,
        Colored(
            `bg-${Internal.formatColorClass(a, b, c, d, e)}`,
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
    return style('background', `url('${src}') center / cover no-repeat`);
}

/** TODO:
 * A centered background image that keeps its natural proportions, but scales to fit the space.
 * @param src
 * @returns
 */
function uncropped(src: string): Attribute {
    return style('background', `url('${src}') center / contain no-repeat`);
}

/** TODO:
 * Tile an image in the x and y axes.
 * @param src
 * @returns
 */
function tiled(src: string): Attribute {
    return style('background', `url('${src}') repeat`);
}

/** TODO:
 * Tile an image in the x axis.
 * @param src
 * @returns
 */
function tiledX(src: string): Attribute {
    return style('background', `url('${src}') repeat-x`);
}

/** TODO:
 * Tile an image in the Y axis.
 * @param src
 * @returns
 */
function tiledY(src: string): Attribute {
    return style('background', `url('${src}') repeat-y`);
}

function gradient(angle: number, steps: Promise<Hsla | Rgba>[]): Attribute {
    switch (steps) {
        case []:
            return NoAttribute();

        case [steps[0]]:
            return color(steps[0]);

        default:
            return StyleClass(
                Flag.bgGradient,
                Single(
                    `bg-grad-${[Internal.floatClass(angle)]
                        .concat(
                            steps.map((clr: Promise<Hsla | Rgba>) => {
                                const [a, b, c, d, e] = Object.values(clr);
                                return Internal.formatColorClass(a, b, c, d, e);
                            })
                        )
                        .join('-')}`,
                    'background-image',
                    `linear-gradient(${[angle + 'rad']
                        .concat(
                            steps.map((clr: Promise<Hsla | Rgba>) => {
                                const [a, b, c, d, e] = Object.values(clr);
                                return Internal.formatColor(a, b, c, d, e);
                            })
                        )
                        .join(', ')}`
                )
            );
    }
}

export { color, gradient, image, uncropped, tiled, tiledX, tiledY };

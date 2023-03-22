/**
 * @docs color, gradient
 *
 * # Images
 *
 * @docs image, uncropped, tiled, tiledX, tiledY
 *
 * **Note** if you want more control over a background image than is provided here, you should try just using a normal `Element.image` with something like `Element.behindContent`.
 */

import {
    Attribute,
    Color,
    Colored,
    NoAttribute,
    Single,
    StyleClass,
} from '../internal/data.ts';
import * as Flag from '../internal/flag.ts';
import * as Internal from '../internal/model.ts';
import { isEmpty } from '../utils/utils.ts';
import { style } from './attributes.ts';

async function color(backgroundColor: Promise<Color>): Promise<Attribute> {
    const val = await backgroundColor;
    const [a, b, c, d, e] = Object.values(val);
    return StyleClass(
        Flag.bgColor,
        Colored(
            `bg-${Internal.formatColorClass(a, b, c, d, e)}`,
            'background-color',
            val
        )
    );
}

/** Resize the image to fit the containing element while maintaining proportions and cropping the overflow. */
function image(src: string): Attribute {
    return style('background', `url('${src}') center / cover no-repeat`);
}

/** A centered background image that keeps its natural proportions, but scales to fit the space. */
function uncropped(src: string): Attribute {
    return style('background', `url('${src}') center / contain no-repeat`);
}

/** Tile an image in the x and y axes. */
function tiled(src: string): Attribute {
    return style('background', `url('${src}') repeat`);
}

/** Tile an image in the x axis. */
function tiledX(src: string): Attribute {
    return style('background', `url('${src}') repeat-x`);
}

/** Tile an image in the Y axis. */
function tiledY(src: string): Attribute {
    return style('background', `url('${src}') repeat-y`);
}

async function gradient(
    angle: number,
    steps: Promise<Color>[]
): Promise<Attribute> {
    if (isEmpty(steps)) return NoAttribute();
    if (steps.length === 1) return await color(steps[0]);
    const [stepsCls] = steps.map(async (clr: Promise<Color>) => {
        const val = await clr;
        const [a, b, c, d, e] = Object.values(val);
        return Internal.formatColorClass(a, b, c, d, e);
    });
    const [stepsColor] = steps.map(async (clr: Promise<Color>) => {
        const val = await clr;
        const [a, b, c, d, e] = Object.values(val);
        return Internal.formatColor(a, b, c, d, e);
    });
    return (async () => {
        return StyleClass(
            Flag.bgGradient,
            Single(
                `bg-grad-${[Internal.floatClass(angle)]
                    .concat(await stepsCls)
                    .join('-')}`,
                'background-image',
                `linear-gradient(${[angle + 'rad']
                    .concat(await stepsColor)
                    .join(', ')}`
            )
        );
    })();
}

export { color, gradient, image, uncropped, tiled, tiledX, tiledY };

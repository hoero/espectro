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
    Gradient,
    NoAttribute,
    SideOrCorner,
    Single,
    Step,
    StyleClass,
} from '../internal/data.ts';
import * as Flag from '../internal/flag.ts';
import * as Internal from '../internal/model.ts';
import { isEmpty } from '../utils/utils.ts';
import { style } from './attributes.ts';

function color(backgroundColor: Color): Attribute {
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

function stepsValues(steps: Step[]) {
    return [
        steps.map((step: Step) => {
            const [a, b, c, d, e] = Object.values(step.step);
            return Internal.formatColorClass(a, b, c, d, e);
        }),
        steps.map((step: Step) => {
            if (typeof step.step === 'number')
                return step.step.toString() + '%';

            const [a, b, c, d, e] = Object.values(step.step),
                color = Internal.formatColor(a, b, c, d, e);

            if (typeof step.stop === 'number') return `${color} ${step.stop}%`;

            if (typeof step.stop !== 'undefined' && step.stop?.length === 2)
                return `${color} ${step.stop[0]}% ${step.stop[1]}%`;

            return color;
        }),
    ];
}

function angleValues(angle?: number | SideOrCorner) {
    switch (angle) {
        case SideOrCorner.Top:
            return ['to-top', 'to top'];

        case SideOrCorner.Bottom:
        case undefined:
            return ['to-bottom', 'to bottom'];

        case SideOrCorner.Left:
            return ['to-left', 'to left'];

        case SideOrCorner.LeftTop:
            return ['to-left-top', 'to left top'];

        case SideOrCorner.LeftBottom:
            return ['to-left-bottom', 'to left bottom'];

        case SideOrCorner.Right:
            return ['to-right', 'to right'];

        case SideOrCorner.RightTop:
            return ['to-right-top', 'to right top'];

        case SideOrCorner.RightBottom:
            return ['to-right-bottom', 'to right bottom'];

        default:
            return [Internal.floatClass(angle), angle + 'deg'];
    }
}

function gradient({
    steps,
    angle,
}: {
    steps: Step[];
    angle?: number | SideOrCorner;
}): Attribute {
    if (isEmpty(steps)) return NoAttribute();
    if (steps.length === 1 && typeof steps[0].step !== 'number')
        return color(steps[0].step);

    const [stepsCls, stepsColor] = stepsValues(steps),
        [angleCls, angle_] = angleValues(angle);

    return StyleClass(
        Flag.bgGradient,
        Single(
            `bg-lineargrad-${[angleCls].concat(stepsCls).join('-')}`,
            'background-image',
            `linear-gradient(${[angle_].concat(stepsColor).join(', ')})`
        )
    );
}

function gradients(gradients: Gradient[]): Attribute {
    if (isEmpty(gradients)) return NoAttribute();
    if (gradients.length === 1) return gradient(gradients[0]);

    const steps = gradients.map(({ steps }) => stepsValues(steps)),
        angle = gradients.map(({ angle }) => angleValues(angle));

    return StyleClass(
        Flag.bgGradient,
        Single(
            `bg-lineargrads-${[angle[0][0]].concat(steps[0][0]).join('-')}`,
            'background-image',
            gradients
                .map(
                    (_gradient, index) =>
                        `linear-gradient(${[angle[index][1]]
                            .concat(steps[index][1])
                            .join(', ')})`
                )
                .join(', ')
        )
    );
}

export { color, gradient, gradients, image, uncropped, tiled, tiledX, tiledY };

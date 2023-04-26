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
    EndingShape,
    Gradient,
    GradientLinear,
    GradientRadial,
    Gradients,
    HRadius,
    NoAttribute,
    Position,
    SideOrCorner,
    Single,
    Size,
    Step,
    StyleClass,
    VRadius,
    XPosition,
    YPosition,
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

function gradientRadial({
    steps,
    shape,
    size,
    radius,
}: {
    steps: Step[];
    shape?: EndingShape;
    size?: Size;
    radius?: [HRadius, VRadius];
}): Attribute {
    if (isEmpty(steps)) return NoAttribute();
    if (steps.length === 1 && typeof steps[0].step !== 'number')
        return color(steps[0].step);

    const [stepsCls, stepsColor] = stepsValues(steps),
        shape_ = endingShape(shape),
        size_ = getSize(size, radius, shape);

    return StyleClass(
        Flag.bgGradient,
        Single(
            `bg-radialgrad-${[shape_].concat(stepsCls).join('-')}`,
            'background-image',
            `radial-gradient(${[`${shape_} ${size_}`]
                .concat(stepsColor)
                .join(', ')})`
        )
    );
}

function gradients(gradients: Gradient[]): Attribute {
    if (isEmpty(gradients)) return NoAttribute();

    const linear: GradientLinear[] = [],
        radial: GradientRadial[] = [];
    gradients.map((grad) => {
        if (grad.type === Gradients.Radial) radial.push(grad);
        if (grad.type === Gradients.Linear) linear.push(grad);
    });

    if (linear.length > 0) {
        if (linear.length === 1) return gradient(linear[0]);

        const steps = linear.map(({ steps }) => stepsValues(steps)),
            angle = linear.map(({ angle }) => angleValues(angle));

        return StyleClass(
            Flag.bgGradient,
            Single(
                `bg-lineargrads-${[angle[0][0]].concat(steps[0][0]).join('-')}`,
                'background-image',
                linear
                    .map(
                        (_gradient, index) =>
                            `linear-gradient(${[angle[index][1]]
                                .concat(steps[index][1])
                                .join(', ')})`
                    )
                    .join(', ')
            )
        );
    } else if (radial.length > 0) {
        if (radial.length === 1) return gradientRadial(radial[0]);
        return NoAttribute();
    } else {
        return NoAttribute();
    }
}

function stepsValues(steps: Step[]): [string[], string[]] {
    return [
        steps.map((step: Step) => {
            if (typeof step.step === 'number') return step.step.toString();

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

function angleValues(angle?: number | SideOrCorner): [string, string] {
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

function endingShape(ending_shape?: EndingShape): string {
    switch (ending_shape) {
        case EndingShape.Ellipse:
        default:
            return 'ellipse';

        case EndingShape.Circle:
            return 'circle';
    }
}

function getSize(
    size: Size = Size.FarthestCorner,
    radius?: [HRadius, VRadius],
    ending_shape?: EndingShape
): string {
    if (typeof radius === 'undefined')
        switch (size) {
            case Size.ClosestCorner:
                return 'closest-corner';

            case Size.ClosestSide:
                return 'closest-side';

            case Size.FarthestCorner:
                return 'farthest-corner';

            case Size.FarthestSide:
                return 'farthest-side';

            default:
                throw new Error('Use a length value and define the radiuses.');
        }

    switch (ending_shape) {
        case EndingShape.Circle: {
            switch (size) {
                case Size.Px:
                    return `${radius[0]}px`;

                default:
                    throw new Error(
                        'Ellipse shape needs two values in percentage units or one that at least includes percentage from size values. i.e. Size.Percentage'
                    );
            }
        }

        case EndingShape.Ellipse: {
            switch (size) {
                case Size.PxPercentage:
                    return `${radius[0]}px ${radius[1]}%`;

                case Size.Percentage:
                    return `${radius[0]}% ${radius[1]}%`;

                case Size.PercentagePx:
                    return `${radius[0]}% ${radius[1]}px`;

                default:
                    throw new Error(
                        'Circle shape only supports one pixel value. i.e. Size.Px'
                    );
            }
        }

        default: {
            switch (size) {
                case Size.Px:
                    return `${radius[0]}px`;

                case Size.PxPercentage:
                    return `${radius[0]}px ${radius[1]}%`;

                case Size.Percentage:
                    return `${radius[0]}% ${radius[1]}%`;

                case Size.PercentagePx:
                    return `${radius[0]}% ${radius[1]}px`;

                default:
                    throw new Error(
                        "Don't define radiuses when using extent keywords."
                    );
            }
        }
    }
}

function getPosition(
    position: Position,
    positions?: [XPosition, YPosition]
): string {
    if (typeof positions === 'undefined')
        switch (position) {
            case Position.Left:
                return 'left';

            case Position.LeftTop:
                return 'left top';

            case Position.LeftCenter:
                return 'left center';

            case Position.LeftBottom:
                return 'left bottom';

            case Position.Right:
                return 'right';

            case Position.RightTop:
                return 'right top';

            case Position.RightCenter:
                return 'right center';

            case Position.RightBottom:
                return 'right bottom';

            case Position.Top:
                return 'top';

            case Position.Bottom:
                return 'bottom';

            case Position.Center:
                return 'center';

            case Position.CenterTop:
                return 'center top';

            case Position.CenterCenter:
                return 'center center';

            case Position.CenterBottom:
                return 'center bottom';

            default:
                throw new Error('Use a length value and define the positions.');
        }

    switch (position) {
        case Position.LeftLength:
            return `left ${positions[1]}%`;

        case Position.RightLength:
            return `right ${positions[1]}%`;

        case Position.Length:
            return `${positions[0]}% ${positions[1]}%`;

        case Position.LengthLeft:
            return `${positions[0]}% left`;

        case Position.LengthRight:
            return `${positions[0]}% right`;

        default:
            throw new Error(
                "Don't define positions when positions values that don't include length."
            );
    }
}

export {
    color,
    gradient,
    gradients,
    gradientRadial,
    image,
    uncropped,
    tiled,
    tiledX,
    tiledY,
};

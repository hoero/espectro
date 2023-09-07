import { modular } from '../element.ts';
import { Rem } from '../internal/data.ts';
import { Device, Breakpoints, respond } from '../responsive.ts';
import { baseFontSize } from './pixel.ts';

/**This defines what 1rem is in pixels. */
const oneRem = 10;

/** Modular scale */
function scaled(rescale: number) {
    return modular(baseFontSize, 1.25, rescale) / 10;
}

/**
 * #### Responsive rems
 * Same as rem function, but in this one you can define rems for specific device profiles using breakpoints.
 */
function rrems(device: Device, breakpoints: Breakpoints): Rem {
    return Rem(respond(device, breakpoints));
}

/**
 * This allows the user to use Points for fonts as we usually use in graphics software.
 * The calculation converts the Points value to pixels for later use with rem.
 */
function pt(value: number): number {
    return value / 7.5;
}

/**
 * #### Responsive points
 * Same as pt function, but in this one you can define points for specific device profiles using breakpoints.
 */
function rpts(device: Device, breakpoints: Breakpoints): number {
    return pt(respond(device, breakpoints));
}

/** For line-height unitless values */
function unitless(point: number, value: number): number {
    return pt(point) * value;
}

export { oneRem, rrems, pt, rpts, unitless, scaled };

import { Device, Breakpoints, respond } from '../responsive.ts';

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

export { pt, rpts, unitless };

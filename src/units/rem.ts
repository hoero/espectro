import { Device, Breakpoints, respond } from '../responsive.ts';
import { size } from '../elements/font.ts';
import { Attribute, Lengths } from '../internal/data.ts';

/** Font sizes for rem values. Use `Rem.pt` with this to use points, or `Rem.pts` to provide points for specific device profiles*/
function fontSize(i: number): Attribute {
    return size(i, Lengths.Rem);
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

export { fontSize, pt, rpts, unitless };

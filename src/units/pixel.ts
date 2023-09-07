import { modular } from '../element.ts';
import { Device, DeviceClass, Breakpoints, respond } from '../responsive.ts';

/** Default browser font size */
const baseFontSize = 16;

/** Modular scale */
function scaled(rescale: number) {
    return modular(baseFontSize, 1.25, rescale);
}

/**
 * This allows the user to use Points for fonts as we usually use in graphics software.
 * The calculation converts the Points value to pixels.
 */
function pt(device: Device, value: number): number {
    return remToPx(oneRem(device), value / 7.5);
}

/**
 * #### Responsive points
 * Same as pt function, but in this one you can define points for specific device profiles using breakpoints.
 */
function rpts(device: Device, breakpoints: Breakpoints): number {
    return pt(device, respond(device, breakpoints));
}

/** For line-height unitless values */
function unitless(device: Device, point: number, value: number): number {
    return pt(device, point) * value;
}

/**
 * #### Responsive pixel
 * Using rem values instead of pixels, which is a responsive format that scales to the user font size preference on the browser.
 */
function rpx(device: Device, rem: number): number {
    return remToPx(oneRem(device), rem);
}

/**
 * #### Responsive pixels
 * Same as rpx function, but in this one you can define responsive pixels for specific device profiles using breakpoints.
 */
function rpxs(device: Device, breakpoints: Breakpoints): number {
    return rpx(device, respond(device, breakpoints));
}

/**
 * This defines what 1rem is.
 * To have 1rem as 10px just divide 10 and the base font size which is 16.
 *
 * #### Desktop
 * 1rem = 10px, 10/16 = 62.5%
 *
 * #### Tablet (1100px)
 * 1rem = 8.4px, 8.4/16 = 52.5%
 *
 * #### Phone (600px)
 * 1rem = 7.28px, 7.28/16 = 45.5%
 */
function oneRem(device: Device): number {
    switch (device.class_) {
        case DeviceClass.Phone:
            return percentToPx(45.5);

        case DeviceClass.Tablet:
            return percentToPx(52.5);

        default:
            return percentToPx(62.5);
    }
}

/** Convert a rem value to a pixel value */
function remToPx(base: number, rem: number): number {
    return base * rem;
}

/** Convert a percent value to a pixel value */
function percentToPx(percent: number): number {
    return (percent * baseFontSize) / 100;
}

export { pt, rpts, unitless, rpx, rpxs, scaled, baseFontSize };

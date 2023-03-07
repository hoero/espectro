import { Device, DeviceClass } from './responsive.ts';
import { Breakpoints, respond } from './responsive.ts';

//TODO: Default browser font size
const baseFontSize = 16;

/**TODO:  This defines what 1rem is.
To have 1rem as 10px just divide 10 and the base font size which is 16.

- Desktop
    1rem = 10px, 10/16 = 62.5%

- Tablet (1100px)
    1rem = 8.4px, 8.4/16 = 52.5%

- Phone (600px)
    1rem = 7.28px, 7.28/16 = 45.5%
*/
function oneRem(device: Device) {
    switch (device.class) {
        case DeviceClass.Phone:
            return percentToPx(45.5);

        case DeviceClass.Tablet:
            return percentToPx(52.5);

        default:
            return percentToPx(62.5);
    }
}

//TODO:  This allows the user to use Points for fonts as we usually use in graphics software.
// The calculation converts the Points value to another one for later use with rem.
function pt(device: Device, point: number) {
    return remToPx(oneRem(device), point / 7.5);
}

/** TODO:  Responsive points

        Same as pt function, but in this one you can define points
        for specific device profiles using breakpoints.
*/
function rpts(device: Device, breakpoints: Breakpoints) {
    return pt(device, respond(device, breakpoints));
}

// TODO: For line-height unitless values
function unitless(device: Device, point: number, value: number) {
    return pt(device, point) * value;
}

/**  TODO: Responsive pixel

        Using rem values instead of pixels, which is
        a responsive format that scales to user's browser font size preference.
*/
function rpx(device: Device, rem: number) {
    return remToPx(oneRem(device), rem);
}

/** TODO: Responsive pixels

    Same as rpx function, but in this one you can define responsive pixels
    for specific device profiles using breakpoints.
*/
function rpxs(device: Device, breakpoints: Breakpoints) {
    return rpx(device, respond(device, breakpoints));
}

//TODO:  Convert a rem value to a pixel value
function remToPx(base: number, rem: number) {
    return base * rem;
}

//TODO:  Convert a percent value to a pixel value
function percentToPx(percent: number) {
    return (percent * baseFontSize) / 100;
}

export { pt, rpts, unitless, rpx, rpxs };

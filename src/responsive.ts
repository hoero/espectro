// deno-lint-ignore-file no-explicit-any
import { _ } from './deps.ts';

/** MEDIA QUERY MANAGER
    -------------------------

    0      - *      : Base
    0      - 600px  : Phone
    600    - 954px  : Tablet portrait mode
    954    - 1200px : Tablet landscape mode
    [1200  - 1921px]: Is where our normal styles apply (Desktop)
    1921px ->       : Big Desktop

    $breakpoint argument choices:
    - phone
    - phonePortrait
    - phoneLandscape
    - tablet
    - tabletPortrait
    - tabletLandscape
    - desktop
    - desktopPortrait
    - desktopLandscape
    - bigDesktop
    - bigDesktopPortrait
    - bigDesktopLandscape
*/

interface Breakpoints {
    default?: any;
    phone?: any;
    phonePortrait?: any;
    phoneLandscape?: any;
    tablet?: any;
    tabletPortrait?: any;
    tabletLandscape?: any;
    desktop?: any;
    desktopPortrait?: any;
    desktopLandscape?: any;
    bigDesktop?: any;
    bigDesktopPortrait?: any;
    bigDesktopLandscape?: any;
}

interface Device {
    class: DeviceClass;
    orientation: Orientation;
}

enum DeviceClass {
    Phone,
    Tablet,
    Desktop,
    BigDesktop,
}

enum Orientation {
    Portrait,
    Landscape,
}

function isPhone(device: Device) {
    return device.class === DeviceClass.Phone;
}

function isPhonePortrait(device: Device) {
    return (
        device.class === DeviceClass.Phone &&
        device.orientation === Orientation.Portrait
    );
}

function isPhoneLandscape(device: Device) {
    return (
        device.class === DeviceClass.Phone &&
        device.orientation === Orientation.Landscape
    );
}

function isTablet(device: Device) {
    return device.class === DeviceClass.Tablet;
}

function isTabletPortrait(device: Device) {
    return (
        device.class === DeviceClass.Tablet &&
        device.orientation === Orientation.Portrait
    );
}

function isTabletLandscape(device: Device) {
    return (
        device.class === DeviceClass.Tablet &&
        device.orientation === Orientation.Landscape
    );
}

function isDesktop(device: Device) {
    return device.class === DeviceClass.Desktop;
}

function isDesktopPortrait(device: Device) {
    return (
        device.class === DeviceClass.Desktop &&
        device.orientation === Orientation.Portrait
    );
}

function isDesktopLandscape(device: Device) {
    return (
        device.class === DeviceClass.Desktop &&
        device.orientation === Orientation.Landscape
    );
}

function isBigDesktop(device: Device) {
    return device.class === DeviceClass.BigDesktop;
}

function isBigDesktopPortrait(device: Device) {
    return (
        device.class === DeviceClass.BigDesktop &&
        device.orientation === Orientation.Portrait
    );
}

function isBigDesktopLandscape(device: Device) {
    return (
        device.class === DeviceClass.BigDesktop &&
        device.orientation === Orientation.Landscape
    );
}

/** Simulates CSS @media query

    With device data it can return specific values for different
    device profiles using breakpoints.
*/
function respond(device: Device, bps: Breakpoints) {
    switch (device.class) {
        case DeviceClass.Phone:
            if (bps.phone || bps.phonePortrait || bps.phoneLandscape) {
                switch (device.orientation) {
                    case Orientation.Portrait:
                        return bps.phonePortrait
                            ? bps.phonePortrait
                            : bps.phone;
                    case Orientation.Landscape:
                        return bps.phoneLandscape
                            ? bps.phoneLandscape
                            : bps.phone;
                }
            }

            return bps.default;

        case DeviceClass.Tablet:
            if (bps.tablet || bps.tabletPortrait || bps.tabletLandscape) {
                switch (device.orientation) {
                    case Orientation.Portrait:
                        return bps.tabletPortrait
                            ? bps.tabletPortrait
                            : bps.tablet;

                    case Orientation.Landscape:
                        return bps.tabletLandscape
                            ? bps.tabletLandscape
                            : bps.tablet;
                }
            }

            return bps.default;

        case DeviceClass.Desktop:
            if (bps.desktop || bps.desktopPortrait || bps.desktopLandscape) {
                switch (device.orientation) {
                    case Orientation.Portrait:
                        return bps.desktopPortrait
                            ? bps.desktopPortrait
                            : bps.desktop;

                    case Orientation.Landscape:
                        return bps.desktopLandscape
                            ? bps.desktopLandscape
                            : bps.desktop;
                }
            }

            return bps.default;

        case DeviceClass.BigDesktop:
            if (
                bps.bigDesktop ||
                bps.bigDesktopPortrait ||
                bps.bigDesktopLandscape
            ) {
                switch (device.orientation) {
                    case Orientation.Portrait:
                        return bps.bigDesktopPortrait
                            ? bps.bigDesktopPortrait
                            : bps.bigDesktop;

                    case Orientation.Landscape:
                        return bps.bigDesktopLandscape
                            ? bps.bigDesktopLandscape
                            : bps.bigDesktop;
                }
            }

            return bps.default;

        default:
            break;
    }
}

// Gets the device data based on the viewport width and viewport height.
function deviceData(vw: number, vh: number) {
    return classifyDevice({ width: vw, height: vh });
}

/** Takes in a Window.Size and returns a device profile which can be used for responsiveness.

If you have more detailed concerns around responsiveness, it probably makes sense to copy this function into your codebase and modify as needed.
*/
function classifyDevice(window: { width: number; height: number }): Device {
    const longSide = _.max([window.width, window.height]);
    const shortSide = _.min([window.width, window.height]);

    return {
        class: (function () {
            if (shortSide !== undefined && shortSide < 600) {
                return DeviceClass.Phone;
            } else if (longSide !== undefined && longSide <= 1200) {
                return DeviceClass.Tablet;
            } else if (
                longSide !== undefined &&
                longSide > 1200 &&
                longSide <= 1920
            ) {
                return DeviceClass.Desktop;
            } else {
                return DeviceClass.BigDesktop;
            }
        })(),
        orientation:
            window.width < window.height
                ? Orientation.Portrait
                : Orientation.Landscape,
    };
}

/** Takes in a Window.Size and returns a device profile which can be used for responsiveness.

If you have more detailed concerns around responsiveness, it probably makes sense to copy this function into your codebase and modify as needed.
*/
export {
    DeviceClass,
    Orientation,
    isPhone,
    isPhonePortrait,
    isPhoneLandscape,
    isTablet,
    isTabletPortrait,
    isTabletLandscape,
    isDesktop,
    isDesktopPortrait,
    isDesktopLandscape,
    isBigDesktop,
    isBigDesktopPortrait,
    isBigDesktopLandscape,
    respond,
    deviceData,
    classifyDevice,
};
export type { Breakpoints, Device };

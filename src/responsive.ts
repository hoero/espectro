// deno-lint-ignore-file no-explicit-any

/** ## Media Query Manager
 *
 * - #### 0      - *      : Base
 * - #### 0      - 600px  : Phone
 * - #### 600    - 954px  : Tablet portrait mode
 * - #### 954    - 1200px : Tablet landscape mode
 * - #### [1200  - 1921px]: This is where our normal styles apply (Desktop)
 * - #### 1921px ->       : Big Desktop
 *
 * ### Breakpoint argument choices:
 * - phone
 * - phonePortrait
 * - phoneLandscape
 * - tablet
 * - tabletPortrait
 * - tabletLandscape
 * - desktop
 * - desktopPortrait
 * - desktopLandscape
 * - bigDesktop
 * - bigDesktopPortrait
 * - bigDesktopLandscape
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

interface Device {
    class_: DeviceClass;
    orientation: Orientation;
}

function Device(class_: DeviceClass, orientation: Orientation): Device {
    return { class_, orientation };
}

function isPhone(device: Device): boolean {
    return device.class_ === DeviceClass.Phone;
}

function isPhonePortrait(device: Device): boolean {
    return (
        device.class_ === DeviceClass.Phone &&
        device.orientation === Orientation.Portrait
    );
}

function isPhoneLandscape(device: Device): boolean {
    return (
        device.class_ === DeviceClass.Phone &&
        device.orientation === Orientation.Landscape
    );
}

function isTablet(device: Device): boolean {
    return device.class_ === DeviceClass.Tablet;
}

function isTabletPortrait(device: Device): boolean {
    return (
        device.class_ === DeviceClass.Tablet &&
        device.orientation === Orientation.Portrait
    );
}

function isTabletLandscape(device: Device): boolean {
    return (
        device.class_ === DeviceClass.Tablet &&
        device.orientation === Orientation.Landscape
    );
}

function isDesktop(device: Device): boolean {
    return device.class_ === DeviceClass.Desktop;
}

function isDesktopPortrait(device: Device): boolean {
    return (
        device.class_ === DeviceClass.Desktop &&
        device.orientation === Orientation.Portrait
    );
}

function isDesktopLandscape(device: Device): boolean {
    return (
        device.class_ === DeviceClass.Desktop &&
        device.orientation === Orientation.Landscape
    );
}

function isBigDesktop(device: Device): boolean {
    return device.class_ === DeviceClass.BigDesktop;
}

function isBigDesktopPortrait(device: Device): boolean {
    return (
        device.class_ === DeviceClass.BigDesktop &&
        device.orientation === Orientation.Portrait
    );
}

function isBigDesktopLandscape(device: Device): boolean {
    return (
        device.class_ === DeviceClass.BigDesktop &&
        device.orientation === Orientation.Landscape
    );
}

/** #### Simulates CSS @media query
 * With device data it can return specific values for different device profiles using breakpoints.
 */
function respond(device: Device, bps: Breakpoints): any {
    switch (device.class_) {
        case DeviceClass.Phone:
            if (
                typeof bps.phone !== 'undefined' ||
                typeof bps.phonePortrait !== 'undefined' ||
                typeof bps.phoneLandscape !== 'undefined'
            ) {
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
            if (
                typeof bps.tablet !== 'undefined' ||
                typeof bps.tabletPortrait !== 'undefined' ||
                typeof bps.tabletLandscape !== 'undefined'
            ) {
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
            if (
                typeof bps.desktop !== 'undefined' ||
                typeof bps.desktopPortrait !== 'undefined' ||
                typeof bps.desktopLandscape !== 'undefined'
            ) {
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
                typeof bps.bigDesktop !== 'undefined' ||
                typeof bps.bigDesktopPortrait !== 'undefined' ||
                typeof bps.bigDesktopLandscape !== 'undefined'
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

/** Gets the device data based on the viewport width and viewport height. */
function deviceData(vw: number, vh: number): Device {
    return classifyDevice({ width: vw, height: vh });
}

/**
 * Takes in `window.innerWidth` and `window.innerHeight`, and returns a device profile which can be used for responsiveness.
 *
 * If you have more detailed concerns around responsiveness, it probably makes sense to copy this function into your codebase and modify as needed.
 */
function classifyDevice(window: { width: number; height: number }): Device {
    const longSide: number = Math.max(window.width, window.height),
        shortSide: number = Math.min(window.width, window.height);
    return Device(
        (() => {
            if (shortSide < 600) {
                return DeviceClass.Phone;
            } else if (longSide <= 1200) {
                return DeviceClass.Tablet;
            } else if (longSide > 1200 && longSide <= 1920) {
                return DeviceClass.Desktop;
            } else {
                return DeviceClass.BigDesktop;
            }
        })(),
        window.width < window.height
            ? Orientation.Portrait
            : Orientation.Landscape
    );
}

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

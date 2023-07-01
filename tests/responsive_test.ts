import {
    classifyDevice,
    isBigDesktop,
    isBigDesktopLandscape,
    isBigDesktopPortrait,
    isDesktop,
    isDesktopLandscape,
    isDesktopPortrait,
    isPhone,
    isPhoneLandscape,
    isPhonePortrait,
    isTablet,
    isTabletLandscape,
    isTabletPortrait,
    respond,
} from '../src/responsive.ts';
import { asserts } from '../test_deps.ts';

const phone = { width: 375, height: 812 },
    phoneLandscape = { width: 812, height: 375 },
    tablet = { width: 810, height: 1080 },
    tabletLandscape = { width: 1080, height: 810 },
    desktop = { width: 1255, height: 768 },
    desktopPortrait = { width: 768, height: 1255 },
    bigDesktop = { width: 2560, height: 1440 },
    bigDesktopPortrait = { width: 1440, height: 2560 };

const bps = {
    default: 21,
    phone: 16,
    phonePortrait: 16,
    phoneLandscape: 18,
    tablet: 18,
    tabletPortrait: 18,
    tabletLandscape: 21,
};

Deno.test('Is a phone?', () => {
    const which = classifyDevice(phone);
    asserts.assertStrictEquals(isPhone(which), true);
});

Deno.test("Is a phone and it's oriented vertically?", () => {
    const which = classifyDevice(phone);
    asserts.assertEquals(isPhonePortrait(which), true);
});

Deno.test("Is a phone and it's oriented horizontally?", () => {
    const which = classifyDevice(phoneLandscape);
    asserts.assertEquals(isPhoneLandscape(which), true);
});

Deno.test('16px on phone?', () => {
    const which = classifyDevice(phone);
    const bps_ = respond(which, bps);
    asserts.assertStrictEquals(bps_, 16);
});

Deno.test('18px on phone landscape?', () => {
    const which = classifyDevice(phoneLandscape);
    const bps_ = respond(which, bps);
    asserts.assertStrictEquals(bps_, 18);
});

Deno.test('Is a tablet?', () => {
    const which = classifyDevice(tablet);
    asserts.assertStrictEquals(isTablet(which), true);
});

Deno.test("Is a tablet and it's oriented vertically?", () => {
    const which = classifyDevice(tablet);
    asserts.assertStrictEquals(isTabletPortrait(which), true);
});

Deno.test("Is a tablet and it's oriented horizontally?", () => {
    const which = classifyDevice(tabletLandscape);
    asserts.assertStrictEquals(isTabletLandscape(which), true);
});

Deno.test('18px on tablet?', () => {
    const which = classifyDevice(tablet);
    const bps_ = respond(which, bps);
    asserts.assertStrictEquals(bps_, 18);
});

Deno.test('21px on tablet landscape?', () => {
    const which = classifyDevice(tabletLandscape);
    const bps_ = respond(which, bps);
    asserts.assertStrictEquals(bps_, 21);
});

Deno.test('Is a desktop?', () => {
    const which = classifyDevice(desktop);
    asserts.assertStrictEquals(isDesktop(which), true);
});

Deno.test("Is a desktop and it's oriented horizontally?", () => {
    const which = classifyDevice(desktop);
    asserts.assertStrictEquals(isDesktopLandscape(which), true);
});

Deno.test("Is a desktop and it's oriented vertically?", () => {
    const which = classifyDevice(desktopPortrait);
    asserts.assertStrictEquals(isDesktopPortrait(which), true);
});

Deno.test('21px as default?', () => {
    const which = classifyDevice(desktop);
    const bps_ = respond(which, bps);
    asserts.assertStrictEquals(bps_, 21);
});

Deno.test('Is a wide monitor?', () => {
    const which = classifyDevice(bigDesktop);
    asserts.assertStrictEquals(isBigDesktop(which), true);
});

Deno.test("Is a wide monitor and it's oriented horizontally?", () => {
    const which = classifyDevice(bigDesktop);
    asserts.assertStrictEquals(isBigDesktopLandscape(which), true);
});

Deno.test("Is a wide monitor and it's oriented vertically?", () => {
    const which = classifyDevice(bigDesktopPortrait);
    asserts.assertStrictEquals(isBigDesktopPortrait(which), true);
});

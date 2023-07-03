import { asserts } from '../test_deps.ts';
import { pt, rpts, rpx, rpxs } from '../src/units/pixel.ts';
import { classifyDevice } from '../src/responsive.ts';

const device = classifyDevice({ width: 2560, height: 1440 }),
    phone = classifyDevice({ width: 375, height: 812 }),
    tablet = classifyDevice({ width: 810, height: 1080 });

const bps = {
    default: 21,
    phone: 16,
    phonePortrait: 16,
    phoneLandscape: 18,
    tablet: 18,
    tabletPortrait: 18,
    tabletLandscape: 21,
};

Deno.test('12pt to pixels is 16px?', () => {
    asserts.assertEquals(pt(device, 12), 16);
});

Deno.test('21pt to pixels is 28px?', () => {
    asserts.assertEquals(pt(device, 21), 28);
});

Deno.test('36pt to pixels is 48px?', () => {
    asserts.assertEquals(pt(device, 36), 48);
});

Deno.test('16pt on phone is 15.5px?', () => {
    asserts.assertStrictEquals(rpts(phone, bps), 15.530666666666667);
});

Deno.test('18pt on tablet is 20.16px?', () => {
    asserts.assertStrictEquals(rpts(tablet, bps), 20.16);
});

Deno.test('21pt on desktop is 28px?', () => {
    asserts.assertStrictEquals(rpts(device, bps), 28);
});

Deno.test('1.6rem on phone is 11.648000000000001px?', () => {
    asserts.assertStrictEquals(rpx(phone, 1.6), 11.648000000000001);
});

Deno.test('1.8rem on tablet is 15.120000000000001px?', () => {
    asserts.assertStrictEquals(
        rpxs(tablet, { tablet: 1.8 }),
        15.120000000000001
    );
});

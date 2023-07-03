import { asserts } from '../test_deps.ts';
import { classifyDevice } from '../src/responsive.ts';
import { pt, rpts } from '../src/units/rem.ts';

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

Deno.test('12pt to rem is 1.6rem?', () => {
    asserts.assertEquals(pt(12), 1.6);
});

Deno.test('21pt to rem is 2.8rem?', () => {
    asserts.assertEquals(pt(21), 2.8);
});

Deno.test('36pt to rem is 4.8rem?', () => {
    asserts.assertEquals(pt(36), 4.8);
});

Deno.test('16pt on phone is 2.1333333333333333rem?', () => {
    asserts.assertStrictEquals(rpts(phone, bps), 2.1333333333333333);
});

Deno.test('18pt on tablet is 2.4rem?', () => {
    asserts.assertStrictEquals(rpts(tablet, bps), 2.4);
});

Deno.test('21pt on desktop is 2.8rem?', () => {
    asserts.assertStrictEquals(rpts(device, bps), 2.8);
});

export type Field = [number, number];

function Field(a: number, b: number): Field {
    return [a, b];
}

export enum Flags {
    Flag,
    Second,
}

export interface Flag_ {
    type: Flags.Flag;
    first: number;
}

function Flag(first: number): Flag_ {
    return {
        type: Flags.Flag,
        first,
    };
}

export interface Second {
    type: Flags.Second;
    second: number;
}

function Second(second: number): Second {
    return {
        type: Flags.Second,
        second,
    };
}

export type Flag = Flag_ | Second;

const none = Field(0, 0);

function value(myFlag: Flag): number {
    switch (myFlag.type) {
        case Flags.Flag:
            return Math.round(Math.log2(myFlag.first));

        case Flags.Second:
            return Math.round(Math.log2(myFlag.second)) + 32;
    }
}

// If the query is in the truth, return true
function present(myFlag: Flag, field: Field): boolean {
    switch (myFlag.type) {
        case Flags.Flag:
            return (myFlag.first & field[0]) === myFlag.first;

        case Flags.Second:
            return (myFlag.second & field[1]) === myFlag.second;
    }
}

// Add a flag to a field.
function add(myFlag: Flag, field: Field): Field {
    switch (myFlag.type) {
        case Flags.Flag:
            return Field(myFlag.first | field[0], field[1]);

        case Flags.Second:
            return Field(field[0], myFlag.second | field[1]);
    }
}

/** Generally you want to use `add`, which keeps a distinction between Fields and Flags.

Merging will combine two fields
*/
function merge(a: Field, b: Field): Field {
    return Field(a[0] | b[0], a[1] | b[1]);
}

function flag(i: number): Second | Flag {
    if (i > 31) {
        return Second((i - 32) << 1);
    }
    return Flag(i << 1);
}

// Used for Style invalidation

const transparency = flag(0);

const padding = flag(2);

const spacing = flag(3);

const fontSize = flag(4);

const fontFamily = flag(5);

const width = flag(6);

const height = flag(7);

const bgColor = flag(8);

const bgImage = flag(9);

const bgGradient = flag(10);

const borderStyle = flag(11);

const fontAlignment = flag(12);

const fontWeight = flag(13);

const fontColor = flag(14);

const wordSpacing = flag(15);

const letterSpacing = flag(16);

const borderRound = flag(17);

const txtShadows = flag(18);

const shadows = flag(19);

const overflow = flag(20);

const cursor = flag(21);

const scale = flag(23);

const rotate = flag(24);

const moveX = flag(25);

const moveY = flag(26);

const borderWidth = flag(27);

const borderColor = flag(28);

const yAlign = flag(29);

const xAlign = flag(30);

const onFocus = flag(31);

const active = flag(32);

const hover = flag(33);

const gridTemplate = flag(34);

const gridPosition = flag(35);

//  Notes

const heightContent = flag(36);

const heightFill = flag(37);

const widthContent = flag(38);

const widthFill = flag(39);

const alignRight = flag(40);

const alignBottom = flag(41);

const centerX = flag(42);

const centerY = flag(43);

const widthBetween = flag(44);

const heightBetween = flag(45);

const behind = flag(46);

const heightTextAreaContent = flag(47);

const fontVariant = flag(48);

export {
    active,
    add,
    alignBottom,
    alignRight,
    behind,
    bgColor,
    bgGradient,
    bgImage,
    borderColor,
    borderRound,
    borderStyle,
    borderWidth,
    centerX,
    centerY,
    cursor,
    flag,
    onFocus,
    fontAlignment,
    fontColor,
    fontFamily,
    fontSize,
    fontVariant,
    fontWeight,
    gridPosition,
    gridTemplate,
    height,
    heightBetween,
    heightContent,
    heightFill,
    heightTextAreaContent,
    hover,
    letterSpacing,
    merge,
    moveX,
    moveY,
    none,
    overflow,
    padding,
    present,
    rotate,
    scale,
    shadows,
    spacing,
    transparency,
    txtShadows,
    value,
    width,
    widthBetween,
    widthContent,
    widthFill,
    wordSpacing,
    xAlign,
    yAlign,
};

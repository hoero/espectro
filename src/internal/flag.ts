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

// If the query is in the truth, return true
function present(myFlag: Flag, fields: Field[]): boolean {
    switch (myFlag.type) {
        case Flags.Flag:
            return (
                fields.find((value) => value[0] === myFlag.first) !== undefined
            );

        case Flags.Second:
            return (
                fields.find((value) => value[1] === myFlag.second) !== undefined
            );
    }
}

// Add a flag to a field.
function add(myFlag: Flag, fields: Field[]): Field[] {
    switch (myFlag.type) {
        case Flags.Flag:
            return [Field(myFlag.first, 0), ...fields];

        case Flags.Second:
            return [Field(0, myFlag.second), ...fields];
    }
}

function flag(i: number): Flag {
    if (i > 31) return Second(i === 32 ? 1 : i - 32 + 1);
    return Flag(i);
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

const focus = flag(31);

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
    focus,
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
    width,
    widthBetween,
    widthContent,
    widthFill,
    wordSpacing,
    xAlign,
    yAlign,
};

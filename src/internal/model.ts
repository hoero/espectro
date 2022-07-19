interface Rgba {
    red: number;
    green: number;
    blue: number;
    alpha: number;
}

interface Hsla {
    hue: number;
    saturation: number;
    lightness: number;
    alpha: number;
}

type Colour = [number, number, number];

type ColourAlpha = [number, number, number, number];

type Color = Rgba | Hsla;

type Px = [number, Lengths.Px];

type Rem = [number, Lengths.Rem];

type MinMax = [number, Lengths.Content | Lengths.Fill];

type Length = Px | Rem | MinMax | Lengths;

enum Lengths {
    Px,
    Rem,
    Content,
    Fill,
    MinContent,
    MaxContent,
}

export { Rgba, Hsla, Colour, ColourAlpha, Color, MinMax, Length, Lengths };

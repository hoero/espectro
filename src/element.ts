import { Length, Lengths } from './internal/model';

function px(value: number): Length {
    return [Lengths.Px, Math.round(value)];
}

function rem(value: number): Length {
    return [Lengths.Rem, value];
}

// Shrink an element to fit its contents.
let shrink: Length = Lengths.Content;

// Fill the available space. The available space will be split evenly between elements that have `width fill`.
let fill: Length = Lengths.Fill;

// Set supported CSS property to min-content
let minContent: Length = Lengths.MinContent;

// Set supported CSS property to max-content
let maxContent: Length = Lengths.MaxContent;

/** TODO: Similarly you can set a minimum boundary.

     el
        [ height
            (fill
                |> maximum 300
                |> minimum 30
            )

        ]
        (text "I will stop at 300px")
*/
function minimum(
    value: number,
    length: Lengths.Content | Lengths.Fill
): Length {
    return [length, value];
}

/** TODO: Add a maximum to a length.

    el
        [ height
            (fill
                |> maximum 300
            )
        ]
        (text "I will stop at 300px")
*/
function maximum(
    value: number,
    length: Lengths.Content | Lengths.Fill
): Length {
    return [length, value];
}

/** TODO: Sometimes you may not want to split available space evenly. In this case you can use `fillPortion` to define which elements should have what portion of the available space.

So, two elements, one with `width (fillPortion 2)` and one with `width (fillPortion 3)`. The first would get 2 portions of the available space, while the second would get 3.

**Also:** `fill == fillPortion 1`
*/
function fillPortion(value: number): Length {
    return [Lengths.Fill, value];
}

export {
    px,
    rem,
    shrink,
    fill,
    fillPortion,
    minContent,
    maxContent,
    minimum,
    maximum,
};

import { Length, Lengths } from './internal/model';

function px(value: number): Length {
    return [value, Lengths.Px];
}

function rem(value: number): Length {
    return [value, Lengths.Rem];
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
    return [value, length];
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
    return [value, length];
}

export { px, rem, shrink, fill, minContent, maxContent, minimum, maximum };

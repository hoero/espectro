/**TODO
 * Notes from the `Html.Keyed` on how keyed works:

---

A keyed node helps optimize cases where children are getting added, moved, removed, etc. Common examples include:

  - The user can delete items from a list.
  - The user can create new items in a list.
  - You can sort a list based on name or date or whatever.

When you use a keyed node, every child is paired with a string identifier. This makes it possible for the underlying diffing algorithm to reuse nodes more efficiently.

This means if a key is changed between renders, then the diffing step will be skipped and the node will be forced to rerender.

---

@docs el, column, row
 */

import { height, shrink, width } from '../element.ts';
import {
    asColumn,
    asEl,
    asRow,
    Attribute,
    Element,
    Keyed,
} from '../internal/data.ts';
import { div, element, htmlClass } from '../internal/model.ts';
import { classes } from '../internal/style.ts';

/**
 * TODO:
 * @param attributes
 * @param child
 * @returns
 */
function el(attributes: Attribute[], child: [string, Element]): Element {
    return element(
        asEl,
        div,
        [width(shrink), height(shrink), ...attributes],
        Keyed([child])
    );
}

/**
 * TODO:
 * @param attributes
 * @param children
 * @returns
 */
function row(attributes: Attribute[], children: [string, Element][]): Element {
    return element(
        asRow,
        div,
        [
            htmlClass(classes.contentLeft + ' ' + classes.contentCenterY),
            width(shrink),
            height(shrink),
            ...attributes,
        ],
        Keyed(children)
    );
}

/**
 * TODO:
 * @param attributes
 * @param children
 * @returns
 */
function column(
    attributes: Attribute[],
    children: [string, Element][]
): Element {
    return element(
        asColumn,
        div,
        [
            htmlClass(classes.contentTop + ' ' + classes.contentLeft),
            width(shrink),
            height(shrink),
            ...attributes,
        ],
        Keyed(children)
    );
}

export { el, column, row };

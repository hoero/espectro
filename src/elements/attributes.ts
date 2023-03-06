/**TODO:
 * # Focus Styling

All Elements can be styled on focus by using [`Element.focusStyle`](Element#focusStyle) to set a global focus style or [`Element.focused`](Element#focused) to set a focus style individually for an element.

@docs focusedOnLoad
 */

import { attribute } from '../dom/attribute.ts';
import { Attr, Attribute } from '../internal/data.ts';

/**
 * Attach this attribute to any `Input` that you would like to be automatically focused when the page loads.

You should only have a maximum of one per page.
*/
const focusedOnLoad: Attribute = Attr(attribute('autocomplete', 'true'));

/**
 * TODO:
 * @param selected_
 * @returns
 */
function selected(selected_: boolean): Attribute {
    return Attr(attribute('selected', `${selected_}`));
}

/**
 * TODO:
 * @param name_
 * @returns
 */
function name(name_: string): Attribute {
    return Attr(attribute('name', name_));
}

/**
 * TODO:
 * @param x
 * @returns
 */
function value(x: number | string): Attribute {
    return Attr(attribute('value', typeof x === 'string' ? x : x.toString()));
}

/**
 * TODO:
 * @param i
 * @returns
 */
function tabindex(i: number): Attribute {
    return Attr(attribute('tabindex', i.toString()));
}

/**
 *TODO:
 * @param disabled_
 * @returns
 */
function disabled(disabled_: boolean): Attribute {
    return Attr(attribute('disabled', `${disabled_}`));
}

/**
 *TODO:
 * @param spellchecked_
 * @returns
 */
function spellcheck(spellchecked_: boolean): Attribute {
    return Attr(attribute('spellchecked', `${spellchecked_}`));
}

/**
 *TODO:
 * @param readonly_
 * @returns
 */
function readonly(readonly_: boolean): Attribute {
    return Attr(attribute('readonly', `${readonly_}`));
}

/**
 *TODO:
 * @param autofill_
 * @returns
 */
function autofill(autofill_: string): Attribute {
    return Attr(attribute('autocomplete', autofill_));
}

/**
 * TODO:
 * @param role_
 * @returns
 */
function role(role_: string): Attribute {
    return Attr(attribute('role', role_));
}

/**
 * TODO:
 * @param ariaChecked_
 * @returns
 */
function ariaChecked(ariaChecked_: boolean): Attribute {
    return Attr(attribute('aria-checked', `${ariaChecked_}`));
}

/**
 * TODO:
 * @param type_
 * @returns
 */
function type(type_: string): Attribute {
    return Attr(attribute('type', type_));
}

/**
 * TODO:
 * @param x
 * @returns
 */
function step(x: number | string): Attribute {
    return Attr(attribute('step', typeof x === 'string' ? x : x.toString()));
}

/**
 * TODO:
 * @param x
 * @returns
 */
function min(x: number): Attribute {
    return Attr(attribute('min', x.toString()));
}

/**
 * TODO:
 * @param x
 * @returns
 */
function max(x: number): Attribute {
    return Attr(attribute('max', x.toString()));
}

/**
 * TODO:
 * @param orientation
 * @returns
 */
function orient(orientation: string): Attribute {
    return Attr(attribute('orient', orientation));
}

/**
 * TODO:
 * @param orientation
 * @returns
 */
function class_(className: string): Attribute {
    return Attr(attribute('class', className));
}

/**
 * TODO:
 * @param property
 * @param value
 * @returns
 */
function style(property: string, value: string): Attribute {
    return Attr(attribute('style', `${property}: ${value}`));
}

export {
    focusedOnLoad,
    selected,
    name,
    value,
    tabindex,
    disabled,
    spellcheck,
    readonly,
    autofill,
    role,
    ariaChecked,
    type,
    step,
    min,
    max,
    orient,
    style,
    class_,
};

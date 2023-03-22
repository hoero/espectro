/**
 * # Focus Styling
 *
 * All Elements can be styled on focus by using [`Element.focusStyle`](Element#focusStyle) to set a global focus style or [`Element.focused`](Element#focused) to set a focus style individually for an element.
 *
 * @docs focusedOnLoad
 */

import { attribute } from '../dom/attribute.ts';
import { Attr, Attribute } from '../internal/data.ts';

/**
 * Attach this attribute to any `Input` that you would like to be automatically focused when the page loads.
 *
 * You should only have a maximum of one per page.
 */
const focusedOnLoad: Attribute = Attr(attribute('autocomplete', 'true'));

function selected(selected_: boolean): Attribute {
    return Attr(attribute('selected', `${selected_}`));
}

function name(name_: string): Attribute {
    return Attr(attribute('name', name_));
}

function value(x: number | string): Attribute {
    return Attr(attribute('value', typeof x === 'string' ? x : x.toString()));
}

function tabindex(i: number): Attribute {
    return Attr(attribute('tabindex', i.toString()));
}

function disabled(disabled_: boolean): Attribute {
    return Attr(attribute('disabled', `${disabled_}`));
}

function spellcheck(spellchecked_: boolean): Attribute {
    return Attr(attribute('spellchecked', `${spellchecked_}`));
}

function readonly(readonly_: boolean): Attribute {
    return Attr(attribute('readonly', `${readonly_}`));
}

function autofill(autofill_: string): Attribute {
    return Attr(attribute('autocomplete', autofill_));
}

function role(role_: string): Attribute {
    return Attr(attribute('role', role_));
}

function ariaChecked(ariaChecked_: boolean): Attribute {
    return Attr(attribute('aria-checked', `${ariaChecked_}`));
}

function type(type_: string): Attribute {
    return Attr(attribute('type', type_));
}

function step(x: number | string): Attribute {
    return Attr(attribute('step', typeof x === 'string' ? x : x.toString()));
}

function min(x: number): Attribute {
    return Attr(attribute('min', x.toString()));
}

function max(x: number): Attribute {
    return Attr(attribute('max', x.toString()));
}

function orient(orientation: string): Attribute {
    return Attr(attribute('orient', orientation));
}

function class_(className: string): Attribute {
    return Attr(attribute('class', className));
}

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

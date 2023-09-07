/**
 * # Focus Styling
 *
 * All Elements can be styled on focus by using [`Element.focusStyle`](Element#focusStyle) to set a global focus style or [`Element.focused`](Element#focused) to set a focus style individually for an element.
 *
 * @docs focusedOnLoad
 */

import { preact } from '../../deps.ts';
import { Attr, Attribute } from '../internal/data.ts';

/**
 * Attach this attribute to any `Input` that you would like to be automatically focused when the page loads.
 *
 * You should only have a maximum of one per page.
 */
const focusedOnLoad: Attribute = Attr({ autocomplete: 'true' });

function selected(selected_: boolean): Attribute {
    return Attr({ selected: selected_ });
}

function name(name_: string): Attribute {
    return Attr({ name: name_ });
}

function value(x: number | string): Attribute {
    return Attr({ value: typeof x === 'string' ? x : x.toString() });
}

function tabindex(i: number): Attribute {
    return Attr({ tabIndex: i });
}

function disabled(disabled_: boolean): Attribute {
    return Attr({ disabled: disabled_ });
}

function spellcheck(spellcheck_: boolean): Attribute {
    return Attr({ spellcheck: spellcheck_ });
}

function readonly(readonly_: boolean): Attribute {
    return Attr({ readonly: readonly_ });
}

function autofill(autofill_: string): Attribute {
    return Attr({ autocomplete: autofill_ });
}

function role(role_: preact.JSX.AriaRole): Attribute {
    return Attr({ role: role_ });
}

function ariaChecked(ariaChecked_: boolean): Attribute {
    return Attr({ 'aria-checked': ariaChecked_ });
}

function type(type_: string): Attribute {
    return Attr({ type: type_ });
}

function step(x: number | string): Attribute {
    return Attr({ step: typeof x === 'string' ? x : x.toString() });
}

function min(x: number): Attribute {
    return Attr({ min: x.toString() });
}

function max(x: number): Attribute {
    return Attr({ max: x.toString() });
}

function orient(orientation: string): Attribute {
    return Attr({ orient: orientation });
}

function id(id: string): Attribute {
    return Attr({ id: id });
}

function class_(className: string): Attribute {
    return Attr({ class: className });
}

function classList(classes: [string, boolean][]): Attribute {
    const classes_: string[] = [];

    classes.forEach((item) => {
        if (item[1]) {
            classes_.push(item[0]);
        }
    });

    return class_(classes_.join(' '));
}

function style(property: string, value: string): Attribute {
    return Attr({ style: `${property}: ${value};` });
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
    classList,
    id,
};

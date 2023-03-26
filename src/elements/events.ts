// deno-lint-ignore-file
/**
 *
 * ## Mouse Events
 *
 * @docs onClick, onDoubleClick, onMouseDown, onMouseUp, onMouseEnter, onMouseLeave, onMouseMove
 *
 * ## Focus Events
 * @docs onFocus, onLoseFocus
 */

import { preact } from '../../deps.ts';
import { Attr, Attribute } from '../internal/data.ts';

// Key codes
const enter = 'Enter',
    tab = 'Tab',
    delete_ = 'Delete',
    backspace = 'Backspace',
    upArrow = 'ArrowUp',
    upArrow_ = 'Up', // IE/Edge specific value
    leftArrow = 'ArrowLeft',
    leftArrow_ = 'Left', // IE/Edge specific value
    rightArrow = 'ArrowRight',
    rightArrow_ = 'Right', // IE/Edge specific value
    downArrow = 'ArrowDown',
    downArrow_ = 'Down', // IE/Edge specific value
    space = ' ',
    escape = 'Escape',
    escape_ = 'Esc'; // IE/Edge specific value

// Mouse Events

function onMouseDown(
    handler: preact.JSX.MouseEventHandler<EventTarget>
): Attribute {
    return on('onMouseDown', handler);
}

function onMouseUp(
    handler: preact.JSX.MouseEventHandler<EventTarget>
): Attribute {
    return on('onMouseUp', handler);
}

function onClick(
    handler: preact.JSX.MouseEventHandler<EventTarget>
): Attribute {
    return on('onClick', handler);
}

function onDoubleClick(
    handler: preact.JSX.MouseEventHandler<EventTarget>
): Attribute {
    return on('onDblClick', handler);
}

function onMouseEnter(
    handler: preact.JSX.MouseEventHandler<EventTarget>
): Attribute {
    return on('onMouseEnter', handler);
}

function onMouseLeave(
    handler: preact.JSX.MouseEventHandler<EventTarget>
): Attribute {
    return on('onMouseLeave', handler);
}

function onMouseMove(
    handler: preact.JSX.MouseEventHandler<EventTarget>
): Attribute {
    return on('onMouseMove', handler);
}

// Focus Events

function onLoseFocus(
    handler: preact.JSX.FocusEventHandler<EventTarget>
): Attribute {
    return on('onBlur', handler);
}

function onFocus(
    handler: preact.JSX.FocusEventHandler<EventTarget>
): Attribute {
    return on('onFocus', handler);
}

function onFocusOut(
    handler: preact.JSX.FocusEventHandler<EventTarget>
): Attribute {
    return on('onfocusout', handler);
}

function onFocusIn(
    handler: preact.JSX.FocusEventHandler<EventTarget>
): Attribute {
    return on('onfocusin', handler);
}

// Form Events

function onInput(
    handler: preact.JSX.GenericEventHandler<EventTarget>
): Attribute {
    return on('onInput', handler);
}

// Keyboard Events

function onEnter(handler: preact.JSX.KeyboardEventHandler<EventTarget>) {
    return onKey(enter, handler);
}

function onSpace(handler: preact.JSX.KeyboardEventHandler<EventTarget>) {
    return onKey(space, handler);
}

function onEscape(handler: preact.JSX.KeyboardEventHandler<EventTarget>) {
    return onKey(escape, handler);
}

function onTab(handler: preact.JSX.KeyboardEventHandler<EventTarget>) {
    return onKey(tab, handler);
}

function onDelete(handler: preact.JSX.KeyboardEventHandler<EventTarget>) {
    return onKey(delete_, handler);
}

function onBackspace(handler: preact.JSX.KeyboardEventHandler<EventTarget>) {
    return onKey(backspace, handler);
}

function onUpArrow(handler: preact.JSX.KeyboardEventHandler<EventTarget>) {
    return onKey(upArrow, handler);
}

function onRightArrow(handler: preact.JSX.KeyboardEventHandler<EventTarget>) {
    return onKey(rightArrow, handler);
}

function onLeftArrow(handler: preact.JSX.KeyboardEventHandler<EventTarget>) {
    return onKey(leftArrow, handler);
}

function onDownArrow(handler: preact.JSX.KeyboardEventHandler<EventTarget>) {
    return onKey(downArrow, handler);
}

function onKey(
    keyCode: string,
    handler: preact.JSX.KeyboardEventHandler<EventTarget>
): Attribute {
    return on(
        'onKeyUp',
        (event: preact.JSX.TargetedKeyboardEvent<EventTarget>) => {
            const { key } = event;
            event.preventDefault();
            switch (key) {
                case keyCode:
                    handler(event);
                    break;
                default:
                    break;
            }
        }
    );
}

function onKeyLookUp(
    handler: preact.JSX.KeyboardEventHandler<EventTarget>
): Attribute {
    // We generally want these attached to the keydown event because it allows us to prevent default on things like spacebar scrolling the page.
    // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/button_role
    return on(
        'onKeyDown',
        (event: preact.JSX.TargetedKeyboardEvent<EventTarget>) => {
            event.preventDefault();
            handler(event);
        }
    );
}

// General Events

function on<T extends preact.JSX.TargetedEvent>(
    event: string,
    handler: preact.JSX.EventHandler<T>
): Attribute {
    return Attr({ [event]: handler });
}

export {
    enter,
    tab,
    delete_,
    backspace,
    upArrow,
    upArrow_,
    leftArrow,
    leftArrow_,
    rightArrow,
    rightArrow_,
    downArrow,
    downArrow_,
    space,
    escape,
    escape_,
    on,
    onClick,
    onDoubleClick,
    onMouseDown,
    onMouseUp,
    onMouseEnter,
    onMouseLeave,
    onMouseMove,
    onFocus,
    onLoseFocus,
    onFocusIn,
    onFocusOut,
    onInput,
    onKey,
    onKeyLookUp,
    onEnter,
    onSpace,
    onEscape,
    onTab,
    onDelete,
    onBackspace,
    onUpArrow,
    onDownArrow,
    onRightArrow,
    onLeftArrow,
};

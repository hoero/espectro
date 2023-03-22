/**
 *
 * ## Mouse Events
 *
 * @docs onClick, onDoubleClick, onMouseDown, onMouseUp, onMouseEnter, onMouseLeave, onMouseMove
 *
 * ## Focus Events
 * @docs onFocus, onLoseFocus
 */

import { EventHandler, on as on_ } from '../dom/event.ts';
import { Attribute, Event } from '../internal/data.ts';

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

function onMouseDown(class_: string, handler: EventHandler): Attribute {
    return Event((on_(class_).mouseDown = handler));
}

function onMouseUp(class_: string, handler: EventHandler): Attribute {
    return Event((on_(class_).mouseUp = handler));
}

function onClick(class_: string, handler: EventHandler): Attribute {
    return Event((on_(class_).click = handler));
}

function onDoubleClick(class_: string, handler: EventHandler): Attribute {
    return Event((on_(class_).doubleClick = handler));
}

function onMouseEnter(class_: string, handler: EventHandler): Attribute {
    return Event((on_(class_).mouseEnter = handler));
}

function onMouseLeave(class_: string, handler: EventHandler): Attribute {
    return Event((on_(class_).mouseLeave = handler));
}

function onMouseMove(class_: string, handler: EventHandler): Attribute {
    return Event((on_(class_).mouseMove = handler));
}

// Focus Events

function onLoseFocus(class_: string, handler: EventHandler): Attribute {
    return Event((on_(class_).blur = handler));
}

function onFocus(class_: string, handler: EventHandler): Attribute {
    return Event((on_(class_).focus = handler));
}

function onFocusOut(class_: string, handler: EventHandler): Attribute {
    return on(class_, 'focusout', handler);
}

function onFocusIn(class_: string, handler: EventHandler): Attribute {
    return on(class_, 'focusin', handler);
}

// Keyboard Events

function onInput(class_: string, handler: EventHandler): Attribute {
    return Event((on_(class_).input = handler));
}

function onEnter(class_: string, handler: EventHandler) {
    return onKey(class_, enter, handler);
}

function onSpace(class_: string, handler: EventHandler) {
    return onKey(class_, space, handler);
}

function onEscape(class_: string, handler: EventHandler) {
    return onKey(class_, escape, handler);
}

function onTab(class_: string, handler: EventHandler) {
    return onKey(class_, tab, handler);
}

function onDelete(class_: string, handler: EventHandler) {
    return onKey(class_, delete_, handler);
}

function onBackspace(class_: string, handler: EventHandler) {
    return onKey(class_, backspace, handler);
}

function onUpArrow(class_: string, handler: EventHandler) {
    return onKey(class_, upArrow, handler);
}

function onRightArrow(class_: string, handler: EventHandler) {
    return onKey(class_, rightArrow, handler);
}

function onLeftArrow(class_: string, handler: EventHandler) {
    return onKey(class_, leftArrow, handler);
}

function onDownArrow(class_: string, handler: EventHandler) {
    return onKey(class_, downArrow, handler);
}

function onKey(
    class_: string,
    keyCode: string,
    handler: EventHandler
): Attribute {
    return on(class_, 'keyup', (ctx) => {
        const { key } = <KeyboardEvent>ctx.e;
        ctx.e.preventDefault();
        switch (key) {
            case keyCode:
                handler(ctx);
                break;
            default:
                break;
        }
    });
}

function onKeyLookUp(class_: string, handler: EventHandler): Attribute {
    // We generally want these attached to the keydown event because it allows us to prevent default on things like spacebar scrolling the page.
    // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/button_role
    return on(class_, 'keydown', (ctx) => {
        ctx.e.preventDefault();
        handler(ctx);
    });
}

// General Events

function on(class_: string, event: string, handler: EventHandler): Attribute {
    return Event((on_(class_)[event] = handler));
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

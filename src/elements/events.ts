/**
 * TODO:
## Mouse Events

@docs onClick, onDoubleClick, onMouseDown, onMouseUp, onMouseEnter, onMouseLeave, onMouseMove


## Focus Events

@docs onFocus, onLoseFocus
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

/**
 * TODO:
 * @param class_
 * @param handler
 * @returns
 */
function onMouseDown(class_: string, handler: EventHandler): Attribute {
    return Event((on_(class_).mouseDown = handler));
}

/**
 * TODO:
 * @param class_
 * @param handler
 * @returns
 */
function onMouseUp(class_: string, handler: EventHandler): Attribute {
    return Event((on_(class_).mouseUp = handler));
}

/**
 * TODO:
 * @param class_
 * @param handler
 * @returns
 */
function onClick(class_: string, handler: EventHandler): Attribute {
    return Event((on_(class_).click = handler));
}

/**
 * TODO:
 * @param class_
 * @param handler
 * @returns
 */
function onDoubleClick(class_: string, handler: EventHandler): Attribute {
    return Event((on_(class_).doubleClick = handler));
}

/**
 * TODO:
 * @param class_
 * @param handler
 * @returns
 */
function onMouseEnter(class_: string, handler: EventHandler): Attribute {
    return Event((on_(class_).mouseEnter = handler));
}

/**
 * TODO:
 * @param class_
 * @param handler
 * @returns
 */
function onMouseLeave(class_: string, handler: EventHandler): Attribute {
    return Event((on_(class_).mouseLeave = handler));
}

/**
 * TODO:
 * @param class_
 * @param handler
 * @returns
 */
function onMouseMove(class_: string, handler: EventHandler): Attribute {
    return Event((on_(class_).mouseMove = handler));
}

// Focus Events

/**
 * TODO:
 * @param class_
 * @param handler
 * @returns
 */
function onLoseFocus(class_: string, handler: EventHandler): Attribute {
    return Event((on_(class_).blur = handler));
}

/**
 * TODO:
 * @param class_
 * @param handler
 * @returns
 */
function onFocus(class_: string, handler: EventHandler): Attribute {
    return Event((on_(class_).focus = handler));
}

/**
 * TODO:
 * @param class_
 * @param handler
 * @returns
 */
function onFocusOut(class_: string, handler: EventHandler): Attribute {
    return on(class_, 'focusout', handler);
}

/**
 * TODO:
 * @param class_
 * @param handler
 * @returns
 */
function onFocusIn(class_: string, handler: EventHandler): Attribute {
    return on(class_, 'focusin', handler);
}

// Keyboard Events
/**
 * TODO:
 * @param class_
 * @param handler
 * @returns
 */
function onInput(class_: string, handler: EventHandler): Attribute {
    return Event((on_(class_).input = handler));
}

/**
 * TODO:
 * @param class_
 * @param handler
 * @returns
 */
function onEnter(class_: string, handler: EventHandler) {
    return onKey(class_, enter, handler);
}

/**
 * TODO:
 * @param class_
 * @param handler
 * @returns
 */
function onSpace(class_: string, handler: EventHandler) {
    return onKey(class_, space, handler);
}

/**
 * TODO:
 * @param class_
 * @param handler
 * @returns
 */
function onEscape(class_: string, handler: EventHandler) {
    return onKey(class_, escape, handler);
}

/**
 * TODO:
 * @param class_
 * @param handler
 * @returns
 */
function onTab(class_: string, handler: EventHandler) {
    return onKey(class_, tab, handler);
}

/**
 * TODO:
 * @param class_
 * @param handler
 * @returns
 */
function onDelete(class_: string, handler: EventHandler) {
    return onKey(class_, delete_, handler);
}

/**
 * TODO:
 * @param class_
 * @param handler
 * @returns
 */
function onBackspace(class_: string, handler: EventHandler) {
    return onKey(class_, backspace, handler);
}

/**
 * TODO:
 * @param class_
 * @param handler
 * @returns
 */
function onUpArrow(class_: string, handler: EventHandler) {
    return onKey(class_, upArrow, handler);
}

/**
 * TODO:
 * @param class_
 * @param handler
 * @returns
 */
function onRightArrow(class_: string, handler: EventHandler) {
    return onKey(class_, rightArrow, handler);
}

/**
 * TODO:
 * @param class_
 * @param handler
 * @returns
 */
function onLeftArrow(class_: string, handler: EventHandler) {
    return onKey(class_, leftArrow, handler);
}

/**
 * TODO:
 * @param class_
 * @param handler
 * @returns
 */
function onDownArrow(class_: string, handler: EventHandler) {
    return onKey(class_, downArrow, handler);
}

/**
 * TODO:
 * @param class_
 * @param handler
 * @returns
 */
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

/**
 * TODO:
 * @param class_
 * @param handler
 * @returns
 */
function onKeyLookUp(class_: string, handler: EventHandler): Attribute {
    // We generally want these attached to the keydown event because it allows us to prevent default on things like spacebar scrolling the page.
    // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/button_role
    return on(class_, 'keydown', (ctx) => {
        ctx.e.preventDefault();
        handler(ctx);
    });
}

// General Events

/**
 * TODO:
 * @param class_
 * @param handler
 * @returns
 */
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

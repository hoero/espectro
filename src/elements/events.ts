/**
 * TODO:
## Mouse Events

@docs onClick, onDoubleClick, onMouseDown, onMouseUp, onMouseEnter, onMouseLeave, onMouseMove


## Focus Events

@docs onFocus, onLoseFocus
 */

import { EventHandler, on as on_ } from '../dom/event.ts';
import { Attribute, Event } from '../internal/data.ts';

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
    onInput,
};

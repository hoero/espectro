import { capsule } from '../deps.ts';

export interface EventRegistry {
    outside: {
        [key: string]: EventHandler;
    };
    // deno-lint-ignore ban-types
    [key: string]: EventHandler | {};
    (selector: string): {
        [key: string]: EventHandler;
    };
}

export interface ComponentEventContext {
    /** The event */
    e: Event;
    /** The element */
    el: HTMLElement;
    /** Queries elements by the given selector under the component dom */
    query<T extends HTMLElement = HTMLElement>(selector: string): T | null;
    /** Queries all elements by the given selector under the component dom */
    queryAll<T extends HTMLElement = HTMLElement>(
        selector: string
    ): NodeListOf<T>;
    /** Publishes the event. Events are delivered to elements which have `sub:event` class.
     * The dispatched events don't bubbles up */
    pub<T = unknown>(name: string, data?: T): void;
    /** Emits the event. The event bubbles up from the component dom */
    emit<T = unknown>(name: string, data?: T): void;
}

export type EventHandler = (el: ComponentEventContext) => void;

export function on(class_: string) {
    const { on } = capsule.component(class_);
    return on;
}

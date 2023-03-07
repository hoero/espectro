import { DOM } from '../../deps.ts';
import { DOMelement } from '../../deps.ts';
import { CTOR_KEY } from '../../deps.ts';

export function attribute(
    name: string,
    value: string,
    key: typeof CTOR_KEY.CTOR_KEY = CTOR_KEY.CTOR_KEY,
    map: DOM.NamedNodeMap | null = null
): DOM.Attr {
    return new DOMelement.Attr(map, name, value, key);
}

export function attributes(attributes: DOM.Attr[]): DOM.Attr[] {
    const attrs: DOM.Attr[] = [];

    for (const { name, value } of attributes) {
        const attr_ = attribute(name, value);
        attrs.push(attr_);
    }

    return attrs;
}

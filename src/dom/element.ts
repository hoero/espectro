import { DOM, DOMelement, CTOR_KEY } from '../../deps.ts';

export default function Element(
    tagName: string,
    attributes: [string, string][],
    parentNode: DOM.Node | null = null,
    key: typeof CTOR_KEY.CTOR_KEY = CTOR_KEY.CTOR_KEY
): DOM.Element {
    return new DOMelement.Element(tagName, parentNode, attributes, key);
}

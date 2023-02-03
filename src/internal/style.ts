import _ from 'lodash';

interface Class {
    name: string;
    rules: Rule[];
}

function class_(name: string, rules: Rule[]): Class {
    return { name, rules };
}

enum Rules {
    Prop,
    Child,
    AllChildren,
    Supports,
    Descriptor,
    Adjacent,
    Batch,
}

interface Prop {
    type: Rules.Prop;
    key: string;
    value: string;
}

function prop(key: string, value: string): Prop {
    return { type: Rules.Prop, key, value };
}

interface Child {
    type: Rules.Child;
    child: string;
    rules: Rule[];
}

function child(child: string, rules: Rule[]): Child {
    return { type: Rules.Child, child, rules };
}

interface AllChildren {
    type: Rules.AllChildren;
    child: string;
    rules: Rule[];
}

function allChildren(child: string, rules: Rule[]): AllChildren {
    return { type: Rules.AllChildren, child, rules };
}

interface Supports {
    type: Rules.Supports;
    support: [string, string];
    props: [string, string][];
}

function supports(
    support: [string, string],
    props: [string, string][]
): Supports {
    return { type: Rules.Supports, support, props };
}

interface Descriptor {
    type: Rules.Descriptor;
    descriptor: string;
    rules: Rule[];
}

function descriptor(descriptor: string, rules: Rule[]): Descriptor {
    return { type: Rules.Descriptor, descriptor, rules };
}

interface Adjacent {
    type: Rules.Adjacent;
    selector: string;
    rules: Rule[];
}

function adjacent(selector: string, rules: Rule[]): Adjacent {
    return { type: Rules.Adjacent, selector, rules };
}

interface Batch {
    type: Rules.Batch;
    batched: Rule[];
}

function batch(batched: Rule[]): Batch {
    return { type: Rules.Batch, batched };
}

type Rule =
    | Prop
    | Child
    | AllChildren
    | Supports
    | Descriptor
    | Adjacent
    | Batch;

// Lengths

enum Alignment {
    Top,
    Bottom,
    Left,
    Right,
    CenterX,
    CenterY,
}

enum Location {
    Above,
    Below,
    OnLeft,
    OnRight,
    Within,
    Behind,
}

interface SelfDescriptor {
    align: Alignment;
}

function self(align: Alignment): SelfDescriptor {
    return { align };
}

interface ContentDescriptor {
    align: Alignment;
}

function content(align: Alignment): ContentDescriptor {
    return { align };
}

interface Intermediate {
    selector: string;
    props: [string, string][];
    closing: string;
    others: Intermediate[];
}

function intermediate(
    selector: string,
    props: [string, string][],
    closing: string,
    others: Intermediate[]
): Intermediate {
    return { selector, props, closing, others };
}

const alignments = [
    Alignment.Top,
    Alignment.Bottom,
    Alignment.Right,
    Alignment.Left,
    Alignment.CenterX,
    Alignment.CenterY,
];

const locations = [
    Location.Above,
    Location.Below,
    Location.OnRight,
    Location.OnLeft,
    Location.Within,
    Location.Behind,
];

const classes = {
    root: 'ui',
    any: 's',
    single: 'e',
    row: 'r',
    column: 'c',
    page: 'pg',
    paragraph: 'p',
    text: 't',
    grid: 'g',
    imageContainer: 'ic',
    wrapped: 'wrp',

    // widhts/heights
    widthFill: 'wf',
    widthContent: 'wc',
    widthExact: 'we',
    widthFillPortion: 'wfp',
    heightFill: 'hf',
    heightContent: 'hc',
    heightExact: 'he',
    heightFillPortion: 'hfp',
    seButton: 'sbt',

    // nearby elements
    nearby: 'nb',
    above: 'a',
    below: 'b',
    onRight: 'or',
    onLeft: 'ol',
    inFront: 'fr',
    behind: 'bh',
    hasBehind: 'hbh',

    // alignments
    alignTop: 'at',
    alignBottom: 'ab',
    alignRight: 'ar',
    alignLeft: 'al',
    alignCenterX: 'cx',
    alignCenterY: 'cy',
    alignedHorizontally: 'ah',
    alignedVertically: 'av',

    // space evenly
    spaceEvenly: 'sev',
    container: 'ctr',
    alignContainerRight: 'acr',
    alignContainerBottom: 'acb',
    alignContainerCenterX: 'accx',
    alignContainerCenterY: 'accy',

    // content alignments
    contentTop: 'ct',
    contentBottom: 'cb',
    contentRight: 'cr',
    contentLeft: 'cl',
    contentCenterX: 'ccx',
    contentCenterY: 'ccy',

    // selection
    noTextSelection: 'notxt',
    cursorPointer: 'cptr',
    cursorText: 'ctxt',

    // pointer events
    passPointerEvents: 'ppe',
    capturePointerEvents: 'cpe',
    transparent: 'clr',
    opaque: 'oq',
    overflowHidden: 'oh',

    // special state classes
    hover: 'hv',

    // , hoverOpaque : "hover-opaque"
    focus: 'fcs',
    focusedWithin: 'focus-within',

    // , focusOpaque : "focus-opaque"
    active: 'atv',

    // , activeOpaque : "active-opaque"
    // scrollbars
    scrollbars: 'sb',
    scrollbarsX: 'sbx',
    scrollbarsY: 'sby',
    clip: 'cp',
    clipX: 'cpx',
    clipY: 'cpy',

    // borders
    borderNone: 'bn',
    borderDashed: 'bd',
    borderDotted: 'bdt',
    borderSolid: 'bs',

    // text weight
    sizeByCapital: 'cap',
    fullSize: 'fs',
    textThin: 'w1',
    textExtraLight: 'w2',
    textLight: 'w3',
    textNormalWeight: 'w4',
    textMedium: 'w5',
    textSemiBold: 'w6',
    bold: 'w7',
    textExtraBold: 'w8',
    textHeavy: 'w9',
    italic: 'i',
    strike: 'sk',
    underline: 'u',
    textUnitalicized: 'tun',

    // text alignment
    textJustify: 'tj',
    textJustifyAll: 'tja',
    textCenter: 'tc',
    textRight: 'tr',
    textLeft: 'tl',
    transition: 'ts',

    // inputText
    inputText: 'it',
    inputMultiline: 'iml',
    inputMultilineParent: 'imlp',
    inputMultilineFiller: 'imlf',
    inputMultilineWrapper: 'implw',
    inputLabel: 'lbl',

    // link
    link: 'lnk',
};

// The indulgent unicode character version.
const unicode = {
    root: 'style-elements',
    any: 's',
    single: 'e',
    row: '⋯',
    column: '⋮',
    page: '🗏',
    paragraph: 'p',
    text: 'text',
    grid: '▦',

    // widhts/heights
    widthFill: '↔',
    widthContent: 'width-content',
    widthExact: 'width-exact',
    heightFill: '↕',
    heightContent: 'height-content',
    heightExact: 'height-exact',

    // nearby elements
    above: 'above',
    below: 'below',
    onRight: 'on-right',
    onLeft: 'on-left',
    inFront: 'infront',
    behind: 'behind',

    // alignments
    alignTop: '⤒',
    alignBottom: '⤓',
    alignRight: '⇥',
    alignLeft: '⇤',
    alignCenterX: 'self-center-x',
    alignCenterY: 'self-center-y',

    // space evenly
    spaceEvenly: 'space-evenly',
    container: 'container',

    // content alignments
    contentTop: 'content-top',
    contentBottom: 'content-bottom',
    contentRight: 'content-right',
    contentLeft: 'content-left',
    contentCenterX: 'content-center-x',
    contentCenterY: 'content-center-y',

    // selection
    noTextSelection: 'no-text-selection',
    cursorPointer: 'cursor-pointer',
    cursorText: 'cursor-text',

    // pointer events
    passPointerEvents: 'pass-pointer-events',
    capturePointerEvents: 'capture-pointer-events',
    transparent: 'transparent',
    opaque: 'opaque',

    // scrollbars
    scrollbars: 'scrollbars',
    scrollbarsX: 'scrollbars-x',
    scrollbarsY: 'scrollbars-y',
    clip: '✂',
    clipX: '✂x',
    clipY: '✂y',

    // borders
    borderNone: 'border-none',
    borderDashed: 'border-dashed',
    borderDotted: 'border-dotted',
    borderSolid: 'border-solid',

    // text weight
    textThin: 'text-thin',
    textExtraLight: 'text-extra-light',
    textLight: 'text-light',
    textNormalWeight: 'text-normal-weight',
    textMedium: 'text-medium',
    textSemiBold: 'text-semi-bold',
    bold: 'bold',
    textExtraBold: 'text-extra-bold',
    textHeavy: 'text-heavy',
    italic: 'italic',
    strike: 'strike',
    underline: 'underline',
    textUnitalicized: 'text-unitalicized',

    // text alignment
    textJustify: 'text-justify',
    textJustifyAll: 'text-justify-all',
    textCenter: 'text-center',
    textRight: 'text-right',
    textLeft: 'text-left',
};

const single = {
    root: 'z',
    any: 's',
    single: 'e',
    row: 'r',
    column: 'c',
    page: 'l',
    paragraph: 'p',
    text: 't',
    grid: 'g',

    // widhts/heights
    widthFill: '↔',
    widthContent: 'wc',
    widthExact: 'w',
    heightFill: '↕',
    heightContent: 'hc',
    heightExact: 'h',

    // nearby elements
    above: 'o',
    below: 'u',
    onRight: 'r',
    onLeft: 'l',
    inFront: 'f',
    behind: 'b',

    // alignments
    alignTop: '⤒',
    alignBottom: '⤓',
    alignRight: '⇥',
    alignLeft: '⇤',
    alignCenterX: 'self-center-x',
    alignCenterY: 'self-center-y',

    // space evenly
    spaceEvenly: 'space-evenly',
    container: 'container',

    // content alignments
    contentTop: 'c⤒',
    contentBottom: 'c⤓',
    contentRight: 'c⇥',
    contentLeft: 'c⇤',
    contentCenterX: 'content-center-x',
    contentCenterY: 'content-center-y',

    // selection
    noTextSelection: 'no-text-selection',
    cursorPointer: 'cursor-pointer',
    cursorText: 'cursor-text',

    // pointer events
    passPointerEvents: 'pass-pointer-events',
    capturePointerEvents: 'capture-pointer-events',
    transparent: 'transparent',
    opaque: 'opaque',

    // scrollbars
    scrollbars: 'scrollbars',
    scrollbarsX: 'scrollbars-x',
    scrollbarsY: 'scrollbars-y',
    clip: '✂',
    clipX: '✂x',
    clipY: '✂y',

    // borders
    borderNone: 'border-none',
    borderDashed: 'border-dashed',
    borderDotted: 'border-dotted',
    borderSolid: 'border-solid',

    // text weight
    textThin: 'text-thin',
    textExtraLight: 'text-extra-light',
    textLight: 'text-light',
    textNormalWeight: 'text-normal-weight',
    textMedium: 'text-medium',
    textSemiBold: 'text-semi-bold',
    bold: 'b',
    textExtraBold: 'text-extra-bold',
    textHeavy: 'text-heavy',
    italic: 'i',
    strike: '-',
    underline: 'u',
    textUnitalicized: 'text-unitalicized',

    // text alignment
    textJustify: 'text-justify',
    textJustifyAll: 'text-justify-all',
    textCenter: 'text-center',
    textRight: 'text-right',
    textLeft: 'text-left',
};

function selfName(desc: SelfDescriptor): string {
    switch (desc.align) {
        case Alignment.Top:
            return dot(classes.alignTop);

        case Alignment.Bottom:
            return dot(classes.alignBottom);

        case Alignment.Left:
            return dot(classes.alignLeft);

        case Alignment.Right:
            return dot(classes.alignRight);

        case Alignment.CenterX:
            return dot(classes.alignCenterX);

        case Alignment.CenterY:
            return dot(classes.alignCenterY);
    }
}

function contentName(desc: ContentDescriptor): string {
    switch (desc.align) {
        case Alignment.Top:
            return dot(classes.contentTop);

        case Alignment.Bottom:
            return dot(classes.contentBottom);

        case Alignment.Left:
            return dot(classes.contentLeft);

        case Alignment.Right:
            return dot(classes.contentRight);

        case Alignment.CenterX:
            return dot(classes.contentCenterX);

        case Alignment.CenterY:
            return dot(classes.contentCenterY);
    }
}

function describeAlignment(
    values: (alignment: Alignment) => [Rule[], Rule[]]
): Batch {
    function createDescription(alignment: Alignment): Rule[] {
        const [content, indiv] = values(alignment);
        return [
            descriptor(contentName({ align: alignment }), content),
            child(dot(classes.any), [
                descriptor(selfName({ align: alignment }), indiv),
            ]),
        ];
    }
    return batch(
        alignments.flatMap((value: Alignment) => createDescription(value))
    );
}

function gridAlignment(values: (alignment: Alignment) => Rule[]): Batch {
    function createDescription(alignment: Alignment): Rule[] {
        return [
            child(dot(classes.any), [
                descriptor(selfName({ align: alignment }), values(alignment)),
            ]),
        ];
    }
    return batch(
        alignments.flatMap((value: Alignment) => createDescription(value))
    );
}

function emptyIntermediate(selector: string, closing: string): Intermediate {
    return intermediate(selector, [], closing, []);
}

function renderRules(
    parent: Intermediate,
    rulesToRender: Rule[]
): Intermediate {
    function generateIntermediates(
        rule: Rule,
        rendered: Intermediate
    ): Intermediate {
        switch (rule.type) {
            case Rules.Prop: {
                rendered.props = [[rule.key, rule.value], ...rendered.props];
                return rendered;
            }

            case Rules.Supports: {
                rendered.others = [
                    intermediate(
                        `@supports (${rule.support[0]}:${rule.support[1]}) {${parent.selector}`,
                        rule.props,
                        `\n}`,
                        []
                    ),
                    ...rendered.others,
                ];
                return rendered;
            }

            case Rules.Adjacent: {
                rendered.others = [
                    renderRules(
                        emptyIntermediate(
                            parent.selector + ' + ' + rule.selector,
                            ''
                        ),
                        rule.rules
                    ),
                    ...rendered.others,
                ];
                return rendered;
            }

            case Rules.Child: {
                rendered.others = [
                    renderRules(
                        emptyIntermediate(
                            parent.selector + ' > ' + rule.child,
                            ''
                        ),
                        rule.rules
                    ),
                    ...rendered.others,
                ];
                return rendered;
            }

            case Rules.AllChildren: {
                rendered.others = [
                    renderRules(
                        emptyIntermediate(
                            parent.selector + ' ' + rule.child,
                            ''
                        ),
                        rule.rules
                    ),
                    ...rendered.others,
                ];
                return rendered;
            }

            case Rules.Descriptor: {
                rendered.others = [
                    renderRules(
                        emptyIntermediate(
                            parent.selector + rule.descriptor,
                            ''
                        ),
                        rule.rules
                    ),
                    ...rendered.others,
                ];
                return rendered;
            }

            case Rules.Batch: {
                rendered.others = [
                    renderRules(
                        emptyIntermediate(parent.selector, ''),
                        rule.batched
                    ),
                    ...rendered.others,
                ];
                return rendered;
            }
        }
    }
    return rulesToRender.reduceRight(
        (_acc: Intermediate, rule: Rule): Intermediate =>
            generateIntermediates(rule, parent),
        intermediate('', [], '', [])
    );
}

function render(classNames: Class[]): string {
    function renderValues(values: [string, string][]): string {
        return values.map(([x, y]) => ` ${x}: ${y};`).join('\n');
    }

    function renderClass(rule: Intermediate): string {
        switch (rule.props) {
            case []:
                return '';

            default:
                return `${rule.selector} {\n${renderValues(rule.props)}${
                    rule.closing
                }\n}`;
        }
    }

    function renderIntermediate(rule: Intermediate): string {
        return (
            renderClass(rule) +
            rule.others
                .map((value: Intermediate): string => renderIntermediate(value))
                .join('\n')
        );
    }

    return classNames
        .reduceRight(
            (existing: Intermediate[], class_: Class): Intermediate[] => [
                renderRules(emptyIntermediate(class_.name, ''), class_.rules),
                ...existing,
            ],
            []
        )
        .map((rule: Intermediate) => renderIntermediate(rule))
        .join('\n');
}

function renderCompact(classNames: Class[]): string {
    function renderValues(values: [string, string][]): string {
        return values.map(([x, y]) => ` ${x}: ${y};`).join('');
    }

    function renderClass(rule: Intermediate): string {
        switch (rule.props) {
            case []:
                return '';

            default:
                return `${rule.selector}{${renderValues(rule.props)}${
                    rule.closing
                }}`;
        }
    }

    function renderIntermediate(rule: Intermediate): string {
        return (
            renderClass(rule) +
            rule.others
                .map((value: Intermediate): string => renderIntermediate(value))
                .join('')
        );
    }

    return classNames
        .reduceRight(
            (existing: Intermediate[], class_: Class): Intermediate[] => [
                renderRules(emptyIntermediate(class_.name, ''), class_.rules),
                ...existing,
            ],
            []
        )
        .map((rule: Intermediate) => renderIntermediate(rule))
        .join('');
}

const viewportRules = `html, body {\n
    height: 100%;\n
    width: 100%;\n
}\n${rules()}`;

function describeText(cls: string, props: Rule[]): Rule {
    return descriptor(
        cls,
        props
            .map((rule: Rule) => makeImportant(rule))
            .concat([
                child('.text', props),
                child('.el', props),
                child('.el > .text', props),
            ])
    );
}

function makeImportant(rule: Rule): Rule {
    switch (rule.type) {
        case Rules.Prop:
            return prop(rule.key, rule.value + ' !important');

        default:
            return rule;
    }
}

function dot(c: string) {
    return `.${c}`;
}

const inputTextReset = `\n
input[type="search"],
input[type="search"]::-webkit-search-decoration,
input[type="search"]::-webkit-search-cancel-button,
input[type="search"]::-webkit-search-results-button,
input[type="search"]::-webkit-search-results-decoration {
  -webkit-appearance:none;
}\n
`;

const sliderReset = `\n
input[type=range] {
  -webkit-appearance: none;
  background: transparent;
  position:absolute;
  left:0;
  top:0;
  z-index:10;
  width: 100%;
  outline: dashed 1px;
  height: 100%;
  opacity: 0;
}\n
`;

const trackReset = `\n
input[type=range]::-moz-range-track {
    background: transparent;
    cursor: pointer;
}\n
input[type=range]::-ms-track {
    background: transparent;
    cursor: pointer;
}\n
input[type=range]::-webkit-slider-runnable-track {
    background: transparent;
    cursor: pointer;
}\n
`;

const thumbReset = `\n
input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
    opacity: 0.5;
    width: 80px;
    height: 80px;
    background-color: black;
    border:none;
    border-radius: 5px;
}\n
input[type=range]::-moz-range-thumb {
    opacity: 0.5;
    width: 80px;
    height: 80px;
    background-color: black;
    border:none;
    border-radius: 5px;
}\n
input[type=range]::-ms-thumb {
    opacity: 0.5;
    width: 80px;
    height: 80px;
    background-color: black;
    border:none;
    border-radius: 5px;
}\n
input[type=range][orient=vertical]{
    writing-mode: bt-lr; /* IE */
    -webkit-appearance: slider-vertical;  /* WebKit */
}
`;

const explainer = `\n
.explain {
    border: 6px solid rgb(174, 121, 15) !important;
}\n
.explain > .${classes.any} {
    border: 4px dashed rgb(0, 151, 167) !important;
}\n
\n
.ctr {
    border: none !important;
}\n
.explain > .ctr > .${classes.any} {
    border: 4px dashed rgb(0, 151, 167) !important;
}\n
\n
`;

const overrides = `@media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {\n${dot(
    classes.any
)}${dot(classes.row)} > ${dot(
    classes.any
)} { flex-basis: auto !important; } ${dot(classes.any)}${dot(
    classes.row
)} > ${dot(classes.any)}${dot(
    classes.container
)} { flex-basis: auto !important; }} ${inputTextReset}${sliderReset}${trackReset}${thumbReset}${explainer}`;

const elDescription: Rule[] = [
    prop('display', 'flex'),
    prop('flex-direction', 'column'),
    prop('white-space', 'pre'),
    descriptor(dot(classes.hasBehind), [
        prop('z-index', '0'),
        child(dot(classes.behind), [prop('z-index', '-1')]),
    ]),
    descriptor(dot(classes.seButton), [
        // Special default for text in a button.
        // This is overridden if they put the text inside an `el`
        child(dot(classes.text), [
            descriptor(dot(classes.heightFill), [prop('flex-grow', '0')]),
            descriptor(dot(classes.widthFill), [
                prop('align-self', 'auto !important'),
            ]),
        ]),
    ]),
    child(dot(classes.heightContent), [prop('height', 'auto')]),
    child(dot(classes.heightFill), [prop('flex-grow', '100000')]),
    child(dot(classes.widthFill), [
        // alignLeft, alignRight, centerX are overridden by width.
        // Prop "align-self" "stretch !important"
        prop('width', '100%'),
    ]),
    child(dot(classes.widthFillPortion), [prop('width', '100%')]),
    child(dot(classes.heightFill), [prop('align-self', 'flex-start')]),
    // child(dot(classes.widthFill), [
    //     prop('align-self', 'stretch'),
    //     descriptor(dot(classes.alignedHorizontally), [prop('width', '100%')]),
    // ]),
    describeAlignment((alignment: Alignment): [Rule[], Rule[]] => {
        switch (alignment) {
            case Alignment.Top:
                return [
                    [prop('justify-content', 'flex-start')],
                    [
                        prop('margin-bottom', 'auto !important'),
                        prop('margin-top', '0 !important'),
                    ],
                ];

            case Alignment.Bottom:
                return [
                    [prop('justify-content', 'flex-end')],
                    [
                        prop('margin-top', 'auto !important'),
                        prop('margin-bottom', '0 !important'),
                    ],
                ];

            case Alignment.Right:
                return [
                    [prop('align-items', 'flex-end')],
                    [prop('align-self', 'flex-end')],
                ];

            case Alignment.Left:
                return [
                    [prop('align-items', 'flex-start')],
                    [prop('align-self', 'flex-start')],
                ];

            case Alignment.CenterX:
                return [
                    [prop('align-items', 'center')],
                    [prop('align-self', 'center')],
                ];

            case Alignment.CenterY:
                return [
                    [
                        // prop('justify-content', 'center')
                        child(dot(classes.any), [
                            prop('margin-top', 'auto'),
                            prop('margin-bottom', 'auto'),
                        ]),
                    ],
                    [
                        prop('margin-top', 'auto !important'),
                        prop('margin-bottom', 'auto !important'),
                    ],
                ];
        }
    }),
];

const baseSheet: Class[] = [
    class_('html,body', [
        prop('height', '100%'),
        prop('padding', '0'),
        prop('margin', '0'),
    ]),
    class_(
        dot(classes.any) + dot(classes.single) + dot(classes.imageContainer),
        [
            prop('display', 'block'),
            descriptor(dot(classes.heightFill), [
                child('img', [
                    prop('max-height', '100%'),
                    prop('object-fit', 'cover'),
                ]),
            ]),
            descriptor(dot(classes.widthFill), [
                child('img', [
                    prop('max-width', '100%'),
                    prop('object-fit', 'cover'),
                ]),
            ]),
        ]
    ),
    class_(dot(classes.any) + ':focus', [prop('outline', 'none')]),
    class_(dot(classes.root), [
        prop('width', '100%'),
        prop('height', 'auto'),
        prop('min-height', '100%'),
        prop('z-index', '0'),
        descriptor(
            dot(classes.any) +
                // + dot(classes.single)
                dot(classes.heightFill),
            [
                prop('height', '100%'),
                child(dot(classes.heightFill), [prop('height', '100%')]),
            ]
        ),
        child(dot(classes.inFront), [
            prop('position', 'fixed'),
            prop('z-index', '20'),
        ]),
    ]),
    class_(dot(classes.nearby), [
        prop('position', 'relative'),
        prop('border', 'none'),
        prop('display', 'flex'),
        prop('flex-direction', 'row'),
        prop('flex-basis', 'auto'),
        descriptor(dot(classes.single), elDescription),
        batch(
            locations.map((loc: Location): Rule => {
                switch (loc) {
                    case Location.Above:
                        return descriptor(dot(classes.above), [
                            prop('position', 'absolute'),
                            prop('bottom', '100%'),
                            prop('left', '0'),
                            prop('width', '100%'),
                            prop('z-index', '20'),
                            prop('margin', '0 !important'),
                            child(dot(classes.heightFill), [
                                prop('height', 'auto'),
                            ]),
                            child(dot(classes.widthFill), [
                                prop('width', '100%'),
                            ]),
                            prop('pointer-events', 'none'),
                            child('*', [prop('pointer-events', 'auto')]),
                        ]);

                    case Location.Below:
                        return descriptor(dot(classes.below), [
                            prop('position', 'absolute'),
                            prop('bottom', '0'),
                            prop('left', '0'),
                            prop('height', '0'),
                            prop('width', '100%'),
                            prop('z-index', '20'),
                            prop('margin', '0 !important'),
                            prop('pointer-events', 'none'),
                            child('*', [prop('pointer-events', 'auto')]),
                            child(dot(classes.heightFill), [
                                prop('height', 'auto'),
                            ]),
                        ]);

                    case Location.OnRight:
                        return descriptor(dot(classes.onRight), [
                            prop('position', 'absolute'),
                            prop('left', '100%'),
                            prop('top', '0'),
                            prop('height', '100%'),
                            prop('margin', '0 !important'),
                            prop('z-index', '20'),
                            prop('pointer-events', 'none'),
                            child('*', [prop('pointer-events', 'auto')]),
                        ]);

                    case Location.OnLeft:
                        return descriptor(dot(classes.onLeft), [
                            prop('position', 'absolute'),
                            prop('right', '100%'),
                            prop('top', '0'),
                            prop('height', '100%'),
                            prop('margin', '0 !important'),
                            prop('z-index', '20'),
                            prop('pointer-events', 'none'),
                            child('*', [prop('pointer-events', 'auto')]),
                        ]);

                    case Location.Within:
                        return descriptor(dot(classes.inFront), [
                            prop('position', 'absolute'),
                            prop('width', '100%'),
                            prop('height', '100%'),
                            prop('left', '0'),
                            prop('top', '0'),
                            prop('margin', '0 !important'),
                            prop('pointer-events', 'none'),
                            child('*', [prop('pointer-events', 'auto')]),
                        ]);

                    case Location.Behind:
                        return descriptor(dot(classes.behind), [
                            prop('position', 'absolute'),
                            prop('width', '100%'),
                            prop('height', '100%'),
                            prop('left', '0'),
                            prop('top', '0'),
                            prop('margin', '0 !important'),
                            prop('z-index', '0'),
                            prop('pointer-events', 'none'),
                            child('*', [prop('pointer-events', 'auto')]),
                        ]);
                }
            })
        ),
    ]),
    class_(dot(classes.any), [
        prop('position', 'relative'),
        prop('border', 'none'),
        prop('flex-shrink', '0'),
        prop('display', 'flex'),
        prop('flex-direction', 'row'),
        prop('flex-basis', 'auto'),
        prop('resize', 'none'),
        prop('font-feature-settings', 'inherit'),

        // prop('flex-basis', '0%'),
        prop('box-sizing', 'border-box'),
        prop('margin', '0'),
        prop('padding', '0'),
        prop('border-width', '0'),
        prop('border-style', 'solid'),

        // inheritable font properties
        prop('font-size', 'inherit'),
        prop('color', 'inherit'),
        prop('font-family', 'inherit'),
        prop('line-height', '1'),
        prop('font-weight', 'inherit'),

        // Text decoration is *mandatorily inherited* in the css spec.
        // There's no way to change this. How crazy is that?
        prop('text-decoration', 'none'),
        prop('font-style', 'inherit'),
        descriptor(dot(classes.wrapped), [prop('flex-wrap', 'wrap')]),
        descriptor(dot(classes.noTextSelection), [
            prop('-moz-user-select', 'none'),
            prop('-webkit-user-select', 'none'),
            prop('-ms-user-select', 'none'),
            prop('user-select', 'none'),
        ]),
        descriptor(dot(classes.cursorPointer), [prop('cursor', 'pointer')]),
        descriptor(dot(classes.cursorText), [prop('cursor', 'text')]),
        descriptor(dot(classes.passPointerEvents), [
            prop('pointer-events', 'none !important'),
        ]),
        descriptor(dot(classes.capturePointerEvents), [
            prop('pointer-events', 'auto !important'),
        ]),
        descriptor(dot(classes.transparent), [prop('opacity', '0')]),
        descriptor(dot(classes.opaque), [prop('opacity', '1')]),
        descriptor(dot(classes.hover + classes.transparent) + ':hover', [
            prop('opacity', '0'),
        ]),
        descriptor(dot(classes.hover + classes.opaque) + ':hover', [
            prop('opacity', '1'),
        ]),
        descriptor(dot(classes.focus + classes.transparent) + ':focus', [
            prop('opacity', '0'),
        ]),
        descriptor(dot(classes.focus + classes.opaque) + ':focus', [
            prop('opacity', '1'),
        ]),
        descriptor(dot(classes.active + classes.transparent) + ':active', [
            prop('opacity', '0'),
        ]),
        descriptor(dot(classes.active + classes.opaque) + ':active', [
            prop('opacity', '1'),
        ]),
        descriptor(dot(classes.transition), [
            prop(
                'transition',
                [
                    'transform',
                    'opacity',
                    'filter',
                    'background-color',
                    'color',
                    'font-size',
                ]
                    .map((x) => x + ' 160ms')
                    .join(', ')
            ),
        ]),
        descriptor(dot(classes.scrollbars), [
            prop('overflow', 'auto'),
            prop('flex-shrink', '1'),
        ]),
        descriptor(dot(classes.scrollbarsX), [
            prop('overflow-x', 'auto'),
            descriptor(dot(classes.row), [prop('flex-shrink', '1')]),
        ]),
        descriptor(dot(classes.scrollbarsY), [
            prop('overflow-y', 'auto'),
            descriptor(dot(classes.column), [prop('flex-shrink', '1')]),
            descriptor(dot(classes.single), [prop('flex-shrink', '1')]),
        ]),
        descriptor(dot(classes.clip), [prop('overflow', 'hidden')]),
        descriptor(dot(classes.clipX), [prop('overflow-x', 'hidden')]),
        descriptor(dot(classes.clipY), [prop('overflow-y', 'hidden')]),
        descriptor(dot(classes.widthContent), [prop('width', 'auto')]),
        descriptor(dot(classes.borderNone), [prop('border-width', '0')]),
        descriptor(dot(classes.borderDashed), [prop('border-style', 'dashed')]),
        descriptor(dot(classes.borderDotted), [prop('border-style', 'dotted')]),
        descriptor(dot(classes.borderSolid), [prop('border-style', 'solid')]),
        descriptor(dot(classes.text), [
            prop('white-space', 'pre'),
            prop('display', 'inline-block'),
        ]),
        descriptor(dot(classes.inputText), [
            // chrome and safari have a minimum recognized line height for text input of 1.05
            // If it's 1, it bumps up to something like 1.2
            prop('line-height', '1.05'),
            prop('background', 'transparent'),
            prop('text-align', 'inherit'),
        ]),
        descriptor(dot(classes.single), elDescription),
        descriptor(dot(classes.row), [
            prop('display', 'flex'),
            prop('flex-direction', 'row'),
            child(dot(classes.any), [
                prop('flex-basis', '0%'),
                descriptor(dot(classes.widthExact), [
                    prop('flex-basis', 'auto'),
                ]),
                descriptor(dot(classes.link), [prop('flex-basis', 'auto')]),
            ]),
            child(dot(classes.heightFill), [
                // alignTop, centerY, and alignBottom need to be disabled
                prop('align-self', 'stretch !important'),
            ]),
            child(dot(classes.heightFillPortion), [
                // alignTop, centerY, and alignBottom need to be disabled
                prop('align-self', 'stretch !important'),
            ]),

            // TODO:: This may be necessary..should it move to classes.heightFIll?
            // child(dot(classes.heightFillBetween), [
            //     // alignTop, centerY, and alignBottom need to be disabled
            //     prop('align-self', 'stretch'),
            //     descriptor('.aligned-vertically', [prop('height', '100%')]),
            // ]),
            child(dot(classes.widthFill), [prop('flex-grow', '100000')]),
            child(dot(classes.container), [
                prop('flex-grow', '0'),
                prop('flex-basis', 'auto'),
                prop('align-self', 'stretch'),
            ]),

            // child('alignLeft:last-of-type.align-container-left', [
            //     prop('flex-grow', '1'),
            // ]),
            // alignRight -> <u>
            // centerX -> <s>
            child('u:first-of-type.' + classes.alignContainerRight, [
                prop('flex-grow', '1'),
            ]),

            // first center y
            child('s:first-of-type.' + classes.alignContainerCenterX, [
                prop('flex-grow', '1'),
                child(dot(classes.alignCenterX), [
                    prop('margin-left', 'auto !important'),
                ]),
            ]),
            child('s:last-of-type.' + classes.alignContainerCenterX, [
                prop('flex-grow', '1'),
                child(dot(classes.alignCenterX), [
                    prop('margin-right', 'auto !important'),
                ]),
            ]),

            // lonely centerX
            child('s:only-of-type.' + classes.alignContainerCenterX, [
                prop('flex-grow', '1'),
                child(dot(classes.alignCenterX), [
                    prop('margin-top', 'auto !important'),
                    prop('margin-bottom', 'auto !important'),
                ]),
            ]),

            // alignBottom's after a centerX should not grow
            child('s:last-of-type.' + classes.alignContainerCenterX + ' ~ u', [
                prop('flex-grow', '0'),
            ]),

            // centerX's after an alignBottom should be ignored
            child(
                'u:first-of-type.' +
                    classes.alignContainerRight +
                    ' ~ s.' +
                    classes.alignContainerCenterX,
                // Bottom alignment always overrides center alignment
                [prop('flex-grow', '0')]
            ),
            describeAlignment((alignment: Alignment): [Rule[], Rule[]] => {
                switch (alignment) {
                    case Alignment.Top:
                        return [
                            [prop('align-items', 'flex-start')],
                            [prop('align-self', 'flex-start')],
                        ];

                    case Alignment.Bottom:
                        return [
                            [prop('align-items', 'flex-end')],
                            [prop('align-self', 'flex-end')],
                        ];

                    case Alignment.Right:
                        return [[prop('justify-content', 'flex-end')], []];

                    case Alignment.Left:
                        return [[prop('justify-content', 'flex-start')], []];

                    case Alignment.CenterX:
                        return [[prop('justify-content', 'center')], []];

                    case Alignment.CenterY:
                        return [
                            [prop('align-items', 'center')],
                            [prop('align-self', 'center')],
                        ];
                }
            }),

            // Must be below the alignment rules or else it interferes
            descriptor(dot(classes.spaceEvenly), [
                prop('justify-content', 'space-between'),
            ]),
            descriptor(dot(classes.inputLabel), [
                prop('align-items', 'baseline'),
            ]),
        ]),
        descriptor(dot(classes.column), [
            prop('display', 'flex'),
            prop('flex-direction', 'column'),
            child(
                dot(classes.any),
                // *Note* - While rows have flex-basis 0%,
                // which allows for the children of a row to default to their content size
                // This apparently is a different story for columns.
                // Safari has an issue if this is flex-basis: 0%, as it goes entirely to 0,
                // instead of the expected content size.
                // So we add `min-height: min-content`, which isn't supported by IE, but works for all other browsers!
                // Separately, 0% is different than 0px, but only for columns
                // In columns, 0% will actually be calculated as `auto` for columns
                // So, 0px is the one we want.
                [
                    prop('flex-basis', '0px'),
                    prop('min-height', 'min-content'),
                    descriptor(dot(classes.heightExact), [
                        prop('flex-basis', 'auto'),
                    ]),
                ]
            ),
            child(dot(classes.heightFill), [prop('flex-grow', '100000')]),
            child(dot(classes.widthFill), [
                // alignLeft, alignRight, centerX need to be disabled
                // Prop "align-self" "stretch !important"
                prop('width', '100%'),
            ]),
            child(dot(classes.widthFillPortion), [
                // alignLeft, alignRight, centerX need to be disabled
                // Prop "align-self" "stretch !important"
                prop('width', '100%'),
            ]),
            // TODO:: This may be necessary..should it move to widthFill?
            // child(dot(classes.widthFill), [
            //     prop('align-self', 'stretch'),
            //     descriptor(dot(classes.alignedHorizontally), [prop('width', '100%')]),
            // ]),
            child(dot(classes.widthContent), [
                prop('align-self', 'flex-start'),
            ]),

            // child('alignTop:last-of-type.align-container-top', [
            //     prop('flex-grow', '1'),
            // ]),
            child('u:first-of-type.' + classes.alignContainerBottom, [
                prop('flex-grow', '1'),
            ]),

            // alignBottom -> <u>
            // centerY -> <s>
            // first center y
            child('s:first-of-type.' + classes.alignContainerCenterY, [
                prop('flex-grow', '1'),
                child(dot(classes.alignCenterY), [
                    prop('margin-top', 'auto !important'),
                    prop('margin-bottom', '0 !important'),
                ]),
            ]),
            child('s:last-of-type.' + classes.alignContainerCenterY, [
                prop('flex-grow', '1'),
                child(dot(classes.alignCenterY), [
                    prop('margin-bottom', 'auto !important'),
                    prop('margin-top', '0 !important'),
                ]),
            ]),

            // lonely centerY
            child('s:only-of-type.' + classes.alignContainerCenterY, [
                prop('flex-grow', '1'),
                child(dot(classes.alignCenterY), [
                    prop('margin-top', 'auto !important'),
                    prop('margin-bottom', 'auto !important'),
                ]),
            ]),

            // alignBottom's after a centerY should not grow
            child('s:last-of-type.' + classes.alignContainerCenterY + ' ~ u', [
                prop('flex-grow', '0'),
            ]),

            // centerY's after an alignBottom should be ignored
            child(
                'u:first-of-type.' +
                    classes.alignContainerBottom +
                    ' ~ s.' +
                    classes.alignContainerCenterY,
                // Bottom alignment always overrides center alignment
                [prop('flex-grow', '0')]
            ),
            describeAlignment((alignment: Alignment): [Rule[], Rule[]] => {
                switch (alignment) {
                    case Alignment.Top:
                        return [
                            [prop('justify-content', 'flex-start')],
                            [prop('margin-bottom', 'auto')],
                        ];

                    case Alignment.Bottom:
                        return [
                            [prop('justify-content', 'flex-end')],
                            [prop('margin-top', 'auto')],
                        ];

                    case Alignment.Right:
                        return [
                            [prop('align-items', 'flex-end')],
                            [prop('align-self', 'flex-end')],
                        ];

                    case Alignment.Left:
                        return [
                            [prop('align-items', 'flex-start')],
                            [prop('align-self', 'flex-start')],
                        ];

                    case Alignment.CenterX:
                        return [
                            [prop('align-items', 'center')],
                            [prop('align-self', 'center')],
                        ];

                    case Alignment.CenterY:
                        return [[prop('justify-content', 'center')], []];
                }
            }),
            child(dot(classes.container), [
                prop('flex-grow', '0'),
                prop('flex-basis', 'auto'),
                prop('width', '100%'),
                prop('align-self', 'stretch !important'),
            ]),
            descriptor(dot(classes.spaceEvenly), [
                prop('justify-content', 'space-between'),
            ]),
        ]),
        descriptor(dot(classes.grid), [
            prop('display', '-ms-grid'),
            child('.gp', [child(dot(classes.any), [prop('width', '100%')])]),
            supports(['display', 'grid'], [['display', 'grid']]),
            gridAlignment((alignment: Alignment): Rule[] => {
                switch (alignment) {
                    case Alignment.Top:
                        return [prop('justify-content', 'flex-start')];

                    case Alignment.Bottom:
                        return [prop('justify-content', 'flex-end')];

                    case Alignment.Right:
                        return [prop('align-items', 'flex-end')];

                    case Alignment.Left:
                        return [prop('align-items', 'flex-start')];

                    case Alignment.CenterX:
                        return [prop('align-items', 'center')];

                    case Alignment.CenterY:
                        return [prop('justify-content', 'center')];
                }
            }),
        ]),
        descriptor(dot(classes.page), [
            prop('display', 'block'),
            child(dot(classes.any + ':first-child'), [
                prop('margin', '0 !important'),
            ]),
            // clear spacing of any subsequent element if an element is float-left
            child(
                dot(
                    `${classes.any}${selfName(
                        self(Alignment.Left)
                    )}:first-child + .${classes.any}`
                ),
                [prop('margin', '0 !important')]
            ),
            child(
                dot(
                    `${classes.any}${selfName(
                        self(Alignment.Right)
                    )}:first-child + .${classes.any}`
                ),
                [prop('margin', '0 !important')]
            ),
            describeAlignment((alignment: Alignment): [Rule[], Rule[]] => {
                switch (alignment) {
                    case Alignment.Top:
                        return [[], []];

                    case Alignment.Bottom:
                        return [[], []];

                    case Alignment.Right:
                        return [
                            [],
                            [
                                prop('float', 'right'),
                                descriptor('::after', [
                                    prop('content', '""'),
                                    prop('display', 'table'),
                                    prop('clear', 'both'),
                                ]),
                            ],
                        ];

                    case Alignment.Left:
                        return [
                            [],
                            [
                                prop('float', 'left'),
                                descriptor('::after', [
                                    prop('content', '""'),
                                    prop('display', 'table'),
                                    prop('clear', 'both'),
                                ]),
                            ],
                        ];

                    case Alignment.CenterX:
                        return [[], []];

                    case Alignment.CenterY:
                        return [[], []];
                }
            }),
        ]),
        descriptor(dot(classes.inputMultiline), [
            prop('white-space', 'pre-wrap !important'),
            prop('height', '100%'),
            prop('width', '100%'),
            prop('background-color', 'transparent'),
        ]),
        descriptor(
            dot(classes.inputMultilineWrapper),
            // Get this.
            // This allows multiline input to anchor scrolling to the bottom of the node
            // when in a scrolling viewport, and the user is adding content.
            // however, it only works in chrome.  In firefox, it prevents scrolling.
            //
            // But how crazy is this solution?
            // [ prop("display", "flex")
            // , prop("flex-direction", "column-reverse")
            // ]
            [
                // to increase specificity to beat another rule
                descriptor(dot(classes.single), [prop('flex-basis', 'auto')]),
            ]
        ),
        descriptor(dot(classes.inputMultilineParent), [
            prop('white-space', 'pre-wrap !important'),
            prop('cursor', 'text'),
            child(dot(classes.inputMultilineFiller), [
                prop('white-space', 'pre-wrap !important'),
                prop('color', 'transparent'),
            ]),
        ]),
        descriptor(dot(classes.paragraph), [
            prop('display', 'block'),
            prop('white-space', 'normal'),
            prop('overflow-wrap', 'break-word'),
            descriptor(dot(classes.hasBehind), [
                prop('z-index', '0'),
                child(dot(classes.behind), [prop('z-index', '-1')]),
            ]),
            allChildren(dot(classes.text), [
                prop('display', 'inline'),
                prop('white-space', 'normal'),
            ]),
            allChildren(dot(classes.paragraph), [
                prop('display', 'inline'),
                descriptor('::after', [prop('content', 'none')]),
                descriptor('::before', [prop('content', 'none')]),
            ]),
            allChildren(dot(classes.single), [
                prop('display', 'inline'),
                prop('white-space', 'normal'),
                // Inline block allows the width of the item to be set
                // but DOES NOT like wrapping text in a standard, normal, sane way.
                // We're sorta counting that if an exact width has been set,
                // people aren't expecting proper text wrapping for this element
                descriptor(dot(classes.widthExact), [
                    prop('display', 'inline-block'),
                ]),
                descriptor(dot(classes.inFront), [prop('display', 'flex')]),
                descriptor(dot(classes.behind), [prop('display', 'flex')]),
                descriptor(dot(classes.above), [prop('display', 'flex')]),
                descriptor(dot(classes.below), [prop('display', 'flex')]),
                descriptor(dot(classes.onRight), [prop('display', 'flex')]),
                descriptor(dot(classes.onLeft), [prop('display', 'flex')]),
                child(dot(classes.text), [
                    prop('display', 'inline'),
                    prop('white-space', 'normal'),
                ]),
            ]),
            child(dot(classes.row), [prop('display', 'inline')]),
            child(dot(classes.column), [prop('display', 'inline-flex')]),
            child(dot(classes.grid), [prop('display', 'inline-grid')]),
            describeAlignment((alignment: Alignment): [Rule[], Rule[]] => {
                switch (alignment) {
                    case Alignment.Top:
                        return [[], []];

                    case Alignment.Bottom:
                        return [[], []];

                    case Alignment.Right:
                        return [[], [prop('float', 'right')]];

                    case Alignment.Left:
                        return [[], [prop('float', 'left')]];

                    case Alignment.CenterX:
                        return [[], []];

                    case Alignment.CenterY:
                        return [[], []];
                }
            }),
        ]),
        descriptor('.hidden', [prop('display', 'none')]),
        descriptor(dot(classes.textThin), [prop('font-weight', '100')]),
        descriptor(dot(classes.textExtraLight), [prop('font-weight', '200')]),
        descriptor(dot(classes.textLight), [prop('font-weight', '300')]),
        descriptor(dot(classes.textNormalWeight), [prop('font-weight', '400')]),
        descriptor(dot(classes.textMedium), [prop('font-weight', '500')]),
        descriptor(dot(classes.textSemiBold), [prop('font-weight', '600')]),
        descriptor(dot(classes.bold), [prop('font-weight', '700')]),
        descriptor(dot(classes.textExtraBold), [prop('font-weight', '800')]),
        descriptor(dot(classes.textHeavy), [prop('font-weight', '900')]),
        descriptor(dot(classes.italic), [prop('font-style', 'italic')]),
        descriptor(dot(classes.strike), [
            prop('text-decoration', 'line-through'),
        ]),
        descriptor(dot(classes.underline), [
            prop('text-decoration', 'underline'),
            prop('text-decoration-skip-ink', 'auto'),
            prop('text-decoration-skip', 'ink'),
        ]),
        descriptor(dot(classes.underline) + dot(classes.strike), [
            prop('text-decoration', 'line-through underline'),
            prop('text-decoration-skip-ink', 'auto'),
            prop('text-decoration-skip', 'ink'),
        ]),
        descriptor(dot(classes.textUnitalicized), [
            prop('font-style', 'normal'),
        ]),
        descriptor(dot(classes.textJustify), [prop('text-align', 'justify')]),
        descriptor(dot(classes.textJustifyAll), [
            prop('text-align', 'justify-all'),
        ]),
        descriptor(dot(classes.textCenter), [prop('text-align', 'center')]),
        descriptor(dot(classes.textRight), [prop('text-align', 'right')]),
        descriptor(dot(classes.textLeft), [prop('text-align', 'left')]),
        descriptor('.modal', [
            prop('position', 'fixed'),
            prop('left', '0'),
            prop('top', '0'),
            prop('width', '100%'),
            prop('height', '100%'),
            prop('pointer-events', 'none'),
        ]),
    ]),
];

const commonValues: Class[] = [
    _.range(0, 6).map((x: number) =>
        class_(`.border-${x.toString()}`, [
            prop('border-width', `${x.toString()}px`),
        ])
    ),
    _.range(8, 32).map((i: number) =>
        class_(`.font-size-${i.toString()}`, [
            prop('font-size', `${i.toString()}px`),
        ])
    ),
    _.range(0, 24).map((i: number) =>
        class_(`.p-${i.toString()}`, [prop('padding', `${i.toString()}px`)])
    ),
    // Common Font Variants
    class_('.v-smcp', [prop('font-variant', 'small-caps')]),
    class_('.v-smcp-off', [prop('font-variant', 'normal')]),
    // fontVariant('smcp'),
    fontVariant('zero'),
    fontVariant('onum'),
    fontVariant('liga'),
    fontVariant('dlig'),
    fontVariant('ordn'),
    fontVariant('tnum'),
    fontVariant('afrc'),
    fontVariant('frac'),
].flat();

function fontVariant(variant: string): Class[] {
    return [
        class_(`.v-${variant}`, [
            prop('font-feature-settings', `"${variant}"`),
        ]),
        class_(`.v-${variant}-off`, [
            prop('font-feature-settings', `"${variant}" 0`),
        ]),
    ];
}

function rules(): string {
    return overrides + renderCompact(baseSheet.concat(commonValues));
}

export { classes, dot, rules };

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

export { classes, unicode, single };

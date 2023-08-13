// deno-lint-ignore-file
import { preact, elmish } from '../deps.ts';
import {
    Length,
    Px,
    Content,
    Attribute,
    Attr,
    Option,
    asEl,
    asRow,
    asColumn,
    Unkeyed,
    Padding_,
    Spaced,
    Maybe,
    PaddingStyle,
    StyleClass,
    SpacingStyle,
    GridPosition,
    GridTemplateStyle,
    asGrid,
    asParagraph,
    asTextColumn,
    Attributes,
    NodeName,
    LayoutContext,
    Rem,
} from './internal/data.ts';
import * as Element_ from './element.ts';
import * as Internal from './internal/model.ts';
import * as Flag from './internal/flag.ts';
import { classes } from './internal/style.ts';
import { style } from './elements/attributes.ts';

interface Column_<T extends Record<string, any>> {
    header: preact.ComponentChild;
    width: Length;
    view: (record: T) => preact.ComponentChild;
}

function Column_(
    header: preact.ComponentChild,
    width: Length,
    view: (record: Record<string, any>) => preact.ComponentChild
): Column_<Record<string, any>> {
    return { header, width, view };
}

interface IndexedColumn<T extends Record<string, any>> {
    header: preact.ComponentChild;
    width: Length;
    view: (a: number, record: T) => preact.ComponentChild;
}

function IndexedColumn(
    header: preact.ComponentChild,
    width: Length,
    view: (a: number, record: Record<string, any>) => preact.ComponentChild
): IndexedColumn<Record<string, any>> {
    return { header, width, view };
}

interface InternalTable<T extends Record<string, any>> {
    data: T[];
    columns: InternalTableColumn[];
}

function _InternalTable(
    data: Record<string, any>[],
    columns: InternalTableColumn[]
): InternalTable<Record<string, any>> {
    return { data, columns };
}

enum InternalTableColumns {
    InternalIndexedColumn,
    InternalColumn,
}

interface InternalIndexedColumn {
    type: InternalTableColumns.InternalIndexedColumn;
    column: IndexedColumn<Record<string, any>>;
}

function InternalIndexedColumn(
    column: IndexedColumn<Record<string, any>>
): InternalIndexedColumn {
    return {
        type: InternalTableColumns.InternalIndexedColumn,
        column,
    };
}

interface InternalColumn {
    type: InternalTableColumns.InternalColumn;
    column: Column_<Record<string, any>>;
}

function InternalColumn(column: Column_<Record<string, any>>): InternalColumn {
    return {
        type: InternalTableColumns.InternalColumn,
        column,
    };
}

type InternalTableColumn = InternalIndexedColumn | InternalColumn;

const { Just, Nothing, MaybeType } = elmish.Maybe;
const { Fragment } = preact;

/** This is your top level node where you can turn `Element` into `JSX`. */
function Layout({
    attributes,
    children,
}: {
    attributes: Attribute[];
    children: preact.ComponentChild;
}) {
    return Element_.layout(
        attributes,
        Element_.jsx(<Fragment>{children}</Fragment>)
    );
}

function LayoutWith({
    options,
    attributes,
    children,
    context,
    node,
}: {
    options: Option[];
    attributes: Attribute[];
    children: preact.ComponentChild;
    context?: LayoutContext;
    node?: NodeName;
}) {
    return Element_.layoutWith(
        options,
        attributes,
        Element_.jsx(<Fragment>{children}</Fragment>),
        context,
        node
    );
}

/** When you want to render exactly nothing. */
function None() {
    return <Text>{''}</Text>;
}

/**
 * Create some plain text. This component is used by default on the El component to render any value that is not a node as a string.
 *
 * **Note** text does not wrap by default. In order to get text to wrap, check out `paragraph`!
 */
function Text({ children }: { children: preact.ComponentChild }) {
    return Internal.render(
        [],
        (() => {
            if (
                typeof children === 'string' ||
                typeof children === 'number' ||
                typeof children === 'bigint' ||
                typeof children === 'boolean'
            )
                return Element_.text(children.toString());
            return Element_.jsx(<Fragment>{children}</Fragment>);
        })()
    );
}

/**
 * The basic building block of your layout.
 *
 * You can think of an `El` as a `div`, but it can only have one child.
 *
 * If you want multiple children, you'll need to use something like `Row` or `Column`
 *
 * ```jsx
 * <El
 *  attributes={[
 *      Background.color((rgb(0, 0.5, 0))),
 *      Border.color((rgb(0, 0.7, 0))),
 *  ]}
 * >
 *  You've made a stylish element!
 * </El>
 * ```
 */
function El({
    attributes,
    children,
}: {
    attributes: Attribute[];
    children: preact.ComponentChild;
}) {
    return (
        <LayoutWith
            options={[Element_.noStaticStyleSheet]}
            attributes={[...Element_.elAttrs, ...attributes]}
        >
            {Text({ children })}
        </LayoutWith>
    );
}

function Row({
    attributes,
    children,
}: {
    attributes: Attribute[];
    children: preact.ComponentChild[];
}) {
    return (
        <LayoutWith
            options={[Element_.noStaticStyleSheet]}
            attributes={[...Element_.rowAttrs, ...attributes]}
            context={asRow}
        >
            {children}
        </LayoutWith>
    );
}

function Column({
    attributes,
    children,
}: {
    attributes: Attribute[];
    children: preact.ComponentChild[];
}) {
    return (
        <LayoutWith
            options={[Element_.noStaticStyleSheet]}
            attributes={[...Element_.columnAttrs, ...attributes]}
            context={asColumn}
        >
            {children}
        </LayoutWith>
    );
}

/** Same as `Row`, but will wrap if it takes up too much horizontal space. */
function WrappedRow({
    attributes,
    children,
}: {
    attributes: Attribute[];
    children: preact.ComponentChild[];
}) {
    const [padded, spaced]: [Maybe<Padding_>, Maybe<Spaced>] =
        Internal.extractSpacingAndPadding(attributes);

    switch (spaced.type) {
        case MaybeType.Nothing:
            return (
                <LayoutWith
                    options={[Element_.noStaticStyleSheet]}
                    attributes={[...Element_.wrappedRowAttrs, ...attributes]}
                    context={asRow}
                >
                    {children}
                </LayoutWith>
            );

        case MaybeType.Just: {
            const { name, x, y } = spaced.value,
                newPadding: Maybe<StyleClass> = (() => {
                    switch (padded.type) {
                        case MaybeType.Just: {
                            const { top, right, bottom, left } = padded.value;
                            if (
                                typeof top === 'number' &&
                                typeof right === 'number' &&
                                typeof bottom === 'number' &&
                                typeof left === 'number' &&
                                typeof x === 'number' &&
                                typeof y === 'number'
                            )
                                if (right >= x / 2 && bottom >= y / 2) {
                                    const newTop = top - y / 2,
                                        newRight = right - x / 2,
                                        newBottom = bottom - y / 2,
                                        newLeft = left - x / 2;
                                    return Just(
                                        StyleClass(
                                            Flag.padding,
                                            PaddingStyle(
                                                Internal.paddingNameFloat(
                                                    newTop,
                                                    newRight,
                                                    newBottom,
                                                    newLeft
                                                ),
                                                newTop,
                                                newRight,
                                                newBottom,
                                                newLeft
                                            )
                                        )
                                    );
                                }
                            if (
                                typeof top !== 'number' &&
                                typeof right !== 'number' &&
                                typeof bottom !== 'number' &&
                                typeof left !== 'number' &&
                                typeof x !== 'number' &&
                                typeof y !== 'number'
                            )
                                if (
                                    right.rem >= x.rem / 2 &&
                                    bottom.rem >= y.rem / 2
                                ) {
                                    const newTop = top.rem - y.rem / 2,
                                        newRight = right.rem - x.rem / 2,
                                        newBottom = bottom.rem - y.rem / 2,
                                        newLeft = left.rem - x.rem / 2;
                                    return Just(
                                        StyleClass(
                                            Flag.padding,
                                            PaddingStyle(
                                                Internal.paddingNameFloat(
                                                    newTop,
                                                    newRight,
                                                    newBottom,
                                                    newLeft
                                                ),
                                                newTop,
                                                newRight,
                                                newBottom,
                                                newLeft
                                            )
                                        )
                                    );
                                }
                            return Nothing();
                        }

                        case MaybeType.Nothing:
                            return Nothing();
                    }
                })();

            switch (newPadding.type) {
                case MaybeType.Just:
                    return (
                        <LayoutWith
                            options={[Element_.noStaticStyleSheet]}
                            attributes={[
                                ...Element_.wrappedRowAttrs,
                                ...attributes,
                                newPadding.value,
                            ]}
                            context={asRow}
                        >
                            {children}
                        </LayoutWith>
                    );

                case MaybeType.Nothing: {
                    // Not enough space in padding to compensate for spacing
                    const halfX =
                            ((typeof x === 'number' ? x : x.rem) / 2) * -1,
                        halfY = ((typeof y === 'number' ? y : y.rem) / 2) * -1;
                    return (
                        <LayoutWith
                            options={[Element_.noStaticStyleSheet]}
                            attributes={attributes}
                        >
                            <LayoutWith
                                options={[Element_.noStaticStyleSheet]}
                                attributes={[
                                    Internal.htmlClass(
                                        classes.contentLeft +
                                            ' ' +
                                            classes.contentCenterY +
                                            ' ' +
                                            classes.wrapped
                                    ),
                                    style(
                                        'margin',
                                        typeof x === 'number' &&
                                            typeof y === 'number'
                                            ? `${halfY.toString()}px ${halfX.toString()}px`
                                            : `${halfY.toString()}rem ${halfX.toString()}rem`
                                    ),
                                    style(
                                        'width',
                                        typeof x === 'number'
                                            ? `calc(100% + ${x.toString()}px)`
                                            : `calc(100% + ${x.rem.toString()}rem)`
                                    ),
                                    style(
                                        'height',
                                        typeof y === 'number'
                                            ? `calc(100% + ${y.toString()}px)`
                                            : `calc(100% + ${y.rem.toString()}rem)`
                                    ),
                                    StyleClass(
                                        Flag.spacing,
                                        SpacingStyle(name, x, y)
                                    ),
                                ]}
                                context={asRow}
                            >
                                {children}
                            </LayoutWith>
                        </LayoutWith>
                    );
                }
            }
        }
    }
}

/**
 * Show some tabular data.
 *
 * Start with a list of ovjects and specify how each column should be rendered.
 *
 * So, if we have a list of `persons`:
 *
 * ```ts
 * interface Person {
 *  firstName: string;
 *  lastName: string;
 * }
 *
 * const persons: Person[] =
 *  [ { firstName: "David", lastName: "Bowie" },
 *  { firstName: "Florence" , lastName: "Welch" } ]
 * ```
 *
 * We could render it using
 *
 * ```jsx
 * <Table
 *  attributes={[]}
 *  config={
 *      { data: persons,
 *        columns:
 *          [ { header: "First Name",
 *              width: fill,
 *              view: (person) => person.firstName
 *             },
 *             { header: "Last Name",
 *               width: fill,
 *               view: (person) => person.lastName
 *             }
 *          ]
 *      }
 *  }
 * />
 * ```
 *
 * **Note:** Sometimes you might not have a list of objects directly in your model. In this case it can be really nice to write a function that transforms some part of your model into a list of objects before feeding it into `Element.Table`.
 */
function Table({
    attributes,
    config,
}: {
    attributes: Attribute[];
    config: {
        data: Record<string, any>[];
        columns: Column_<Record<string, any>>[];
    };
}) {
    return (
        <TableHelper
            attributes={attributes}
            config={{
                data: config.data,
                columns: config.columns.map(InternalColumn),
            }}
        />
    );
}

/** Same as `Element.Table` except the `view` for each column will also receive the row index as well as the object. */
function IndexedTable({
    attributes,
    config,
}: {
    attributes: Attribute[];
    config: {
        data: Record<string, any>[];
        columns: IndexedColumn<Record<string, any>>[];
    };
}) {
    return (
        <TableHelper
            attributes={attributes}
            config={{
                data: config.data,
                columns: config.columns.map(InternalIndexedColumn),
            }}
        />
    );
}

function TableHelper({
    attributes,
    config,
}: {
    attributes: Attribute[];
    config: InternalTable<Record<string, any>>;
}) {
    const [sX, sY] = Internal.getSpacing(attributes, [0, 0]);

    const maybeHeaders: Maybe<preact.ComponentChild[]> = ((
        headers: preact.ComponentChild[]
    ) => {
        const headers_ = headers.map(
            (header: preact.ComponentChild, col: number) =>
                onGrid(1, col + 1, header)
        );
        return headers.some(
            (value: preact.ComponentChild) =>
                value === undefined || value === null
        )
            ? Nothing()
            : Just(headers_);
    })(config.columns.map(columnHeader));

    const template: Attribute = StyleClass(
        Flag.gridTemplate,
        GridTemplateStyle(
            (() => {
                if (typeof sX === 'number' && typeof sY === 'number')
                    return [Px(sX), Px(sY)];
                if (typeof sX !== 'number' && typeof sY !== 'number')
                    return [Rem(sX.rem), Rem(sY.rem)];
                return [Px(0), Px(0)];
            })(),
            config.columns.map(columnWidth),
            [].concat(...new Array(config.data.length).fill([Content()]))
        )
    );

    const children: {
        elements: preact.ComponentChild[];
        column: number;
        row: number;
    } = config.data.reduce(
        (
            acc: {
                elements: preact.ComponentChild[];
                column: number;
                row: number;
            },
            data: Record<string, any>
        ) => build(config.columns, data, acc),
        {
            elements: [],
            row: maybeHeaders.type === MaybeType.Nothing ? 1 : 2,
            column: 1,
        }
    );

    function columnHeader(col: InternalTableColumn): preact.ComponentChild {
        switch (col.type) {
            case InternalTableColumns.InternalIndexedColumn:
                return col.column.header;

            case InternalTableColumns.InternalColumn:
                return col.column.header;
        }
    }

    function columnWidth(col: InternalTableColumn): Length {
        switch (col.type) {
            case InternalTableColumns.InternalIndexedColumn:
                return col.column.width;

            case InternalTableColumns.InternalColumn:
                return col.column.width;
        }
    }

    function onGrid(
        rowLevel: number,
        columnLevel: number,
        elem: preact.ComponentChild
    ): preact.ComponentChild {
        return (
            <LayoutWith
                options={[Element_.noStaticStyleSheet]}
                attributes={[
                    StyleClass(
                        Flag.gridPosition,
                        GridPosition(rowLevel, columnLevel, 1, 1)
                    ),
                ]}
                context={asEl}
            >
                {elem}
            </LayoutWith>
        );
    }

    function add(
        cell: Record<string, any>,
        columnConfig: InternalTableColumn,
        cursor: {
            elements: preact.ComponentChild[];
            row: number;
            column: number;
        }
    ): { elements: preact.ComponentChild[]; row: number; column: number } {
        switch (columnConfig.type) {
            case InternalTableColumns.InternalIndexedColumn: {
                cursor.elements = [
                    onGrid(
                        cursor.row,
                        cursor.column,
                        columnConfig.column.view(
                            maybeHeaders.type === MaybeType.Nothing
                                ? cursor.row - 1
                                : cursor.row - 2,
                            cell
                        )
                    ),
                    ...cursor.elements,
                ];
                cursor.column = cursor.column + 1;
                return cursor;
            }

            case InternalTableColumns.InternalColumn:
                return {
                    elements: [
                        onGrid(
                            cursor.row,
                            cursor.column,
                            columnConfig.column.view(cell)
                        ),
                        ...cursor.elements,
                    ],
                    row: cursor.row,
                    column: cursor.column + 1,
                };
        }
    }

    function build(
        columns: InternalTableColumn[],
        rowData: Record<string, any>,
        cursor: {
            elements: preact.ComponentChild[];
            column: number;
            row: number;
        }
    ): {
        elements: preact.ComponentChild[];
        column: number;
        row: number;
    } {
        const newCursor: {
            elements: preact.ComponentChild[];
            column: number;
            row: number;
        } = columns.reduce(
            (
                acc: {
                    elements: preact.ComponentChild[];
                    column: number;
                    row: number;
                },
                column: InternalTableColumn
            ) => add(rowData, column, acc),
            cursor
        );

        return {
            elements: newCursor.elements,
            row: cursor.row + 1,
            column: 1,
        };
    }

    return (
        <LayoutWith
            options={[Element_.noStaticStyleSheet]}
            attributes={[
                Element_.width(Element_.fill),
                template,
                ...attributes,
            ]}
            context={asGrid}
        >
            {(() => {
                switch (maybeHeaders.type) {
                    case MaybeType.Nothing:
                        return children.elements;

                    case MaybeType.Just:
                        return maybeHeaders.value.concat(
                            children.elements.reverse()
                        );
                }
            })()}
        </LayoutWith>
    );
}

/**
 * A paragraph will layout all children as wrapped, inline elements.
 *
 * ```jsx
 * <Paragraph
 *  attributes={[]}
 * >
 *  <Text>lots of text ....</Text>
 *  <El attributes={[ Font.bold ]}>this is bold</El>
 *  <Text>lots of text ....</Text>
 * </Paragraph>
 * ```
 *
 * This is really useful when you want to markup text by having some parts be bold, or some be links, or whatever you so desire.
 *
 * Also, if a child element has `alignLeft` or `alignRight`, then it will be moved to that side and the text will flow around it, (ah yes, `float` behavior).
 *
 * This makes it particularly easy to do something like a [dropped capital](https://en.wikipedia.org/wiki/Initial).
 *
 * ```jsx
 * <Paragraph
 *  attributes={[]}
 * >
 *  <El attributes={[ alignLeft, padding(5) ]}>S</El>
 *  <Text>o much text ....</Text>
 * </Paragraph>
 * ```
 *
 * Which will look something like
 *
 * ![A paragraph where the first letter is twice the height of the others](https://mdgriffith.gitbooks.io/style-elements/content/assets/Screen%20Shot%202017-08-25%20at%209.41.52%20PM.png)
 * **Note** `spacing` on a paragraph will set the pixel spacing between lines.
 */
function Paragraph({
    attributes,
    children,
}: {
    attributes: Attribute[];
    children: preact.ComponentChild[];
}) {
    return (
        <LayoutWith
            options={[Element_.noStaticStyleSheet]}
            attributes={[...Element_.paragraphAttrs, ...attributes]}
            context={asParagraph}
        >
            {children}
        </LayoutWith>
    );
}

/**
 * Now that we have a paragraph, we need some way to attach a bunch of paragraph's together.
 *
 * To do that we can use a `TextColumn`.
 *
 * The main difference between a `Column` and a `TextColumn` is that `TextColumn` will flow the text around elements that have `alignRight` or `alignLeft`, just like we just saw with paragraph.
 *
 * In the following example, we have a `TextColumn` where one child has `alignLeft`.
 *
 * ```jsx
 * <TextColumn
 *  attributes={[]}
 * >
 *  <Paragraph attributes={[]}><Text>lots of text ....</Text></Paragraph>
 *  <El attributes={[ alignLeft ]}></El>
 *  <Paragraph attributes={[]}><Text>lots of text ....</Text></Paragraph>
 * </TextColumn>
 * ```
 *
 * Which will result in something like:
 *
 * ![A text layout where an image is on the left.](https://mdgriffith.gitbooks.io/style-elements/content/assets/Screen%20Shot%202017-08-25%20at%208.42.39%20PM.png)
 */
function TextColumn({
    attributes,
    children,
}: {
    attributes: Attribute[];
    children: preact.ComponentChild;
}) {
    return (
        <LayoutWith
            options={[Element_.noStaticStyleSheet]}
            attributes={[...Element_.textColumnAttrs, ...attributes]}
            context={asTextColumn}
        >
            {children}
        </LayoutWith>
    );
}

/**
 * Both a source and a description are required for images.
 *
 * The description is used for people using screen readers.
 *
 * Leaving the description blank will cause the image to be ignored by assistive technology. This can make sense for images that are purely decorative and add no additional information.
 *
 * So, take a moment to describe your image as you would to someone who has a harder time seeing.
 */
function Image({
    attributes,
    src,
    description,
}: {
    attributes: Attribute[];
    src: string;
    description: string;
}) {
    const imageAttributes: Attribute[] = attributes.filter((a: Attribute) => {
        switch (a.type) {
            case Attributes.Width:
                return true;

            case Attributes.Height:
                return true;

            default:
                return false;
        }
    });
    return Element_.layoutWith(
        [Element_.noStaticStyleSheet],
        [Internal.htmlClass(classes.imageContainer), ...attributes],
        Internal.element(
            asEl,
            NodeName('img'),
            [
                Attr({ src: src }),
                Attr({ alt: description }),
                ...imageAttributes,
            ],
            Unkeyed([])
        )
    );
}

/**
 * ```jsx
 * <Link
 *  attributes={[]}
 *  url={"http://fruits.com"}
 * >
 *  A link to my favorite fruit provider.
 * </Link>
 * ```
 */
function Link({
    attributes,
    url,
    children,
}: {
    attributes: Attribute[];
    url: string;
    children: preact.ComponentChild;
}) {
    return (
        <LinkCore attributes={attributes} url={url}>
            {children}
        </LinkCore>
    );
}

function NewTabLink({
    attributes,
    url,
    children,
}: {
    attributes: Attribute[];
    url: string;
    children: preact.ComponentChild;
}) {
    return (
        <LinkCore
            attributes={[Attr({ target: '_blank' }), ...attributes]}
            url={url}
        >
            {children}
        </LinkCore>
    );
}

function LinkCore({
    attributes,
    url,
    children,
}: {
    attributes: Attribute[];
    url: string;
    children: preact.ComponentChild;
}) {
    return (
        <LayoutWith
            options={[Element_.noStaticStyleSheet]}
            attributes={[
                Attr({ href: url }),
                ...Element_.linkAttrs,
                ...attributes,
            ]}
            node={NodeName('a')}
        >
            {Text({ children })}
        </LayoutWith>
    );
}

function Download({
    attributes,
    url,
    children,
}: {
    attributes: Attribute[];
    url: string;
    children: preact.ComponentChild;
}) {
    return (
        <DownloadCore attributes={attributes} url={url} filename={''}>
            {children}
        </DownloadCore>
    );
}

function DownloadAs({
    attributes,
    url,
    filename,
    children,
}: {
    attributes: Attribute[];
    url: string;
    filename: string;
    children: preact.ComponentChild;
}) {
    return (
        <DownloadCore attributes={attributes} url={url} filename={filename}>
            {children}
        </DownloadCore>
    );
}

function DownloadCore({
    attributes,
    url,
    filename,
    children,
}: {
    attributes: Attribute[];
    url: string;
    filename: string;
    children: preact.ComponentChild;
}) {
    return (
        <LayoutWith
            options={[Element_.noStaticStyleSheet]}
            attributes={[
                Attr({ href: url }),
                Attr({ download: filename }),
                ...Element_.downloadAttrs,
                ...attributes,
            ]}
            node={NodeName('a')}
        >
            {Text({ children })}
        </LayoutWith>
    );
}

export {
    Layout,
    LayoutWith,
    None,
    Text,
    El,
    Row,
    Column,
    WrappedRow,
    Table,
    IndexedTable,
    Paragraph,
    TextColumn,
    Image,
    Link,
    NewTabLink,
    Download,
    DownloadAs,
};

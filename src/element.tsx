// deno-lint-ignore-file
import { preact, elmish } from '../deps.ts';
import {
    Length,
    Px,
    Rem,
    Content,
    Fill,
    Min,
    Max,
    MinContent,
    MaxContent,
    Element,
    Attribute,
    Attr,
    Option,
    RenderMode,
    RenderModeOption,
    FocusStyle,
    FocusStyleOption,
    HoverSetting,
    HoverOption,
    Empty,
    Text as Text_,
    asEl,
    asRow,
    asColumn,
    Unkeyed,
    Width,
    Height,
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
    Paragraph as Paragraph_,
    Describe,
    asTextColumn,
    Attributes,
    NodeName,
    Location,
    Elements,
    NoAttribute,
    Nearby,
    TransformComponent_,
    Scale,
    Rotate,
    MoveY,
    MoveX,
    AlignX,
    HAlign,
    AlignY,
    VAlign,
    Class,
    Transparency,
    PseudoSelector,
    PseudoClass,
    LayoutContext,
    Unstyled,
} from './internal/data.ts';
import * as Element_ from './element.ts';
import * as Internal from './internal/model.ts';
import * as Flag from './internal/flag.ts';
import { classes } from './internal/style.ts';
import { style } from './elements/attributes.ts';

interface Column_<T extends Record<string, unknown>> {
    header: preact.ComponentChild;
    width: Length;
    view: (record: T) => preact.ComponentChild;
}

function Column_(
    header: preact.ComponentChild,
    width: Length,
    view: (record: Record<string, unknown>) => preact.ComponentChild
): Column_<Record<string, unknown>> {
    return { header, width, view };
}

interface IndexedColumn<T extends Record<string, unknown>> {
    header: preact.ComponentChild;
    width: Length;
    view: (a: number, record: T) => preact.ComponentChild;
}

function IndexedColumn(
    header: preact.ComponentChild,
    width: Length,
    view: (a: number, record: Record<string, unknown>) => preact.ComponentChild
): IndexedColumn<Record<string, unknown>> {
    return { header, width, view };
}

interface InternalTable<T extends Record<string, unknown>> {
    data: T[];
    columns: InternalTableColumn[];
}

function _InternalTable(
    data: Record<string, unknown>[],
    columns: InternalTableColumn[]
): InternalTable<Record<string, unknown>> {
    return { data, columns };
}

enum InternalTableColumns {
    InternalIndexedColumn,
    InternalColumn,
}

interface InternalIndexedColumn {
    type: InternalTableColumns.InternalIndexedColumn;
    column: IndexedColumn<Record<string, unknown>>;
}

function InternalIndexedColumn(
    column: IndexedColumn<Record<string, unknown>>
): InternalIndexedColumn {
    return {
        type: InternalTableColumns.InternalIndexedColumn,
        column,
    };
}

interface InternalColumn {
    type: InternalTableColumns.InternalColumn;
    column: Column_<Record<string, unknown>>;
}

function InternalColumn(
    column: Column_<Record<string, unknown>>
): InternalColumn {
    return {
        type: InternalTableColumns.InternalColumn,
        column,
    };
}

type InternalTableColumn = InternalIndexedColumn | InternalColumn;

const { Just, Nothing, MaybeType } = elmish.Maybe;
const { h, Fragment } = preact;

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
 * ```ts
 * Element.el(
 *  [ Background.color((rgb(0, 0.5, 0)))
 *  , Border.color((rgb(0, 0.7, 0)))
 *  ],
 *  Element.text("You've made a stylish element!"))
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
                    const halfX = (x / 2) * -1,
                        halfY = (y / 2) * -1;
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
                                        `${halfY.toString()}px ${halfX.toString()}px`
                                    ),
                                    style(
                                        'width',
                                        `calc(100% + ${x.toString()}px)`
                                    ),
                                    style(
                                        'height',
                                        `calc(100% + ${y.toString()}px)`
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

function Table({
    attributes,
    config,
}: {
    attributes: Attribute[];
    config: {
        data: Record<string, unknown>[];
        columns: Element_.Column<Record<string, unknown>>[];
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

function IndexedTable({
    attributes,
    config,
}: {
    attributes: Attribute[];
    config: {
        data: Record<string, unknown>[];
        columns: Element_.IndexedColumn<Record<string, unknown>>[];
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
    config: InternalTable<Record<string, unknown>>;
}) {
    const [sX, sY] = Internal.getSpacing(attributes, [0, 0]);

    const maybeHeaders: Maybe<preact.ComponentChild> = ((
        headers: preact.ComponentChild[]
    ) => {
        const [headers_] = headers.map(
            (header: preact.ComponentChild, col: number) =>
                onGrid(1, col + 1, header)
        );
        return headers.some((value: preact.ComponentChild) => value === '')
            ? Nothing()
            : Just(headers_);
    })(config.columns.map(columnHeader));

    const template: Attribute = StyleClass(
        Flag.gridTemplate,
        GridTemplateStyle(
            [Px(sX), Px(sY)],
            config.columns.map(columnWidth),
            config.data.map(() => Content())
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
            data: Record<string, unknown>
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
            >
                {elem}
            </LayoutWith>
        );
    }

    function add(
        cell: Record<string, unknown>,
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
        rowData: Record<string, unknown>,
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
        const cursor_ = cursor;
        const newCursor_ = newCursor;

        return {
            elements: newCursor_.elements,
            row: cursor_.row + 1,
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
                        return [
                            maybeHeaders.value,
                            ...children.elements.reverse(),
                        ];
                }
            })()}
        </LayoutWith>
    );
}

function Paragraph({
    attributes,
    children,
}: {
    attributes: Attribute[];
    children: preact.JSX.Element;
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

function TextColumn({
    attributes,
    children,
}: {
    attributes: Attribute[];
    children: preact.JSX.Element;
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

function Link({
    attributes,
    url,
    children,
}: {
    attributes: Attribute[];
    url: string;
    children: preact.JSX.Element;
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
    children: preact.JSX.Element;
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
    children: preact.JSX.Element;
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
            {children}
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
    children: preact.JSX.Element;
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
    children: preact.JSX.Element;
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
    children: preact.JSX.Element;
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
            {children}
        </LayoutWith>
    );
}

export {
    Layout,
    LayoutWith,
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
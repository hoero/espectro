/**TODO:
 * This module is meant to make accessibility easy!

These are sign posts that accessibility software like screen readers can use to navigate your app.

All you have to do is add them to elements in your app where you see fit.

Here's an example of annotating your navigation region:

    import Element.Region as Region

    myNavigation =
        Element.row [ Region.navigation ]
            [-- ..your navigation links
            ]

@docs mainContent, navigation, heading, aside, footer

@docs description

@docs announce, announceUrgently
 */

import {
    Attribute,
    Complementary,
    ContentInfo,
    Describe,
    Heading,
    Label,
    LiveAssertive,
    LivePolite,
    Main,
    Navigation,
} from '../internal/data.ts';

const main: Attribute = Describe(Main()),
    aside: Attribute = Describe(Complementary()),
    navigation: Attribute = Describe(Navigation()),
    footer: Attribute = Describe(ContentInfo());

/**
 * Screen readers will announce changes to this element and potentially interrupt any other announcement.
 */
const announceUrgently: Attribute = Describe(LiveAssertive());

/**
 * Screen readers will announce when changes to this element are made.
 */
const announce: Attribute = Describe(LivePolite());

/**TODO:
 * This will mark an element as `h1`, `h2`, etc where possible.

Though it's also smart enough to not conflict with existing nodes.

So, this code

link [ Region.heading 1 ]
    { url = "http://fruits.com"
    , label = text "Best site ever"
    }

will generate

<a href="http://fruits.com">
    <h1>Best site ever</h1>
</a>
* @param i 
* @returns 
*/
function heading(i: number): Attribute {
    return Describe(Heading(i));
}

/** TODO:
 * Adds an `aria-label`, which is used by accessibility software to identity otherwise unlabeled elements.

A common use for this would be to label buttons that only have an icon.
 * @param label 
 * @returns 
 */
function description(label: string): Attribute {
    return Describe(Label(label));
}

export {
    main,
    navigation,
    heading,
    aside,
    footer,
    description,
    announce,
    announceUrgently,
};

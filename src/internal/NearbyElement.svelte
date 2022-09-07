<script lang="ts">
    import { classes } from './style';
    import { Location, Element, Elements, EmbedStyles, asEl } from './data';
    import TextElement from './TextElement.svelte';

    let location: Location, element: Element;

    const common = [classes.nearby, classes.single];

    function cls(location: Location) {
        switch (location) {
            case Location.Above:
                return [...common, classes.above].join(' ');

            case Location.Below:
                return [...common, classes.below].join(' ');

            case Location.OnRight:
                return [...common, classes.onRight].join(' ');

            case Location.OnLeft:
                return [...common, classes.onLeft].join(' ');

            case Location.InFront:
                return [...common, classes.inFront].join(' ');

            case Location.Behind:
                return [...common, classes.behind].join(' ');
        }
    }

    export { location, element };
</script>

<div class={cls(location)}>
    {#if element.type === Elements.Text}
        <TextElement str={element.str} />
    {:else if element.type === Elements.Unstyled}
        {element.html(asEl)}
    {:else if element.type === Elements.Styled}
        {element.html(EmbedStyles.NoStyleSheet, asEl)}
    {:else}
        ''
    {/if}
</div>

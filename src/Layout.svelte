<script lang="ts">
    import { rootStyle } from './internal/model';
    import { classes } from './internal/style';

    const { root, any, single } = classes;
</script>

<!-- TODO: -->
<div class="{root} {any} {single} ">
    <slot />
</div>

<style>
</style>

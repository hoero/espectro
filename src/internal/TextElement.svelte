<script lang="ts">
    import { classes } from './style';
    import { TextElement } from './data';

    let type: TextElement = TextElement.Text,
        str: string;

    const textClasses = `${classes.any} ${classes.text} ${classes.widthContent} ${classes.heightContent}`,
        textFillClasses = `${classes.any} ${classes.text} ${classes.widthFill} ${classes.heightFill}`;

    function cls(mode: TextElement) {
        switch (mode) {
            case TextElement.Text:
                return textClasses;

            case TextElement.Fill:
                return textFillClasses;
        }
    }

    export { type, str };
</script>

<div class={cls(type)}>{str}</div>

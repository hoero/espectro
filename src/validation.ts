import { classValidator } from './deps.ts';

import { ChannelsColor } from './color.ts';

const validateColor = (color: ChannelsColor) => {
    return classValidator.validate(color).then((errors) => {
        if (errors.length > 0) {
            console.log('Validation failed: ', errors);
            return;
        }
        return color.color;
    });
};

export default validateColor;

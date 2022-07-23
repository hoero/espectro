import { validate } from 'class-validator';

import { ChannelsColor, Color } from './internal/model';

const validateColor = (color: ChannelsColor): Promise<Color> => {
    return validate(color).then((errors) => {
        if (errors.length > 0) {
            console.log('Validation failed: ', errors);
            return;
        }
        return color.color;
    });
};

export default validateColor;

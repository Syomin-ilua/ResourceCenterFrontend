import * as yup from 'yup';

export const timeValidator = yup.string().test(
    'is-valid-time',
    '${path} недопустимое значение времени',
    (value) => {
        if (!value) return false;
        const timeFormat = /^([01]\d|2[0-3]):([0-5]\d)$/;
        if (!timeFormat.test(value)) {
            return false;
        }
        const [hours, minutes] = value.split(':').map(Number);
        return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
    }
);
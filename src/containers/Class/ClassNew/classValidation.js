import {createValidator, required, minLength, maxLength, date} from 'utils/validation';

const classValidation = createValidator({
  title: [required, minLength(4), maxLength(255)],
  start: [required, date],
  end: [required, date],
});

export default classValidation;

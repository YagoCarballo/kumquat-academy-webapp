import {createValidator, required, date, minLength, maxLength} from 'utils/validation';

const classValidation = createValidator({
  title: [required, minLength(4), maxLength(50)],
  start: [required, date],
  end: [required, date],
});

export default classValidation;

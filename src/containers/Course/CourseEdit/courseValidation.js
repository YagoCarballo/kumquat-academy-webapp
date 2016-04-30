import {createValidator, required, minLength, maxLength} from 'utils/validation';

const courseValidation = createValidator({
  title: [required, minLength(4), maxLength(255)],
  description: [required, maxLength(255)],
});

export default courseValidation;

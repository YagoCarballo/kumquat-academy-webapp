import {createValidator, required, integer, minLength, maxLength} from 'utils/validation';

const moduleValidation = createValidator({
  title: [required, minLength(4), maxLength(255)],
  description: [maxLength(255)],
  duration: [required, integer],
  icon: [required],
  color: [required],
});

export default moduleValidation;

import {
  createValidator,
  required,
  date,
  minLength, maxLength
} from 'utils/validation';

const lectureSlotValidation = createValidator({
  type: [required, minLength(4), maxLength(255)],
  location: [required, minLength(4), maxLength(255)],
  start: [required, date],
  end: [required, date]
});

export default lectureSlotValidation;

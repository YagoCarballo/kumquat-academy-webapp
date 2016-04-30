import {
  createValidator,
  required,
  date,
  boolean,
  integerList,
  minLength, maxLength
} from 'utils/validation';

const lectureValidation = createValidator({
  topic: [required, minLength(4), maxLength(255)],
  description: [required, minLength(4), maxLength(4096)],
  location: [required, minLength(4), maxLength(255)],
  start: [required, date],
  end: [required, date],
  canceled: [required, boolean],
  attachments: [integerList]
});

export default lectureValidation;

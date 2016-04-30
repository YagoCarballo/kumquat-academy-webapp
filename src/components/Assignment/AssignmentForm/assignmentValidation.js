import {
  createValidator,
  required,
  date,
  oneOf,
  minLength, maxLength,
  minNumber, maxNumber
} from 'utils/validation';

const statusValues = [ 'draft', 'created', 'available', 'sent', 'graded', 'returned' ];
const assignmentValidation = createValidator({
  title: [required, minLength(4), maxLength(255)],
  description: [required, minLength(4), maxLength(4096)],
  start: [required, date],
  end: [required, date],
  status: [required, oneOf(statusValues)],
  weight: [required, minNumber(0.00), maxNumber(1.00)]
});

export default assignmentValidation;

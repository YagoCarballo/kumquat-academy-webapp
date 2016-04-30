import {
  createValidator,
  required,
  email,
  date,
  minLength, maxLength
} from 'utils/validation';

const studentValidation = createValidator({
  firstName: [required, minLength(4), maxLength(50)],
  lastName: [required, minLength(4), maxLength(50)],
  username: [required, minLength(4), maxLength(30)],
  email: [required, email, minLength(4), maxLength(100)],
  matricDate: [required, date],
  matricNumber: [required, minLength(4), maxLength(30)],
  dateOfBirth: [required, date]
});

export default studentValidation;

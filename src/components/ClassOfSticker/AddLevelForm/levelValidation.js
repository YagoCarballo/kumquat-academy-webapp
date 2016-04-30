import {createValidator, required, integer, minNumber, date} from 'utils/validation';

const levelValidation = createValidator({
  level: [required, integer, minNumber(1)],
  start: [required, date],
  end: [required, date],
});

export default levelValidation;

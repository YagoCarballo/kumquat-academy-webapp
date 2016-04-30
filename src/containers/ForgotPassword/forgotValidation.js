import { createValidator, required, email } from 'utils/validation';

const forgotValidation = createValidator({
  email: [required, email]
});

export default forgotValidation;

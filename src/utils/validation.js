require('datejs');
const isEmpty = value => value === undefined || value === null || value === '';
const join = (rules) => (value, data) => rules.map(rule => rule(value, data)).filter(error => !!error)[0 /* first error */ ];

export function email(value) {
  // Let's not start a debate on email regex. This is just for an example app!
  if (!isEmpty(value) && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
    return 'Invalid email address';
  }
}

export function required(value) {
  if (isEmpty(value)) {
    return 'Required';
  }
}

export function boolean(value) {
  if (value !== true && value !== false) {
    return 'Must be either true or false';
  }
}

export function minLength(min) {
  return value => {
    if (!isEmpty(value) && value.length < min) {
      return `Must be at least ${min} characters`;
    }
  };
}

export function maxLength(max) {
  return value => {
    if (!isEmpty(value) && value.length > max) {
      return `Must be no more than ${max} characters`;
    }
  };
}

export function integer(value) {
  if (!Number.isInteger(Number(value))) {
    return 'Must be an integer';
  }
}

export function integerList(list) {
  if (list instanceof Array) {
    for (const item of list) {
      if (!Number.isInteger(Number(item))) {
        return 'Must be an integer';
      }
    }
  }
}

export function minNumber(min) {
  return value => {
    if (!isEmpty(value) && value < min) {
      return `Must be at least ${min}`;
    }
  };
}

export function maxNumber(max) {
  return value => {
    if (!isEmpty(value) && value > max) {
      return `Must be no more than ${max}`;
    }
  };
}

export function date(value) {
  const parsedDate = Date.parse(value);
  if (!(parsedDate instanceof Date)) {
    return 'Must be a valid date';
  }
}

export function dateSmallerThan(value, target) {
  const parsedDate = Date.parse(value);
  const parsedTarget = Date.parse(target);
  if (!(parsedDate instanceof Date) || !(parsedTarget instanceof Date)) {
    return 'Must be a valid dates';
  } else if (parsedDate >= parsedTarget) {
    return 'Date must be smaller than ' + parsedTarget.toString('dd.MM.yyyy');
  }
}

export function oneOf(enumeration) {
  return value => {
    if (!~enumeration.indexOf(value)) {
      return `Must be one of: ${enumeration.join(', ')}`;
    }
  };
}

export function match(field) {
  return (value, data) => {
    if (data) {
      if (value !== data[field]) {
        return 'Do not match';
      }
    }
  };
}

export function createValidator(rules) {
  return (data = {}) => {
    const errors = {};
    Object.keys(rules).forEach((key) => {
      const rule = join([].concat(rules[key])); // concat enables both functions and arrays of functions
      const error = rule(data[key], data);
      if (error) {
        errors[key] = error;
      }
    });
    return errors;
  };
}

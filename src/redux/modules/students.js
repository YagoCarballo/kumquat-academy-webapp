require('datejs');

const LOAD = 'kumquat-academy/students/LOAD';
const LOAD_SUCCESS = 'kumquat-academy/students/LOAD_SUCCESS';
const LOAD_FAIL = 'kumquat-academy/students/LOAD_FAIL';

const SAVE = 'kumquat-academy/students/SAVE';
const SAVE_SUCCESS = 'kumquat-academy/students/SAVE_SUCCESS';
const SAVE_FAIL = 'kumquat-academy/students/SAVE_FAIL';

const SEARCH = 'kumquat-academy/students/SEARCH';
const SEARCH_SUCCESS = 'kumquat-academy/students/SEARCH_SUCCESS';
const SEARCH_FAIL = 'kumquat-academy/students/SEARCH_FAIL';

const EDIT_START = 'kumquat-academy/students/EDIT_START';
const EDIT_STOP = 'kumquat-academy/students/EDIT_STOP';

const initialState = {
  loaded: false,
  module: {},
  editing: {},
  search: {}
};

function parseStudent(item) {
  const parsedItem = {
    id: item.id,
    firstName: item.first_name,
    lastName: item.last_name,
    username: item.username,
    email: item.email,
    matricNumber: item.matric_number,
    avatar: (item.avatar ? '/api/api/v1/attachment/' + item.avatar : '/default_avatar.svg'),
    avatarId: item.avatar_id
  };

  if (item.matric_date) {
    parsedItem.matricDate = item.matric_date.substr(0, 10);
  }
  if (item.date_of_birth) {
    parsedItem.dateOfBirth = item.date_of_birth.substr(0, 10);
  }
  return parsedItem;
}

function parseStudents(list) {
  const output = {};
  for (let item of list) {
    item = parseStudent(item);
    output[item.id] = item;
  }
  return output;
}

export default function reducer(state = initialState, action = {}) {
  let editing = {};
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: true,
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        module: {
          ...state.module,
          [action.moduleCode]: parseStudents(action.result.students)
        }
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      };
    case EDIT_START:
      editing = state.editing;
      editing[action.moduleCode] = (editing[action.moduleCode] || {});
      editing[action.moduleCode][action.studentId] = true;
      return {
        ...state,
        editing: editing
      };
    case EDIT_STOP:
      editing = state.editing;
      editing[action.moduleCode] = (editing[action.moduleCode] || {});
      editing[action.moduleCode][action.studentId] = false;
      return {
        ...state,
        editing: editing
      };
    case SAVE:
      return state; // 'saving' flag handled by redux-form
    case SAVE_SUCCESS:
      return {
        ...state,
        editing: editing,
        module: {
          ...state.module,
          [action.moduleCode]: {
            ...state.module[action.moduleCode],
            [action.result.student.id]: parseStudent(action.result.student)
          }
        },
        saveError: {
          ...state.saveError
        }
      };
    case SAVE_FAIL:
      return typeof action.error === 'string' ? {
        ...state,
        saveError: {
          ...state.saveError
        }
      } : state;
    case SEARCH:
      return state; // 'saving' flag handled by redux-form
    case SEARCH_SUCCESS:
      return {
        ...state,
        search: parseStudents(action.result.students)
      };
    case SEARCH_FAIL:
      return typeof action.error === 'string' ? {
        ...state,
        search: {}
      } : state;
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return (globalState.students && globalState.loaded);
}

export function loadStudents(moduleCode) {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    moduleCode: moduleCode,
    promise: (client) => client.get('/api/v1/module/' + moduleCode + '/students')
  };
}

export function search(moduleCode, query) {
  return {
    types: [SEARCH, SEARCH_SUCCESS, SEARCH_FAIL],
    promise: (client) => client.get('/api/v1/module/' + moduleCode + '/students/search/' + query)
  };
}

export function create(moduleCode, student) {
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    studentId: 'new',
    moduleCode: moduleCode,
    promise: (client) => client.put('/api/v1/module/' + moduleCode + '/student', {
      data: {
        'username': student.username,
        'email': student.email,
        'first_name': student.firstName,
        'last_name': student.lastName,
        'date_of_birth': Date.parse(student.dateOfBirth).toISOString(),
        'matric_date': Date.parse(student.matricDate).toISOString(),
        'matric_number': student.matricNumber,
        'avatar_id': student.avatarId
      }
    })
  };
}

export function update(moduleCode, student) {
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    studentId: student.id,
    moduleCode: moduleCode,
    promise: (client) => client.post('/api/v1/module/' + moduleCode + '/student/' + student.id, {
      data: {
        'username': student.username,
        'email': student.email,
        'first_name': student.firstName,
        'last_name': student.lastName,
        'date_of_birth': Date.parse(student.dateOfBirth).toISOString(),
        'matric_date': Date.parse(student.matricDate).toISOString(),
        'matric_number': student.matricNumber,
        'avatar_id': student.avatarId
      }
    })
  };
}

export function addToModule(moduleCode, studentId) {
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    studentId: studentId,
    moduleCode: moduleCode,
    promise: (client) => client.put('/api/v1/module/' + moduleCode + '/student/' + studentId)
  };
}

export function editStart(moduleCode, studentId) {
  return { type: EDIT_START, moduleCode, studentId };
}

export function editStop(moduleCode, studentId) {
  return { type: EDIT_STOP, moduleCode, studentId };
}


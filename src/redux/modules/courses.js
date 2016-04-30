const LOAD = 'kumquat-academy/courses/LOAD';
const LOAD_SUCCESS = 'kumquat-academy/courses/LOAD_SUCCESS';
const LOAD_FAIL = 'kumquat-academy/courses/LOAD_FAIL';
const EDIT_START = 'kumquat-academy/courses/EDIT_START';
const EDIT_STOP = 'kumquat-academy/courses/EDIT_STOP';
const SAVE = 'kumquat-academy/courses/SAVE';
const SAVE_SUCCESS = 'kumquat-academy/courses/SAVE_SUCCESS';
const SAVE_FAIL = 'kumquat-academy/courses/SAVE_FAIL';

const initialState = {
  loaded: false,
  editing: {},
  saveError: {},
  list: {}
};

function parseCourses(list) {
  // Parse the courses
  const output = {};
  for (const course of list) {
    output[course.id] = course;

    // Parse the Modules inside each course
    const modulesObject = {};
    if (course.modules) {
      for (const module of course.modules) {
        modulesObject[module.code] = module;
      }
    }
    course.modules = modulesObject;
  }
  return output;
}

export default function courses(state = initialState, action = {}) {
  let course;
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
        list: parseCourses(action.result.courses),
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error,
        list: {},
      };
    case EDIT_START:
      course = (state.list[action.id] || {});
      return {
        ...state,
        editing: {
          ...state.editing,
          [action.id]: {
            state: true,
            data: course,
          }
        }
      };
    case EDIT_STOP:
      return {
        ...state,
        editing: {
          ...state.editing,
          [action.id]: {
            ...state.editing[action.id],
            state: false,
          }
        }
      };
    case SAVE:
      return state; // 'saving' flag handled by redux-form
    case SAVE_SUCCESS:
      course = action.result.course;
      state.list[course.id] = {
        ...course,
        role: {}
      };
      return {
        ...state,
        list: state.list,
        editing: {
          ...state.editing,
          [action.id]: {
            state: false,
            data: null,
          }
        },
        saveError: {
          ...state.saveError,
          [action.id]: null
        }
      };
    case SAVE_FAIL:
      if (action.error && (typeof action.error.message === 'string')) {
        return {
          ...state,
          saveError: {
            ...state.saveError,
            [action.id]: action.error.message
          }
        };
      }
      return state;
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.modules && globalState.modules.loaded;
}

export function loadCourses() {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('/api/v1/courses')
  };
}

export function editStart(id) {
  return { type: EDIT_START, id };
}

export function editStop(id) {
  return { type: EDIT_STOP, id };
}

export function create(id, course) {
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    id: 'new',
    promise: (client) => client.put('/api/v1/course', {
      data: {
        title: course.title,
        description: course.description
      }
    })
  };
}

export function update(id, course) {
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    id: id,
    promise: (client) => client.post('/api/v1/course/' + id, {
      data: {
        title: course.title,
        description: course.description
      }
    })
  };
}

require('datejs');

const LOAD = 'kumquat-academy/classes/LOAD';
const LOAD_SUCCESS = 'kumquat-academy/classes/LOAD_SUCCESS';
const LOAD_FAIL = 'kumquat-academy/classes/LOAD_FAIL';
const EDIT_START = 'kumquat-academy/classes/EDIT_START';
const EDIT_STOP = 'kumquat-academy/classes/EDIT_STOP';
const SAVE = 'kumquat-academy/classes/SAVE';
const SAVE_SUCCESS = 'kumquat-academy/classes/SAVE_SUCCESS';
const SAVE_FAIL = 'kumquat-academy/classes/SAVE_FAIL';

const LEVEL_SAVE_SUCCESS = 'kumquat-academy/levels/SAVE_SUCCESS';

const initialState = {
  loaded: false,
  editing: {},
  saveError: {},
  list: {}
};

function parseDates(item) {
  item.start = item.start.substr(0, 10);
  item.end = item.end.substr(0, 10);
  return item;
}

function parseClasses(list) {
  const output = {};
  for (let item of list) {
    item = parseDates(item);
    output[item.id] = item;
  }
  return output;
}

export default function reducer(state = initialState, action = {}) {
  let editing;
  let list;
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
        list: {
          ...state.list,
          [action.courseId]: parseClasses(action.result.classes),
        }
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error,
      };
    case EDIT_START:
      editing = state.editing;
      editing[action.courseId] = (editing[action.courseId] || {});
      editing[action.courseId][action.id] = true;
      return {
        ...state,
        editing: editing,
      };
    case EDIT_STOP:
      editing = state.editing;
      editing[action.courseId] = (editing[action.courseId] || {});
      editing[action.courseId][action.id] = true;
      return {
        ...state,
        editing: editing,
      };
    case SAVE:
      return state; // 'saving' flag handled by redux-form
    case SAVE_SUCCESS:
      list = state.list;
      list[action.courseId][action.id] = parseDates(action.result.class);

      editing = state.editing;
      editing[action.courseId] = (editing[action.courseId] || {});
      editing[action.courseId][action.id] = true;
      return {
        ...state,
        list: list,
        editing: editing,
        saveError: {
          ...state.saveError,
          [action.id]: null
        }
      };
    case SAVE_FAIL:
      return typeof action.error === 'string' ? {
        ...state,
        saveError: {
          ...state.saveError,
          [action.level]: action.error
        }
      } : state;
    case LEVEL_SAVE_SUCCESS:
      list = state.list;
      if (action.id === 'new') {
        list[action.courseId][action.classId].levels.push(action.result.level);
      } else {
        list[action.courseId][action.classId].levels[action.id] = action.result.level;
      }

      return {
        ...state,
        list: list
      };
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return (globalState.classes && globalState.loaded);
}

export function loadClasses(courseId) {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    courseId: courseId,
    promise: (client) => client.get('/api/v1/course/' + courseId + '/classes')
  };
}

export function update(courseId, classId, classOf) {
  const url = '/api/v1/course/' + courseId + '/class/' + classId;
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    id: classId,
    courseId: courseId,
    promise: (client) => client.post(url, {
      data: {
        title: classOf.title,
        start: Date.parse(classOf.start).toISOString(),
        end: Date.parse(classOf.end).toISOString(),
      }
    })
  };
}

export function create(classOf) {
  const url = '/api/v1/course/' + classOf.courseId + '/class';
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    id: classOf.id,
    courseId: classOf.courseId,
    promise: (client) => client.put(url, {
      data: {
        title: classOf.title,
        start: Date.parse(classOf.start).toISOString(),
        end: Date.parse(classOf.end).toISOString(),
        levels: classOf.levels,
      }
    })
  };
}

export function editStart(id, courseId) {
  return { type: EDIT_START, id, courseId };
}

export function editStop(id, courseId) {
  return { type: EDIT_STOP, id, courseId };
}

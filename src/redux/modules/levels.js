require('datejs');

const EDIT_START = 'kumquat-academy/levels/EDIT_START';
const EDIT_STOP = 'kumquat-academy/levels/EDIT_STOP';
const SAVE = 'kumquat-academy/levels/SAVE';
const SAVE_SUCCESS = 'kumquat-academy/levels/SAVE_SUCCESS';
const SAVE_FAIL = 'kumquat-academy/levels/SAVE_FAIL';
const ADD_MODULE = 'kumquat-academy/levels/ADD_MODULE';
const ADD_MODULE_SUCCESS = 'kumquat-academy/levels/ADD_MODULE_SUCCESS';
const ADD_MODULE_FAIL = 'kumquat-academy/levels/ADD_MODULE_FAIL';
const LOAD_MODULES = 'kumquat-academy/levels/LOAD_MODULES';
const LOAD_MODULES_SUCCESS = 'kumquat-academy/levels/LOAD_MODULES_SUCCESS';
const LOAD_MODULES_FAIL = 'kumquat-academy/levels/LOAD_MODULES_FAIL';

const initialState = {
  editing: {},
  saveError: {},
  class: {}
};

function parseModuleLevels(list) {
  // Parse the courses
  const output = {};
  for (const module of list) {
    output[module.id] = module;
  }
  return output;
}

function getLevel(Class, classId, lvl) {
  const tmp = (Class || {});
  tmp[classId] = (tmp[classId] || { level: {} });
  tmp[classId].level[lvl] = (tmp[classId].level[lvl] || { modules: {} });
  return tmp;
}

export default function reducer(state = initialState, action = {}) {
  const { classId, lvl } = action;
  let Class;

  switch (action.type) {
    case EDIT_START:
      return {
        ...state,
        editing: {
          ...state.editing,
          [action.level]: true
        }
      };
    case EDIT_STOP:
      return {
        ...state,
        editing: {
          ...state.editing,
          [action.level]: false
        }
      };
    case SAVE:
      return state; // 'saving' flag handled by redux-form
    case SAVE_SUCCESS:
      const data = [...state.data];
      data[action.result.level - 1] = action.result;
      return {
        ...state,
        data: data,
        editing: {
          ...state.editing,
          [action.level]: false
        },
        saveError: {
          ...state.saveError,
          [action.level]: null
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
    case ADD_MODULE:
      return state;
    case ADD_MODULE_SUCCESS:
      Class = getLevel(state.class, classId, lvl);
      Class[classId].level[lvl].modules[action.moduleId] = action.result.module;
      return {
        ...state,
        class: Class
      };
    case ADD_MODULE_FAIL:
      return state;
    case LOAD_MODULES:
      Class = getLevel(state.class, classId, lvl);
      Class[classId].level[lvl] = {
        modulesLoaded: false,
        modulesLoading: false,
        modules: {}
      };
      return {
        ...state,
        class: Class
      };
    case LOAD_MODULES_SUCCESS:
      Class = getLevel(state.class, classId, lvl);
      Class[classId].level[lvl] = {
        ...Class[classId].level[lvl],
        modulesLoaded: true,
        modulesLoading: false,
        modules: parseModuleLevels(action.result.modules)
      };
      return {
        ...state,
        class: Class
      };
    case LOAD_MODULES_FAIL:
      Class = getLevel(state.class, classId, lvl);
      Class[classId].level[lvl] = {
        ...Class[classId].level[lvl],
        modulesLoaded: false,
        modulesLoading: false,
        modules: {}
      };

      return {
        ...state,
        class: Class
      };
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.levels;
}

export function areLevelModulesLoaded(globalState, classId, lvl) {
  const Class = (globalState.class || { level: {} });
  const level = (Class.level[lvl] || { modulesLoad: false });

  return globalState.levels && level.modulesLoaded;
}

export function save(level, courseId, classId) {
  const url = '/api/v1/course/' + courseId + '/class/' + classId + '/level/' + level.level;
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    id: level.level,
    promise: (client) => client.post(url, {
      data: {
        level: level.level,
        start: Date.parse(level.start).toISOString(),
        end: Date.parse(level.end).toISOString()
      }
    })
  };
}

export function create(level, courseId, classId) {
  const url = '/api/v1/course/' + courseId + '/class/' + classId + '/level';
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    id: 'new',
    classId: classId,
    courseId: courseId,
    promise: (client) => client.put(url, {
      data: {
        level: parseInt(level.level, 10),
        start: Date.parse(level.start).toISOString(),
        end: Date.parse(level.end).toISOString()
      }
    })
  };
}

export function addModule(level, courseId, classId, moduleId, code, startDate) {
  const url = '/api/v1/course/' + courseId + '/class/' + classId + '/level/' + level + '/module';
  return {
    types: [ADD_MODULE, ADD_MODULE_SUCCESS, ADD_MODULE_FAIL],
    lvl: level,
    classId: classId,
    courseId: courseId,
    promise: (client) => client.put(url, {
      data: {
        module_id: parseInt(moduleId, 10),
        code: code,
        start: Date.parse(startDate).toISOString()
      }
    })
  };
}

export function getLevelModules(lvl, courseId, classId) {
  const url = '/api/v1/course/' + courseId + '/class/' + classId + '/level/' + lvl + '/modules';
  return {
    types: [LOAD_MODULES, LOAD_MODULES_SUCCESS, LOAD_MODULES_FAIL],
    lvl: lvl,
    classId: classId,
    courseId: courseId,
    promise: (client) => client.get(url)
  };
}


export function editStart(id) {
  return { type: EDIT_START, id };
}

export function editStop(id) {
  return { type: EDIT_STOP, id };
}

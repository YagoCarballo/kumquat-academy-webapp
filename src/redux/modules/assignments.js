require('datejs');

const LOAD = 'kumquat-academy/assignments/LOAD';
const LOAD_SUCCESS = 'kumquat-academy/assignments/LOAD_SUCCESS';
const LOAD_FAIL = 'kumquat-academy/assignments/LOAD_FAIL';

const SAVE = 'kumquat-academy/assignments/SAVE';
const SAVE_SUCCESS = 'kumquat-academy/assignments/SAVE_SUCCESS';
const SAVE_FAIL = 'kumquat-academy/assignments/SAVE_FAIL';

const SUBMIT = 'kumquat-academy/assignments/SUBMIT';
const SUBMIT_SUCCESS = 'kumquat-academy/assignments/SUBMIT_SUCCESS';
const SUBMIT_FAIL = 'kumquat-academy/assignments/SUBMIT_FAIL';

const GRADE = 'kumquat-academy/assignments/GRADE';
const GRADE_SUCCESS = 'kumquat-academy/assignments/GRADE_SUCCESS';
const GRADE_FAIL = 'kumquat-academy/assignments/GRADE_FAIL';

const EDIT_START = 'kumquat-academy/assignments/EDIT_START';
const EDIT_STOP = 'kumquat-academy/assignments/EDIT_STOP';

const initialState = {
  loaded: false,
  module: {},
  editing: {}
};

function parseDates(item) {
  item.start = item.start.substr(0, 10);
  item.end = item.end.substr(0, 10);
  return item;
}

function parseAssignments(list) {
  const output = {};
  for (let item of list) {
    item = parseDates(item);
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
          [action.moduleCode]: parseAssignments(action.result.assignments),
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
      editing[action.moduleCode][action.assignmentId] = true;
      return {
        ...state,
        editing: editing
      };
    case EDIT_STOP:
      editing = state.editing;
      editing[action.moduleCode] = (editing[action.moduleCode] || {});
      editing[action.moduleCode][action.assignmentId] = false;
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
            [action.result.assignment.id]: action.result.assignment
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
    case GRADE:
      return state;
    case GRADE_SUCCESS:
      return {
        ...state,
        editing: editing,
        module: {
          ...state.module,
          [action.moduleCode]: {
            ...state.module[action.moduleCode],
            [action.assignmentId]: {
              ...state.module[action.moduleCode][action.assignmentId],
              students: {
                ...state.module[action.moduleCode][action.assignmentId].students,
                [action.studentId]: {
                  ...state.module[action.moduleCode][action.assignmentId].students[action.studentId],
                  submission: action.result.submission
                }
              }
            }
          }
        },
        saveError: {
          ...state.saveError
        }
      };
    case GRADE_FAIL:
      return typeof action.error === 'string' ? {
        ...state,
        saveError: {
          ...state.saveError
        }
      } : state;
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return (globalState.assignments && globalState.loaded);
}

export function loadAssignments(moduleCode) {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    moduleCode: moduleCode,
    promise: (client) => client.get('/api/v1/module/' + moduleCode + '/assignments')
  };
}

export function create(moduleCode, assignment) {
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    assignmentId: 'new',
    moduleCode: moduleCode,
    promise: (client) => client.put('/api/v1/module/' + moduleCode + '/assignment', {
      data: {
        title: assignment.title,
        description: assignment.description,
        start: Date.parse(assignment.start).toISOString(),
        end: Date.parse(assignment.end).toISOString(),
        status: assignment.status,
        weight: Number(assignment.weight),
        attachment_id: null,
        module_code: moduleCode
      }
    })
  };
}

export function update(moduleCode, assignment) {
  let attachmentId = null;
  if (assignment.attachments && assignment.attachments.length > 0) {
    attachmentId = assignment.attachments[0];
  }

  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    assignmentId: assignment.id,
    moduleCode: moduleCode,
    promise: (client) => client.post('/api/v1/module/' + moduleCode + '/assignment/' + assignment.id, {
      data: {
        title: assignment.title,
        description: assignment.description,
        start: Date.parse(assignment.start).toISOString(),
        end: Date.parse(assignment.end).toISOString(),
        status: assignment.status,
        weight: Number(assignment.weight),
        attachment_id: attachmentId,
        module_code: moduleCode
      }
    })
  };
}

export function submit(moduleCode, assignmentId, submission, onProgress) {
  const formData = new FormData();
  formData.append('description', submission.description);

  for (const file of submission.files) {
    // Append files to form data
    if (file instanceof File) { // is the item a File?
      formData.append('files[]', file);
    } else {
      return {
        type: SUBMIT_FAIL,
        result: {
          error: 'InvalidFile',
          message: 'The provided files are invalid.'
        }
      };
    }
  }
  return {
    types: [SUBMIT, SUBMIT_SUCCESS, SUBMIT_FAIL],
    assignmentId: assignmentId,
    moduleCode: moduleCode,
    promise: (client) => client.put('/api/v1/module/' + moduleCode + '/assignment/' + assignmentId + '/submit', {
      data: formData,
      onProgress: onProgress
    })
  };
}

export function grade(moduleCode, assignmentId, studentId, submissionId, gradeValue) {
  return {
    types: [GRADE, GRADE_SUCCESS, GRADE_FAIL],
    studentId: studentId,
    moduleCode: moduleCode,
    assignmentId: assignmentId,
    submissionId: submissionId,
    promise: (client) => client.post('/api/v1/module/' + moduleCode + '/assignment/' + assignmentId + '/grade', {
      data: {
        id: submissionId,
        grade: gradeValue
      }
    })
  };
}

export function editStart(moduleCode, assignmentId) {
  return { type: EDIT_START, moduleCode, assignmentId };
}

export function editStop(moduleCode, assignmentId) {
  return { type: EDIT_STOP, moduleCode, assignmentId };
}


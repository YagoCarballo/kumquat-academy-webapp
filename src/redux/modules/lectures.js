require('datejs');

const LOAD = 'kumquat-academy/lectures/LOAD';
const LOAD_SUCCESS = 'kumquat-academy/lectures/LOAD_SUCCESS';
const LOAD_FAIL = 'kumquat-academy/lectures/LOAD_FAIL';

const LOAD_SCHEDULE = 'kumquat-academy/lectures/LOAD_SCHEDULE';
const LOAD_SCHEDULE_SUCCESS = 'kumquat-academy/lectures/LOAD_SCHEDULE_SUCCESS';
const LOAD_SCHEDULE_FAIL = 'kumquat-academy/lectures/LOAD_SCHEDULE_FAIL';

const LOAD_LECTURE = 'kumquat-academy/lectures/LOAD_LECTURE';
const LOAD_LECTURE_SUCCESS = 'kumquat-academy/lectures/LOAD_LECTURE_SUCCESS';
const LOAD_LECTURE_FAIL = 'kumquat-academy/lectures/LOAD_LECTURE_FAIL';

const SAVE = 'kumquat-academy/lectures/SAVE';
const SAVE_SUCCESS = 'kumquat-academy/lectures/SAVE_SUCCESS';
const SAVE_FAIL = 'kumquat-academy/lectures/SAVE_FAIL';

const SAVE_SLOT = 'kumquat-academy/lectures/SAVE_SLOT';
const SAVE_SLOT_SUCCESS = 'kumquat-academy/lectures/SAVE_SLOT_SUCCESS';
const SAVE_SLOT_FAIL = 'kumquat-academy/lectures/SAVE_SLOT_FAIL';

const EDIT_START = 'kumquat-academy/lectures/EDIT_START';
const EDIT_STOP = 'kumquat-academy/lectures/EDIT_STOP';

const initialState = {
  weekDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  loaded: false,
  lectureLoaded: false,
  scheduleLoaded: false,
  module: {},
  lecture: null,
  schedule: null,
  editing: {}
};

function parseLectures(list) {
  const output = {};
  for (const item of list) {
    item.lectureSlotId = item.lecture_slot_id;
    output[item.id] = item;
  }
  return output;
}

function parseSlots(weeks) {
  const output = {};
  for (const key in weeks) {
    if (weeks.hasOwnProperty(key)) {
      output[key] = parseLectures(weeks[key]);
    }
  }
  return output;
}

function parseWeeks(weeks) {
  const output = {};
  for (const week of weeks) {
    const lectures = {};
    for (const key in week.lectures) {
      if (week.lectures.hasOwnProperty(key)) {
        lectures[key] = parseLectures(week.lectures[key]);
      }
    }

    week.lectures = lectures;
    output[week.week] = week;
  }
  return output;
}

export default function reducer(state = initialState, action = {}) {
  let editing = {};
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: true
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        module: {
          ...state.module,
          [action.moduleCode]: {
            ...state.module[action.moduleCode],
            slots: parseSlots(action.result.slots),
            weeks: parseWeeks(action.result.weeks)
          }
        }
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      };
    case LOAD_SCHEDULE:
      return {
        ...state,
        scheduleLoading: true
      };
    case LOAD_SCHEDULE_SUCCESS:
      return {
        ...state,
        scheduleLoading: false,
        scheduleLoaded: true,
        schedule: action.result.schedule
      };
    case LOAD_SCHEDULE_FAIL:
      return {
        ...state,
        scheduleLoading: false,
        scheduleLoaded: false,
        error: action.error
      };
    case LOAD_LECTURE:
      return {
        ...state,
        lectureLoading: true
      };
    case LOAD_LECTURE_SUCCESS:
      return {
        ...state,
        lectureLoading: false,
        lectureLoaded: true,
        lecture: action.result.lecture
      };
    case LOAD_LECTURE_FAIL:
      return {
        ...state,
        lectureLoading: false,
        lectureLoaded: false,
        error: action.error
      };
    case EDIT_START:
      editing = state.editing;
      editing[action.moduleCode] = (editing[action.moduleCode] || {});
      editing[action.moduleCode][action.lectureId] = true;
      return {
        ...state,
        editing: editing
      };
    case EDIT_STOP:
      editing = state.editing;
      editing[action.moduleCode] = (editing[action.moduleCode] || {});
      editing[action.moduleCode][action.lectureId] = false;
      return {
        ...state,
        editing: editing
      };
    case SAVE:
    case SAVE_SLOT:
      return state; // 'saving' flag handled by redux-form
    case SAVE_SUCCESS:
      return {
        ...state,
        editing: editing,
        module: {
          ...state.module,
          [action.moduleCode]: {
            ...state.module[action.moduleCode],
            weeks: {
              ...state.module[action.moduleCode].weeks,
              [action.weekNumber]: {
                ...state.module[action.moduleCode].weeks[action.weekNumber],
                lectures: {
                  ...state.module[action.moduleCode].weeks[action.weekNumber].lectures,
                  [action.weekDay]: {
                    ...state.module[action.moduleCode].weeks[action.weekNumber].lectures[action.weekDay],
                    [action.result.lecture.id]: action.result.lecture
                  }
                }
              }
            }
          }
        },
        saveError: {
          ...state.saveError
        }
      };
    case SAVE_SLOT_SUCCESS:
      return {
        ...state,
        editing: editing,
        module: {
          ...state.module,
          [action.moduleCode]: {
            ...state.module[action.moduleCode],
            slots: {
              ...state.module[action.moduleCode].slots,
              [action.weekDay]: {
                ...state.module[action.moduleCode].slots[action.weekDay],
                [action.result.lecture_slot.id]: action.result.lecture_slot
              }
            }
          }
        },
        saveError: {
          ...state.saveError
        }
      };
    case SAVE_FAIL:
    case SAVE_SLOT_FAIL:
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
  return (globalState.lectures && globalState.loaded);
}

export function isScheduleLoaded(globalState) {
  return (globalState.schedule && globalState.scheduleLoaded);
}

export function isLectureLoaded(globalState) {
  return (globalState.lecture && globalState.lectureLoaded);
}

export function loadLectures(moduleCode) {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    moduleCode: moduleCode,
    promise: (client) => client.get('/api/v1/module/' + moduleCode + '/lectures-overview')
  };
}

export function loadSchedule() {
  return {
    types: [LOAD_SCHEDULE, LOAD_SCHEDULE_SUCCESS, LOAD_SCHEDULE_FAIL],
    promise: (client) => client.get('/api/v1/schedule')
  };
}

export function loadLecture(moduleCode, lectureId) {
  return {
    types: [LOAD_LECTURE, LOAD_LECTURE_SUCCESS, LOAD_LECTURE_FAIL],
    promise: (client) => client.get('/api/v1/module/' + moduleCode + '/lecture/' + lectureId)
  };
}

export function create(moduleCode, weekNumber, weekDay, lectureSlotId, lecture) {
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    lectureId: 'new',
    moduleCode: moduleCode,
    weekNumber: weekNumber,
    weekDay: weekDay,
    promise: (client) => client.put('/api/v1/module/' + moduleCode + '/lecture', {
      data: {
        location: lecture.location,
        topic: lecture.topic,
        start: Date.parse(lecture.start).toISOString(),
        end: Date.parse(lecture.end).toISOString(),
        description: lecture.description,
        canceled: lecture.canceled,
        lecture_slot_id: (lectureSlotId ? Number(lectureSlotId) : null)
      }
    })
  };
}

export function update(moduleCode, weekNumber, weekDay, lectureSlotId, lecture) {
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    lectureId: lecture.id,
    moduleCode: moduleCode,
    weekNumber: weekNumber,
    weekDay: weekDay,
    promise: (client) => client.post('/api/v1/module/' + moduleCode + '/lecture/' + lecture.id, {
      data: {
        location: lecture.location,
        topic: lecture.topic,
        start: Date.parse(lecture.start).toISOString(),
        end: Date.parse(lecture.end).toISOString(),
        description: lecture.description,
        canceled: lecture.canceled,
        lecture_slot_id: (lectureSlotId ? Number(lectureSlotId) : null)
      }
    })
  };
}

export function createSlot(moduleCode, weekDay, baseDate, lectureSlot) {
  const parsedBaseDate = Date.parse(baseDate);
  return {
    types: [SAVE_SLOT, SAVE_SLOT_SUCCESS, SAVE_SLOT_FAIL],
    lectureId: 'new',
    moduleCode: moduleCode,
    weekDay: weekDay,
    promise: (client) => client.put('/api/v1/module/' + moduleCode + '/lecture-slot', {
      data: {
        location: lectureSlot.location,
        type: lectureSlot.type,
        start: parsedBaseDate.at(Date.parse(lectureSlot.start).toString('HH:mm')).toISOString(),
        end: parsedBaseDate.at(Date.parse(lectureSlot.end).toString('HH:mm')).toISOString()
      }
    })
  };
}

export function updateSlot(moduleCode, weekDay, baseDate, lectureSlot) {
  const parsedBaseDate = Date.parse(baseDate);
  return {
    types: [SAVE_SLOT, SAVE_SLOT_SUCCESS, SAVE_SLOT_FAIL],
    lectureId: lectureSlot.id,
    moduleCode: moduleCode,
    weekDay: weekDay,
    promise: (client) => client.post('/api/v1/module/' + moduleCode + '/lecture-slot/' + lectureSlot.id, {
      data: {
        location: lectureSlot.location,
        type: lectureSlot.type,
        start: parsedBaseDate.at(Date.parse(lectureSlot.start).toString('HH:mm')).toISOString(),
        end: parsedBaseDate.at(Date.parse(lectureSlot.end).toString('HH:mm')).toISOString()
      }
    })
  };
}

export function editStart(moduleCode, lectureId) {
  return { type: EDIT_START, moduleCode, lectureId };
}

export function editStop(moduleCode, lectureId) {
  return { type: EDIT_STOP, moduleCode, lectureId };
}


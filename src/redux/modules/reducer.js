import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';

import auth from './auth';
import languages from './languages';
import courses from './courses';
import modules from './modules';
import classes from './classes';
import levels from './levels';
import assignments from './assignments';
import attachments from './attachments';
import students from './students';
import lectures from './lectures';

import {reducer as form} from 'redux-form';

export default combineReducers({
  router: routerStateReducer,
  languages,
  auth,
  modules,
  courses,
  classes,
  levels,
  form,
  assignments,
  attachments,
  students,
  lectures
});

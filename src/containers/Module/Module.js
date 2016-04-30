/**
 * Created by yagocarballo on 28/12/2015.
 */
import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { Grid, Col } from 'react-bootstrap';
import {Sidebar} from '../../components';

import { isLoaded as areAssignmentsLoaded, loadAssignments } from 'redux/modules/assignments';
import { isLoaded as areCoursesLoaded, loadCourses } from 'redux/modules/courses';

@connect(state => ({
  user: state.auth.user,
  courseId: state.router.params.courseId,
  moduleCode: state.router.params.moduleCode,
  courses: state.courses.list
}), null)
export default class Module extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    courseId: PropTypes.string.isRequired,
    moduleCode: PropTypes.string.isRequired,
    courses: PropTypes.object,
    children: PropTypes.object
  };

  static fetchData(getState, dispatch, params) {
    const promises = [];

    if (!areCoursesLoaded(getState())) {
      promises.push(dispatch(loadCourses()));
    }

    // If in Manage mode the dependencies are loaded in the manage module class
    if (params.pathname.indexOf('/manage') >= 0) {
      return Promise.all(promises);
    }

    // Else, load the dependencies normally
    const path = params.pathname.replace(/\/course\/[0-9]+\/module\//gi, '');
    const moduleCode = path.substr(0, path.indexOf('/'));

    if (!areAssignmentsLoaded(getState())) {
      promises.push(dispatch(loadAssignments(moduleCode)));
    }

    return Promise.all(promises);
  }

  render() {
    const { moduleCode } = this.props;
    const courses = this.props.courses[this.props.courseId] || { modules: {} };
    const module = courses.modules[this.props.moduleCode];
    const items = [
      { key: 'info', to: '/course/' + module.course_id + '/module/' + moduleCode + '/info', title: 'Module Information' },
      { key: 'lectures', to: '/course/' + module.course_id + '/module/' + moduleCode + '/lectures', title: 'Lectures' },
      { key: 'assignments', to: '/course/' + module.course_id + '/module/' + moduleCode + '/assignments', title: 'Assignments' },
      // { key: 'materials', to: '/course/' + module.course_id + '/module/' + moduleCode + '/materials', title: 'Materials' },
      // { key: 'grades', to: '/course/' + module.course_id + '/module/' + moduleCode + '/grades', title: 'Grades' }
    ];

    if (module && (module.role.write || module.role.admin)) {
      items.push({ key: 'manage', to: '/manage/course/' + module.course_id + '/module/' + module.code, title: 'Teacher Area' });
    }

    const styles = require('./Module.scss');
    return (
      <Grid className={'appContent ' + styles.modulePage}>
        <Sidebar {...{items: items}} />
        <Col sm={10} className={styles.moduleContainer}>{this.props.children}</Col>
      </Grid>
    );
  }
}

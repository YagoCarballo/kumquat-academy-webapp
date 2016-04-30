/**
 * Created by yagocarballo on 10/02/2016.
 */
import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { Panel } from 'react-bootstrap';
import { Tabs } from '../../../components';

import { isLoaded as areAssignmentsLoaded, loadAssignments } from 'redux/modules/assignments';
import { isLoaded as areLecturesLoaded, loadLectures } from 'redux/modules/lectures';
import { isLoaded as areStudentsLoaded, loadStudents } from 'redux/modules/students';

@connect(state => ({
  moduleCode: state.router.params.moduleCode,
  courseId: state.router.params.courseId
}), null)
export default class ManageModule extends Component {
  static propTypes = {
    moduleCode: PropTypes.string.isRequired,
    courseId: PropTypes.string,
    children: PropTypes.object
  };

  static fetchData(getState, dispatch, params) {
    const path = params.pathname.replace(/(\/manage)?(\/course\/[0-9]+)?\/module\//gi, '');
    const moduleCode = path.substr(0, path.indexOf('/'));
    const promises = [];

    if (!areAssignmentsLoaded(getState())) {
      promises.push(dispatch(loadAssignments(moduleCode)));
    }

    if (!areStudentsLoaded(getState())) {
      promises.push(dispatch(loadStudents(moduleCode)));
    }

    if (!areLecturesLoaded(getState())) {
      promises.push(dispatch(loadLectures(moduleCode)));
    }

    return Promise.all(promises);
  }

  render = () => {
    const styles = require('./ManageModule.scss');
    const { moduleCode, courseId } = this.props;
    const withCourse = (courseId ? ('/course/' + courseId) : '');
    const items = [
      { key: 0, title: 'Info', to: '/manage' + withCourse + '/module/' + moduleCode, index: true },
      { key: 1, title: 'Assignments', to: '/manage' + withCourse + '/module/' + moduleCode + '/assignments' },
      { key: 2, title: 'Students', to: '/manage' + withCourse + '/module/' + moduleCode + '/students' },
      { key: 3, title: 'Lectures', to: '/manage' + withCourse + '/module/' + moduleCode + '/lectures' },
      // { key: 4, title: 'Announcements', to: '/manage' + withCourse + '/module/' + moduleCode + '/announcements' }
    ];

    return (
      <div className={styles.manageModulePage + ' container'}>
        <Tabs items={items} />
        <Panel className={styles.manageModuleContent}>
          {this.props.children}
        </Panel>
      </div>
    );
  }
}

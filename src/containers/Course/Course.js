/**
 * Created by yagocarballo on 15/01/2015.
 */
import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-bootstrap';
import {Sidebar} from '../../components';

import { isLoaded as areCoursesLoaded, loadCourses } from 'redux/modules/courses';
import { isLoaded as areClassesLoaded, loadClasses } from 'redux/modules/classes';

@connect(state => ({
  user: state.auth.user,
  courseId: state.router.params.courseId,
  courses: state.courses.list,
}), null)
export default class Course extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    courseId: PropTypes.string.isRequired,
    courses: PropTypes.object.isRequired,
    children: PropTypes.object,
  };

  static fetchData(getState, dispatch, params) {
    const promises = [];

    if (!areCoursesLoaded(getState())) {
      promises.push(dispatch(loadCourses()));
    }

    if (!areClassesLoaded(getState())) {
      const path = params.pathname.replace('/course/', '');
      const courseId = Number(path.substr(0, path.indexOf('/')));
      promises.push(dispatch(loadClasses(courseId)));
    }

    return Promise.all(promises);
  }

  render() {
    const course = this.props.courses[this.props.courseId];
    const items = [
      { key: 'info', to: '/course/' + course.id + '/info', title: 'Details' },
      // { key: 'modules', to: '/manage/course/' + course.id + '/modules', title: 'Modules' },
      { key: 'classes', to: '/course/' + course.id + '/classes', title: 'Classes' },
      // { key: 'announcements', to: '/course/' + course.id + '/announcements', title: 'Announcements' }
    ];

    const styles = require('./Course.scss');
    return (
      <Grid className={'appContent ' + styles.coursePage}>
        <Row>
          <Sidebar {...{items: items}} />
          <Col sm={10} className={styles.contentCol}>
            {this.props.children}
          </Col>
        </Row>
      </Grid>
    );
  }
}

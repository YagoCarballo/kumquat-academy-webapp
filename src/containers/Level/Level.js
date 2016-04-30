/**
 * Created by yagocarballo on 28/12/2015.
 */
import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { Row, Col, Breadcrumb, BreadcrumbItem } from 'react-bootstrap';
import { Sidebar } from '../../components';

import { isLoaded as areCoursesLoaded, loadCourses } from 'redux/modules/courses';
import { isLoaded as areClassesLoaded, loadClasses } from 'redux/modules/classes';

@connect(state => ({
  user: state.auth.user,
  courseId: state.router.params.courseId,
  classId: state.router.params.classId,
  level: state.router.params.level,
  courses: state.courses.list,
}), null)
export default class Level extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    courseId: PropTypes.string.isRequired,
    classId: PropTypes.string.isRequired,
    level: PropTypes.string.isRequired,
    courses: PropTypes.object,
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
    const { courseId, classId, level } = this.props;
    const items = [
      { key: 'info', to: '/course/' + courseId + '/class/' + classId + '/level/' + level + '/info', title: 'Level Information' },
      { key: 'modules', to: '/course/' + courseId + '/class/' + classId + '/level/' + level + '/modules', title: 'Modules' },
      // { key: 'students', to: '/course/' + courseId + '/class/' + classId + '/level/' + level + '/students', title: 'Students' },
      // { key: 'announcements', to: '/course/' + courseId + '/class/' + classId + '/level/' + level + '/announcements', title: 'Announcements' }
    ];

    const styles = require('./Level.scss');
    return (
      <div className={'appContent ' + styles.levelPage}>
        <Row className={styles.breadcrumbRow}>
          <Breadcrumb className={styles.breadcrumb}>
            <BreadcrumbItem href={'/' }>Home</BreadcrumbItem>
            <BreadcrumbItem href={'/course/' + courseId + '/info' }>BSc Applied Computing</BreadcrumbItem>
            <BreadcrumbItem href={'/course/' + courseId + '/class/' + classId + '/info' }>Class of 2015</BreadcrumbItem>
            <BreadcrumbItem href={'/course/' + courseId + '/class/' + classId + '/level/' + level + '/info' }>{ 'Level ' + level }</BreadcrumbItem>
            <BreadcrumbItem active>Modules</BreadcrumbItem>
          </Breadcrumb>
        </Row>
        <Row>
          <Sidebar {...{items: items}} />
          <Col sm={10} className={styles.levelContainer}>
            {this.props.children}
          </Col>
        </Row>
      </div>
    );
  }
}

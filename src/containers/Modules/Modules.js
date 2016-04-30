/**
 * Created by yagocarballo on 28/12/2015.
 */
import React, {Component, PropTypes} from 'react';
import DocumentMeta from 'react-document-meta';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import { Input, Well, Grid, Row, Col } from 'react-bootstrap';
import { ModuleBox } from '../../components';

import { isLoaded as areCoursesLoaded, loadCourses } from 'redux/modules/courses';

@connect(
  state => ({
    user: state.auth.user,
    courses: state.courses.list,
    courseId: state.router.params.courseId,
  }),
  { pushState })
export default class Modules extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    courses: PropTypes.object.isRequired,
    courseId: PropTypes.string,
    pushState: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedCourse: (props.courseId || -1),
    };
  }

  static fetchData(getState, dispatch) {
    const promises = [];

    if (!areCoursesLoaded(getState())) {
      promises.push(dispatch(loadCourses()));
    }

    return Promise.all(promises);
  }

  courseSelected = (event) => {
    this.setState({ selectedCourse: event.target.value });
    this.props.pushState(null, '/course/' + event.target.value + '/modules');
  };

  render() {
    const styles = require('./Modules.scss');
    let { selectedCourse } = this.state;
    const { courses, courseId } = this.props;
    const modulesList = [];
    const coursesList = [
      <option key={0} value={0}>{'- Select a course -'}</option>
    ];
    if (selectedCourse === -1) {
      selectedCourse = (courseId || -1);
    }

    for (const key in courses) {
      if (courses.hasOwnProperty(key)) {
        const course = courses[key];
        const currentHasModules = Object.keys(course.modules).length > 0;
        if (currentHasModules) {
          coursesList.push(<option key={course.id} value={course.id}>{course.title}</option>);
          if (selectedCourse === -1) {
            selectedCourse = course.id;
          } else if (selectedCourse !== -1) {
            const selectedHasNoModules = Object.keys(courses[selectedCourse].modules || {}).length <= 0;
            if (selectedHasNoModules && currentHasModules) {
              selectedCourse = course.id;
            }
          }
        }
      }
    }

    const course = courses[selectedCourse] || { missing: true, modules: {} };
    for (const key in course.modules) {
      if (course.modules.hasOwnProperty(key)) {
        const module = course.modules[key];
        modulesList.push(
          <Col key={key} xs={12} sm={4} md={3} lg={3} className={styles.moduleCol}>
            <ModuleBox {...{
              id: module.code,
              to: '/course/' + module.course_id + '/module/' + module.code + '/info',
              name: module.title,
              year: module.year,
              color: module.color,
              icon: module.icon
            }} />
          </Col>
        );
      }
    }


    if (course.missing) {
      modulesList.push(<Well key="error" className={styles.noModulesAlert}>Please select a course.</Well>);
    } else if (modulesList.length <= 0) {
      modulesList.push(<Well key="error" className={styles.noModulesAlert}>No Modules Available!</Well>);
    }

    return (
      <Grid className={'appContent ' + styles.modulesPage}>
        <DocumentMeta title="Kumquat Academy: Modules"/>
        <Row className={styles.filterRow}>
          <Col xs={12} className={styles.filterBar}>
            <Input type="select" defaultValue={selectedCourse} onChange={::this.courseSelected}>
              {coursesList}
            </Input>
          </Col>
        </Row>
        <Row className={styles.contentRow}>
          <Col sm={12} className={styles.contentCol}>
            <div className={styles.modulesAreaContainer}>
              <Row>
                {modulesList}
              </Row>
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }
}

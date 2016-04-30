/**
 * Created by yagocarballo on 28/12/2015.
 */
import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { CourseBox, NewCourseBox } from '../../../components';

@connect(
  state => ({
    courses: state.courses.list,
  }),
  null)
export default class ManageCourses extends Component {
  static propTypes = {
    courses: PropTypes.object.isRequired,
  };

  render = () => {
    const styles = require('./ManageCourses.scss');
    const courses = [];

    for (const key in this.props.courses) {
      if (this.props.courses.hasOwnProperty(key)) {
        const course = this.props.courses[key];
        courses.push(<CourseBox key={course.id} id={course.id + ''} title={course.title} description={course.description} />);
      }
    }
    courses.push(<NewCourseBox key="new-course" />);

    return (
      <div className={styles.manageCoursesPage + ' container'}>
        {courses}
      </div>
    );
  }
}

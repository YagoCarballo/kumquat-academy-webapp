/**
 * Created by yagocarballo on 17/01/2015.
 */
import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';

@connect(state => ({
  courseId: state.router.params.courseId,
}), null)
export default class CourseInfo extends Component {
  static propTypes = {
    courseId: PropTypes.string,
  };

  render() {
    const styles = require('./CourseInfo.scss');
    return (
      <div className={'container ' + styles.courseInfoPage}></div>
    );
  }
}

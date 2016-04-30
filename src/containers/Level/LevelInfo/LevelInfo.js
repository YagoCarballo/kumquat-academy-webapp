/**
 * Created by yagocarballo on 04/02/2015.
 */
import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';

@connect(state => ({
  courseId: state.router.params.courseId,
  classId: state.router.params.classId,
  level: state.router.params.level
}), null)
export default class LevelInfo extends Component {
  static propTypes = {
    courseId: PropTypes.string.isRequired,
    classId: PropTypes.string.isRequired,
    level: PropTypes.string.isRequired
  };

  render() {
    const styles = require('./LevelInfo.scss');
    return (
      <div className={styles.levelInfoPage + ' container'}>
      </div>
    );
  }
}

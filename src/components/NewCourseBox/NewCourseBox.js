/**
 * Created by yagocarballo on 28/12/2015.
 */
import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import { editStart } from 'redux/modules/courses';

@connect(null, {pushState, editStart})
export default class NewCourseBox extends Component {
  static propTypes = {
    pushState: PropTypes.func.isRequired,
    editStart: PropTypes.func.isRequired,
  };

  onClick() {
    this.props.editStart('new');
    this.props.pushState(null, '/course/new');
  }

  render() {
    const styles = require('./NewCourseBox.scss');
    return (
      <div className={'well ' + styles.newCourseBox} onClick={::this.onClick}>
        <div className={styles.newCourseIconContainer}>
          <i className={'fa fa-plus ' + styles.newCourseIcon}/>
        </div>
      </div>
    );
  }
}

/**
 * Created by yagocarballo on 22/01/2015.
 */
import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import { editStart } from 'redux/modules/classes';

@connect(null, {pushState, editStart})
export default class NewClassSticker extends Component {
  static propTypes = {
    courseId: PropTypes.string.isRequired,
    pushState: PropTypes.func.isRequired,
    editStart: PropTypes.func.isRequired,
  };

  onClick() {
    this.props.editStart('new');
    this.props.pushState(null, '/course/' + this.props.courseId + '/class/new');
  }

  render() {
    const styles = require('./NewClassSticker.scss');
    return (
      <div className={'well ' + styles.newClassSticker} onClick={::this.onClick}>
        <div className={styles.newClassIconContainer}>
          <i className={'fa fa-plus ' + styles.newClassIcon}/>
        </div>
      </div>
    );
  }
}

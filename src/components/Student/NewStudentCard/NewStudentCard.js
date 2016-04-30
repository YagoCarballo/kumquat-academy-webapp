/**
 * Created by yagocarballo on 21/02/2015.
 */
import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';

@connect(null, {pushState})
export default class NewStudentCard extends Component {
  static propTypes = {
    pushState: PropTypes.func.isRequired,
    url: PropTypes.string.isRequired,
    onClick: PropTypes.func
  };

  onClick() {
    if (this.props.onClick) {
      this.props.onClick();
    } else {
      this.props.pushState(null, this.props.url);
    }
  }

  render() {
    const styles = require('./NewStudentCard.scss');
    return (
      <div className={styles.studentCardComponent} onClick={::this.onClick}>
        <div className={styles.studentAvatar}>
          <i className={'fa fa-user-plus ' + styles.newStudentIcon}/>
        </div>
        <div className={styles.fullName}>
          <span className={styles.lastName}>{ 'Add Student' }</span>
        </div>
      </div>
    );
  }
}

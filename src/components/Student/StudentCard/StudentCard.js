/**
 * Created by yagocarballo on 21/02/2015.
 */
import React, {Component, PropTypes} from 'react';

export default class StudentCard extends Component {
  static propTypes = {
    avatar: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    previewMode: PropTypes.bool,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func
  };

  onEdit() {
    if (this.props.onEdit) {
      this.props.onEdit();
    }
  }

  onDelete() {
    if (this.props.onDelete) {
      this.props.onDelete();
    }
  }

  render() {
    const styles = require('./StudentCard.scss');
    const { previewMode } = this.props;
    const student = {
      avatar: this.props.avatar,
      firstName: this.props.firstName,
      lastName: this.props.lastName
    };
    const hoverAnimationStyle = (previewMode ? '' : styles.normalMode);
    return (
      <div className={styles.studentCardComponent + ' ' + hoverAnimationStyle}>
        <div className={styles.studentAvatar}>
          <img src={student.avatar} />
        </div>
        <div className={styles.fullName}>
          <b className={styles.firstName}>{ (student.firstName || ' ') + ' '}</b>
          <span className={styles.lastName}>{ (student.lastName || ' ') }</span>
        </div>
        { !previewMode &&
          <div className={styles.actionsBar}>
            <i className={'fa fa-trash ' + styles.actionButton + ' ' + styles.deleteButton} onClick={::this.onDelete} />
            <i className={'fa fa-pencil-square-o ' + styles.actionButton} onClick={::this.onEdit} />
          </div>
        }
      </div>
    );
  }
}

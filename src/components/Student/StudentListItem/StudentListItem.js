/**
 * Created by yagocarballo on 21/02/2015.
 */
import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { ListGroupItem } from 'react-bootstrap';
import * as assignmentActions from 'redux/modules/assignments';

@connect(null, { ...assignmentActions })
export default class StudentListItem extends Component {
  static propTypes = {
    avatar: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    submission: PropTypes.object,

    moduleCode: PropTypes.string.isRequired,
    assignmentId: PropTypes.number.isRequired,
    studentIndex: PropTypes.number.isRequired,

    // Action Triggers
    grade: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      submission: null,
      grade: 0,
      status: null,
      lastGrade: 0
    };
  }

  saveGrade() {
    const { submission, grade } = this.state;
    const { moduleCode, assignmentId, studentIndex } = this.props;
    this.props.grade(moduleCode, assignmentId, studentIndex, submission.id, grade).then(result => {
      if (result && typeof result.error === 'object') {
        return Promise.reject(result.error);
      }
      this.setState({
        submission: null,
        status: 'Graded',
        lastGrade: grade
      });
    });
  }

  gradeUpdated(event) {
    this.setState({
      grade: event.target.valueAsNumber
    });
  }

  render() {
    const styles = require('./StudentListItem.scss');
    const { submission } = this.props;
    const student = {
      avatar: (this.props.avatar ? '/api/api/v1/attachment/' + this.props.avatar : '/default_avatar.svg'),
      firstName: this.props.firstName,
      lastName: this.props.lastName
    };
    const submissionState = {
      status: 'Waiting',
      statusColor: 'rgba(238, 0, 23, 0.76)',
      submitted: false,
      graded: false,
      grade: 0,
      comments: '',
      attachment: null
    };
    if (submission !== null) {
      submissionState.status = 'Submitted';
      submissionState.statusColor = 'rgba(0, 179, 238, 0.76)';
      submissionState.submitted = true;
      submissionState.attachment = submission.attachment;
      submissionState.description = submission.description;
      submissionState.grade = submission.grade;

      // Check if it's graded
      if (submission.graded_on !== null) {
        submissionState.status = 'Graded';
        submissionState.statusColor = 'rgba(0, 238, 8, 0.76)';
        submissionState.graded = true;
      }
    }
    if (this.state.status === 'Graded') {
      submissionState.status = 'Graded';
      submissionState.statusColor = 'rgba(0, 238, 8, 0.76)';
      submissionState.graded = true;
      submissionState.grade = this.state.lastGrade;
    }
    return (
      <ListGroupItem className={styles.studentListItemComponent}>
        <div className={styles.studentAvatar}>
          <img src={student.avatar} />
        </div>
        <div className={styles.fullName}>
          <b className={styles.firstName}>{ (student.firstName || ' ') + ' '}</b>
          <span className={styles.lastName}>{ (student.lastName || ' ') }</span>
        </div>
        <div className={styles.status} style={{ backgroundColor: submissionState.statusColor }}>
          { submissionState.status }
        </div>
        { submissionState.attachment !== null &&
          <a className={styles.attachmentLink} href={'/api/api/v1/attachment/' + submissionState.attachment.url + '/' + submissionState.attachment.name}>
            {submissionState.attachment.name}
          </a>
        }
        <div className={styles.attachments}>
          <p>{submissionState.description || ''}</p>
        </div>
        { submissionState.attachment === null &&
          <div className={styles.attachments + ' ' + styles.noSubmissions}>
            <b>Assignment not yet submitted</b>
          </div>
        }
        { (submissionState.status === 'Submitted' || submissionState.status === 'Graded') &&
          <div className={styles.gradeButton + ' ' + ((this.state.submission !== null) ? styles.open : '')}>
            <i className="fa fa-graduation-cap"
               style={{ display: (submissionState.status === 'Submitted' && (this.state.submission === null) ? 'block' : 'none') }}
               onClick={::this.setState.bind(this, { submission: submission })} />
            <b style={{ display: (submissionState.status === 'Submitted' && (this.state.submission === null) ? 'block' : 'none') }}>Add Grade</b>
            <b className={styles.gradeLabel}
               style={{ display: (submissionState.status === 'Graded' && (this.state.submission === null) ? 'block' : 'none') }}
               onClick={::this.setState.bind(this, { submission: submission })}>
              {submissionState.grade + '%'}
            </b>
            { (this.state.submission !== null) &&
              <div className={styles.gradeForm}>
                <b className={styles.label}>Enter the Grade (%)</b>
                <input className={styles.number}
                       type="number"
                       min={0}
                       max={100}
                       defaultValue={submissionState.grade}
                       onChange={::this.gradeUpdated} />
                <div className={styles.cancelButton} onClick={::this.setState.bind(this, { submission: null })}><span>Cancel</span></div>
                <div className={styles.saveButton} onClick={::this.saveGrade}><span>Save</span></div>
              </div>
            }
          </div>
        }
      </ListGroupItem>
    );
  }
}

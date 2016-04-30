/**
 * Created by yagocarballo on 19/02/2015.
 */
require('datejs');
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { Col, Row, ButtonInput, Input, Panel } from 'react-bootstrap';
import { AddStudentToModule } from '../../../components';
import * as studentActions from 'redux/modules/students';
import studentValidation from './studentValidation';

@connect((state, props) => ({
  initialValues: props.student
}), { ...studentActions })
@reduxForm({
  form: 'form-student',
  fields: [
    'username',
    'email',
    'firstName',
    'lastName',
    'dateOfBirth',
    'matricDate',
    'matricNumber',
    'avatarId'
  ],
  validate: studentValidation
})
export default class StudentForm extends Component {
  static propTypes = {
    moduleCode: PropTypes.string.isRequired,
    student: PropTypes.object.isRequired,
    onClose: PropTypes.func,

    // Action Triggers
    create: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
    editStart: PropTypes.func.isRequired,
    editStop: PropTypes.func.isRequired,

    // Redux Form
    resetForm: PropTypes.func.isRequired,
    fields: PropTypes.object.isRequired,
    invalid: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired
  };

  saveStudent(event) {
    event.preventDefault();
    const { moduleCode, student: { id } } = this.props;
    const action = (id === 'new') ? this.props.create : this.props.update;
    action(moduleCode, { ...this.props.values, id: id }).then(result => {
      if (result && typeof result.error === 'object') {
        return Promise.reject(result.error);
      }
      this.props.onClose(event);
    });
  }

  startEditing() {
    const { moduleCode, student: { id } } = this.props;
    this.props.editStart(moduleCode, (id || 'new'));
  }

  render() {
    const styles = require('./StudentForm.scss');
    const {
      onClose, moduleCode,
      fields: { username, email, firstName, lastName, dateOfBirth, matricDate, matricNumber, avatarId },
      invalid, pristine, submitting,
      student: { id }
      } = this.props;
    const isNew = (id === 'new');
    const validation = {
      username: (username.error && username.touched) ? 'error' : null,
      email: (email.error && email.touched) ? 'error' : null,
      firstName: (firstName.error && firstName.touched) ? 'error' : null,
      lastName: (lastName.error && lastName.touched) ? 'error' : null,
      dateOfBirth: (dateOfBirth.error && dateOfBirth.touched) ? 'error' : null,
      matricDate: (matricDate.error && matricDate.touched) ? 'error' : null
    };

    return (
      <div className={styles.studentFormContainer}>
        { isNew &&
          <Row className={styles.middleMessage}>
            <span>Select an existent student</span>
          </Row>
        }
        { isNew &&
          <Row>
            <AddStudentToModule moduleCode={moduleCode} onClose={onClose} />
          </Row>
        }
        { isNew &&
          <Row className={styles.middleMessage}>
            <span>Or Create a new student</span>
          </Row>
        }
        <Row>
          <Panel>
            <form onSubmit={::this.saveStudent} className="form-horizontal" className={styles.studentForm}>
              <Input bsStyle={validation.username}
                     type="text"
                     label="Username"
                     labelClassName="col-sm-3"
                     wrapperClassName="col-sm-9"
                     placeholder="Enter the student username."
                     help={ (username.error && username.touched) ? username.error : '' }
                     hasFeedback
                {...username} />
              <Input bsStyle={validation.email}
                     type="email"
                     label="Email"
                     labelClassName="col-sm-3"
                     wrapperClassName="col-sm-9"
                     placeholder="Enter the student email."
                     help={ (email.error && email.touched) ? email.error : '' }
                     hasFeedback
                {...email} />
              <Input bsStyle={validation.firstName}
                     type="text"
                     label="First Name"
                     labelClassName="col-sm-3"
                     wrapperClassName="col-sm-9"
                     placeholder="Enter the student first name."
                     help={ (firstName.error && firstName.touched) ? firstName.error : '' }
                     hasFeedback
                {...firstName} />
              <Input bsStyle={validation.lastName}
                     type="text"
                     label="Last Name"
                     labelClassName="col-sm-3"
                     wrapperClassName="col-sm-9"
                     placeholder="Enter the student last name."
                     help={ (lastName.error && lastName.touched) ? lastName.error : '' }
                     hasFeedback
                {...lastName} />
              <Input bsStyle={validation.dateOfBirth}
                     type="date"
                     label="Date of Birth"
                     labelClassName="col-sm-3"
                     wrapperClassName="col-sm-9"
                     help={ (dateOfBirth.error && dateOfBirth.touched) ? dateOfBirth.error : '' }
                     hasFeedback
                {...dateOfBirth} />
              <Input bsStyle={validation.matricDate}
                     type="date"
                     label="Matriculation Date"
                     labelClassName="col-sm-3"
                     wrapperClassName="col-sm-9"
                     help={ (matricDate.error && matricDate.touched) ? matricDate.error : '' }
                     hasFeedback
                {...matricDate} />
              <Input bsStyle={validation.matricNumber}
                     type="text"
                     label="Matriculation Number"
                     labelClassName="col-sm-3"
                     wrapperClassName="col-sm-9"
                     placeholder="Enter the student matriculation number."
                {...matricNumber} />
              <input type="hidden" {...avatarId} />
              <Row>
                <Col sm={6}>
                  <ButtonInput type="button" className="form-control" onClick={onClose}>Cancel</ButtonInput>
                </Col>
                <Col sm={6}>
                  <ButtonInput type="submit"
                               className="form-control"
                               disabled={pristine || invalid || submitting}>
                    Save Student
                  </ButtonInput>
                </Col>
              </Row>
            </form>
          </Panel>
        </Row>
      </div>
    );
  }
}

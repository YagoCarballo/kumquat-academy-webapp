/**
 * Created by yagocarballo on 17/01/2015.
 */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { Popover, Input, ButtonInput, OverlayTrigger } from 'react-bootstrap';
import * as levelActions from 'redux/modules/levels';
import levelValidation from './levelValidation';

@connect((state, props) => ({
  form: 'add-level-to-course(' + props.courseId + ')-class(' + props.classId + ')',
  fields: [
    'level',
    'start',
    'end',
  ],
}), { ...levelActions })
@reduxForm(props => ({
  form: props.form,
  fields: props.fields,
  validate: levelValidation
}))
export default class AddLevelForm extends Component {
  static propTypes = {
    courseId: PropTypes.string.isRequired,
    classId: PropTypes.string.isRequired,

    // Action Triggers
    create: PropTypes.func.isRequired,
    editStart: PropTypes.func.isRequired,
    editStop: PropTypes.func.isRequired,

    // Redux Form
    resetForm: PropTypes.func.isRequired,
    fields: PropTypes.object.isRequired,
    invalid: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
  };

  addLevel(event) {
    event.preventDefault();
    const {courseId, classId, values} = this.props;
    this.props.editStop('new', classId, courseId);
    this.setState({ loading: true });

    // Create or Update course
    this.props.create(values, courseId, classId).then(result => {
      this.setState({ loading: false });
      if (result && typeof result.error === 'object') {
        return Promise.reject(result.error);
      }
      this.props.resetForm(event);
    });
  }

  startEditing() {
    this.props.editStart('new', this.props.classId, this.props.courseId);
  }


  render() {
    const {
      fields: { level, start, end, },
      invalid, pristine, submitting,
    } = this.props;

    const styles = require('./AddLevelForm.scss');
    const popover = (
      <Popover className={styles.addLevelPopover} id="add-level" placement="top" title="Add Level">
        <form onSubmit={::this.addLevel}>
          <Input name="level"
                 type="number"
                 min={1}
                 label="Level"
                 help={ (level.error && level.touched) ? level.error : '' }
                 placeholder="Enter Level" {...level} />
          <Input name="start"
                 type="date"
                 label="Start"
                 help={ (start.error && start.touched) ? start.error : '' }
                 placeholder="Enter the Start Date" {...start} />
          <Input name="end"
                 type="date"
                 label="End"
                 help={ (end.error && end.touched) ? end.error : '' }
                 placeholder="Enter the End Date" {...end} />
          <ButtonInput bsStyle="primary"
                       type="submit"
                       className={'form-control ' + styles.saveButton}
                       value="Add Level"
                       disabled={pristine || invalid || submitting} />
        </form>
      </Popover>
    );

    return (
      <OverlayTrigger trigger="click" rootClose placement="bottom" onClick={::this.startEditing} overlay={popover}>
        <i className="fa fa-plus" />
      </OverlayTrigger>
    );
  }
}

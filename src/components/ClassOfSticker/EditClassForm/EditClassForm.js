/**
 * Created by yagocarballo on 17/01/2015.
 */
import React, { Component, PropTypes, ReactDOM } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { Popover, Input, ButtonInput, OverlayTrigger, Tooltip, ProgressBar } from 'react-bootstrap';
import * as classActions from 'redux/modules/classes';
import classValidation from './classValidation';

@connect((state, props) => ({
  initialValues: (state.classes.list[props.courseId][props.classId] || {}),
  form: 'edit-course(' + props.courseId + ')-class(' + props.classId + ')',
  fields: [
    'title',
    'start',
    'end',
  ],
}), { ...classActions })
@reduxForm(props => ({
  form: props.form,
  fields: props.fields,
  validate: classValidation,
}))
export default class EditClassForm extends Component {
  static propTypes = {
    className: PropTypes.string.isRequired,
    courseId: PropTypes.string.isRequired,
    classId: PropTypes.string.isRequired,

    // Action Triggers
    create: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
    editStart: PropTypes.func.isRequired,
    editStop: PropTypes.func.isRequired,

    // Redux Form
    fields: PropTypes.object.isRequired,
    values: PropTypes.object.isRequired,
    invalid: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  saveClass(event) {
    event.preventDefault();
    const {courseId, classId, values} = this.props;
    this.props.editStop(classId, courseId);
    this.setState({ loading: true });

    // Create or Update course
    this.props.update(courseId, classId, values).then(result => {
      this.setState({ loading: false });
      if (result && typeof result.error === 'object') {
        return Promise.reject(result.error);
      }
    });
  }

  startEditing() {
    this.props.editStart(this.props.classId, this.props.courseId);
  }

  render() {
    const {
      fields: { title, start, end, },
      invalid, pristine, submitting,
    } = this.props;

    const styles = require('./EditClassForm.scss');
    let submitButton;
    if (!this.state.loading) {
      submitButton = (<ButtonInput bsStyle="primary"
                                   type="submit"
                                   className={'form-control ' + styles.saveButton}
                                   value="Save Changes"
                                   disabled={pristine || invalid || submitting} />);
    } else {
      submitButton = <ProgressBar active now={100} className={'form-control ' + styles.progress} />;
    }

    const tooltip = <Tooltip id="edit">Edit Class</Tooltip>;
    const popover = (
      <Popover className={styles.editClassFormPopover} id="edit-class" placement="top" title={ 'Edit Class' }>
        <form onSubmit={::this.saveClass}>
          <Input name="title"
                 type="text"
                 label="Class Of "
                 help={ (title.error && title.touched) ? title.error : '' }
                 placeholder="Enter the title" {...title} />
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
          {submitButton}
        </form>
      </Popover>
    );

    const popoverProps = {
      container: this,
      trigger: 'click',
      placement: 'right',
      overlay: popover,
      target: () => ReactDOM.findDOMNode(this.refs.target)
    };

    const tooltipProps = {
      container: this,
      placement: 'top',
      overlay: tooltip,
      trigger: [ 'hover', 'focus' ],
      target: () => ReactDOM.findDOMNode(this.refs.target)
    };

    return (
      <div>
        <OverlayTrigger {...tooltipProps}>
          <b className={this.props.className}>
            <OverlayTrigger {...popoverProps} onClick={::this.startEditing} rootClose>
              <span className={styles.clickArea}><i className="fa fa-pencil-square-o" /></span>
            </OverlayTrigger>
          </b>
        </OverlayTrigger>
      </div>
    );
  }
}

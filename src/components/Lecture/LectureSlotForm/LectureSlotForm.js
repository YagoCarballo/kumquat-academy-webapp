/**
 * Created by yagocarballo on 01/03/2015.
 */
import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { Row, Col, Modal, ButtonInput, Input } from 'react-bootstrap';
import lectureSlotValidation from './lectureSlotValidation';
import * as lectureActions from 'redux/modules/lectures';

@connect((state, props) => ({
  initialValues: props.lectureSlot,
  form: 'form-lecture-slot-' + props.lectureSlot.id,
  fields: [
    'type',
    'location',
    'start',
    'end'
  ]
}), { ...lectureActions })
@reduxForm(props => ({
  form: props.form,
  fields: props.fields,
  validate: lectureSlotValidation
}))
export default class LectureSlotForm extends Component {
  static propTypes = {
    lectureSlot: PropTypes.object.isRequired,
    moduleCode: PropTypes.string.isRequired,
    weekDay: PropTypes.string.isRequired,
    baseDate: PropTypes.string.isRequired,

    // Custom Styles
    containerClass: PropTypes.string,
    buttonClass: PropTypes.string,
    editMode: PropTypes.bool,

    // Action Triggers
    createSlot: PropTypes.func.isRequired,
    updateSlot: PropTypes.func.isRequired,
    editStart: PropTypes.func.isRequired,
    editStop: PropTypes.func.isRequired,

    // Redux Form
    resetForm: PropTypes.func.isRequired,
    fields: PropTypes.object.isRequired,
    invalid: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    };
  }

  onSave(event) {
    event.preventDefault();
    const { moduleCode, weekDay, baseDate, lectureSlot: { id } } = this.props;
    const action = (id === 'new') ? this.props.createSlot : this.props.updateSlot;
    action(moduleCode, weekDay, baseDate, { ...this.props.values, id: id }).then(result => {
      if (result && typeof result.error === 'object') {
        return Promise.reject(result.error);
      }
      this.close(event);
    });
  }

  close() {
    const { moduleCode, lectureSlot: { id } } = this.props;
    this.props.editStop(moduleCode, (id || 'new'));
    this.setState({
      showModal: false
    });
  }

  open() {
    const { moduleCode, lectureSlot: { id } } = this.props;
    this.props.editStart(moduleCode, (id || 'new'));
    this.setState({
      showModal: true
    });
  }

  render() {
    const styles = require('./LectureSlotForm.scss');
    const {
      editMode, buttonClass, containerClass,
      fields: { type, location, start, end },
      invalid, pristine, submitting
    } = this.props;
    const validation = {
      type: (type.error && type.touched) ? 'error' : null,
      location: (location.error && location.touched) ? 'error' : null,
      start: (start.error && start.touched) ? 'error' : null,
      end: (end.error && end.touched) ? 'end' : null
    };
    return (
      <div className={styles.lectureSlotFormComponent + ' ' + containerClass}>
        { editMode &&
          <i className={'fa fa-pencil-square-o ' + buttonClass} onClick={::this.open} />
        }
        { !editMode &&
          <ButtonInput className={buttonClass}
                       type="button"
                       onClick={::this.open}
                       value={'Add Lecture Slot'} />
        }

        <Modal show={this.state.showModal} onHide={::this.close} className={styles.form}>
          <form onSubmit={::this.onSave}>
            <Modal.Header closeButton>
              { editMode &&
                <Modal.Title>Edit Lecture Slot</Modal.Title>
              }
              { !editMode &&
                <Modal.Title>Add Lecture Slot</Modal.Title>
              }
            </Modal.Header>
            <Modal.Body>
              <div className="form-horizontal">
                <Input bsStyle={validation.type}
                       type="text"
                       label="Lecture Type"
                       labelClassName="col-sm-3"
                       wrapperClassName="col-sm-9"
                       placeholder="Enter the type (Lecture, Lab, Reading, ...)"
                       help={ (type.error && type.touched) ? type.error : '' }
                       hasFeedback
                  {...type} />
                <Input bsStyle={validation.location}
                       type="text"
                       label="Location"
                       labelClassName="col-sm-3"
                       wrapperClassName="col-sm-9"
                       placeholder="Enter the location of the Lecture."
                       help={ (location.error && location.touched) ? location.error : '' }
                       hasFeedback
                  {...location} />
                <Input bsStyle={validation.start}
                       type="time"
                       label="Start"
                       labelClassName="col-sm-3"
                       wrapperClassName="col-sm-9"
                       placeholder="Enter the time the lecture starts"
                       help={ (start.error && start.touched) ? start.error : '' }
                       hasFeedback
                  {...start} />
                <Input bsStyle={validation.end}
                       type="time"
                       label="End"
                       labelClassName="col-sm-3"
                       wrapperClassName="col-sm-9"
                       placeholder="Enter the time the lecture ends"
                       help={ (end.error && end.touched) ? end.error : '' }
                       hasFeedback
                  {...end} />
                </div>
            </Modal.Body>
            <Modal.Footer>
              <Row>
                <Col sm={6}>
                  <ButtonInput bsStyle="danger"
                               className="form-control"
                               type="button"
                               onClick={::this.close}
                               value={'Close'} />
                </Col>
                <Col sm={6}>
                  <ButtonInput type="submit"
                               className="form-control"
                               value={'Save Slot'}
                               disabled={pristine || invalid || submitting} />
                </Col>
              </Row>
            </Modal.Footer>
          </form>
        </Modal>
      </div>
    );
  }
}

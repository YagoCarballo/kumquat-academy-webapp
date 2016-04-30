/**
 * Created by yagocarballo on 01/03/2015.
 */
import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { Row, Col, Modal, ButtonInput, Input, FormControls } from 'react-bootstrap';
import { UploadAttachment } from '../../../components';
import TinyMCE from 'react-tinymce';
import * as lectureActions from 'redux/modules/lectures';
import lectureValidation from './lectureValidation';

@connect((state, props) => ({
  initialValues: props.lecture,
  form: 'form-lecture-' + props.weekNumber + '-' + props.weekDay + '-' + props.lecture.id,
  fields: [
    'topic',
    'location',
    'start',
    'end',
    'description',
    'canceled'
  ]
}), { ...lectureActions })
@reduxForm(props => ({
  form: props.form,
  fields: props.fields,
  validate: lectureValidation
}))
export default class LectureForm extends Component {
  static propTypes = {
    lecture: PropTypes.object.isRequired,
    moduleCode: PropTypes.string.isRequired,
    weekNumber: PropTypes.number.isRequired,
    weekDay: PropTypes.string.isRequired,
    template: PropTypes.bool,
    onClose: PropTypes.func,

    // Custom Styles
    containerClass: PropTypes.string,
    buttonClass: PropTypes.string,

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

  constructor(props) {
    super(props);
    this.state = {
      tinyMCEConf: {
        inline: false,
        selector: 'textarea',
        min_height: 300,
        browser_spellcheck: true,
        plugins: [
          'advlist autolink lists link image charmap print preview anchor',
          'searchreplace visualblocks code fullscreen emoticons',
          'insertdatetime media table contextmenu paste'
        ],
        skin_url: '/tinymce-light',
        theme: 'modern',
        toolbar: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | ' +
        'bullist numlist outdent indent | link image'
      }
    };
  }

  onSave(event) {
    event.preventDefault();
    const { moduleCode, weekNumber, weekDay, template, lecture: { id, lectureSlotId } } = this.props;
    const action = (id === 'new' || template) ? this.props.create : this.props.update;
    action(moduleCode, weekNumber, weekDay, lectureSlotId, { ...this.props.values, id: (template ? 'new' : id) }).then(result => {
      if (result && typeof result.error === 'object') {
        return Promise.reject(result.error);
      }
      this.close(event);
    });
  }

  close() {
    const { moduleCode, lecture: { id } } = this.props;
    this.props.editStop(moduleCode, (id || 'new'));
    this.props.onClose();
  }

  open() {
    const { moduleCode, lecture: { id } } = this.props;
    this.props.editStart(moduleCode, (id || 'new'));
  }

  descriptionChanged(event) {
    this.props.fields.description.onChange({
      value: event.target.getContent(),
      touch: true
    });
  }

  render() {
    const styles = require('./LectureForm.scss');
    const { tinyMCEConf } = this.state;
    const {
      containerClass, lecture, moduleCode,
      fields: { topic, location, start, end, description, canceled },
      invalid, pristine, submitting
    } = this.props;
    const validation = {
      topic: (topic.error && topic.touched) ? 'error' : null,
      location: (location.error && location.touched) ? 'error' : null,
      start: (start.error && start.touched) ? 'error' : null,
      end: (end.error && end.touched) ? 'error' : null,
      description: (description.error && description.touched) ? 'error' : null,
      canceled: (canceled.error && canceled.touched) ? 'error' : null
    };
    const parsedAttachments = {};
    if (lecture.attachments) {
      for (const attachment of lecture.attachments) {
        parsedAttachments[attachment.name] = attachment;
        parsedAttachments[attachment.name].percentage = 100;
      }
    }
    return (
      <div className={styles.lectureFormComponent + ' ' + containerClass}>
        <form onSubmit={::this.onSave}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Lecture</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="form-horizontal">
              <Input bsStyle={validation.topic}
                     type="text"
                     label="Lecture Topic"
                     labelClassName="col-sm-3"
                     wrapperClassName="col-sm-9"
                     placeholder="Enter the topic of this lecture."
                     help={ (topic.error && topic.touched) ? topic.error : '' }
                     hasFeedback
                {...topic} />
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
                     type="datetime-local"
                     label="Start"
                     labelClassName="col-sm-3"
                     wrapperClassName="col-sm-9"
                     placeholder="Enter the time the lecture starts"
                     help={ (start.error && start.touched) ? start.error : '' }
                     hasFeedback
                {...start} />
              <Input bsStyle={validation.end}
                     type="datetime-local"
                     label="End"
                     labelClassName="col-sm-3"
                     wrapperClassName="col-sm-9"
                     placeholder="Enter the time the lecture ends"
                     help={ (end.error && end.touched) ? end.error : '' }
                     hasFeedback
                {...end} />
              <FormControls.Static bsStyle={validation.canceled}
                                   label="Canceled"
                                   labelClassName="col-sm-3"
                                   wrapperClassName="col-sm-9"
                                   placeholder="Cancel this Lecture?"
                                   help={ (canceled.error && canceled.touched) ? canceled.error : '' }
                                   hasFeedback>
                <input type="checkbox" {...canceled} />
                </FormControls.Static>
                <FormControls.Static bsStyle={validation.description}
                                     label="Description"
                                     labelClassName="col-sm-3"
                                     wrapperClassName="col-sm-9"
                                     help={ (description.error && description.touched) ? description.error : '' }
                                     hasFeedback>
                  <TinyMCE onChange={::this.descriptionChanged}
                           content={ lecture.description }
                           config={ tinyMCEConf } />
                </FormControls.Static>
                { lecture.id !== 'new' &&
                  <UploadAttachment id={'/module/' + moduleCode + '/lecture/' + lecture.id}
                                    attachments={parsedAttachments} />
                }
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
                             value={'Save Lecture'}
                             disabled={pristine || invalid || submitting} />
              </Col>
            </Row>
          </Modal.Footer>
        </form>
      </div>
    );
  }
}

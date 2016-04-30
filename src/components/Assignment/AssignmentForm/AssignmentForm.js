/**
 * Created by yagocarballo on 19/02/2015.
 */
require('datejs');
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import TinyMCE from 'react-tinymce';
import { Col, Row, Button, ButtonInput, Input, FormControls } from 'react-bootstrap';
import { UploadAttachment } from '../../../components';
import * as assignmentActions from 'redux/modules/assignments';
import assignmentValidation from './assignmentValidation';

@connect((state, props) => ({
  initialValues: props.assignment
}), { ...assignmentActions })
@reduxForm({
  form: 'form-assignment',
  fields: [
    'title',
    'description',
    'start',
    'end',
    'status',
    'weight'
  ],
  validate: assignmentValidation
})
export default class AssignmentForm extends Component {
  static propTypes = {
    moduleCode: PropTypes.string.isRequired,
    assignment: PropTypes.object.isRequired,
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

  statusEnum = [
    <option key={0}>{'draft'}</option>,
    <option key={1}>{'created'}</option>,
    <option key={2}>{'available'}</option>,
    <option key={3}>{'sent'}</option>,
    <option key={4}>{'graded'}</option>,
    <option key={5}>{'returned'}</option>
  ];

  saveAssignment(event) {
    event.preventDefault();
    const { moduleCode, assignment: { id } } = this.props;
    const action = (id === 'new') ? this.props.create : this.props.update;
    action(moduleCode, { ...this.props.values, id: id }).then(result => {
      if (result && typeof result.error === 'object') {
        return Promise.reject(result.error);
      }
      this.props.onClose(event);
    });
  }

  startEditing() {
    const { moduleCode, assignment: { id } } = this.props;
    this.props.editStart(moduleCode, (id || 'new'));
  }

  descriptionChanged(event) {
    this.props.fields.description.onChange({
      value: event.target.getContent(),
      touch: true
    });
  }

  render() {
    const styles = require('./AssignmentForm.scss');
    const { tinyMCEConf } = this.state;
    const {
      onClose,
      assignment, moduleCode,
      fields: { title, description, start, end, status, weight },
        invalid, pristine, submitting,
      } = this.props;
    const validation = {
      title: (title.error && title.touched) ? 'error' : null,
      description: (description.error && description.touched) ? 'error' : null,
      start: (start.error && start.touched) ? 'error' : null,
      end: (end.error && end.touched) ? 'end' : null,
      status: (status.error && status.touched) ? 'status' : null,
      weight: (weight.error && weight.touched) ? 'weight' : null
    };
    const parsedAttachments = {};
    if (assignment.attachments) {
      for (const attachment of assignment.attachments) {
        parsedAttachments[attachment.name] = attachment;
        parsedAttachments[attachment.name].percentage = 100;
      }
    }
    return (
      <form onSubmit={::this.saveAssignment} className="form-horizontal" className={styles.assignmentForm}>
        <Input bsStyle={validation.title}
               type="text"
               label="Title"
               labelClassName="col-sm-2"
               wrapperClassName="col-sm-10"
               placeholder="Enter the assignment title."
               help={ (title.error && title.touched) ? title.error : '' }
               hasFeedback
          {...title} />
        <Input bsStyle={validation.start}
               type="datetime-local"
               label="Start"
               labelClassName="col-sm-2"
               wrapperClassName="col-sm-10"
               placeholder="Pick the start date of the assignment."
               help={ (start.error && start.touched) ? start.error : '' }
               hasFeedback
          {...start} />
        <Input bsStyle={validation.end}
               type="datetime-local"
               label="End"
               labelClassName="col-sm-2"
               wrapperClassName="col-sm-10"
          {...end} />
        <Input bsStyle={validation.status}
               type="select"
               label="Status"
               labelClassName="col-sm-2"
               wrapperClassName="col-sm-10"
               placeholder="Enter the end date of the assignment."
               help={ (end.error && end.touched) ? end.error : '' }
               hasFeedback
          {...status}>
          {this.statusEnum}
        </Input>
        <Input bsStyle={validation.weight}
               type="number"
               label="Weight"
               labelClassName="col-sm-2"
               wrapperClassName="col-sm-10"
               min={0.00}
               max={1.0}
               step={0.01}
               placeholder="Enter the weight of the assignment (from 0.0 to 1.0)."
               help={ (weight.error && weight.touched) ? weight.error : '' }
               hasFeedback
          {...weight} />
        <FormControls.Static bsStyle={validation.description}
                             label="Description"
                             labelClassName="col-sm-2"
                             wrapperClassName="col-sm-10"
                             help={ (description.error && description.touched) ? description.error : '' }
                             hasFeedback>
          <TinyMCE
            onChange={::this.descriptionChanged}
            content={ assignment.description }
            config={ tinyMCEConf }
          />
        </FormControls.Static>
        { assignment.id !== 'new' &&
          <UploadAttachment id={'/module/' + moduleCode + '/assignment/' + assignment.id}
                            attachments={parsedAttachments} />
        }
        <Row>
          <Col sm={6}>
            <Button className="form-control" onClick={onClose}>Cancel</Button>
          </Col>
          <Col sm={6}>
            <ButtonInput type="submit"
                         className="form-control"
                         disabled={pristine || invalid || submitting}>
              Save Assignment
            </ButtonInput>
          </Col>
        </Row>
      </form>
    );
  }
}

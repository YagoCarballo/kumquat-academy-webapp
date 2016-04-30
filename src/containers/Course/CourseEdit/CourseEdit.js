/**
 * Created by yagocarballo on 28/12/2015.
 */
import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { goBack } from 'redux-router';
import { reduxForm } from 'redux-form';
import courseValidation from './courseValidation';
import { Grid, Row, Col, Input, ButtonInput, ListGroup, ListGroupItem } from 'react-bootstrap';
import * as courseActions from 'redux/modules/courses';

@connect(state => ({
  courseId: state.router.params.courseId,
  saveError: state.courses.saveError,
  initialValues: (state.courses.list[state.router.params.courseId] || {})
}), { ...courseActions, goBack })
@reduxForm({
  form: 'course-edit',
  fields: [
    'title',
    'description'
  ],
  validate: courseValidation
})
export default class CourseEdit extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    courseId: PropTypes.string,

    invalid: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,

    editStop: PropTypes.func.isRequired,
    create: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
    values: PropTypes.object.isRequired,
    saveError: PropTypes.object,

    goBack: PropTypes.func.isRequired,
  };

  saveCourse(event) {
    event.preventDefault();
    const id = this.props.courseId || 'new';
    this.props.editStop(id);

    // Choose the function to use (update or create)
    let save = this.props.update;
    if (id === 'new') {
      save = this.props.create;
    }

    // Create or Update course
    save(id, this.props.values).then(result => {
      if (result && typeof result.error === 'object') {
        return Promise.reject(result.error);
      }
      this.props.goBack();
    });
  }

  cancel() {
    this.props.goBack();
  }

  render() {
    const {
      courseId,
      fields: { title, description, },
      invalid, pristine, submitting,
      saveError: { [courseId || 'new']: saveError },
      } = this.props;

    const validation = {
      title: (title.error && title.touched) ? 'error' : null,
      description: (description.error && description.touched) ? 'error' : null,
    };

    const buttonValue = (courseId ? 'Save Course' : 'Create Course');
    const styles = require('./CourseEdit.scss');
    return (
      <Grid className={'container ' + styles.courseEditPage} fluid>
        <Row>
          <Col xs={12} xsOffset={0} sm={12} smOffset={0} md={8} mdOffset={1} lg={6} lgOffset={3}>
            <br />
            <form onSubmit={::this.saveCourse}>
              <ListGroup>
                {saveError && <ListGroupItem bsStyle="danger">{saveError}</ListGroupItem>}
              </ListGroup>
              <Input bsStyle={validation.title}
                     name="title"
                     type="text"
                     label="Title"
                     placeholder="Enter title"
                     help={ (title.error && title.touched) ? title.error : '' }
                     hasFeedback {...title} />
              <Input bsStyle={validation.description}
                     name="description"
                     type="textarea"
                     label="Description"
                     placeholder="Enter description."
                     help={ (description.error && description.touched) ? description.error : '' }
                     hasFeedback {...description} />
              <ButtonInput type="submit" className="form-control" value={buttonValue} disabled={pristine || invalid || submitting} />
              <ButtonInput type="reset" bsStyle="danger" value="Cancel" onClick={::this.cancel} />
            </form>
          </Col>
        </Row>
      </Grid>
    );
  }
}

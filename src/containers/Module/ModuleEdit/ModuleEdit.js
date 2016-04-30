/**
 * Created by yagocarballo on 28/12/2015.
 */
import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { goBack } from 'redux-router';
import { reduxForm } from 'redux-form';
import moduleValidation from './moduleValidation';
import { ColorPicker, IconPicker, ModuleBox } from '../../../components';
import { Grid, Row, Col, Input, ButtonInput } from 'react-bootstrap';
import * as moduleActions from 'redux/modules/modules';

import { isLoaded as areCoursesLoaded, loadCourses } from 'redux/modules/courses';
import { areIconsLoaded, loadIcons } from 'redux/modules/modules';

@connect(state => ({
  courseId: state.router.params.courseId,
  moduleCode: state.router.params.moduleCode,
  selectedIcon: state.modules.editing.icon,
  selectedColor: state.modules.editing.color,
}), { ...moduleActions, goBack })
@reduxForm({
  form: 'module-edit',
  fields: [
    'title',
    'description',
    'duration',
    'icon',
    'color',
  ],
  validate: moduleValidation
})
export default class ModuleEdit extends Component {
  static propTypes = {
    moduleCode: PropTypes.string,
    courseId: PropTypes.string.isRequired,
    selectedIcon: PropTypes.string.isRequired,
    selectedColor: PropTypes.string.isRequired,

    // Redux Form
    fields: PropTypes.object.isRequired,
    invalid: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,

    create: PropTypes.func.isRequired,
    values: PropTypes.object.isRequired,

    goBack: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      color: 'white'
    };
  }

  static fetchData(getState, dispatch) {
    const promises = [];

    if (!areCoursesLoaded(getState())) {
      promises.push(dispatch(loadCourses()));
    }

    if (!areIconsLoaded(getState())) {
      promises.push(dispatch(loadIcons()));
    }

    return Promise.all(promises);
  }

  saveModule(event) {
    event.preventDefault();

    this.props.create(this.props.values).then(result => {
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
      selectedIcon, selectedColor,
      fields: { title, description, duration, icon, color, },
      invalid, pristine, submitting,
    } = this.props;

    const validation = {
      title: (title.error && title.touched) ? 'error' : null,
      description: (description.error && description.touched) ? 'error' : null,
      duration: (duration.error && duration.touched) ? 'error' : null,
    };

    const previewModule = {
      id: 'Preview',
      to: '',
      name: '',
      year: '',
      color: selectedColor,
      icon: selectedIcon,
    };

    const styles = require('./ModuleEdit.scss');
    return (
      <Grid className={'appContent container ' + styles.moduleEditPage} fluid>
        <Row>
          <Col xs={12} xsOffset={0} sm={12} smOffset={0} md={8} mdOffset={1} lg={6} lgOffset={3}>
            <br />
            <form onSubmit={::this.saveModule}>
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

              <Input bsStyle={validation.duration}
                     name="duration"
                     type="number"
                     label="Duration (In Weeks)"
                     placeholder="Enter the number of weeks."
                     help={ (duration.error && duration.touched) ? duration.error : '' }
                     hasFeedback {...duration} />
              <ColorPicker label="Course Color" color={color} />
              <div className={styles.iconAndPreview}>
                <IconPicker label="Course Icon" icon={icon} />
                <ModuleBox {...previewModule} />
              </div>
              <ButtonInput type="submit" className="form-control" value="Create Module" disabled={pristine || invalid || submitting} />
              <ButtonInput type="reset" bsStyle="danger" value="Cancel" onClick={::this.cancel} />
            </form>
          </Col>
        </Row>
      </Grid>
    );
  }
}

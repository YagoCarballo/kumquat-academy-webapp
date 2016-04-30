/**
 * Created by yagocarballo on 28/12/2015.
 */
require('datejs');
import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { goBack } from 'redux-router';
import { reduxForm } from 'redux-form';
import classValidation from './classValidation';
import { Grid, Row, Col, Input, ButtonInput } from 'react-bootstrap';
import { LevelsInput } from '../../../components';
import * as classActions from 'redux/modules/classes';

import { isLoaded as areCoursesLoaded, loadCourses } from 'redux/modules/courses';

@connect(state => ({
  courseId: state.router.params.courseId,
  initialValues: {
    courseId: state.router.params.courseId,
    levels: [],
  },
}), { ...classActions, goBack })
@reduxForm({
  form: 'class-new',
  fields: [
    'courseId',
    'title',
    'start',
    'end',
    'levels',
  ],
  validate: classValidation
})
export default class ClassNew extends Component {
  static propTypes = {
    courseId: PropTypes.string.isRequired,

    // Redux Form
    fields: PropTypes.object.isRequired,
    invalid: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,

    create: PropTypes.func.isRequired,
    values: PropTypes.object.isRequired,

    goBack: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      initialValues: {
        start: Date.today(),
        end: Date.today().add(1).years(),
      }
    };
  }

  static fetchData(getState, dispatch) {
    const promises = [];

    if (!areCoursesLoaded(getState())) {
      promises.push(dispatch(loadCourses()));
    }

    return Promise.all(promises);
  }

  saveClass(event) {
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

  levelsChanged(levels) {
    const start = levels[0].start;
    const end = levels[levels.length - 1].end;

    this.props.fields.start.onChange({
      value: start.toString('yyyy-MM-dd'),
      touch: true,
    });

    this.props.fields.end.onChange({
      value: end.toString('yyyy-MM-dd'),
      touch: true,
    });

    this.props.fields.levels.onChange({
      value: levels,
      touch: true,
    });
  }

  render() {
    const {
      fields: { title, start, end, },
      invalid, pristine, submitting,
    } = this.props;

    const validation = {
      title: (title.error && title.touched) ? 'error' : null,
      start: (start.error && start.touched) ? 'error' : null,
      end: (end.error && end.touched) ? 'error' : null,
    };

    const styles = require('./ClassNew.scss');
    return (
      <Grid className={styles.classNewPage} fluid>
        <Row>
          <Col xs={12} xsOffset={0} sm={12} smOffset={0} md={10} mdOffset={1} lg={8} lgOffset={2}>
            <br />
            <form onSubmit={::this.saveClass}>
              <Input bsStyle={validation.title}
                     name="title"
                     type="text"
                     label="Class Of "
                     placeholder="Enter title"
                     help={ (title.error && title.touched) ? title.error : '' }
                     hasFeedback {...title} />
              <LevelsInput label="Levels" onChange={::this.levelsChanged} />
              <Input bsStyle={validation.start}
                     name="start"
                     type="date"
                     label="Start Date"
                     placeholder="Enter the Start Date"
                     help={ (start.error && start.touched) ? start.error : '' }
                     hasFeedback {...start} />
              <Input bsStyle={validation.end}
                     name="end"
                     type="date"
                     label="End Date"
                     placeholder="Enter the End Date"
                     help={ (end.error && end.touched) ? end.error : '' }
                     hasFeedback {...end} />
              <ButtonInput type="submit" className="form-control" value="Create Class" disabled={pristine || invalid || submitting} />
              <ButtonInput type="reset" bsStyle="danger" value="Cancel" onClick={::this.cancel} />
            </form>
          </Col>
        </Row>
      </Grid>
    );
  }
}

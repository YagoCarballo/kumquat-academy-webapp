/**
 * Created by yagocarballo on 17/01/2015.
 */
import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-bootstrap';
import { ClassOfSticker, NewClassSticker } from '../../../components';

@connect(state => ({
  courseId: state.router.params.courseId,
  classes: state.classes.list[state.router.params.courseId],
}), null)
export default class CourseClasses extends Component {
  static propTypes = {
    courseId: PropTypes.string.isRequired,
    classes: PropTypes.object.isRequired,
  };

  render() {
    const { courseId, classes } = this.props;
    const classElements = [];
    for (const key in classes) {
      if (classes.hasOwnProperty(key)) {
        const item = classes[key];
        classElements.push(
          <Col key={item.id} sm={6} md={4} lg={3}>
            <ClassOfSticker classId={String(item.id)} courseId={courseId}/>
          </Col>);
      }
    }

    const styles = require('./CourseClasses.scss');
    return (
      <Grid fluid className={styles.courseClassesPage}>
        <Row className={styles.contentRow}>
          {classElements}
          <Col sm={6} md={4} lg={3}>
            <NewClassSticker courseId={courseId} />
          </Col>
        </Row>
      </Grid>
    );
  }
}

/**
 * Created by yagocarballo on 28/12/2015.
 */
import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-bootstrap';
import {Sidebar} from '../../components';

import { isLoaded as areCoursesLoaded, loadCourses } from 'redux/modules/courses';

@connect(state => ({
  user: state.auth.user
}), null)
export default class Manage extends Component {
  static propTypes = {
    children: PropTypes.object
  };

  static fetchData(getState, dispatch) {
    const promises = [];

    if (!areCoursesLoaded(getState())) {
      promises.push(dispatch(loadCourses()));
    }

    return Promise.all(promises);
  }

  render() {
    const items = [
      // { key: 0, title: 'Overview', to: '/manage/overview' },
      { key: 1, title: 'Courses', to: '/manage/courses' }
    ];

    const styles = require('./Manage.scss');
    return (
      <Grid className={'appContent ' + styles.managePage}>
        <Row>
          <Sidebar {...{items: items}} />
          <Col sm={10} className={styles.manageContainer}>{this.props.children}</Col>
        </Row>
      </Grid>
    );
  }
}

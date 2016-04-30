/**
 * Created by yagocarballo on 04/02/2015.
 */
import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { Panel, Grid, Row, Col, Button } from 'react-bootstrap';
import { ModuleBox, AddModuleToLevelModal } from '../../../components';

import { isRawLoaded as areModulesLoaded, findRawModules } from 'redux/modules/modules';
import { areLevelModulesLoaded, getLevelModules } from 'redux/modules/levels';

@connect(state => ({
  courseId: state.router.params.courseId,
  classId: state.router.params.classId,
  level: state.router.params.level,
  modules: (
    (state.levels.class[state.router.params.classId] || { level: {} }
    ).level[state.router.params.level] || { modules: {} }
  ).modules
}), {findRawModules})
export default class LevelModules extends Component {
  static propTypes = {
    courseId: PropTypes.string.isRequired,
    classId: PropTypes.string.isRequired,
    level: PropTypes.string.isRequired,
    modules: PropTypes.object.isRequired,
    findRawModules: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
    };
  }

  static fetchData(getState, dispatch, params) {
    const path = params.pathname.replace('/course/', '');
    const tokens = path.split('/');
    const courseId = Number(tokens[0]);
    const classId = Number(tokens[2]);
    const level = Number(tokens[4]);

    const promises = [];

    if (!areModulesLoaded(getState())) {
      promises.push(dispatch(findRawModules()));
    }

    if (!areLevelModulesLoaded(getState(), classId, level)) {
      promises.push(dispatch(getLevelModules(level, courseId, classId)));
    }

    return Promise.all(promises);
  }

  close() {
    this.props.findRawModules('', 0);
    this.setState({ showModal: false });
  }

  open() {
    this.setState({ showModal: true });
  }

  render() {
    const { level, modules } = this.props;
    const styles = require('./LevelModules.scss');

    const header = (
      <Row className={styles.header}>
        <Col xs={7} sm={9}>
          <b>{ 'Level ' + level + ' Modules' }</b>
        </Col>
        <Col xs={5} sm={3} className={styles.searchBox}>
          <Button className={styles.addModuleButton} onClick={::this.open}>Add Module</Button>
        </Col>
      </Row>
    );

    const moduleElements = [];
    for (const key in modules) {
      if (modules.hasOwnProperty(key)) {
        const module = modules[key];
        moduleElements.push(
          <Col key={key} xs={12} sm={4} md={3} lg={3} className={styles.moduleCol}>
            <ModuleBox {...{
              id: module.code,
              to: '/manage/course/' + module.course_id + '/module/' + module.code,
              name: module.title,
              description: module.description,
              year: module.year,
              color: module.color,
              icon: module.icon
            }} />
          </Col>
        );
      }
    }

    return (
      <div className={styles.levelModulesPage + ' container'}>
        <Panel header={ header }>
          <Grid className={styles.modulesGrid}>
            <Row>
              {moduleElements}
            </Row>
          </Grid>
        </Panel>
        <AddModuleToLevelModal openModal={::this.open} closeModal={::this.close} showModal={this.state.showModal} />
      </div>
    );
  }
}

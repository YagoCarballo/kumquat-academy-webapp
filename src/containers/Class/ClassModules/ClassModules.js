/**
 * Created by yagocarballo on 04/02/2015.
 */
import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { Accordion, Panel, Grid, Row, Col } from 'react-bootstrap';
import { ModuleBox } from '../../../components';

@connect(state => ({
  courseId: state.router.params.courseId,
  classId: state.router.params.classId,
  level: state.router.params.level
}), null)
export default class ClassModules extends Component {
  static propTypes = {
    courseId: PropTypes.string.isRequired,
    classId: PropTypes.string.isRequired
  };

  render() {
    const styles = require('./ClassModules.scss');
    return (
      <div className={styles.classModulesPage + ' container'}>
        <Accordion defaultActiveKey={'1'}>
          <Panel header="Level 1" eventKey="1" expanded>
            <Grid className={styles.modulesGrid}>
              <Row>
                <Col xs={12} sm={4} md={3} lg={3} className={styles.moduleCol}>
                  <ModuleBox {...{
                    id: 'AC123456',
                    to: '/course/:courseId/module/:moduleId/info',
                    name: 'Demo 1',
                    year: '2014/2015',
                    color: 'purple',
                    icon: 'fa-cloud'
                  }} />
                </Col>
                <Col xs={12} sm={4} md={3} lg={3} className={styles.moduleCol}>
                  <ModuleBox {...{
                    id: 'AC123456',
                    to: '/course/:courseId/module/:moduleId/info',
                    name: 'Demo 1',
                    year: '2014/2015',
                    color: 'purple',
                    icon: 'fa-cloud'
                  }} />
                </Col>
                <Col xs={12} sm={4} md={3} lg={3} className={styles.moduleCol}>
                  <ModuleBox {...{
                    id: 'AC123456',
                    to: '/course/:courseId/module/:moduleId/info',
                    name: 'Demo 1',
                    year: '2014/2015',
                    color: 'purple',
                    icon: 'fa-cloud'
                  }} />
                </Col>
                <Col xs={12} sm={4} md={3} lg={3} className={styles.moduleCol}>
                  <ModuleBox {...{
                    id: 'AC123456',
                    to: '/course/:courseId/module/:moduleId/info',
                    name: 'Demo 1',
                    year: '2014/2015',
                    color: 'purple',
                    icon: 'fa-cloud'
                  }} />
                </Col>
                <Col xs={12} sm={4} md={3} lg={3} className={styles.moduleCol}>
                  <ModuleBox {...{
                    id: 'AC123456',
                    to: '/course/:courseId/module/:moduleId/info',
                    name: 'Demo 1',
                    year: '2014/2015',
                    color: 'purple',
                    icon: 'fa-cloud'
                  }} />
                </Col>
              </Row>
            </Grid>
          </Panel>
          <Panel header="Level 2" eventKey="2">
            .......... Modules for Level 2 .................
          </Panel>
          <Panel header="Level 3" eventKey="3">
            .......... Modules for Level 3 .................
          </Panel>
          <Panel header="Level 4" eventKey="4">
            .......... Modules for Level 4 .................
          </Panel>
        </Accordion>
      </div>
    );
  }
}

/**
 * Created by yagocarballo on 28/12/2015.
 */
import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { Col, Panel } from 'react-bootstrap';
import { ModuleBox, NewModuleBox } from '../../../components';

@connect(state => ({
  courseId: state.router.params.courseId,
}), null)
export default class ManageModules extends Component {
  static propTypes = {
    courseId: PropTypes.string.isRequired,
  };

  render = () => {
    const styles = require('./ManageModules.scss');
    const newModuleUrl = '/course/' + this.props.courseId + '/module/new';
    const editModuleUrl = '/manage/module/';
    const modules = {
      ongoing: [
        (
        <Col key={'AC21009'} xs={12} sm={4} md={3} lg={3} className={styles.moduleCol}>
          <ModuleBox {...{ id: 'AC21009', to: editModuleUrl + 'AC21009/info', name: 'Networks and Data', year: '2013/2014', color: 'purple', icon: 'fa-fort-awesome' }} />
        </Col>
        )
      ],
      future: [
        (
        <Col key={'AC41008'} xs={12} sm={4} md={3} lg={3} className={styles.moduleCol}>
          <ModuleBox {...{ id: 'AC41008', to: editModuleUrl + 'AC41008/info', name: 'Big Data', year: '2013/2014', color: 'blue', icon: 'fa-cloud' }} />
        </Col>
        ),
        (
        <Col key={'AC31007'} xs={12} sm={4} md={3} lg={3} className={styles.moduleCol}>
          <ModuleBox {...{ id: 'AC31007', to: editModuleUrl + 'AC31007/info', name: 'Information Technology', year: '2013/2014', color: 'red', icon: 'fa-cogs' }} />
        </Col>
        )
      ],
      past: [
        (
        <Col key={'AC11006'} xs={12} sm={4} md={3} lg={3} className={styles.moduleCol}>
          <ModuleBox {...{ id: 'AC11006', to: editModuleUrl + 'AC11006/info', name: 'Agile Software Engineering', year: '2013/2014', color: '#FFEB3B', icon: 'fa-tachometer' }} />
        </Col>
        )
      ]
    };

    return (
      <div className={styles.manageModulesPage + ' container'}>
        <Panel className={styles.group} header={'Ongoing Modules'}>
          { modules.ongoing }
          <Col xs={12} sm={4} md={3} lg={3} className={styles.moduleCol}>
            <NewModuleBox {...{to: newModuleUrl}} />
          </Col>
        </Panel>
        <Panel className={styles.group} header={'Future Modules'}>
          { modules.future }
          <Col xs={12} sm={4} md={3} lg={3} className={styles.moduleCol}>
            <NewModuleBox {...{to: newModuleUrl}} />
          </Col>
        </Panel>
        <Panel className={styles.group} header={'Past Modules'}>
          { modules.past }
          <Col xs={12} sm={4} md={3} lg={3} className={styles.moduleCol}>
            <NewModuleBox {...{to: newModuleUrl}} />
          </Col>
        </Panel>
      </div>
    );
  }
}

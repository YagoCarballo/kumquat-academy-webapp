/**
 * Created by yagocarballo on 06/02/2015.
 */
require('datejs');
import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { Row, Col, Button, Modal, Input, ListGroup } from 'react-bootstrap';
import ModuleListItem from './ModuleListItem/ModuleListItem';

import { findRawModules } from 'redux/modules/modules';
import { addModule } from 'redux/modules/levels';

@connect(state => ({
  courseId: state.router.params.courseId,
  classId: state.router.params.classId,
  level: state.router.params.level,
  modules: state.modules.raw.list
}), { findRawModules, addModule })
export default class AddModuleToLevelModal extends Component {
  static propTypes = {
    courseId: PropTypes.string.isRequired,
    classId: PropTypes.string.isRequired,
    level: PropTypes.string.isRequired,
    modules: PropTypes.array.isRequired,

    showModal: PropTypes.bool.isRequired,
    openModal: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,

    findRawModules: PropTypes.func.isRequired,
    addModule: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      selected: -1,
      code: '',
      valid: false,
      startDate: Date.today().at('00:00')
    };
  }

  filterModules(event) {
    const query = event.target.value;
    this.props.findRawModules(query, 0);
  }

  codeChanged(event) {
    const code = event.target.value;
    this.setState({
      code: code,
      valid: (code && code.length > 3 && this.state.selected !== -1)
    });
  }

  startDateChanged(event) {
    const startDate = event.target.value;
    this.setState({
      startDate: Date.parse(startDate)
    });
  }

  addModule(event) {
    event.preventDefault();
    const { selected, code, startDate } = this.state;
    const { level, courseId, classId, closeModal } = this.props;
    this.props.addModule(level, courseId, classId, selected, code, startDate).then(result => {
      if (result && typeof result.error === 'object') {
        return Promise.reject(result.error);
      }
      closeModal();
    });
  }

  itemSelected(id) {
    this.setState({
      selected: id,
      valid: (this.state.code && this.state.code.length > 3 && id !== -1)
    });
  }

  render() {
    const { selected, valid, startDate } = this.state;
    const { level, modules, showModal } = this.props;
    const styles = require('./AddModuleToLevelModal.scss');

    const moduleItems = [];
    for (const module of modules) {
      moduleItems.push(
        <ModuleListItem key={module.id}
                        module={module}
                        active={selected === module.id}
                        onClick={::this.itemSelected.bind(this, module.id)} />
      );
    }

    return (
      <Modal show={showModal} className={styles.addModuleModal} onHide={::this.props.closeModal}>
        <form onSubmit={::this.addModule}>
          <Modal.Header className={styles.addModuleModalHeader} closeButton>
            <Modal.Title>{'Add Module to Level ' + level }</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row className={styles.addModuleCode}>
              <Col xs={6}>
                <Input type="text" placeholder="Enter the module Code" onChange={::this.codeChanged} />
              </Col>
              <Col xs={6}>
                <Input type="date" placeholder="Enter Start Date" defaultValue={Date.parse(startDate).toString('yyyy-MM-dd')} onChange={::this.startDateChanged} />
              </Col>
            </Row>
            <Row className={styles.addModuleModalFilter}>
              <Col xs={12}>
                <Input className={styles.filterField} type="search" placeholder="Filter Modules" onChange={::this.filterModules} />
              </Col>
            </Row>
            <Row className={styles.addModuleModalModules}>
              <Col xs={12}>
                <ListGroup className={styles.listGroup}>
                  {moduleItems}
                </ListGroup>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Row>
              <Col xs={4}>
                <Button bsStyle="danger" className="form-control" onClick={::this.props.closeModal}>Cancel</Button>
              </Col>
              <Col xs={8}>
                <Input type="submit" className={styles.formAddModule} value="Add Module" disabled={!valid} />
              </Col>
            </Row>
          </Modal.Footer>
        </form>
      </Modal>
    );
  }
}

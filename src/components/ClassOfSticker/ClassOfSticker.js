/**
 * Created by yagocarballo on 17/01/2015.
 */
import React, { Component, PropTypes, ReactDOM } from 'react';
import { connect } from 'react-redux';
import { ListGroup, ListGroupItem, Tooltip, OverlayTrigger, Modal, Button } from 'react-bootstrap';
import AddLevelForm from './AddLevelForm/AddLevelForm';
import EditClassForm from './EditClassForm/EditClassForm';
import LevelsList from './LevelsList/LevelsList';

@connect((state, props) => ({
  Class: state.classes.list[props.courseId][props.classId],
}), null)
export default class ClassOfSticker extends Component {
  static propTypes = {
    Class: PropTypes.object.isRequired,
    classId: PropTypes.string.isRequired,
    courseId: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
    };
  }

  close() {
    this.setState({ showModal: false });
  }

  open() {
    this.setState({ showModal: true });
  }

  render() {
    const { courseId, Class: { id, title } } = this.props;

    const tooltipProps = {
      container: this,
      target: () => ReactDOM.findDOMNode(this.refs.target)
    };

    const styles = require('./ClassOfSticker.scss');
    return (
      <div className={styles.classOfSticker}>
        <div className={styles.classOf}>
          <span>Class Of </span>
          <b>{title}</b>
        </div>
        <div className={styles.levels}>
          <ListGroup>
            <LevelsList classId={String(id)} courseId={courseId} />
            <ListGroupItem key="new-level" eventKey={0} className={styles.newLevel}>
              <AddLevelForm courseId={courseId} classId={'' + id} />
            </ListGroupItem>
          </ListGroup>
        </div>
        <div className={styles.actionBar}>
          <OverlayTrigger {...tooltipProps} trigger={['hover', 'focus']} placement="top" overlay={<Tooltip id="delete">Delete Class</Tooltip>}>
            <b className={styles.delete} onClick={::this.open}><i className="fa fa-trash" /></b>
          </OverlayTrigger>
          <OverlayTrigger {...tooltipProps} trigger={['hover', 'focus']} placement="top" overlay={<Tooltip id="edit">Edit Class</Tooltip>}>
            <EditClassForm courseId={courseId} classId={'' + id} className={styles.edit} />
          </OverlayTrigger>
          <OverlayTrigger {...tooltipProps} trigger={['hover', 'focus']} placement="top" overlay={<Tooltip id="students">Clone Class</Tooltip>}>
            <b className={styles.clone}><i className="fa fa-clone" /></b>
          </OverlayTrigger>
          <OverlayTrigger {...tooltipProps} trigger={['hover', 'focus']} placement="top" overlay={<Tooltip id="students">Show Students</Tooltip>}>
            <b className={styles.students}><i className="fa fa-users" /></b>
          </OverlayTrigger>
        </div>
        <Modal show={this.state.showModal} onHide={::this.close}>
          <Modal.Header className={styles.headerDanger} closeButton>
            <Modal.Title>Delete Class</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to remove this class?<br />
            <b>This Action is NOT reversible.</b>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={::this.close}>Cancel</Button>
            <Button bsStyle="danger">Delete</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

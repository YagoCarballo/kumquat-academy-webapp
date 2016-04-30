/**
 * Created by yagocarballo on 10/02/2016.
 */
require('datejs');
import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { Col, Row, Panel, ListGroup, ListGroupItem, FormControls, Label, Button } from 'react-bootstrap';
import { AssignmentForm, StudentListItem } from '../../../../components';
import * as assignmentActions from 'redux/modules/assignments';

@connect(state => ({
  moduleCode: state.router.params.moduleCode,
  assignments: state.assignments.module[state.router.params.moduleCode]
}), {...assignmentActions})
export default class ManageModuleAssignments extends Component {
  static propTypes = {
    moduleCode: PropTypes.string.isRequired,
    assignments: PropTypes.object.isRequired,
    editStart: PropTypes.func.isRequired,
    editStop: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      selected: 0,
      editMode: false
    };
  }

  getStatusLabelStyle(assignment) {
    switch ((assignment || {}).status) {
      case 'created':
        return 'info';
      case 'available':
        return 'primary';
      case 'sent':
        return 'danger';
      case 'graded':
        return 'warning';
      case 'returned':
        return 'success';
      case 'draft':
      default:
        return 'default';
    }
  }

  assignmentSelected(index) {
    this.setState({ selected: index, editMode: false });
  }

  newAssignment() {
    this.startEditing();
    this.setState({ selected: -1, editMode: true });
  }

  editAssignment() {
    this.startEditing(this.props.assignments[this.state.selected]);
    this.setState({ editMode: true });
  }

  cancelEdit() {
    const selected = this.state.selected;
    this.stopEditing(this.props.assignments[this.state.selected]);
    this.setState({ selected: (selected === -1 ? 0 : selected), editMode: false });
  }

  saveAssignment() {
    this.setState({ editMode: false });
    console.log('TODO -> Save');
  }

  deleteAssignment() {
    console.log('TODO -> Delete');
  }

  handleEditorChange(event) {
    console.log('TODO -> On TinyMCE Change: ' + event.target.getContent());
  }

  startEditing(id) {
    const { moduleCode } = this.props;
    this.props.editStart(moduleCode, (id || 'new'));
  }

  stopEditing(id) {
    const { moduleCode } = this.props;
    this.props.editStop(moduleCode, (id || 'new'));
  }

  render = () => {
    const styles = require('./ManageModuleAssignments.scss');
    const { moduleCode, assignments } = this.props;
    const { selected, editMode} = this.state;
    let assignment;
    let attachmentElements = [];
    const itemElements = [];
    const studentElements = [];
    let index = 0;
    for (const key in assignments) {
      if (assignments.hasOwnProperty(key)) {
        if (index === selected) {
          assignment = assignments[key];
        }

        itemElements.push(
          <ListGroupItem key={key}
                         active={ index === selected }
                         onClick={::this.assignmentSelected.bind(this, index)}>
            {assignments[key].title}
          </ListGroupItem>
        );
        ++index;
      }
    }
    if (selected === -1) {
      assignment = {
        id: 'new',
        title: '',
        description: '',
        start: Date.today().add(12).hours(),
        end: Date.today().add(1).weeks().add(12).hours(),
        status: 'draft',
        weight: 0.15,
        attachment: ''
      };
    }

    // Parse dates so they can be used in the datetime-local picker
    if (assignment) {
      assignment.start = Date.parse(assignment.start).toString('yyyy-MM-ddTHH:mm');
      assignment.end = Date.parse(assignment.end).toString('yyyy-MM-ddTHH:mm');
      attachmentElements = [];
      if (assignment.attachments) {
        for (const attachment of assignment.attachments) {
          attachmentElements.push(<li key={attachment.id}>
            <a href={'/api/api/v1/attachment/' + attachment.url + '/' + attachment.name} target="_blank">{attachment.name}</a>
          </li>);
        }
      }

      if (assignment.students) {
        let studentIndex = 0;
        for (const student of assignment.students) {
          studentElements.push(
            <StudentListItem avatar={student.avatar}
                             firstName={student.last_name}
                             lastName={student.first_name}
                             submission={student.submission}
                             moduleCode={moduleCode}
                             assignmentId={assignment.id}
                             studentIndex={studentIndex} />
          );
          ++studentIndex;
        }
      }
    }
    // Get the style for the status label
    const statusStyle = this.getStatusLabelStyle(assignment);
    return (
      <div className={styles.manageAssignmentsPage}>
        <Row>
          <Col sm={3}>
            <ListGroup>
              {itemElements}
              <ListGroupItem key={'key'} className={styles.newAssignmentButton}
                             active={ selected === -1 }
                             onClick={::this.newAssignment}>
                {'Add Assignment'}
              </ListGroupItem>
            </ListGroup>
          </Col>
          <Col sm={9}>
            {assignment &&
              <Panel header={!editMode &&
                  <Row className={styles.header}>
                    <Col sm={6}>
                      <b>{ assignment.title }</b>
                    </Col>
                    <Col sm={3} className={styles.actionsBox}>
                        <Button className={styles.headerButton} onClick={::this.deleteAssignment}>Delete Assignment</Button>
                    </Col>
                    <Col sm={3} className={styles.actionsBox}>
                      <Button className={styles.headerButton} onClick={::this.editAssignment}>Edit Assignment</Button>
                    </Col>
                  </Row>
              }>
              {editMode &&
                <AssignmentForm moduleCode={moduleCode} assignment={assignment} onClose={::this.cancelEdit} />
              }
              {!editMode &&
                <div className="form-horizontal">
                  <FormControls.Static label="Description" labelClassName="col-xs-2" wrapperClassName="col-xs-10">
                    <div dangerouslySetInnerHTML={{__html: assignment.description}}></div>
                  </FormControls.Static>
                  <FormControls.Static label="Start" labelClassName="col-xs-2" wrapperClassName="col-xs-10">{assignment.start.toString('dd.MM.yyyy HH:mm')}</FormControls.Static>
                  <FormControls.Static label="End" labelClassName="col-xs-2" wrapperClassName="col-xs-10">{assignment.end.toString('dd.MM.yyyy HH:mm')}</FormControls.Static>
                  <FormControls.Static label="Status" labelClassName="col-xs-2" wrapperClassName="col-xs-10"><Label bsStyle={statusStyle}>{assignment.status}</Label></FormControls.Static>
                  <FormControls.Static label="Weight" labelClassName="col-xs-2" wrapperClassName="col-xs-10">{(assignment.weight * 100) + '%'}</FormControls.Static>
                  <FormControls.Static label="Attachments" labelClassName="col-xs-2" wrapperClassName="col-xs-10">
                    <ul>{attachmentElements}</ul>
                  </FormControls.Static>
                  <FormControls.Static label="Students" labelClassName="col-xs-2" wrapperClassName="col-xs-10">
                    <ListGroup>
                      {studentElements}
                    </ListGroup>
                  </FormControls.Static>
                </div>
              }
              </Panel>
            }
          </Col>
        </Row>
      </div>
    );
  }
}

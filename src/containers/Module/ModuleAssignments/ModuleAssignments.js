/**
 * Created by yagocarballo on 28/12/2015.
 */
import React, {Component, PropTypes} from 'react';
import DocumentMeta from 'react-document-meta';
import { connect } from 'react-redux';
import { Panel, ListGroup, ListGroupItem, FormControls, Row, Col, Label, Well } from 'react-bootstrap';
import { SubmitAssignment } from '../../../components';

@connect((state) => ({
  moduleCode: state.router.params.moduleCode,
  assignments: state.assignments.module[state.router.params.moduleCode]
}), null)
export default class ModuleAssignments extends Component {
  static propTypes = {
    moduleCode: PropTypes.string.isRequired,
    assignments: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      selected: 0
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
    this.setState({ selected: index });
  }

  render() {
    const styles = require('./ModuleAssignments.scss');
    const { assignments, moduleCode } = this.props;
    const { selected } = this.state;
    let assignment;
    let attachmentElements = [];
    const itemElements = [];
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
    // Get the style for the status label
    const statusStyle = this.getStatusLabelStyle(assignment);
    if (assignment) {
      attachmentElements = [];
      if (assignment.attachments) {
        for (const attachment of assignment.attachments) {
          attachmentElements.push(<li key={attachment.id}>
            <a href={'/api/api/v1/attachment/' + attachment.url + '/' + attachment.name} target="_blank">{attachment.name}</a>
          </li>);
        }
      }
    }
    return (
      <div className={styles.moduleAssignmentsPage + ' container'}>
        <DocumentMeta title={'Kumquat Academy: Module ' + moduleCode + ' Assignments' }/>
        <Row>
          <Panel>
            { (index <= 0) &&
              <Well key="error" className={styles.noAssignmentsAlert}>
                No assignments available at the moment. Please come back later
              </Well>
            }
            <Col sm={3}>
              <ListGroup>
                {itemElements}
              </ListGroup>
            </Col>
            <Col sm={9}>
              {assignment &&
                <Panel header={
                    <Row className={styles.header}>
                      <Col sm={12}>
                        <b>{ assignment.title }</b>
                      </Col>
                    </Row>
                  }>
                  <form className="form-horizontal">
                    <div dangerouslySetInnerHTML={{__html: assignment.description}}></div>
                    <br />
                    <FormControls.Static label="Start" labelClassName="col-xs-2" wrapperClassName="col-xs-10">{assignment.start.toString('dd.MM.yyyy HH:mm')}</FormControls.Static>
                    <FormControls.Static label="End" labelClassName="col-xs-2" wrapperClassName="col-xs-10">{assignment.end.toString('dd.MM.yyyy HH:mm')}</FormControls.Static>
                    <FormControls.Static label="Status" labelClassName="col-xs-2" wrapperClassName="col-xs-10"><Label bsStyle={statusStyle}>{assignment.status}</Label></FormControls.Static>
                    <FormControls.Static label="Weight" labelClassName="col-xs-2" wrapperClassName="col-xs-10">{(assignment.weight * 100) + '%'}</FormControls.Static>
                    <FormControls.Static label="Attachments" labelClassName="col-xs-2" wrapperClassName="col-xs-10"><ul>{attachmentElements}</ul></FormControls.Static>
                  </form>
                  <Panel header={
                    <Row className={styles.header}>
                      <Col sm={12}>
                        <b>Submit Assignment</b>
                      </Col>
                    </Row>
                  }>
                    <SubmitAssignment moduleCode={moduleCode}
                                      assignmentId={assignment.id}
                                      submissionOpen={assignment.submission_open} />
                  </Panel>
                </Panel>
              }
            </Col>
          </Panel>
        </Row>
      </div>
    );
  }
}

/**
 * Created by yagocarballo on 19/02/2015.
 */
require('datejs');
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Row, ButtonInput, Input, Panel, ListGroup, ListGroupItem } from 'react-bootstrap';
import * as studentActions from 'redux/modules/students';

@connect((state) => ({
  students: state.students.search
}), { ...studentActions })
export default class AddStudentToModule extends Component {
  static propTypes = {
    moduleCode: PropTypes.string.isRequired,
    onClose: PropTypes.func,

    // states
    students: PropTypes.object.isRequired,

    // Action Triggers
    search: PropTypes.func.isRequired,
    addToModule: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      selected: -1
    };
  }

  search(event) {
    const { moduleCode } = this.props;
    const query = event.target.value;
    if (query && query !== '' && query.length >= 2) {
      this.props.search(moduleCode, query);
    }
  }

  addStudent(event) {
    event.preventDefault();
    const { moduleCode, students } = this.props;
    this.props.addToModule(moduleCode, students[this.state.selected].id).then(result => {
      if (result && typeof result.error === 'object') {
        return Promise.reject(result.error);
      }
      this.props.onClose(event);
    });
  }

  studentSelected(studentId) {
    this.setState({ selected: studentId });
  }

  render() {
    const styles = require('./AddStudentToModule.scss');
    const { students } = this.props;
    const { selected } = this.state;
    let inList = false;
    const studentElements = [];
    for (const key in students) {
      if (students.hasOwnProperty(key)) {
        const student = students[key];
        inList = (selected === student.id) ? true : inList;
        studentElements.push(<ListGroupItem className={styles.studentItem}
                                            key={student.id}
                                            onClick={::this.studentSelected.bind(this, student.id)}
                                            active={selected === student.id}>
          <img className={styles.avatar} src={student.avatar} />
          <span className={styles.fullName}><b>{student.firstName}</b> { ' ' + student.lastName }</span>
        </ListGroupItem>);
      }
    }
    return (
      <form onSubmit={::this.addStudent} className="form-horizontal">
        <Row className={styles.addStudentToModuleContainer}>
          <Panel>
              <Input type="search" placeholder="Search Student" className={styles.searchField} onChange={::this.search} />
              <ListGroup>
                {studentElements}
              </ListGroup>
              <ButtonInput type="submit" className="form-control" disabled={selected === -1 || !inList}>Add Student</ButtonInput>
          </Panel>
        </Row>
      </form>
    );
  }
}

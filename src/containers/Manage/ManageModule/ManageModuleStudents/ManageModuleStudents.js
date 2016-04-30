/**
 * Created by yagocarballo on 21/02/2016.
 */
require('datejs');
import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import { StudentCard, NewStudentCard, StudentForm } from '../../../../components';

@connect(state => ({
  moduleCode: state.router.params.moduleCode,
  students: state.students.module[state.router.params.moduleCode],
}), null)
export default class ManageModuleStudents extends Component {
  static propTypes = {
    moduleCode: PropTypes.string.isRequired,
    students: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
      student: null
    };
  }

  onStopEditing() {
    this.setState({ editMode: false, student: null });
  }

  onAddStudent() {
    this.setState({ editMode: true, student: {
      id: 'new',
      avatar: '/default_avatar.svg',
      matricDate: Date.today()
    }});
  }

  editStudent(student) {
    if (student.dateOfBirth) {
      student.dateOfBirth = Date.parse(student.dateOfBirth).toString('yyyy-MM-dd');
    }
    if (student.matricDate) {
      student.matricDate = Date.parse(student.matricDate).toString('yyyy-MM-dd');
    }
    this.setState({ editMode: true, student: student });
  }

  render = () => {
    const styles = require('./ManageModuleStudents.scss');
    const { moduleCode, students } = this.props;
    const { editMode } = this.state;
    const studentElements = [];
    for (const key in students) {
      if (students.hasOwnProperty(key)) {
        const student = students[key];
        studentElements.push(<Col xs={6} sm={3} lg={2} key={student.id} className={styles.studentCardCol}>
          <StudentCard {...student} onEdit={::this.editStudent.bind(this, student)} />
        </Col>);
      }
    }
    studentElements.push(<Col xs={6} sm={3} lg={2} key={'new'} className={styles.studentCardCol}>
      <NewStudentCard url={'#'} onClick={::this.onAddStudent} />
    </Col>);
    return (
      <div className={styles.manageModuleStudentsPage}>
        { !editMode &&
          <Row>
            {studentElements}
          </Row>
        }
        { editMode &&
          <Row>
            { this.state.student.id !== 'new' &&
              <Col sm={3}>
                <StudentCard {...this.state.student} previewMode/>
              </Col>
            }
            <Col sm={(this.state.student.id === 'new') ? 12 : 9}>
              <StudentForm moduleCode={moduleCode} student={this.state.student} onClose={::this.onStopEditing} />
            </Col>
          </Row>
        }
      </div>
    );
  }
}

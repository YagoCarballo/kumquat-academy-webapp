/**
 * Created by yagocarballo on 19/02/2015.
 */
require('datejs');
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import UploadItem from '../UploadAttachment/UploadItem/UploadItem';
import { Col, Row, ButtonInput, ListGroup, Well, ProgressBar } from 'react-bootstrap';
import * as assignmentActions from 'redux/modules/assignments';

@connect(null, { ...assignmentActions })
export default class SubmitAssignment extends Component {
  static propTypes = {
    moduleCode: PropTypes.string.isRequired,
    assignmentId: PropTypes.number.isRequired,
    submissionOpen: PropTypes.bool,

    // Action Triggers
    submit: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      status: 'available',
      progress: 0,
      submission: {
        files: [],
        description: null
      }
    };
  }

  submitAssignment(event) {
    event.preventDefault();
    this.setState({ status: 'waiting' });
    const { moduleCode, assignmentId } = this.props;
    this.props.submit(moduleCode, assignmentId, this.state.submission, (uploadEvent) => {
      this.setState({ progress: uploadEvent.percent });
    }).then(result => {
      if (result && typeof result.error === 'object') {
        return Promise.reject(result.error);
      }
      this.setState({ status: 'closed' });
    });
  }

  descriptionChanged(event) {
    const { submission } = this.state;
    this.setState({
      submission: {
        ...submission,
        description: event.target.value
      }
    });
  }

  filesAdded(files) {
    const { submission } = this.state;
    const stateFiles = submission.files;
    for (const file of files) {
      file.id = 'new';
      stateFiles.push(file);
    }
    this.setState({
      submission: {
        ...submission,
        files: stateFiles
      }
    });
  }

  fileDeleted(index) {
    const { submission } = this.state;
    const files = submission.files;
    files.splice(Number(index), 1);
    this.setState({
      submission: {
        ...submission,
        files: files
      }
    });
  }

  render() {
    const styles = require('./SubmitAssignment.scss');
    const { submission, progress } = this.state;
    const { submissionOpen } = this.props;
    let { status } = this.state;
    if (submissionOpen !== true) {
      status = 'closed';
    }

    // Display the items to be uploaded
    const uploadingItems = [];
    for (const index in submission.files) {
      if (submission.files.hasOwnProperty(index) && submission.files[index]) {
        const file = submission.files[index];
        uploadingItems.push(<UploadItem key={file.name}
                                        containerId={String(index)}
                                        file={file}
                                        onDelete={::this.fileDeleted} manualMode />);
      }
    }

    // check if the submission is ready
    const submissionReady = (submission.files.length > 0);
    switch (status) {
      case 'available':
        return (
          <form onSubmit={::this.submitAssignment} className="form-horizontal" className={styles.submitAssignmentForm}>
            <Row className={styles.uploaderRow}>
              <Col sm={3}>
                <h5>Assignment Files</h5>
                <br />
                <p>Please drag and drop the files to submit into the upload box or click on the upload box
                  to select the files to be submitted as part of this assignment.</p>
              </Col>
              <Col sm={5}>
                <Dropzone onDrop={::this.filesAdded}
                          className={styles.uploadBox}
                          activeClassName={styles.activeUploadBox}>
                  <div className={styles.infoCol}>
                    <i className={'fa fa-cloud-upload ' + styles.icon} />
                    <br />
                    <b>Drag & drop</b>
                    <p>or <span className={styles.fakeLink}>browse</span> your files</p>
                  </div>
                </Dropzone>
              </Col>
              <Col sm={4} className={styles.uploadList}>
                { uploadingItems.length > 0 &&
                  <ListGroup>
                    {uploadingItems}
                  </ListGroup>
                }
                { uploadingItems.length <= 0 &&
                  <Well key="error" className={styles.submissionNotAvailable}>Empty</Well>
                }
              </Col>
            </Row>
            <hr />
            <Row>
              <Col sm={3}>
                <h5>Assignment Notes</h5>
                <br />
                <p>Please enter any notes or comments about this assignment for the teacher to read.</p>
              </Col>
              <Col sm={9}>
                <textarea className={'form-control ' + styles.commentsArea} onChange={::this.descriptionChanged} />
              </Col>
            </Row>
            <Row>
              <br />
              <Col sm={12}>
                <ButtonInput type="submit"
                             className="form-control"
                             disabled={!submissionReady}>
                  Submit Assignment
                </ButtonInput>
              </Col>
            </Row>
          </form>
        );
      case 'waiting':
        return (
          <div className={styles.uploadingBox}>
            <ProgressBar active now={progress} />
          </div>
        );
      default:
        return (
          <Well key="error" className={styles.submissionNotAvailable}>Submission Closed</Well>
        );
    }
  }
}

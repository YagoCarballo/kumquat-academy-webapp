/**
 * Created by yagocarballo on 19/02/2015.
 */
require('datejs');
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Row, Col, ListGroup } from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import UploadItem from './UploadItem/UploadItem';
import * as attachmentActions from 'redux/modules/attachments';

@connect((state, props) => ({
  uploads: (state.attachments.uploads[props.id] || { list: {} }).list,
  progress: state.attachments.progress
}), { ...attachmentActions })
export default class UploadAttachment extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    uploads: PropTypes.object.isRequired,
    attachments: PropTypes.array.isRequired,
    progress: PropTypes.number.isRequired,
    onUpload: PropTypes.func,

    // Action Triggers
    upload: PropTypes.func.isRequired,
    updateProgress: PropTypes.func.isRequired,
    setInitialAttachments: PropTypes.func.isRequired
  };

  componentWillMount() {
    const { id, attachments } = this.props;
    this.props.setInitialAttachments(id, attachments);
  }

  onDrop(files) {
    const { id } = this.props;
    for (const file of files) {
      this.uploadFile(id, file);
    }
  }

  uploadFile(key, file) {
    this.props.upload(key, file, (event) => {
      this.props.updateProgress(event.percent, key, file.name);
    }).then(result => {
      if (result && typeof result.error === 'object') {
        return Promise.reject(result.error);
      }
      if (this.props.onUpload) {
        const attachmentIds = [];
        for (const index in this.props.uploads) {
          if (this.props.uploads.hasOwnProperty(index) && this.props.uploads[index]) {
            attachmentIds.push(this.props.uploads[index].id);
          }
        }
        this.props.onUpload(attachmentIds);
      }
    });
  }

  render() {
    const styles = require('./UploadAttachment.scss');
    const { uploads, id } = this.props;
    const uploadingItems = [];
    for (const index in uploads) {
      if (uploads.hasOwnProperty(index) && uploads[index]) {
        const file = uploads[index];
        uploadingItems.push(<UploadItem key={file.name} containerId={id} file={file} />);
      }
    }

    return (
      <Row className={styles.uploaderRow}>
        <Col sm={6}>
          <Dropzone onDrop={::this.onDrop}
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
        <Col sm={6}>
          <ListGroup>
            {uploadingItems}
          </ListGroup>
        </Col>
      </Row>
    );
  }
}

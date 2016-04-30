/**
 * Created by yagocarballo on 20/02/2015.
 */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { ListGroupItem, ProgressBar } from 'react-bootstrap';
import * as attachmentActions from 'redux/modules/attachments';

@connect(null, { ...attachmentActions })
export default class UploadItem extends Component {
  static propTypes = {
    containerId: PropTypes.string.isRequired,
    file: PropTypes.object.isRequired,
    remove: PropTypes.func.isRequired,
    onDelete: PropTypes.func,
    manualMode: PropTypes.bool
  };

  onDelete() {
    const { containerId, file, manualMode, onDelete } = this.props;
    if (manualMode) {
      onDelete(containerId, file);
    } else {
      this.props.remove(containerId, file.name, file.id).then(result => {
        if (result && typeof result.error === 'object') {
          return Promise.reject(result.error);
        }
      });
    }
  }

  render() {
    const styles = require('./UploadItem.scss');
    const { file } = this.props;
    const isImage = (file.type.indexOf('image') >= 0);
    const url = ( file.id === 'new' ? (file.preview || file.url) : '/api/api/v1/attachment/' + file.url);
    return (
      <ListGroupItem key={file.name} className={styles.uploadItem}>
        <b className={styles.fileName}>{file.name}</b>
        { isImage &&
          <img className={styles.preview} src={url} alt={file.name} style={{maxHeight: '30px'}} />
        }
        { !isImage &&
          <div className={styles.preview}>
            <i className={'fa fa-question ' + styles.unknownFileType} />
          </div>
        }
        <ProgressBar className={styles.uploadProgress}
                     bsStyle="info"
                     now={file.percentage}
                     striped={file.id === 'new'}
                     active={file.id === 'new'} />
        <i className={'fa fa-times-circle ' + styles.deleteButton} onClick={::this.onDelete} />
      </ListGroupItem>
    );
  }
}

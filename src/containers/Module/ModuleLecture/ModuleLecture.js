/**
 * Created by yagocarballo on 09/03/2016.
 */
import React, {Component, PropTypes} from 'react';
import DocumentMeta from 'react-document-meta';
import { connect } from 'react-redux';
import { FormControls } from 'react-bootstrap';

import { isActiveLectureLoaded, loadLecture } from 'redux/modules/lectures';

@connect(state => ({
  moduleCode: state.router.params.moduleCode,
  lecture: state.lectures.lecture
}), null)
export default class ModuleLecture extends Component {
  static propTypes = {
    moduleCode: PropTypes.string.isRequired,
    lecture: PropTypes.object.isRequired
  };

  static fetchData(getState, dispatch, params) {
    const path = params.pathname.replace(/(\/course\/[0-9]+)?\/module\//gi, '');
    const moduleCode = path.substr(0, path.indexOf('/'));
    const lectureId = path.substr(2, path.indexOf('/'));
    const promises = [];

    if (!isActiveLectureLoaded(getState())) {
      promises.push(dispatch(loadLecture(moduleCode, lectureId)));
    }

    return Promise.all(promises);
  }

  render() {
    const styles = require('./ModuleLecture.scss');
    const { lecture } = this.props;

    // Parse the Dates
    lecture.start = Date.parse(lecture.start);
    lecture.end = Date.parse(lecture.end);

    // Parse the Attachments
    let attachmentElements = [];
    if (lecture) {
      attachmentElements = [];
      if (lecture.attachments) {
        for (const attachment of lecture.attachments) {
          attachmentElements.push(<li key={attachment.id}>
            <a href={'/api/api/v1/attachment/' + attachment.url + '/' + attachment.name} target="_blank">{attachment.name}</a>
          </li>);
        }
      }
    }
    return (
      <div className={styles.moduleLecturePage + ' container'}>
        <DocumentMeta title={'Kumquat Academy: ' + lecture.topic }/>
        <form className="form-horizontal">
          <FormControls.Static label="Topic" labelClassName="col-xs-2" wrapperClassName="col-xs-10">{lecture.topic}</FormControls.Static>
          <FormControls.Static label="Location" labelClassName="col-xs-2" wrapperClassName="col-xs-10">{lecture.location}</FormControls.Static>
          <FormControls.Static label="Start" labelClassName="col-xs-2" wrapperClassName="col-xs-10">{lecture.start.toString('dd.MM.yyyy HH:mm')}</FormControls.Static>
          <FormControls.Static label="End" labelClassName="col-xs-2" wrapperClassName="col-xs-10">{lecture.end.toString('dd.MM.yyyy HH:mm')}</FormControls.Static>
          <br />
          <hr />
          <div dangerouslySetInnerHTML={{__html: lecture.description}}></div>
          <hr />
          <br />
          <FormControls.Static label="Attachments" labelClassName="col-xs-2" wrapperClassName="col-xs-10"><ul>{attachmentElements}</ul></FormControls.Static>
        </form>
      </div>
    );
  }
}

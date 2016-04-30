/**
 * Created by yagocarballo on 28/12/2015.
 */
import React, {Component, PropTypes} from 'react';
import DocumentMeta from 'react-document-meta';
import { connect } from 'react-redux';
import { Panel, FormControls, Button } from 'react-bootstrap';
import { LectureWeekPanel } from '../../../components';

import { isLoaded as areLecturesLoaded, loadLectures } from 'redux/modules/lectures';

@connect(state => ({ moduleCode: state.router.params.moduleCode }), null)
export default class ModuleLectures extends Component {
  static propTypes = {
    moduleCode: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      lecture: null
    };
  }

  onClose() {
    this.setState({ lecture: null });
  }

  lectureSelected(lecture) {
    this.setState({ lecture: lecture });
  }

  static fetchData(getState, dispatch, params) {
    const path = params.pathname.replace(/(\/course\/[0-9]+)?\/module\//gi, '');
    const moduleCode = path.substr(0, path.indexOf('/'));
    const promises = [];

    if (!areLecturesLoaded(getState())) {
      promises.push(dispatch(loadLectures(moduleCode)));
    }

    return Promise.all(promises);
  }

  render() {
    const styles = require('./ModuleLectures.scss');
    const { moduleCode } = this.props;
    const { lecture } = this.state;
    const lectureStyles = {
      height: 0,
      opacity: 0
    };
    let attachmentElements = [];
    if (lecture) {
      attachmentElements = [];
      if (lecture.attachments) {
        for (const attachment of lecture.attachments) {
          attachmentElements.push(<li key={attachment.id}>
            <a href={'/api/api/v1/attachment/' + attachment.url} target="_blank">{attachment.name}</a>
          </li>);
        }
      }

      lectureStyles.height = 'auto';
      lectureStyles.opacity = 1;
    }
    return (
      <div className={styles.moduleLecturesPage + ' container'}>
        <DocumentMeta title={'Kumquat Academy: Module ' + moduleCode + ' Lectures' }/>
          <Panel className={styles.lectureDetails} style={lectureStyles}>
            { lecture &&
              <form className="form-horizontal">
                <FormControls.Static label="Topic" labelClassName="col-xs-2" wrapperClassName="col-xs-10">{lecture.topic}</FormControls.Static>
                <FormControls.Static label="Location" labelClassName="col-xs-2" wrapperClassName="col-xs-10">{lecture.location}</FormControls.Static>
                <FormControls.Static label="Start" labelClassName="col-xs-2" wrapperClassName="col-xs-10">{Date.parse(lecture.start).toString('dd.MM.yyyy HH:mm')}</FormControls.Static>
                <FormControls.Static label="End" labelClassName="col-xs-2" wrapperClassName="col-xs-10">{Date.parse(lecture.end).toString('dd.MM.yyyy HH:mm')}</FormControls.Static>
                <br />
                <hr />
                <div dangerouslySetInnerHTML={{__html: lecture.description}}></div>
                <hr />
                <br />
                <FormControls.Static label="Attachments" labelClassName="col-xs-2" wrapperClassName="col-xs-10"><ul>{attachmentElements}</ul></FormControls.Static>
                <br />
                <Button className="form-control" onClick={::this.onClose}>Close</Button>
              </form>
            }
          </Panel>
        <LectureWeekPanel moduleCode={moduleCode} viewOnly onLectureSelected={::this.lectureSelected} />
      </div>
    );
  }
}

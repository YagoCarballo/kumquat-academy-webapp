/**
 * Created by yagocarballo on 21/02/2016.
 */
import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { Panel, Row } from 'react-bootstrap';
import { WeekLectures, LectureWeekPanel } from '../../../../components';

@connect(state => ({
  moduleCode: state.router.params.moduleCode
}), null)
export default class ManageModuleLectures extends Component {
  static propTypes = {
    moduleCode: PropTypes.string.isRequired
  };

  render = () => {
    const styles = require('./ManageModuleLectures.scss');
    const { moduleCode } = this.props;
    return (
      <div className={styles.manageModuleLecturesPage}>
        <Panel>
          <Row>
            <WeekLectures moduleCode={moduleCode} />
          </Row>
        </Panel>
        <LectureWeekPanel moduleCode={moduleCode} />
      </div>
    );
  }
}

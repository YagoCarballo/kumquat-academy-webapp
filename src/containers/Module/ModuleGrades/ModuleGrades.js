/**
 * Created by yagocarballo on 28/12/2015.
 */
import React, {Component, PropTypes} from 'react';
import DocumentMeta from 'react-document-meta';
import { connect } from 'react-redux';
import { Row, Panel } from 'react-bootstrap';

@connect(state => ({
  moduleCode: state.router.params.moduleCode
}), null)
export default class ModuleGrades extends Component {
  static propTypes = {
    moduleCode: PropTypes.string.isRequired
  };

  render() {
    const styles = require('./ModuleGrades.scss');
    const { moduleCode } = this.props;
    return (
      <div className={styles.moduleGradesPage + ' container'}>
        <DocumentMeta title={'Kumquat Academy: Module ' + moduleCode + ' Grades' }/>
        <Row>
          <Panel>
            TODO
          </Panel>
        </Row>
      </div>
    );
  }
}

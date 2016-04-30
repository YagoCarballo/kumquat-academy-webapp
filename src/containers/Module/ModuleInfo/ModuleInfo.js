/**
 * Created by yagocarballo on 28/12/2015.
 */
import React, {Component, PropTypes} from 'react';
import DocumentMeta from 'react-document-meta';
import { connect } from 'react-redux';

@connect(state => ({ moduleCode: state.router.params.moduleCode }), null)
export default class ModuleInfo extends Component {
  static propTypes = {
    moduleCode: PropTypes.string.isRequired
  };

  render() {
    const styles = require('./ModuleInfo.scss');
    const { moduleCode } = this.props;
    return (
      <div className={styles.moduleInfoPage + ' container'}>
        <DocumentMeta title={'Kumquat Academy: Module ' + moduleCode + ' Info' }/>
      </div>
    );
  }
}

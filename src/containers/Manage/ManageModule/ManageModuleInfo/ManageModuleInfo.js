/**
 * Created by yagocarballo on 10/02/2016.
 */
import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';

@connect(state => ({
  moduleCode: state.router.params.moduleCode,
}), null)
export default class ManageModuleInfo extends Component {
  static propTypes = {
    moduleCode: PropTypes.string.isRequired,
  };

  render = () => {
    const styles = require('./ManageModuleInfo.scss');
    return (
      <div className={styles.manageModuleInfoPage}>
        <b>TODO</b>
      </div>
    );
  }
}

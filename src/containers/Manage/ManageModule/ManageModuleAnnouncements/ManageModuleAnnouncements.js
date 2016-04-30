/**
 * Created by yagocarballo on 21/02/2016.
 */
import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';

@connect(state => ({
  moduleCode: state.router.params.moduleCode,
}), null)
export default class ManageModuleAnnouncements extends Component {
  static propTypes = {
    moduleCode: PropTypes.string.isRequired,
  };

  render = () => {
    const styles = require('./ManageModuleAnnouncements.scss');
    return (
      <div className={styles.manageModuleAnnouncementsPage}>
        <b>TODO</b>
      </div>
    );
  }
}

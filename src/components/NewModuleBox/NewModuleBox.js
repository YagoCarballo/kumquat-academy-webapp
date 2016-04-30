/**
 * Created by yagocarballo on 28/12/2015.
 */
import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';

@connect(null, {pushState})
export default class NewModuleBox extends Component {
  static propTypes = {
    to: PropTypes.string,
    pushState: PropTypes.func.isRequired,
  };

  onClick() {
    this.props.pushState(null, this.props.to);
  }

  render() {
    const styles = require('./NewModuleBox.scss');
    return (
      <div className={styles.newModuleBoxComponent} onClick={::this.onClick}>
        <div className={styles.newModuleIconContainer}>
          <i className={'fa fa-plus ' + styles.newModuleIcon}/>
        </div>
        <div className={styles.newModuleColorLine}>
          <p>Create Module</p>
        </div>
      </div>
    );
  }
}

/**
 * Created by yagocarballo on 28/12/2015.
 */
import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import { FormattedMessage } from 'react-intl';

@connect(null, {pushState})
export default class ModuleBox extends Component {
  static propTypes = {
    id: PropTypes.string,
    name: PropTypes.string,
    year: PropTypes.string,
    color: PropTypes.string,
    icon: PropTypes.string,
    to: PropTypes.string,
    pushState: PropTypes.func.isRequired
  };

  onClick() {
    if (this.props.to !== '') {
      this.props.pushState(null, this.props.to);
    }
  }

  render() {
    const styles = require('./ModuleBox.scss');
    return (
      <div className={styles.moduleBoxComponent} onClick={::this.onClick}>
        <div className={styles.moduleIconContainer} style={{ backgroundColor: this.props.color }}>
          <i className={'fa ' + this.props.icon + ' ' + styles.moduleIcon}/>
        </div>
        <p><b className={styles.moduleId}>{this.props.id}</b></p>
        <p className={styles.moduleName}>{this.props.name}</p>
        <p className={styles.moduleYear}>{this.props.year}</p>
        <div className={styles.moduleColorLine} style={{ backgroundColor: this.props.color }}>
          <p>
            <FormattedMessage
              id="modules.open"
              description="Open Module button on every module."
              defaultMessage="Open Module" />
          </p>
        </div>
      </div>
    );
  }
}

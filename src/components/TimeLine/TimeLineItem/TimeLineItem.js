/**
 * Created by yagocarballo on 28/12/2015.
 */
import React, {Component, PropTypes} from 'react';

export default class TimeLineItem extends Component {
  static propTypes = {
    module: PropTypes.string,
    title: PropTypes.string,
    message: PropTypes.string,
    color: PropTypes.string,
    icon: PropTypes.string,
  };

  render() {
    const styles = require('./TimeLineItem.scss');
    return (
      <div className={styles.timeLineItemContainer}>
        <p name="title" className={styles.itemTitle}>{this.props.title}</p>
        <p name="message" className={styles.itemMessage}>{this.props.message}</p>
        <p name="module" className={styles.itemModuleId}>{this.props.module}</p>
        <div name="color" className={styles.colorLine} style={{ backgroundColor: this.props.color }}></div>
      </div>
    );
  }
}

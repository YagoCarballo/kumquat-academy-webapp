/**
 * Created by yagocarballo on 04/02/2015.
 */
require('datejs');
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import { LevelListItem } from '../../../components';

@connect((state, props) => ({
  levels: state.classes.list[props.courseId][props.classId].levels,
}), { pushState })
export default class LevelsList extends Component {
  static propTypes = {
    levels: PropTypes.array.isRequired,
    classId: PropTypes.string.isRequired,
    courseId: PropTypes.string.isRequired,
    pushState: PropTypes.func.isRequired,
  };

  openLevel(level) {
    const { courseId, classId } = this.props;
    const path = '/course/' + courseId + '/class/' + classId + '/level/' + level;
    this.props.pushState(null, path);
  }

  render() {
    const styles = require('./LevelsList.scss');
    const { levels } = this.props;

    const listItems = [];
    for (const item of levels) {
      listItems.push(
        <div className={styles.listItemContainer}
             key={item.level}
             onClick={::this.openLevel.bind(this, item.level)}>
          <LevelListItem className={styles.listItem} level={item} />
        </div>
      );
    }

    return (
      <div className={styles.levelsList}>
        {listItems}
      </div>
    );
  }
}

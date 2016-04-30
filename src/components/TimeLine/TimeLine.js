/**
 * Created by yagocarballo on 28/12/2015.
 */
import React, {Component} from 'react';
import {TimeLineItem} from '../../components';

export default class TimeLine extends Component {
  render() {
    const items = [
      <TimeLineItem key={1} {...{ module: 'AC21009', title: 'Assignment 1 : Report', message: 'Due in 2 Hours', color: 'purple', icon: '' }} />,
      <TimeLineItem key={2} {...{ module: 'AC41008', title: 'Lecture', message: 'Dalhousie 2F11', color: 'blue', icon: '' }} />,
      <TimeLineItem key={3} {...{ module: 'AC31007', title: 'Lab', message: 'QMB Labs 1 and 2', color: 'red', icon: '' }} />,
      <TimeLineItem key={4} {...{ module: 'AC11006', title: 'Exam', message: 'Sports Area', color: '#FFEB3B', icon: '' }} />,
      <TimeLineItem key={5} {...{ module: 'AC21009', title: 'Assignment 1 : Presentation', message: 'Presentation Area', color: 'purple', icon: '' }} />,
    ];
    const styles = require('./TimeLine.scss');
    return (
      <div className={styles.timeLineContainer}>{items}</div>
    );
  }
}

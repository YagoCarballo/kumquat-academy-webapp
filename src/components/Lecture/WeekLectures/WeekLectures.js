/**
 * Created by yagocarballo on 27/02/2016.
 */
require('datejs');
import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { LectureSlot, LectureSlotForm } from '../../../components';

@connect((state, props) => ({
  weekDays: state.lectures.weekDays,
  slots: state.lectures.module[props.moduleCode].slots
}), null)
export default class WeekLectures extends Component {
  static propTypes = {
    moduleCode: PropTypes.string.isRequired,
    weekDays: PropTypes.array.isRequired,
    slots: PropTypes.object.isRequired
  };

  slotsFromWeek(days) {
    const slots = [];
    for (const key in days) {
      if (days.hasOwnProperty(key)) {
        slots.push(days[key]);
      }
    }
    return slots;
  }

  render() {
    const styles = require('./WeekLectures.scss');
    const { slots, weekDays, moduleCode } = this.props;
    const dayElements = [];
    for (const weekDay of weekDays) {
      const slotElements = [];
      let index = 0;
      for (const slot of this.slotsFromWeek(slots[weekDay])) {
        ++index;
        slotElements.push(
          <LectureSlot key={ slot.id }
                       weekDay={weekDay}
                       moduleCode={moduleCode}
                       id={slot.id}
                       type={slot.type}
                       start={String(slot.start)}
                       end={String(slot.end)}
                       location={slot.location} />
        );
      }
      dayElements.push(
        <div key={weekDay} className={styles.dayCol}>
          <span className={styles.title}>{weekDay}</span>
          <div className={styles.list}>
            { slotElements }
            <LectureSlotForm lectureSlot={{ id: 'new' }}
                             baseDate={Date[weekDay.toLowerCase()]().toString('yyyy-MM-ddTHH:mm:ssZ')}
                             buttonClass={styles.addButton}
                             moduleCode={moduleCode}
                             weekDay={weekDay} />
          </div>
        </div>
      );
    }
    return (
      <div className={styles.weekLecturesComponent}>
        <div>{ dayElements }</div>
      </div>
    );
  }
}

/**
 * Created by yagocarballo on 27/02/2015.
 */
import React, {Component, PropTypes} from 'react';
import { LectureSlotForm } from '../../../components';

export default class LectureSlot extends Component {
  static propTypes = {
    moduleCode: PropTypes.string.isRequired,
    weekDay: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    start: PropTypes.string.isRequired,
    end: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired
  };

  render() {
    const styles = require('./LectureSlot.scss');
    const { id, start, end, type, location, moduleCode, weekDay } = this.props;
    const slot = {
      id: id,
      type: type,
      start: Date.parse(start).toString('HH:mm'),
      end: Date.parse(end).toString('HH:mm'),
      location: location
    };
    return (
      <div className={styles.lectureSlotComponent}>
        <div className={styles.header}>
          <span className={styles.title}>{ type }</span>
        </div>
        <div className={styles.body}>
          <div className={styles.time}>
            <span className={styles.start}>{Date.parse(start).toString('HH:mm')}</span>
            { ' - ' }
            <span className={styles.end}>{Date.parse(end).toString('HH:mm')}</span>
          </div>
        </div>
        <div className={styles.actionBar}>
          <i className={'fa fa-trash ' + styles.actionButton + ' ' + styles.deleteButton} />
          <LectureSlotForm lectureSlot={slot}
                           weekDay={weekDay}
                           moduleCode={moduleCode}
                           baseDate={Date[weekDay.toLowerCase()]().toISOString()}
                           buttonClass={styles.actionButton + ' ' + styles.editButton}
                           containerClass={styles.buttonContainer}
                           editMode />
        </div>
        <div className={styles.footer}>
          <span className={styles.location}>
            { location }
          </span>
        </div>
      </div>
    );
  }
}

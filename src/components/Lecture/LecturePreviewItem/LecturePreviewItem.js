/**
 * Created by yagocarballo on 27/02/2015.
 */
import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';

@connect((state, props) => ({
  lecture: (((state.lectures.module[props.moduleCode] || { weeks: {} }).weeks[props.weekNumber] || { lectures: {} }
  ).lectures[props.weekDay] || {})[props.id]
}), null)
export default class LecturePreviewItem extends Component {
  static propTypes = {
    lecture: PropTypes.object,
    id: PropTypes.string.isRequired,
    slotId: PropTypes.number.isRequired,
    topic: PropTypes.string.isRequired,
    start: PropTypes.string.isRequired,
    end: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    moduleCode: PropTypes.string.isRequired,
    weekNumber: PropTypes.number.isRequired,
    weekDay: PropTypes.string.isRequired,
    empty: PropTypes.bool,
    onClick: PropTypes.func,
    viewOnly: PropTypes.bool
  };

  render() {
    const styles = require('./LecturePreviewItem.scss');
    const { start, end, topic, location, empty, onClick, lecture } = this.props;
    const parsedLecture = (lecture || {
      start: start,
      end: end,
      topic: location,
      location: location
    });
    const emptyStyle = (empty) ? (styles.empty) : '';
    const parsedStart = Date.parse(parsedLecture.start);
    const parsedEnd = Date.parse(parsedLecture.end);
    return (
      <div className={styles.lecturePreviewItemComponent + ' ' + emptyStyle} onClick={onClick}>
        <div className={styles.header}>
          <div className={styles.time}>
            <span className={styles.start}>{parsedStart.toString('HH:mm')}</span>
            { ' - ' }
            <span className={styles.end}>{parsedEnd.toString('HH:mm')}</span>
          </div>
          <div className={styles.title}>
            { empty &&
              parsedStart.toString('dddd')
            }
            { !empty &&
              parsedStart.toString('ddd, dd.MM.yyyy')
            }
          </div>
        </div>
        <div className={styles.body}>
          <p>{ topic }</p>
        </div>
        <div className={styles.footer}>
          <span className={styles.location}>
            { parsedLecture.location }
          </span>
        </div>
      </div>
    );
  }
}

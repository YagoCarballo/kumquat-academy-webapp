/**
 * Created by yagocarballo on 27/02/2015.
 */
import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { Accordion, Panel, Modal } from 'react-bootstrap';
import { LecturePreviewItem, LectureForm } from '../../../components';
import moment from 'moment';

@connect((state, props) => ({
  weekDays: state.lectures.weekDays,
  slots: state.lectures.module[props.moduleCode].slots,
  weeks: state.lectures.module[props.moduleCode].weeks
}), null)
export default class LectureWeekPanel extends Component {
  static propTypes = {
    moduleCode: PropTypes.string.isRequired,
    weekDays: PropTypes.array.isRequired,
    slots: PropTypes.object.isRequired,
    weeks: PropTypes.object.isRequired,
    onLectureSelected: PropTypes.func,
    viewOnly: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.state = {
      editLecture: null,
      weekDay: 'Monday',
      weekNumber: 1,
      empty: true
    };
  }

  slotsFromWeek(days) {
    const slots = [];
    for (const key in days) {
      if (days.hasOwnProperty(key)) {
        slots.push(days[key]);
      }
    }
    return slots;
  }

  lecturesFromWeek(days) {
    const lectures = [];
    for (const key in days) {
      if (days.hasOwnProperty(key)) {
        lectures.push(days[key]);
      }
    }
    return lectures;
  }

  listEmptySlots(weekDay, usedSlotIds) {
    const { slots } = this.props;
    const lectureSlots = this.slotsFromWeek(slots[weekDay]);
    const emptySlots = [];
    // Loop the slots and check if there is a match with the lecture
    for (const slot of lectureSlots) {
      if (usedSlotIds[slot.id]) {
        continue;
      }

      emptySlots.push(slot);
    }
    return emptySlots;
  }

  buildWeek(styles, viewOnly, week, weekDays, moduleCode) {
    let count = 0;
    const parsedWeek = week;

    // Create the Lecture Elements
    const dayElements = [];
    for (const weekDay of weekDays) {
      const usedSlotIds = {};
      const lectureElements = [];
      // Add Lectures
      const lectures = this.lecturesFromWeek(parsedWeek.lectures[weekDay]);
      for (const lecture of lectures) {
        // If on view only, don't display canceled lectures
        if (viewOnly && lecture.canceled) {
          continue;
        }

        ++count;
        lectureElements.push(
          <LecturePreviewItem key={'lecture_' + lecture.id}
                              slotId={lecture.lecture_slot_id}
                              moduleCode={moduleCode}
                              weekDay={weekDay}
                              weekNumber={parsedWeek.week}
                              id={String(lecture.id)}
                              topic={lecture.topic}
                              start={Date.parse(lecture.start).toString('yyyy-MM-ddTHH:mm')}
                              end={Date.parse(lecture.end).toString('yyyy-MM-ddTHH:mm')}
                              location={lecture.location}
                              onClick={::this.open.bind(this, lecture, weekDay, parsedWeek.week, false)}
                              viewOnly={viewOnly} />
        );
        if (lecture.lecture_slot_id) {
          usedSlotIds[lecture.lecture_slot_id] = true;
        }
      }

      // Add Empty Slots (Only on edit mode)
      if (!viewOnly) {
        const emptySlots = this.listEmptySlots(weekDay, usedSlotIds);
        for (const slot of emptySlots) {
          // Parse the start Date
          const slotStart = moment(slot.start);
          let lectureStart = moment(parsedWeek.start, 'YYYY-MM-DD');
          lectureStart = lectureStart.add(dayElements.length, 'day');
          lectureStart = lectureStart.hour(slotStart.hour()).minute(slotStart.minute());

          // Parse the end Date
          const slotEnd = moment(slot.end);
          let lectureEnd = moment(parsedWeek.start, 'YYYY-MM-DD');
          lectureEnd = lectureEnd.add(dayElements.length, 'day');
          lectureEnd = lectureEnd.hour(slotEnd.hour()).minute(slotEnd.minute());

          // Create the Empty Lecture
          const lecture = {
            id: 'new',
            topic: '',
            start: lectureStart.format('YYYY-MM-DDTHH:mm'),
            end: lectureEnd.format('YYYY-MM-DDTHH:mm'),
            location: slot.location,
            lectureSlotId: slot.id
          };

          // Add the slot to the list
          lectureElements.push(
            <LecturePreviewItem key={'slot_' + slot.id}
                                slotId={lecture.lectureSlotId}
                                moduleCode={moduleCode}
                                weekDay={weekDay}
                                weekNumber={parsedWeek.week}
                                id={lecture.id}
                                topic={lecture.topic}
                                start={lecture.start}
                                end={lecture.end}
                                location={lecture.location} empty
                                onClick={::this.open.bind(this, lecture, weekDay, parsedWeek.week, true)} />
          );
        }
      }

      dayElements.push(
        <div key={weekDay} className={styles.dayCol}>
          <span className={styles.title}>{weekDay}</span>
          <div className={styles.list}>
            { lectureElements }
          </div>
        </div>
      );
    }

    // Create a string with the first and last day of the lectures
    let duration = moment(parsedWeek.start, 'YYYY-MM-DD').format('DD.MM.YYYY');
    duration += ' - ';
    duration += moment(parsedWeek.end, 'YYYY-MM-DD').format('DD.MM.YYYY');

    // Create the Header for the Week Panel
    const headerElement = (
      <div className={styles.weekPanelHeader}>
        <span className={styles.title}>{'Week ' + parsedWeek.week}</span>
        <span className={styles.date}>{duration}</span>
      </div>
    );
    return (
      <Panel key={parsedWeek.week}
             className={styles.lectureWeekPanelComponent}
             header={headerElement}
             eventKey={parsedWeek.week}
             style={{ display: ((viewOnly && count === 0) ? 'none' : 'block') }}>
        <div className={styles.weekPanel}>{ dayElements }</div>
      </Panel>
    );
  }

  close() {
    if (this.props.viewOnly) {
      this.props.onLectureSelected();
    } else {
      this.setState({
        editLecture: null,
        weekDay: 'Monday',
        weekNumber: 1,
        empty: true
      });
    }
  }

  open(lecture, weekDay, weekNumber, empty) {
    if (this.props.viewOnly) {
      this.props.onLectureSelected(lecture, weekDay, weekNumber, empty);
    } else {
      lecture.start = Date.parse(lecture.start).toString('yyyy-MM-ddTHH:mm');
      lecture.end = Date.parse(lecture.end).toString('yyyy-MM-ddTHH:mm');
      this.setState({
        editLecture: lecture,
        weekDay: weekDay,
        weekNumber: weekNumber,
        empty: empty
      });
    }
  }

  render() {
    const styles = require('./LectureWeekPanel.scss');
    const { weeks, moduleCode, weekDays, viewOnly } = this.props;
    const { editLecture, weekDay, weekNumber, empty } = this.state;
    const weekElements = [];
    for (const key in weeks) {
      if (weeks.hasOwnProperty(key)) {
        weekElements.push(this.buildWeek(styles, viewOnly, weeks[key], weekDays, moduleCode));
      }
    }
    return (
      <div>
        <Accordion defaultActiveKey={1}>
          { weekElements }
        </Accordion>
        { !viewOnly &&
          <Modal show={editLecture !== null} onHide={::this.close} className={styles.form}>
            { editLecture &&
            <LectureForm lecture={editLecture}
                         moduleCode={moduleCode}
                         weekDay={weekDay}
                         weekNumber={weekNumber}
                         buttonClass={styles.overlay}
                         template={empty}
                         onClose={::this.close} />
            }
          </Modal>
        }
      </div>
    );
  }
}

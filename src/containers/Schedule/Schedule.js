require('datejs');
import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import { Modal, Button, FormControls } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';

import { isScheduleLoaded, loadSchedule } from 'redux/modules/lectures';

const MIN_TIME = 900;
const MAX_TIME = 1700 - MIN_TIME;
const CALENDAR_HEIGHT = 353;
const EVENT_HEIGHT = 45;
const EVENT_WIDTH = 160;

@connect((state) => ({
  weekDays: state.lectures.weekDays,
  schedule: state.lectures.schedule
}), {pushState})
export default class Schedule extends Component {
  static propTypes = {
    weekDays: PropTypes.array.isRequired,
    schedule: PropTypes.object.isRequired,
    pushState: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      activeLecture: null
    };
  }

  closeLecture() {
    this.setState({activeLecture: null});
  }

  openLecture(lecture) {
    this.setState({activeLecture: lecture});
  }

  static fetchData(getState, dispatch) {
    const promises = [];

    if (!isScheduleLoaded(getState())) {
      promises.push(dispatch(loadSchedule()));
    }

    return Promise.all(promises);
  }

  render() {
    const styles = require('./Schedule.scss');
    const { weekDays, schedule } = this.props;
    const { activeLecture } = this.state;
    let dayNumber = 0;
    const events = [];
    for (const weekDay of weekDays) {
      for (const lecture of schedule[weekDay]) {
        // Parse the Dates
        lecture.start = Date.parse(String(lecture.start));
        lecture.end = Date.parse(String(lecture.end));

        // Get the start and end hours in the date's time-zone
        const dayStart = lecture.start.at('9:00');
        const dayEnd = lecture.start.at('17:00');

        // If inside the allowed range, display the lectures
        if (lecture.start.between(dayStart, dayEnd)) {
          const totalStart = Number(lecture.start.toString('HHmm'));
          let totalEnd = Number(lecture.end.toString('HHmm'));
          if (Date.compare(lecture.end, dayEnd) === 1) {
            totalEnd = 1700;
          }
          // ((value - min) / (max - min)) * calendar-height
          const leftPos = (EVENT_WIDTH * dayNumber);
          const topPos = Math.ceil(((totalStart - MIN_TIME) / MAX_TIME) * CALENDAR_HEIGHT) + EVENT_HEIGHT;
          const height = Math.ceil((((totalEnd - MIN_TIME) / MAX_TIME) * CALENDAR_HEIGHT) - topPos) + (EVENT_HEIGHT - 2);

          events.push(<div key={lecture.id + ' - ' + dayNumber}
                           style={{ top: topPos + 'px', height: height + 'px', left: (leftPos) }}
                           className={styles.event}
                           onClick={::this.openLecture.bind(this, lecture)}>
            <div className={styles.colorBar} style={{ backgroundColor: lecture.module.color }}></div>
            <div className={styles.eventContent}>
              <div>
                <div className={styles.eventTopic}>{lecture.topic}</div>
                <div className={styles.eventLocation}>{lecture.location}</div>
              </div>
            </div>
          </div>);
        }
      }
      // Increment the day number
      dayNumber += 1;
    }
    // Parse the Attachments
    let attachmentElements = [];
    if (activeLecture) {
      attachmentElements = [];
      if (activeLecture.attachments) {
        for (const attachment of activeLecture.attachments) {
          attachmentElements.push(<li key={attachment.id}>
            <a href={'/api/api/v1/attachment/' + attachment.url} target="_blank">{attachment.name}</a>
          </li>);
        }
      }
    }
    return (
      <div className={'appContent ' + styles.schedulePage}>
        <div className={styles.schedulePageContainer}>
          <ul className={styles.schedulePageHours}>
            <li>9:00 - 10:00</li>
            <li>10:00 - 11:00</li>
            <li>11:00 - 12:00</li>
            <li>12:00 - 13:00</li>
            <li>13:00 - 14:00</li>
            <li>14:00 - 15:00</li>
            <li>15:00 - 16:00</li>
            <li>16:00 - 17:00</li>
          </ul>
          <table className={styles.schedulePageTable}>
            <thead className={styles.schedulePageTableHead}>
            <tr>
              <th>
                <FormattedMessage
                  id="schedule.monday"
                  description="Day of the week."
                  defaultMessage="Monday" />
              </th>
              <th>
                <FormattedMessage
                  id="schedule.tuesday"
                  description="Day of the week."
                  defaultMessage="Tuesday" />
              </th>
              <th>
                <FormattedMessage
                  id="schedule.wednesday"
                  description="Day of the week."
                  defaultMessage="Wednesday" />
              </th>
              <th>
                <FormattedMessage
                  id="schedule.thursday"
                  description="Day of the week."
                  defaultMessage="Thursday" />
              </th>
              <th>
                <FormattedMessage
                  id="schedule.friday"
                  description="Day of the week."
                  defaultMessage="Friday" />
              </th>
            </tr>
            </thead>
            <tbody>
            <tr rowSpan="2">
              <td>{''}</td>
              <td>{''}</td>
              <td>{''}</td>
              <td>{''}</td>
              <td>{''}</td>
            </tr>
            <tr>
              <td>{''}</td>
              <td>{''}</td>
              <td>{''}</td>
              <td>{''}</td>
              <td>{''}</td>
            </tr>
            <tr>
              <td>{''}</td>
              <td>{''}</td>
              <td>{''}</td>
              <td>{''}</td>
              <td>{''}</td>
            </tr>
            <tr>
              <td>{''}</td>
              <td>{''}</td>
              <td>{''}</td>
              <td>{''}</td>
              <td>{''}</td>
            </tr>
            <tr>
              <td>{''}</td>
              <td>{''}</td>
              <td>{''}</td>
              <td>{''}</td>
              <td>{''}</td>
            </tr>
            <tr>
              <td>{''}</td>
              <td>{''}</td>
              <td>{''}</td>
              <td>{''}</td>
              <td>{''}</td>
            </tr>
            <tr>
              <td>{''}</td>
              <td>{''}</td>
              <td>{''}</td>
              <td>{''}</td>
              <td>{''}</td>
            </tr>
            <tr>
              <td>{''}</td>
              <td>{''}</td>
              <td>{''}</td>
              <td>{''}</td>
              <td>{''}</td>
            </tr>
            </tbody>
          </table>
          {events}
        </div>
        { activeLecture &&
          <Modal show={activeLecture} onHide={::this.closeLecture}>
            <Modal.Header closeButton>
              <Modal.Title>{activeLecture.topic}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form className="form-horizontal">
                <FormControls.Static label="Topic" labelClassName="col-xs-2" wrapperClassName="col-xs-10">{activeLecture.topic}</FormControls.Static>
                <FormControls.Static label="Location" labelClassName="col-xs-2" wrapperClassName="col-xs-10">{activeLecture.location}</FormControls.Static>
                <FormControls.Static label="Start" labelClassName="col-xs-2" wrapperClassName="col-xs-10">{activeLecture.start.toString('dd.MM.yyyy HH:mm')}</FormControls.Static>
                <FormControls.Static label="End" labelClassName="col-xs-2" wrapperClassName="col-xs-10">{activeLecture.end.toString('dd.MM.yyyy HH:mm')}</FormControls.Static>
                <br />
                <hr />
                <div dangerouslySetInnerHTML={{__html: activeLecture.description}}></div>
                <hr />
                <br />
                <FormControls.Static label="Attachments" labelClassName="col-xs-2" wrapperClassName="col-xs-10"><ul>{attachmentElements}</ul></FormControls.Static>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={::this.closeLecture}>Close</Button>
            </Modal.Footer>
          </Modal>
        }
      </div>
    );
  }
}

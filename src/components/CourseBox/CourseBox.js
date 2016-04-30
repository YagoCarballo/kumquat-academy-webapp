/**
 * Created by yagocarballo on 28/12/2015.
 */
import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import { FormattedMessage } from 'react-intl';
import { Button, ButtonGroup } from 'react-bootstrap';
import { editStart } from 'redux/modules/courses';

@connect(null, {pushState, editStart})
export default class CourseBox extends Component {
  static propTypes = {
    id: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    pushState: PropTypes.func.isRequired,
    editStart: PropTypes.func.isRequired,
  };

  onClick(prefix, action) {
    if (action === '/edit') {
      this.props.editStart(String(this.props.id));
    }

    const to = prefix + '/course/' + this.props.id + action;
    this.props.pushState(null, to);
  }

  render() {
    const {title, description} = this.props;
    const styles = require('./CourseBox.scss');
    return (
      <div className={'well ' + styles.courseBox}>
        <h4>{ title }</h4>
        <p>{ description }</p>
        <ButtonGroup className={styles.actionButtons} vertical block>
          <Button onClick={::this.onClick.bind(this, '', '/info')} bsStyle="primary">
            <FormattedMessage
              id="course.open"
              description="Button to open a course."
              defaultMessage="Open Course" />
          </Button>
          <Button onClick={::this.onClick.bind(this, '/manage', '/modules')}>
            <FormattedMessage
              id="course.view-modules"
              description="Button to view the modules of a course."
              defaultMessage="View Modules" />
          </Button>
        </ButtonGroup>
      </div>
    );
  }
}

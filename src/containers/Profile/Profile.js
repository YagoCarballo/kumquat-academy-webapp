import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { Row, Col, Panel } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import * as authActions from 'redux/modules/auth';

@connect(
    state => ({user: state.auth.user}),
    authActions)
export default
class Profile extends Component {
  static propTypes = {
    user: PropTypes.object,
    logout: PropTypes.func
  };

  render() {
    const styles = require('./Profile.scss');
    const {user, logout} = this.props;
    const avatar = (user.avatar ? '/api/api/v1/attachment/' + user.avatar : '/default_avatar.svg');
    return (user &&
      <div className={'appContent container ' + styles.profilePage}>
        <Row className={styles.content}>
          <Col sm={4}>
            <div className={styles.studentCard}>
              <div className={styles.avatar} style={{ backgroundImage: 'url(' + avatar + ')' }}></div>
              <div className={styles.infoRow}>
                <b>
                  <FormattedMessage
                    id="profile.cardFirstName"
                    description="First Name label"
                    defaultMessage="First Name" />
                </b>
                <span>{user.first_name}</span>
              </div>
              <div className={styles.infoRow}>
                <b>
                  <FormattedMessage
                    id="profile.cardLastName"
                    description="Last Name label"
                    defaultMessage="Last Name" />
                </b>
                <span>{user.last_name}</span>
              </div>
              <div className={styles.infoRow}>
                <b>
                  <FormattedMessage
                    id="profile.cardMatriculationNumber"
                    description="Matriculation Number label"
                    defaultMessage="Matriculation Number" />
                </b>
                <span>{user.matric_number}</span>
              </div>
              <div className={styles.infoRow + ' ' + styles.email}>
                <b>
                  <FormattedMessage
                    id="profile.cardEmail"
                    description="Email label"
                    defaultMessage="Email" />
                </b>
                <span>{user.email}</span>
              </div>
            </div>
            <br />
            <p>
              <FormattedMessage
                id="profile.welcome"
                description="Welcome message."
                defaultMessage="Welcome to Kumquat Academy {firstName} {lastName}!!."
                values={{
                  firstName: <b>{user.first_name}</b>,
                  lastName: <b>{user.last_name}</b>
                }} />
            </p>
            <br />
            <div>
              <button className="btn btn-danger" onClick={logout}><i className="fa fa-sign-out"/>
                {' '}
                <FormattedMessage
                  id="profile.logout"
                  description="Log Out button in the Profile"
                  defaultMessage="Logout" />
              </button>
            </div>
          </Col>
          <Col sm={8} sm-offset={1}>
            <Panel className={styles.newsPanel}>{' '}</Panel>
          </Col>
        </Row>
      </div>
    );
  }
}

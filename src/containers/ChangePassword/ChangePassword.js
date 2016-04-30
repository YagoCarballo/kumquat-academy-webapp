import React, {Component, PropTypes} from 'react';
import crypto from 'crypto';
import {connect} from 'react-redux';
import { pushState } from 'redux-router';
import DocumentMeta from 'react-document-meta';
import * as authActions from 'redux/modules/auth';

@connect(
  state => ({
    token: state.router.params.token,
    error: state.auth.error
  }),
  { ...authActions, pushState })
export default class ChangePassword extends Component {
  static propTypes = {
    error: PropTypes.object,
    token: PropTypes.string.isRequired,
    changePassword: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      errors: [],
      stateStyles: {
        newPassword: '',
        repeatPassword: ''
      }
    };

    this.user = {
      newPassword: '',
      repeatPassword: ''
    };
  }

  onChange(event) {
    event.preventDefault();
    const stateUser = this.state.stateStyles;
    if (this.state.errors.length !== 0) {
      this.setState({ errors: [] });
    }

    if (event.target.name === 'new_password') {
      const newPassword = event.target.value;
      if (newPassword.length < 4 || newPassword.length > 20) {
        stateUser.newPassword = 'invalid';
      } else {
        this.user.newPassword = newPassword;
        stateUser.newPassword = 'valid';
      }
    }

    if (event.target.name === 'repeat_password') {
      const repeatPassword = event.target.value;
      if (repeatPassword.length < 4 || repeatPassword.length > 20) {
        stateUser.repeatPassword = 'invalid';
      } else {
        this.user.repeatPassword = repeatPassword;
        stateUser.repeatPassword = 'valid';
      }
    }

    return this.setState({ user: stateUser });
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.state.stateStyles.newPassword === 'valid' && this.user.newPassword === this.user.repeatPassword) {
      const hash = crypto.createHash('sha512').update(this.user.newPassword);
      this.props.changePassword(this.props.token, hash.digest('hex')).then(result => {
        if (result && typeof result.error === 'object') {
          return Promise.reject(result.error);
        }
        this.props.pushState(null, '/');
      });
    } else {
      const errors = [];
      if (this.state.stateStyles.newPassword === 'valid') {
        errors.push(<li>Invalid password</li>);
      }
      if (this.user.newPassword === this.user.repeatPassword) {
        errors.push(<li>Passwords do not match</li>);
      }
      this.setState({ errors: errors });
    }
  }

  render() {
    const {errors, stateStyles} = this.state;
    const styles = require('./ChangePassword.scss');
    const { error } = this.props;
    return (
      <div className={'appContent ' + styles.changePasswordPage}>
        <DocumentMeta title="Kumquat Academy: Change Password"/>
        <div className={styles.changePasswordContainer}>
          <div className={styles.changePasswordContainerHeader}>
            <h3>Change Password</h3>
          </div>
          <form onSubmit={::this.handleSubmit}>
            <div>
              <input name="new_password"
                type="password"
                placeholder="Enter the new password"
                onChange={::this.onChange}
                className={styles[stateStyles.newPassword]} />
            </div>
            <div>
              <input name="repeat_password"
                type="password"
                placeholder="Repeat new password"
                onChange={::this.onChange}
                className={styles[stateStyles.repeatPassword]} />
            </div>
            <div>
              <input className={styles.submitButton} type="submit" value="Change Password" />
            </div>
          </form>
          <div className={styles.errorBox}>
            <ul>{errors}</ul>
            {error &&
              <ul>
                <li>{error.message}</li>
              </ul>
            }
          </div>
        </div>
      </div>
    );
  }
}

import React, {Component, PropTypes} from 'react';
import crypto from 'crypto';
import { Link } from 'react-router';
import {connect} from 'react-redux';
import DocumentMeta from 'react-document-meta';
import * as authActions from 'redux/modules/auth';

@connect(
  state => ({
    user: state.auth.user,
    loginError: state.auth.loginError,
  }),
  authActions)
export default class Login extends Component {
  static propTypes = {
    user: PropTypes.object,
    login: PropTypes.func,
    loginError: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      errors: [],
      stateStyles: {
        username: '',
        password: '',
      },
    };

    this.user = {
      username: '',
      password: '',
    };
  }

  onChange(event) {
    event.preventDefault();
    const stateUser = this.state.stateStyles;
    if (this.state.errors.length !== 0) {
      this.setState({ errors: [] });
    }

    if (event.target.name === 'username') {
      const username = event.target.value;
      if (username.length < 4 || username.length > 20) {
        stateUser.username = 'invalid';
      } else {
        this.user.username = username;
        stateUser.username = 'valid';
      }
    }

    if (event.target.name === 'password') {
      const password = event.target.value;
      if (password.length < 4 || password.length > 20) {
        stateUser.password = 'invalid';
      } else {
        this.user.password = password;
        stateUser.password = 'valid';
      }
    }

    return this.setState({ user: stateUser });
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.state.stateStyles.username === 'valid' && this.state.stateStyles.password === 'valid') {
      const hash = crypto.createHash('sha512').update(this.user.password);
      this.user.password = hash.digest('hex');
      this.props.login(this.user);
    } else {
      const errors = [];
      if (this.state.stateStyles.username === 'invalid' || this.user.username.length === 0) {
        errors.push(<li>Invalid Username</li>);
      }

      if (this.state.stateStyles.password === 'invalid' || this.user.password.length === 0) {
        errors.push(<li>Invalid Password</li>);
      }

      this.setState({ errors: errors });
    }
  }

  render() {
    const {errors, stateStyles} = this.state;
    const styles = require('./Login.scss');
    const {loginError} = this.props;
    return (
      <div className={'appContent ' + styles.loginPage}>
        <DocumentMeta title="Kumquat Academy: Login"/>
        <div className={styles.signInBoxContainer}>
          <div className={styles.signInBoxContainerHeader}>
            <h3>Sign In</h3>
          </div>
          <form onSubmit={::this.handleSubmit}>
            <div>
              <input name="username"
                type="text"
                placeholder="Enter your username"
                onChange={::this.onChange}
                className={styles[stateStyles.username]} />
            </div>
            <div>
              <input name="password"
                type="password"
                placeholder="Enter your password"
                onChange={::this.onChange}
                className={styles[stateStyles.password]} />
            </div>
            <div>
              <input className={styles.submitButton} type="submit" value="Sign In" />
            </div>
          </form>
          <Link className={styles.forgotLink} to="/forgot-password">Forgot Password?</Link>
          <div className={styles.errorBox}>
            <ul>{errors}</ul>
            {loginError &&
              <ul>
                <li>{loginError.message}</li>
              </ul>
            }
          </div>
        </div>
      </div>
    );
  }
}

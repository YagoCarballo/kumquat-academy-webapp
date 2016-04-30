import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import { reduxForm } from 'redux-form';
import { pushState } from 'redux-router';
import { Input } from 'react-bootstrap';
import DocumentMeta from 'react-document-meta';
import * as authActions from 'redux/modules/auth';
import forgotValidation from './forgotValidation';

@connect(
  state => ({
    error: state.auth.error,
    result: state.result
  }),
  {...authActions, pushState}
)
@reduxForm({
  form: 'reset-password',
  fields: [
    'email'
  ],
  validate: forgotValidation
})
export default class ForgotPassword extends Component {
  static propTypes = {
    error: PropTypes.object,
    result: PropTypes.object,

    // Action Triggers
    forgotPassword: PropTypes.func,
    pushState: PropTypes.func,

    // Redux Form
    resetForm: PropTypes.func.isRequired,
    fields: PropTypes.object.isRequired,
    values: PropTypes.object.isRequired,
    invalid: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired
  };

  handleSubmit(event) {
    event.preventDefault();
    const { forgotPassword, values } = this.props;
    this.setState({ form: 'loading' });
    forgotPassword(values.email).then(result => {
      if (result && typeof result.error === 'object') {
        return Promise.reject(result.error);
      }
      this.props.pushState(null, '/');
    });
  }

  render() {
    const styles = require('./ForgotPassword.scss');
    const {
      error,
      fields: { email },
      invalid, pristine, submitting
    } = this.props;
    const validation = {
      email: (email.error && email.touched) ? 'error' : null
    };
    return (
      <div className={'appContent ' + styles.forgotPage}>
        <DocumentMeta title="Kumquat Academy: Forgot Password"/>
        <div className={styles.forgotBoxContainer}>
          <div className={styles.forgotBoxContainerHeader}>
            <h3>Remember Password</h3>
          </div>
          <form onSubmit={::this.handleSubmit}>
            <div>
              <Input bsStyle={validation.email}
                     type="email"
                     placeholder="Enter your email."
                     help={ (email.error && email.touched) ? email.error : '' }
                     hasFeedback
                {...email} />
            </div>
            <div>
              <input className={styles.submitButton}
                     type="submit"
                     value="Reset password"
                     disabled={ pristine || invalid || submitting } />
            </div>
            <div className={styles.errorBox}>
              {error &&
                <ul>
                  <li>{error.message}</li>
                </ul>
              }
            </div>
          </form>
        </div>
      </div>
    );
  }
}

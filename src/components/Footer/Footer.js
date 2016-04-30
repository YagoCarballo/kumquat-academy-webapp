import React, {Component, PropTypes} from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import * as languageActions from 'redux/modules/languages';

@connect(null, languageActions)
export default class Footer extends Component {
  static propTypes = {
    changeLocale: PropTypes.func,
  };

  setLocale = (locale) => {
    this.props.changeLocale(locale);

    // Temporary hack, to force the language change
    window.location.reload();
  };

  render() {
    const styles = require('./Footer.scss');
    return (
      <footer className={styles.footer}>
        <div className={'container-fluid ' + styles.footerWrapper}>
          <div className={styles.feedback}>
            <div className={styles.feedbackContainer}>
              <Link className={styles.feedbackLink} to="/feedback/comments">
                <FormattedMessage
                  id="footer.question"
                  description="Button to ask questions on footer."
                  defaultMessage="Ask a question"/>
              </Link>
              <span className={styles.feedbackSpacer}>|</span>
              <Link className={styles.feedbackLink} to="/feedback/issues">
                <FormattedMessage
                  id="footer.issue"
                  description="Button to report an issue on footer."
                  defaultMessage="Report an issue"/>
              </Link>
            </div>
          </div>

          <div className={styles.footerContainer}>
            <span className={styles.footerText}>© Kumquat Academy</span>
            <span className={styles.footerSpacer}>·</span>
            <Link className={styles.footerLink} to="/">
              <FormattedMessage
                id="footer.home"
                description="Button to load the Home page on footer."
                defaultMessage="Home"/>
            </Link>
            <span className={styles.footerSpacer}>·</span>
            <Link className={styles.footerLink} to="/privacy">
              <FormattedMessage
                id="footer.privacy"
                description="Button to show the privacy terms on footer."
                defaultMessage="Privacy"/>
            </Link>
            <span className={styles.footerSpacer}>·</span>
            <span className={styles.footerLink} onClick={::this.setLocale.bind(this, 'en')}>
             <FormattedMessage
               id="languages.english"
               description="Name of the language."
               defaultMessage="English"/>
             </span>
             <span className={styles.footerLink} onClick={::this.setLocale.bind(this, 'es')}>
             <FormattedMessage
               id="languages.spanish"
               description="Name of the language."
               defaultMessage="Spanish"/>
             </span>
            <span className={styles.footerSpacer}>·</span>
            <Link className={styles.footerLink} to="/not-found">
              <FormattedMessage
                id="footer.not-found"
                description="Not found button on the footer."
                defaultMessage="Not found"/>
            </Link>
          </div>
        </div>
      </footer>
    );
  }
}

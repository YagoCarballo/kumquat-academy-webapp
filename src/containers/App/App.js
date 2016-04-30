import React, { Component, PropTypes } from 'react';
import { IntlProvider, addLocaleData } from 'react-intl';
import { connect } from 'react-redux';
import DocumentMeta from 'react-document-meta';
import { isLoaded as isTranslationLoaded, load as loadTranslations } from 'redux/modules/languages';
import { isLoaded as isAuthLoaded, load as loadAuth } from 'redux/modules/auth';
import { Footer, NavigationBar } from 'components';
import { pushState } from 'redux-router';
import config from '../../config';

import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext as dragDropContext } from 'react-dnd';

// Loads the Supported Locales
import en from 'react-intl/lib/locale-data/en';
import es from 'react-intl/lib/locale-data/es';

// Adds the Available Locales
addLocaleData(en);
addLocaleData(es);

@connect(
  state => ({
    user: state.auth.user,
    translation: state.languages.translation,
    path: state.router.location.pathname,
    style: { height: '100%' }
  }),
  {pushState})
@dragDropContext(HTML5Backend)
export default class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    translation: PropTypes.object.isRequired,
    user: PropTypes.object,
    pushState: PropTypes.func.isRequired,
    path: PropTypes.string.isRequired,
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  componentWillReceiveProps(nextProps) {
    if (!this.props.user && nextProps.user) {
      // login
      this.props.pushState(null, '/profile');
    } else if (this.props.user && !nextProps.user) {
      // logout
      this.props.pushState(null, '/');
    }
  }

  static fetchData(getState, dispatch) {
    const promises = [];

    if (!isTranslationLoaded(getState())) {
      promises.push(dispatch(loadTranslations()));
    }

    if (!isAuthLoaded(getState())) {
      promises.push(dispatch(loadAuth()));
    }

    return Promise.all(promises);
  }

  render() {
    const translation = this.props.translation;
    const styles = require('./App.scss');
    return (
      <IntlProvider className={styles.intlWrapper} locale={translation.locale} messages={translation.messages} >
        <div className={styles.app}>
          <DocumentMeta {...config.app}/>
          <NavigationBar />
          <div className={styles.wrapper}>
            {this.props.children}
            <div className={styles.push}></div>
          </div>
          <Footer />
        </div>
      </IntlProvider>
    );
  }
}

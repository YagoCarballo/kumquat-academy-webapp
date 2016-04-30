/**
 * Created by yagocarballo on 28/12/2015.
 */
import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { IndexLink } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { logout } from 'redux/modules/auth';
import { FormattedMessage } from 'react-intl';

@connect(state => ({user: state.auth.user}), {logout})
export default class NavigationBar extends Component {
  static propTypes = {
    user: PropTypes.object,
    logout: PropTypes.func.isRequired,
  };

  handleLogout(event) {
    event.preventDefault();
    this.props.logout();
  }

  render() {
    const {user} = this.props;
    const styles = require('./NavigationBar.scss');
    return (
      <Navbar className={styles.navigationBar} fixedTop fluid>
        <Navbar.Header>
          <Navbar.Brand>
            <IndexLink to="/" activeStyle={{color: '#33e0ff'}}>
              <div className={styles.brand}></div>
            </IndexLink>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>

        <Navbar.Collapse>
          <Nav navbar className={styles.leftNav}>
            {user && <LinkContainer to="/modules">
              <NavItem eventKey={1}>
                <FormattedMessage
                  id="navigation.modules"
                  description="Modules button in the Navigation Bar"
                  defaultMessage="Modules" />
              </NavItem>
            </LinkContainer>}

            {user && <LinkContainer to="/schedule">
              <NavItem eventKey={2}>
                <FormattedMessage
                  id="navigation.schedule"
                  description="Schedule button in the Navigation Bar"
                  defaultMessage="Schedule" />
              </NavItem>
            </LinkContainer>}

            <LinkContainer to="/news">
              <NavItem eventKey={3}>
                <FormattedMessage
                  id="navigation.news"
                  description="News button in the Navigation Bar"
                  defaultMessage="News" />
              </NavItem>
            </LinkContainer>
            <LinkContainer to="/contact-us">
              <NavItem eventKey={4}>
                <FormattedMessage
                  id="navigation.contact-us"
                  description="Contact Us button in the Navigation Bar"
                  defaultMessage="Contact Us" />
              </NavItem>
            </LinkContainer>
          </Nav>
          <Nav navbar pullRight>
            {user &&
            <LinkContainer to="/profile">
              <p className={styles.loggedInMessage + ' navbar-text'}>
                <FormattedMessage
                  id="navigation.logged-in-message"
                  description="Message displayed at the navigation bar when logged in"
                  defaultMessage="Logged in as {username}."
                  values={{
                    username: <strong>{user.username}</strong>,
                  }} />
              </p>
            </LinkContainer>}
            {user && user.admin &&
            <LinkContainer to="/manage">
              <NavItem eventKey={5}>
                <FormattedMessage
                    id="navigation.manage"
                    description="Manage button in the Navigation Bar"
                    defaultMessage="Manage" />
              </NavItem>
            </LinkContainer>}
            {!user &&
            <LinkContainer to="/login">
              <NavItem eventKey={6}>
                <FormattedMessage
                  id="navigation.login"
                  description="Sign In button in the Navigation Bar"
                  defaultMessage="Login" />
              </NavItem>
            </LinkContainer>}
            {user &&
            <LinkContainer to="/logout">
              <NavItem eventKey={7} className="logout-link" onClick={::this.handleLogout}>
                <FormattedMessage
                  id="navigation.logout"
                  description="Log Out button in the Navigation Bar"
                  defaultMessage="Logout" />
              </NavItem>
            </LinkContainer>}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

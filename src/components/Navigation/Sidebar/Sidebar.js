/**
 * Created by yagocarballo on 28/12/2015.
 */
import React, { Component, PropTypes } from 'react';
import { NavItem, Nav, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

export default class Sidebar extends Component {
  static propTypes = {
    items: PropTypes.arrayOf(React.PropTypes.object).isRequired,
  };

  buildMenu =(items, styles) => {
    const listItems = [];
    for (const item of items) {
      listItems.push(
        <LinkContainer key={item.key} to={item.to}>
          <NavItem className={styles.navItem} eventKey={item.key}>{item.title}</NavItem>
        </LinkContainer>
      );
    }
    return listItems;
  };

  render() {
    const styles = require('./Sidebar.scss');
    const menuOptions = this.buildMenu(this.props.items, styles);
    return (
      <Col sm={2} className={styles.sidebarCol}>
        <Nav className={styles.sidebarContainer} bsStyle="pills" stacked activeKey={1}>
          {menuOptions}
        </Nav>
      </Col>
    );
  }
}

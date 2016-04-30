/**
 * Created by yagocarballo on 10/02/2016.
 */
import React, { Component, PropTypes } from 'react';
import { NavItem, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

export default class Tabs extends Component {
  static propTypes = {
    items: PropTypes.arrayOf(React.PropTypes.object).isRequired,
  };

  buildMenu =(items, styles) => {
    const listItems = [];
    for (const item of items) {
      listItems.push(
        <LinkContainer key={item.key} to={item.to} onlyActiveOnIndex={item.index}>
          <NavItem className={styles.navItem} eventKey={item.key}>{item.title}</NavItem>
        </LinkContainer>
      );
    }
    return listItems;
  };

  render() {
    const styles = require('./Tabs.scss');
    const menuOptions = this.buildMenu(this.props.items, styles);
    return (
      <Nav className={styles.navBar} bsStyle="tabs" activeKey={1}>
        {menuOptions}
      </Nav>
    );
  }
}

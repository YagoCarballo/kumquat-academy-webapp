/**
 * Created by yagocarballo on 06/02/2015.
 */
import React, {Component, PropTypes} from 'react';
import { ListGroupItem, Row, Col } from 'react-bootstrap';

export default class ModuleListItem extends Component {
  static propTypes = {
    module: PropTypes.object.isRequired,
    active: PropTypes.bool,
    onClick: PropTypes.func
  };

  render() {
    const { module, active, onClick } = this.props;
    const styles = require('./ModuleListItem.scss');
    const globalClass = active ? 'active ' : '';
    const click = (onClick || function empty() {});

    return (
      <ListGroupItem className={globalClass + styles.moduleItem} onClick={click}>
        <Row>
          <Col xs={2} className={styles.iconColumn}>
            <div className={styles.moduleIconContainer} style={{ backgroundColor: module.color }}>
              <i className={'fa ' + module.icon + ' ' + styles.moduleIcon}/>
            </div>
          </Col>
          <Col xs={10} className={styles.codeColumn}>
            <b>{module.title}</b>
            <p>{module.description}</p>
          </Col>
        </Row>
      </ListGroupItem>
    );
  }
}

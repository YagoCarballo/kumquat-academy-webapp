/**
 * Created by yagocarballo on 30/01/2015.
 */
require('datejs');
import React, {Component, PropTypes} from 'react';
import { Row, Col, ListGroupItem } from 'react-bootstrap';

export default class LevelListItem extends Component {
  static propTypes = {
    level: PropTypes.object,
    className: PropTypes.string,
  };

  render() {
    const { className, level: { level, start, end }} = this.props;
    const dates = Date.parse(start).toString('dd.MM.yyyy') + ' - ' + Date.parse(end).toString('dd.MM.yyyy');
    const styles = require('./LevelListItem.scss');
    return (
      <ListGroupItem className={className + ' ' + styles.levelListItem}>
        <Row>
          <Col sm={9}>
            <Row><b className={styles.title}>{'Level ' + level}</b></Row>
            <Row><p className={styles.dates}>{dates}</p></Row>
          </Col>
          <Col sm={3}>
            <Row className={styles.actionButton}><i className="fa fa-trash" /> Delete</Row>
            <Row className={styles.actionButton}><i className="fa fa-pencil-square-o" /> Edit</Row>
          </Col>
        </Row>
      </ListGroupItem>
    );
  }
}

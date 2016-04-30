/**
 * Created by yagocarballo on 30/01/2015.
 */
import React, {Component, PropTypes} from 'react';
import LevelListItem from '../LevelListItem/LevelListItem';
import { Grid, Row, Col, Input, Button, ListGroup } from 'react-bootstrap';
require('datejs');

export default class LevelsInput extends Component {
  static propTypes = {
    label: PropTypes.string,
    levels: PropTypes.array,
    onChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    const levels = (props.levels || []);
    const lastLevel = (levels[levels.length - 1] || { level: 1, start: Date.today(), end: Date.today(), });
    this.state = {
      levels: levels,
      level: {
        level: { value: (levels.length + 1), valid: true, },
        start: { value: Date.parse('' + lastLevel.end).add(1).days(), valid: true, },
        end: { value: Date.parse('' + lastLevel.end).add(1).days().add(1).years(), valid: true, },
      },
    };
  }

  addLevel() {
    const levels = this.state.levels;
    const lastLevel = this.state.level;
    levels.push({
      level: this.state.level.level.value,
      start: this.state.level.start.value,
      end: this.state.level.end.value,
    });

    // Update the State
    this.setState({
      levels: levels,
      level: {
        level: { value: (levels.length + 1), valid: true, },
        start: { value: Date.parse(lastLevel.end.value).add(1).days(), valid: true, },
        end: { value: Date.parse(lastLevel.end.value).add(1).days().add(1).years(), valid: true, },
      },
    });

    // Notify the parent
    this.props.onChange(levels);
  }

  levelChanged(event) {
    const lvl = event.target.valueAsNumber;
    const levels = this.state.levels;
    const duplicated = levels.find(item => item.level === lvl);
    const level = {
      value: lvl,
      valid: (duplicated === undefined && lvl > 0),
    };

    this.setState({ level: {
      ...this.state.level,
      level: level
    }});
  }

  startChanged(event) {
    const start = (event.target.valueAsDate || '');
    const isValid = (start instanceof Date);
    // Update the end to be 1 Year after the start
    let end = this.state.level.end;
    if (isValid) {
      end = {
        value: Date.parse(start.toString()).add(1).years(),
        valid: true
      };
    }
    this.setState({ level: {
      ...this.state.level,
      end: end,
      start: {
        value: start,
        valid: isValid,
      }
    }});
  }

  endChanged(event) {
    const start = this.state.level.start.value;
    const end = (event.target.valueAsDate || '');
    const isValid = (end instanceof Date && start instanceof Date && start < end);

    this.setState({ level: {
      ...this.state.level,
      end: {
        value: end,
        valid: isValid,
      }
    }});
  }

  render() {
    const { label } = this.props;
    const { level, levels } = this.state;
    const styles = require('./LevelsInput.scss');

    const initial = {
      level: level.level.value,
      start: level.start.value.toString('yyyy-MM-dd'),
      end: level.end.value.toString('yyyy-MM-dd'),
    };

    const levelIsValid = !(level.level.valid && level.start.valid && level.end.valid);

    const levelItems = [];
    for (const item of levels) {
      levelItems.push(<LevelListItem key={item.level} level={item} />);
    }

    return (
      <div>
        <label className="control-label">{ label }</label>
        <div className={styles.levelsInput}>
          <Grid fluid>
            <Row className={'well ' + styles.addLevelWell}>
              <Col sm={2}>
                <Input ref="levelNumber"
                       name="level"
                       type="number"
                       min={1}
                       label="Level"
                       help={ '' }
                       value={initial.level}
                       onChange={::this.levelChanged}
                       placeholder="Level" />
              </Col>
              <Col sm={4}>
                <Input ref="levelStart"
                       name="start"
                       type="date"
                       label="Start"
                       help={ '' }
                       value={initial.start}
                       onChange={::this.startChanged}
                       placeholder="Enter the Start Date" />
              </Col>
              <Col sm={4}>
                <Input ref="levelEnd"
                       name="end"
                       type="date"
                       label="End"
                       help={ '' }
                       value={initial.end}
                       onChange={::this.endChanged}
                       placeholder="Enter the End Date" />
              </Col>
              <Col sm={2} className={styles.addButtonCol}>
                <Button bsStyle="default"
                        onClick={::this.addLevel}
                        className={styles.addButton}
                        disabled={levelIsValid}>Add</Button>
              </Col>
            </Row>
            <Row className={styles.levelsRow}>
              <ListGroup className={styles.levelsList}>
                {levelItems}
              </ListGroup>
            </Row>
          </Grid>
        </div>
      </div>
    );
  }
}

/**
 * Created by yagocarballo on 09/01/2015.
 */
import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';
import * as modulesActions from 'redux/modules/modules';

@connect(state => ({
  colorPalette: state.modules.colorPalette,
}), dispatch => bindActionCreators(modulesActions, dispatch))
export default class ColorPicker extends Component {
  static propTypes = {
    label: PropTypes.string,
    editColor: PropTypes.func.isRequired,
    color: PropTypes.object.isRequired,
    colorPalette: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      selected: 0,
      value: null,
    };

    this.state.value = props.colorPalette[this.state.selected];
  }

  pickColor(index, color) {
    this.props.editColor(color);
    this.setState({
      value: color,
      selected: index,
    });
    this.props.color.onChange({
      value: color,
      touch: true,
    });
  }

  render() {
    const { colorPalette } = this.props;
    const { selected, value } = this.state;
    const styles = require('./ColorPicker.scss');

    let index = 0;
    const colorBoxes = [];
    for (const color of colorPalette) {
      let colorBoxStyles = styles.colorBox;
      if (index === selected) {
        colorBoxStyles += ' ' + styles.selected;
      }

      colorBoxes.push(<div key={index}
        className={colorBoxStyles}
        onClick={::this.pickColor.bind(this, index, color)}
        style={{ backgroundColor: color }}></div>);
      index++;
    }

    return (
      <div>
        <label className="control-label">{this.props.label}</label>
        <div className={'well ' + styles.colorPickerScroll}>
          <div className={styles.colorPickerBox}>
            {colorBoxes}
          </div>
        </div>
        <input type="text" value={value} name="color" hidden readOnly />
      </div>
    );
  }
}

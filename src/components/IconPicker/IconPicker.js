/**
 * Created by yagocarballo on 09/01/2015.
 */
import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';
import * as modulesActions from 'redux/modules/modules';

@connect(state => ({
  iconList: state.modules.icons,
  defaultIcon: state.modules.defaultIcon,
}), dispatch => bindActionCreators(modulesActions, dispatch))
export default class IconPicker extends Component {
  static propTypes = {
    label: PropTypes.string,
    iconList: PropTypes.array.isRequired,
    defaultIcon: PropTypes.number.isRequired,
    editIcon: PropTypes.func.isRequired,
    icon: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      selected: this.props.defaultIcon,
      value: props.iconList[this.props.defaultIcon],
    };
  }

  componentDidMount() {
    // Scroll to the default Icon
    setTimeout(() => {
      const scrollNode = this.refs.iconsPicker;
      const iconNode = this.refs.selectedIcon;
      if (iconNode && scrollNode) {
        scrollNode.scrollTop = (iconNode.offsetTop - iconNode.parentNode.offsetTop);
      }
    }, 100);
  }

  pickIcon(index, icon) {
    this.props.editIcon(icon);
    this.setState({
      value: icon,
      selected: index,
    });
    this.props.icon.onChange({
      value: icon,
      touch: true,
    });
  }

  render() {
    const { selected, value } = this.state;
    const styles = require('./IconPicker.scss');

    let index = 0;
    const iconBoxes = [];
    for (const iconName of this.props.iconList) {
      if (index === selected) {
        iconBoxes.push(<div key={index} ref="selectedIcon"
                            className={styles.iconBox + ' fa ' + iconName + ' ' + styles.selected}
                            onClick={::this.pickIcon.bind(this, index, iconName)}></div>);
      } else {
        iconBoxes.push(<div key={index}
                            className={styles.iconBox + ' fa ' + iconName}
                            onClick={::this.pickIcon.bind(this, index, iconName)}></div>);
      }

      index++;
    }

    return (
      <div>
        <label className="control-label">{this.props.label}</label>
        <div ref="iconsPicker" className={'well ' + styles.iconsPicker}>
          <div className={styles.iconsPickerBox}>
            {iconBoxes}
          </div>
        </div>
        <input type="text" value={value} name="icon" hidden readOnly />
      </div>
    );
  }
}

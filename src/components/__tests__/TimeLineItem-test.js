import React from 'react';
import ReactDOM from 'react-dom';
import {renderIntoDocument} from 'react-addons-test-utils';
import { expect} from 'chai';
import { TimeLineItem } from 'components';

describe('TimeLineItem', () => {
  const mockProperties = {
    module: 'AC21009',
    title: 'Assignment 1 : Report',
    message: 'Due in 2 Hours',
    color: 'purple',
    icon: '',
  };

  const renderer = renderIntoDocument(
    <TimeLineItem {...mockProperties} />
  );
  const dom = ReactDOM.findDOMNode(renderer);

  it('should render correctly', () => {
    return expect(renderer).to.be.ok;
  });

  it('should render with correct values', () => {
    const title = dom.querySelector('p[name=title]').textContent;
    const module = dom.querySelector('p[name=module]').textContent;
    const message = dom.querySelector('p[name=message]').textContent;
    const color = dom.querySelector('div[name=color]').style.backgroundColor;
    expect(title).to.equal(mockProperties.title);
    expect(module).to.equal(mockProperties.module);
    expect(message).to.equal(mockProperties.message);
    expect(color).to.equal(mockProperties.color);
  });

  it('should render the correct className', () => {
    const styles = require('components/TimeLine/TimeLineItem/TimeLineItem.scss');
    expect(styles.timeLineItemContainer).to.be.a('string');
    expect(dom.className).to.include(styles.timeLineItemContainer);
  });

});

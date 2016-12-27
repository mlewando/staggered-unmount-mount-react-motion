import React from 'react';
import {TransitionMotion, spring} from 'react-motion';

export default ({list}) => (
  <TransitionMotion
    willLeave={() => ({h: spring(0)})}
    willEnter={() => ({h: 0})}
    styles={list.map(item => ({
      key: item,
      data: item,
      style: {
        h: spring(18)
      }
    }))}
    >
    {interpolatedData => (
      <div>
        {interpolatedData.map(config => (
          <div key={config.key} style={{height: config.style.h, overflow: 'hidden'}}>
            {config.data}
          </div>
        ))}
      </div>
    )}
  </TransitionMotion>
);

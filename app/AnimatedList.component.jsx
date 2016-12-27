import React from 'react';

export default props => (
  <div>
    {props.list.map(item => (
      <div key={item}>{item}</div>
    ))}
  </div>
);

import React from 'react';
import List from './AnimatedList.component';

export default ({children}) =>
    <List list={children.map(element => ({key: element.key, element}))}
          getKey={data => data.key}
          render={data => data.element} />;

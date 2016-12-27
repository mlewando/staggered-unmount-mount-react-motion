import React from 'react';
import {TransitionMotion, spring} from 'react-motion';
import merge from './arraysMerge';

function logData(data) {
    console.log(data.map(d => `${d.type} - ${d.value.data} [${typeof d.value.style.h === 'number'
        ? d.value.style.h
        : `to: ${d.value.style.h.val}`}]`));
}

const getAdded = data => data.filter(d => d.type === 'added').map(d => d.value);
const getStable = data => data.filter(d => d.type === 'stable').map(d => d.value);

function getStyles(prev = [], currentList) {
    currentList = currentList.map(item => ({
        key: item,
        data: item,
        style: {
            h: 0
        }
    }));
    const prevData = {};
    prev.forEach(p => prevData[p.key] = p.style);
    let data = merge(currentList, prev, (a, b) => a.key === b.key);

    let added = [...getAdded(data), ...getStable(data)].filter(c => c.style.h < 18);
    logData(data);
    added.forEach((config, i) => {
        if (i === 0) {
            config.style = {
                h: spring(18)
            };
        } else if (prevData[added[i - 1].key]) {
            config.style = {
                h: spring(prevData[added[i - 1].key].h)
            };
        }
    });

    return data.map(d => d.value);
}

export default({list}) => (
    <TransitionMotion willLeave={() => ({h: spring(0)})} willEnter={() => ({h: 0})} styles={prev => getStyles(prev, list)}>
        {interpolatedData => (
            <div>
                {interpolatedData.map(config => (
                    <div key={config.key} style={{
                        height: config.style.h,
                        overflow: 'hidden'
                    }}>
                        {config.data}
                    </div>
                ))}
            </div>
        )}
    </TransitionMotion>
);

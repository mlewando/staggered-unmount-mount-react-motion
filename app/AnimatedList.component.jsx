import React from 'react';
import {TransitionMotion, spring} from 'react-motion';
import merge, {getAddedOrStable, getRemoved, getRawData} from './arraysMerge';

function logData(data) {
    console.debug(data.map(d => `${d.type} - ${d.value.data} [${typeof d.value.style.h === 'number'
        ? d.value.style.h
        : `to: ${d.value.style.h.val}`}]`));
}

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
    const data = merge(currentList, prev, (a, b) => a.key === b.key);
    logData(data);

    const added = getAddedOrStable(data).filter(c => c.style.h < 18);
    const removed = getRemoved(data);

    let maxHeightToRemove = Math.max(...removed.map(config => config.style.h));
    removed.reverse().forEach((config, i) => {
        if (i === 0) {
            config.style = {
                h: 0
            };
        } else if (prevData[removed[i - 1].key]) {
            config.style = {
                h: spring(prevData[removed[i - 1].key].h)
            };
        }
    });

    if (maxHeightToRemove < 1) {
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
    }

    return getRawData(data).filter(d => d.style.h !== 0);
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

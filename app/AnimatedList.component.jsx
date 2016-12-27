import React from 'react';
import {TransitionMotion, spring} from 'react-motion';
import merge, {getAddedOrStable, getRemoved, getRawData} from './arraysMerge';

function logData(data) {
    console.debug(data.map(d => `${d.type} - ${d.value.data} [${typeof d.value.style.h === 'number'
        ? d.value.style.h
        : `to: ${d.value.style.h.val}`}]`));
}

const START_STYLES = {
    h: 0
};

const END_STYLES = {
    h: 18
}

const isEnterEnded = config => config.style.h === 18;
const isLeaveEnded = config => config.style.h === 0;

const shouldStartMountAnimation = removed => {
    const maxHeightToRemove = Math.max(...removed.map(config => config.style.h));
    return maxHeightToRemove < 2;
}

function getStyles(prev = [], currentList) {
    currentList = currentList.map(item => ({
        key: item,
        data: item,
        style: {
            ...START_STYLES
        }
    }));
    const prevData = {};
    prev.forEach(p => prevData[p.key] = p.style);
    const data = merge(currentList, prev, (a, b) => a.key === b.key);
    logData(data);

    const added = getAddedOrStable(data).filter(c => !isEnterEnded(c));
    const removed = getRemoved(data);

    const willAdd = shouldStartMountAnimation(removed);
    removed.reverse().forEach((config, i) => {
        if (i === 0) {
            config.style = {
                ...START_STYLES
            };
        } else if (prevData[removed[i - 1].key]) {
            const beforeElementStyle = prevData[removed[i - 1].key];
            config.style = {};
            Object.keys(beforeElementStyle).forEach(key => {
                config.style[key] = spring(beforeElementStyle[key]);
            });
        }
    });

    if (willAdd) {
        added.forEach((config, i) => {
            if (i === 0) {
                config.style = {};
                Object.keys(END_STYLES).forEach(key => {
                    config.style[key] = spring(END_STYLES[key]);
                });
            } else if (prevData[added[i - 1].key]) {
                const beforeElementStyle = prevData[added[i - 1].key];
                config.style = {};
                Object.keys(beforeElementStyle).forEach(key => {
                    config.style[key] = spring(beforeElementStyle[key]);
                });
            }
        });
    }

    return getRawData(data).filter(c => !isLeaveEnded(c));
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

import React from 'react';
import {TransitionMotion, spring} from 'react-motion';
import merge, {getAddedOrStable, getRemoved, getRawData} from './arraysMerge';

function logData(data) {
    console.debug(data.map(d => `${d.type} - ${d.value.data} [${typeof d.value.style.h === 'number'
        ? d.value.style.h
        : `to: ${d.value.style.h.val}`}]`));
}

const compareStyles = (a, b) => Object.keys(a).reduce((valid, key) => valid && a[key] === b[key], true);

function goToElement(element) {
    const style = {};
    Object.keys(element).forEach(key => {
        style[key] = spring(element[key]);
    });
    return style;
}
function staggerRemove(styles, start) {
    const prevData = {};
    styles.forEach(p => prevData[p.key] = p.style);
    styles.reverse().forEach((config, i) => {
        if (i === 0) {
            config.style = {
                ...start
            };
        } else if (prevData[styles[i - 1].key]) {
            config.style = goToElement(prevData[styles[i - 1].key]);
        }
    });
}
function staggerAdd(styles, end) {
    const prevData = {};
    styles.forEach(p => prevData[p.key] = p.style);
    styles.forEach((config, i) => {
        if (i === 0) {
            config.style = {};
            Object.keys(end).forEach(key => {
                config.style[key] = spring(end[key]);
            });
        } else if (prevData[styles[i - 1].key]) {
            config.style = goToElement(prevData[styles[i - 1].key]);
        }
    });
}

function getStyles(prev = [], currentList, {start, end, shouldStartMountAnimation}) {
    currentList = currentList.map(item => ({
        key: item,
        data: item,
        style: {
            ...start
        }
    }));
    const prevData = {};
    prev.forEach(p => prevData[p.key] = p.style);
    const data = merge(currentList, prev, (a, b) => a.key === b.key);
    logData(data);

    const added = getAddedOrStable(data).filter(c => !compareStyles(c.style, end));
    const removed = getRemoved(data);

    const willAdd = removed.length === 0 || shouldStartMountAnimation(removed[0]);
    staggerRemove(removed, start);

    if (willAdd) {
        staggerAdd(added, end);
    }

    return getRawData(data).filter(c => !compareStyles(c.style, start));
}

export default({list}) => (
    <TransitionMotion willLeave={() => ({h: spring(0)})} willEnter={() => ({h: 0})} styles={prev => getStyles(prev, list, {
        start: {
            h: 0
        },
        end: {
            h: 18
        },
        shouldStartMountAnimation: lastToRemove => lastToRemove.style.h < 2
    })}>
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

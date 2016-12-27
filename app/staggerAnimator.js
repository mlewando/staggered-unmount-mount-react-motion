import {spring} from 'react-motion';
import merge, {getAddedOrStable, getRemoved, getRawData} from './arraysMerge';

const compareStyles = (a, b) => Object.keys(a).reduce((valid, key) => valid && a[key] === b[key], true);

function getProgress(styles, start, end) {
    const keys = Object.keys(styles);
    const lenght = keys.length;
    let sum = 0;
    for (var i = 0; i < lenght; i++) {
        const key = keys[i];
        sum += (styles[key] - start[key]) * 100 / (end[key] - start[key]);
    }
    return sum / lenght;
}

function snapToElement(element) {
    const style = {};
    Object.keys(element).forEach(key => {
        style[key] = spring(element[key]);
    });
    return style;
}
function staggerRemove(styles, start, end, force) {
    const prevData = {};
    styles.forEach(p => prevData[p.key] = p.style);
    styles.reverse().forEach((config, i) => {
        if (i === 0) {
            config.style = {
                ...start
            };
        } else if (prevData[styles[i - 1].key]) {
            const prevStyles = prevData[styles[i - 1].key];
            if (getProgress(prevStyles, start, end) < (100 - force)) {
                config.style = snapToElement(prevStyles);
            }
        }
    });
}
function staggerAdd(styles, start, end, force) {
    const prevData = {};
    styles.forEach(p => prevData[p.key] = p.style);
    styles.forEach((config, i) => {
        if (i === 0) {
            config.style = {};
            Object.keys(end).forEach(key => {
                config.style[key] = spring(end[key]);
            });
        } else if (prevData[styles[i - 1].key]) {
            const prevStyles = prevData[styles[i - 1].key];
            if (getProgress(prevStyles, start, end) > force) {
                config.style = snapToElement(prevStyles);
            }
        }
    });
}

function getStyles(prev = [], currentList, {start, end, force}) {
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

    const added = getAddedOrStable(data).filter(c => !compareStyles(c.style, end));
    const removed = getRemoved(data);

    const lastRemoveProgress = removed.length === 0
        ? 100
        : 100 - getProgress(removed[0].style, start, end);
        console.log('last remove progress:', lastRemoveProgress);
    staggerRemove(removed, start, end, force);

    if (lastRemoveProgress > force) {
        staggerAdd(added, start, end, force);
    }

    return getRawData(data).filter(c => !compareStyles(c.style, start));
}

export default getStyles;

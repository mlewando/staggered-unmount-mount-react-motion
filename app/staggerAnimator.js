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

function stagger({styles, to, force, getProgress, snapToFirst}) {
    const prevData = {};
    styles.forEach(p => prevData[p.key] = p.style);
    styles.forEach((config, i) => {
        if (i === 0) {
            config.style = snapToFirst ? snapToElement(to) : {...to};
        } else if (prevData[styles[i - 1].key]) {
            const prevStyles = prevData[styles[i - 1].key];
            if (getProgress(prevStyles) > force) {
                config.style = snapToElement(prevStyles);
            }
        }
    });
}

function getStyles(prev = [], currentList, {start, end, force, startWithRemove = true}) {
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
    const removed = getRemoved(data).reverse();
    const getAddingProgress = style => getProgress(style, start, end);
    const getRemovingProgress = style => getProgress(style, end, start);
    const addingProgress = added.length === 0 ? 100 : getAddingProgress(added[added.length - 1].style);
    const removingProgress = removed.length === 0 ? 100 : getRemovingProgress(removed[removed.length - 1].style);
    const removeAction = {styles: removed, to: start, force, getProgress: getRemovingProgress,  snapToFirst: false};
    const addAction = {styles: added, to: end, force, getProgress: getAddingProgress, snapToFirst: true};

    let actions = [];
    if (startWithRemove && removingProgress > force) {
        actions = [removeAction, addAction];
    } else if (startWithRemove) {
        actions = [removeAction];
    } else if (!startWithRemove && addingProgress > force) {
        actions = [addAction, removeAction];
    } else {
        actions = [addAction];
    }

    actions.forEach(stagger);

    return getRawData(data).filter(c => !compareStyles(c.style, start));
}

export default getStyles;

function getProgress(item, start, end) {
    const keys = Object.keys(item);
    const lenght = keys.length;
    let sum = 0;
    for (let i = 0; i < lenght; i++) {
        const key = keys[i];
        sum += (item[key] - start[key]) * 100 / (end[key] - start[key]);
    }
    return sum / lenght;
}

export default getProgress;

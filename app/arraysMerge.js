function checkIfAvailableAfterIndex(index, value, array, compare = (a, b) => a === b) {
    return array.find((v, i) => i > index && compare(v, value)) !== undefined;
}

export default(a, b, compare = (a, b) => a === b) => {
    let c = [];
    b = [...b];
    a = [...a];
    const handleB = (value, i) => {
        const nextB = b.length > 0
            ? b[0]
            : undefined;

        if (nextB === undefined || checkIfAvailableAfterIndex(i, nextB, a, compare)) {
            c.push({value, type: 'added'});
        } else if (compare(nextB, value)) {
            c.push({value: nextB, type: 'stable'});
            b.shift();
        } else {
            c.push({value: nextB, type: 'removed'});
            b.shift();
            handleB(value, i);
        }
    }
    a.forEach(handleB);
    b.forEach(value => c.push({value, type: 'removed'}));
    return c;
}

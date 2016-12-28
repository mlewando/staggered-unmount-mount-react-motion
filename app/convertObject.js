function convertObject(originalObject, converter) {
    const result = {};
    Object.keys(originalObject).forEach(key => {
        result[key] = converter(originalObject[key]);
    });
    return result;
}

export default convertObject;

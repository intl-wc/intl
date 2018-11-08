const dot = (str, val, obj) => {
    let currentObj = obj;
    let keys = str.split('.');
    let i;
    let key;

    for (i = 0; i < Math.max(1, keys.length - 1); i++) {
        key = keys[i];
        currentObj[key] = currentObj[key] || {};
        currentObj = currentObj[key];
    }

    currentObj[keys[i]] = val;
    delete obj[str];
}

const expand = (obj) => {
    for (let key of Object.keys(obj)) {
        if (key.includes('.')) {
            dot(key, obj[key], obj)
        }
    }
    return obj;
}
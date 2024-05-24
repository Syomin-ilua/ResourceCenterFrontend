function isObjectEqual(obj1: { [x: string]: any; }, obj2: { [x: string]: any; }) {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
        return false;
    }

    for (let key of keys1) {
        const val1 = obj1[key];
        const val2 = obj2[key];

        const areObjects = isObject(val1) && isObject(val2);
        if ((areObjects && !isObjectEqual(val1, val2)) || (!areObjects && val1 !== val2)) {
            return false;
        }
    }

    return true;
}

function isObject(obj: null) {
    return obj !== null && typeof obj === 'object';
}

export function arraysAreEqual(arr1: any[], arr2: any[]) {
    if (arr1.length !== arr2.length) {
        return false;
    }

    for (let i = 0; i < arr1.length; i++) {
        if (!isObjectEqual(arr1[i], arr2[i])) {
            return false;
        }
    }

    return true;
}

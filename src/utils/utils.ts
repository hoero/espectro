// deno-lint-ignore-file no-explicit-any
export function isString<T = any>(str: string | T): str is string {
    return typeof str === 'string' || str instanceof String;
}

export function isNumber(val: any) {
    return typeof val === 'number' && val === val;
}

export function isArray(arr: any): boolean {
    return isArrayLike(arr) && !isString(arr);
}

function isArrayLike(obj: any): boolean {
    return obj != null && typeof obj[Symbol.iterator] === 'function';
}

export function isPlainObject(val: any): boolean {
    return !!val && typeof val === 'object' && val.constructor === Object;
}

export function isEmpty(val: any) {
    return val == null || !(Object.keys(val) || val).length;
}

export function range(size: number, startAt = 0): ReadonlyArray<number> {
    return [...Array(size).keys()].map((i) => i + startAt);
}

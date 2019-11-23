
export function* range(start=0, end=Infinity, step = 1): IterableIterator<number> {
    for (let i = start; i < end; i += step) {
        yield i;
    }
}

/**
 * Shuffles an array in place
 */
export const shuffle = <T,>(a: Array<T>) => {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
}
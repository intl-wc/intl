const get = () => {
    return document.documentElement.getAttribute('dir');
}
const set = (dir: 'ltr' | 'rtl' | 'auto') => {
    document.documentElement.setAttribute('dir', dir);
}

export const direction = { get, set }
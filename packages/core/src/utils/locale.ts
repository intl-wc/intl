const get = () => {
    return document.documentElement.getAttribute('lang');
}
const set = (locale: string) => {
    document.documentElement.setAttribute('lang', locale);
}

export const locale = { get, set }
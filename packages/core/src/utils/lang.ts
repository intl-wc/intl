export function getLocale(locale: string, element: HTMLElement) {
    if (locale) return locale;

    const closest = element.closest('[lang]');
    if (closest) return closest.getAttribute('lang');

    const docLang = document.documentElement.getAttribute('lang');
    if (docLang) return docLang;

    return;
}
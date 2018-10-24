export function getLocale(locale: string, element: HTMLElement) {
    if (locale) return locale;

    const closest = element.closest('[lang]').getAttribute('lang');
    if (closest) return closest;

    return 'en';
}
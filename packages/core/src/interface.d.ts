export * from './components';
export * from './declarations';
export * from './index';

declare global {
    interface IntlUtils {
        phrase: (name: string) => Promise<string|null>
    }

    interface Window {
        IntlUtils: IntlUtils
    }
}
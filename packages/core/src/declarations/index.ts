export type Lazy<T> = {
    lazy: true;
    url: string;
    interface: T;
}

export interface Config {
    locales?: string[];
    srcDir?: string;
}
import { Config } from '@intl/core';

// https://intljs.com/docs/config

export const config: Config = {
  locales: [ 'en' ]
};

export interface Schema {
  lang: {
    en: string;
    es: string;
  },
  appTitle: string;
  greeting: string;
  welcome: string;
  build: string;
  docs: {
    start: string;
    end: string;
  },
  profileLink: string;
}

import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'intl',
  outputTargets:[
    {
      type: 'dist'
    },
    {
      type: 'www',
      serviceWorker: null
    }
  ]
};

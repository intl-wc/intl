import { inspect } from 'util';

export default (config: any) => (
`import { Config } from '@intl/core';

// https://intljs.com/docs/config

export const config: Config = ${inspect(config)
        .replace(/^{\s?/, '{\n  ')
        .replace(/\s?}$/, '\n}')
        .replace(/,\s?/, ',\n  ')};

export interface Schema {}
`
)
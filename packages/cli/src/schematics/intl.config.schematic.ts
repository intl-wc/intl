import { inspect } from 'util';

import * as d from './declarations';

interface Config {
        rootDir: string,
        config: any
}

const schematic: d.Schematic<Config> = {
        name: 'config',
        actions: (opts) => (
                [
                        {
                                type: 'create',
                                path: [opts.rootDir, 'intl.config.ts'],
                                file: true,
                                sourceText: `import { Config } from '@intl/core';

// https://intljs.com/docs/config

export const config: Config = ${inspect(opts.config)
        .replace(/^{\s?/, '{\n  ')
        .replace(/\s?}$/, '\n}')
        .replace(/,\s?/, ',\n  ')};

export interface Schema {}
`
                        }
                ]
        )
}

export default schematic;
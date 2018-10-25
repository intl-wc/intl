import { resolve } from 'path';
import { inspect } from 'util';
import { writeFile, stat } from './fs';

export async function configExists(): Promise<boolean> {
    const absPath = resolve('.', 'intl.config.ts');
    return stat(absPath).then(x => x.isFile())
}

export async function createConfigFile(config: { [key: string]: any }) {
    const contents = `import { Config } from '@intl/core';

// https://intljs.com/docs/config

export const config: Config = ${inspect(config)
    .replace(/^{\s/, '{\n  ')
    .replace(/\s}$/, '\n}')
    .replace(/,\s?/, ',\n  ')};
`
    const absPath = resolve('.', 'intl.config.ts');
    return writeFile(absPath, contents);
}
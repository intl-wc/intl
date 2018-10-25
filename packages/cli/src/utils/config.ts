import { resolve } from 'path';
import { inspect } from 'util';
import { writeFile, stat } from './fs';

export const defaultConfig = {
    srcDir: 'src/assets/i18n',
    locales: ['en']
}

export async function configExists(): Promise<boolean> {
    const absPath = resolve('.', 'intl.config.ts');
    try {
        return await stat(absPath).then(x => x.isFile())
    } catch (e) {
        return Promise.resolve(false);
    }
        
}

export async function createConfigFile(srcDir?: string, locales?: string[]) {
    let config: { [key: string]: any } = {};
    if (srcDir && srcDir !== defaultConfig.srcDir) config = { ...config, srcDir };
    if (!locales) locales = defaultConfig.locales;
    config = { ...config, locales };

    const contents = `import { Config } from '@intl/core';

// https://intljs.com/docs/config

export const config: Config = ${inspect(config)
    .replace(/^{\s?/, '{\n  ')
    .replace(/\s?}$/, '\n}')
    .replace(/,\s?/, ',\n  ')};

export interface Schema {}
`
    const absPath = resolve('.', 'intl.config.ts');
    return writeFile(absPath, contents);
}
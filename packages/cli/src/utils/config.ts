import { resolve, join } from 'path';
import { SCHEMATICS } from '../schematics';
import { writeFile, fileExists, mkdirp } from './fs';

export const defaultConfig = {
    srcDir: 'src/assets/i18n',
    locales: ['en']
}

export async function configExists(): Promise<boolean> {
    return fileExists('intl.config.ts');
}

async function createSrcDir(srcDir: string) {
    // srcDir = resolve('.', srcDir);
    // const filePath = join(srcDir, 'README.md');
    // const sourceText = SCHEMATICS.find(x => x.name === 'config').render();
    // await mkdirp(srcDir);
    // await writeFile(filePath, sourceText);
}

export async function createConfig(srcDir?: string, locales?: string[]) {
    let config: { [key: string]: any } = {};
    if (srcDir && srcDir !== defaultConfig.srcDir) config = { ...config, srcDir };
    if (!locales) locales = defaultConfig.locales;
    config = { ...config, locales };

    // const sourceText = CONFIG.render(config);
    const filePath = resolve('.', 'intl.config.ts');
    return Promise.all([
        // writeFile(filePath, sourceText),
        createSrcDir(srcDir || defaultConfig.srcDir)
    ]);
}
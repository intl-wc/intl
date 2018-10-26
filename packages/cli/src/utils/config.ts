import { resolve, join } from 'path';
import { INTL_CONFIG, SRC_DIR_README } from '../templates';
import { writeFile, fileExists, mkdirp } from './fs';

export const defaultConfig = {
    srcDir: 'src/assets/i18n',
    locales: ['en']
}

export async function configExists(): Promise<boolean> {
    return fileExists('intl.config.ts');
}

async function createSrcDir(srcDir: string) {
    srcDir = resolve('.', srcDir);
    const filePath = join(srcDir, 'README.md');
    const sourceText = SRC_DIR_README();
    await mkdirp(srcDir);
    await writeFile(filePath, sourceText);
}

export async function createConfig(srcDir?: string, locales?: string[]) {
    let config: { [key: string]: any } = {};
    if (srcDir && srcDir !== defaultConfig.srcDir) config = { ...config, srcDir };
    if (!locales) locales = defaultConfig.locales;
    config = { ...config, locales };

    const sourceText = INTL_CONFIG(config);
    const filePath = resolve('.', 'intl.config.ts');
    return Promise.all([
        writeFile(filePath, sourceText),
        createSrcDir(srcDir || defaultConfig.srcDir)
    ]);
}
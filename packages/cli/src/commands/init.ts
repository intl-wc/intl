import { resolve } from 'path';
import { configExists, createConfigFile } from '../utils/config';

const defaultPath = 'src/assets/i18n';
const defaultConfig: any = {
    locales: ['en']
}

export default async function (...args: string[]) {
    if (await configExists()) {
        console.log('intl has already been initialized');
        return;
    }

    const location = args[0] || defaultPath;
    const absPath = resolve('.', location);

    console.log('Init', absPath);
    let config = defaultConfig;
    if (location !== defaultPath) {
        config = {
            ...defaultConfig,
            path: location
        }
    }
    await createConfigFile(config);
}
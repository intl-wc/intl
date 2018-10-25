import { resolve } from 'path';
import { configExists, createConfigFile } from '../utils/config';

export default async function (...args: string[]) {
    if (await configExists()) {
        console.log('intl has already been initialized');
        return;
    }

    const srcDir = args[0];

    await createConfigFile(srcDir);
}
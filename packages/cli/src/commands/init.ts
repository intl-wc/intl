import { resolve } from 'path';
import { configExists, createConfig } from '../utils/config';

export default async function (...args: string[]) {
    if (await configExists()) {
        console.log('intl has already been initialized');
        return;
    }
    const srcDir = args[0];
    await createConfig(srcDir);
}
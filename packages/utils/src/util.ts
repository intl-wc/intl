import { resolve } from "path";
import { writeFile as _writeFile, stat as _stat, mkdir as _mkdir } from "fs";
import { promisify } from "util";

export const writeFile = promisify(_writeFile);
const stat = promisify(_stat);
const mkdir = promisify(_mkdir);

export async function mkdirp(path: string) {
    const dir = resolve('.', path);
    try {
        const stats = await stat(dir);
        if (!stats.isDirectory()) throw new Error();
        else return;
    } catch (e) {
        await mkdir(dir);
    }
}

export function lazyProps(): ([key, value]: [any, any]) => boolean {
    return ([_, value]) => value.type === 'object'
        && value.properties
        && value.properties.lazy
        && value.properties.lazy.enum
        && Array.isArray(value.properties.lazy.enum)
        && value.properties.lazy.enum.length === 1
        && value.properties.lazy.enum[0]
}
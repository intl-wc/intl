import _mkdirp from 'mkdirp';
import { resolve } from 'path';
import { promisify } from 'util';
import { writeFile as _writeFile, readFile as _readFile, stat as _stat, appendFile as _appendFile } from 'fs';

const stat = promisify(_stat);
const writeFile = promisify(_writeFile);
const readFile = promisify(_readFile);
const appendFile = promisify(_appendFile);
const mkdirp = (dir: string, opts?: _mkdirp.Mode | _mkdirp.Options): Promise<_mkdirp.Made> => {
    return new Promise((resolve, reject) => {
        _mkdirp(dir, opts as any, (err, made) => {
            if (err) reject(err)
            resolve(made)
        })
    });
}
export { stat, writeFile, readFile, appendFile, mkdirp };

export async function fileExists(file: string): Promise<boolean> {
    const absPath = resolve('.', file);
    try {
        return await stat(absPath).then(x => x.isFile())
    } catch (e) {
        return Promise.resolve(false);
    }
}
export async function dirExists(dir: string): Promise<boolean> {
    const absPath = resolve('.', dir);
    try {
        return await stat(absPath).then(x => x.isDirectory())
    } catch (e) {
        return Promise.resolve(false);
    }
}
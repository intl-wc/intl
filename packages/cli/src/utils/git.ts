import { resolve } from 'path';
// import { escapeRegExp } from './utils';
import { dirExists, fileExists, readFile, appendFile } from './fs';

export async function isGitProject(): Promise<boolean> {
    return dirExists('.git');
}

export async function hasGitIgnore(): Promise<boolean> {
    return fileExists('.gitignore');
}

export async function inGitIgnore(search: RegExp): Promise<boolean> {
    const file = await readFile(resolve('.', '.gitignore')).then(x => x.toString());
    return search.test(file);
}

export async function addToGitIgnore(...content: string[]): Promise<void> {
    appendFile(resolve('.', '.gitignore'), `\n${content.join('\n')}\n`);
}
import { SCHEMATICS, Action, Schematic, isCreateAction, isJSONUpdateAction, isAppendAction, isReplaceAction, isDeleteAction } from '../schematics';
import { join } from 'path';
import { mkdirp, writeFile, appendFile, readFile } from '../utils/fs';

export default async function (...args: string[]) {
    const [name, ...opts] = args;
    console.log(name, opts);
    if (hasSchematic(name)) {
        const schematic = await getSchematic(name as any);
        let actions: Action[] = [];
        if (schematic) actions.push(...getActions(schematic, ...opts));

        for (let action of actions) {
            console.log(action);
            const path = Array.isArray(action.path) ? join(...action.path) : action.path;
            if (isCreateAction(action)) {
                if (action.dir) {
                    mkdirp(path);
                } else if (action.file) {
                    writeFile(path, action.sourceText);
                }
            } else if (isAppendAction(action)) {
                if (action.sourceText) {
                    appendFile(path, action.sourceText)
                }
            } else if (isJSONUpdateAction(action)) {
                if (action.data) {
                    const json = await readFile(path).then(x => JSON.parse(x.toString()));
                    const newJson = { ...json, ...action.data }
                    await writeFile(path, JSON.stringify(newJson, null, 2));
                }
            }else if (isReplaceAction(action)) {
                console.log('Replace', path);
            } else if (isDeleteAction(action)) {
                console.log('Delete', path);
            }
        }
    }
}

const hasSchematic = (name: string) => SCHEMATICS.findIndex(x => (x.name === name)) > -1;

async function getSchematic(name: string): Promise<Schematic|null> {
    const schematic = SCHEMATICS.find(x => x.name === name);
    return schematic ? schematic : null;
}

function getActions(schematic: Schematic, ...args: string[]) {
    const defaultArgs = {
        locales: [ 'en' ],
        rootDir: '.',
        srcDir: 'src/assets/i18n',
    }
    switch (schematic.name) {
        case 'config': {
            const [config] = args;
            return schematic.actions({ ...defaultArgs, config });
        }
        case 'route': {
            const [name, path] = args;
            console.log(name, path);
            return schematic.actions({ ...defaultArgs, name, path });
        }
        default: return [];
    }
}
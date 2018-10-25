import { promisify } from 'util';
import { writeFile as _writeFile, readFile as _readFile, stat as _stat } from 'fs';

const stat = promisify(_stat);
const writeFile = promisify(_writeFile);
const readFile = promisify(_readFile);

export { stat, writeFile, readFile };
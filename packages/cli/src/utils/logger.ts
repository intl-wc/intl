import * as color from 'colorette';
import * as d from '../declarations';

// Much of these Logger functions are taken from
// the Stencil source code (MIT @ Ionic)
// https://github.com/ionic-team/stencil/blob/303e7d93201f22bae6aa8dcc2bc5747fb4c94e73/src/sys/node/node-logger.ts#L265

export function printDuration(duration: number) {
    if (duration > 1000) {
        return `in ${(duration / 1000).toFixed(2)} s`;
    } else {
        const ms = parseFloat((duration).toFixed(3));
        return `in ${ms} ms`;
    }
}

export function onlyUnix(str: string) {
    return isWin() ? str : '';
}

export function terminalPrompt() {
    return isWin() ? '>' : '$';
}

export function isWin() {
    return process.platform === 'win32';
}

export function printDiagnostics(diagnostics: d.Diagnostic[]) {
    if (!diagnostics || !diagnostics.length) return;

    let outputLines: string[] = [''];

    diagnostics.forEach(d => {
        outputLines = outputLines.concat(printDiagnostic(d));
    });

    console.log(outputLines.join('\n'));
}

function printDiagnostic(d: d.Diagnostic) {
    const outputLines = wordWrap([d.messageText], getColumns());

    let header = '';

    if (d.header && d.header !== 'Build Error') {
        header += d.header;
    }

    if (d.relFilePath) {
        if (header.length > 0) {
            header += ': ';
        }

        header += color.cyan(d.relFilePath);

        if (typeof d.lineNumber === 'number' && d.lineNumber > -1) {
            header += color.dim(`:`);
            header += color.yellow(`${d.lineNumber}`);

            if (typeof d.columnNumber === 'number' && d.columnNumber > -1) {
                header += color.dim(`:`);
                header += color.yellow(`${d.columnNumber}`);
            }
        }
    }

    if (header.length > 0) {
        outputLines.unshift(INDENT + header);
    }

    outputLines.push('');

    if (d.lines && d.lines.length) {
        const lines = prepareLines(d.lines);

        lines.forEach((l) => {
            if (!isMeaningfulLine(l.text)) {
                return;
            }

            let msg = `L${l.lineNumber}:  `;
            while (msg.length < INDENT.length) {
                msg = ' ' + msg;
            }

            let text = l.text as string;
            if (l.errorCharStart > -1) {
                text = highlightError(text, l.errorCharStart, l.errorLength as number);
            }

            msg = color.dim(msg);
            msg += text;

            outputLines.push(msg);
        });

        outputLines.push('');
    }

    return outputLines;
}

function prepareLines(orgLines: d.PrintLine[]) {
    const lines: d.PrintLine[] = JSON.parse(JSON.stringify(orgLines));

    for (let i = 0; i < 100; i++) {
        if (!eachLineHasLeadingWhitespace(lines)) {
            return lines;
        }
        for (let i = 0; i < lines.length; i++) {
            lines[i].text = (lines[i] as any).text.substr(1);
            lines[i].errorCharStart--;
            if (!(lines[i] as any).text.length) {
                return lines;
            }
        }
    }

    return lines;
}

function isMeaningfulLine(line?: string) {
    if (line) {
        line = line.trim();
        return line.length > 0;
    }
    return false;
}

function eachLineHasLeadingWhitespace(lines: d.PrintLine[] = []) {
    if (!lines.length) {
        return false;
    }

    for (var i = 0; i < lines.length; i++) {
        if (!lines[i].text || (lines[i] as any).text.length < 1) {
            return false;
        }
        const firstChar = (lines[i] as any).text.charAt(0);
        if (firstChar !== ' ' && firstChar !== '\t') {
            return false;
        }
    }

    return true;
}


function highlightError(errorLine: string, errorCharStart: number, errorLength: number) {
    let rightSideChars = errorLine.length - errorCharStart + errorLength - 1;
    while (errorLine.length + INDENT.length > MAX_COLUMNS) {
        if (errorCharStart > (errorLine.length - errorCharStart + errorLength) && errorCharStart > 5) {
            // larger on left side
            errorLine = errorLine.substr(1);
            errorCharStart--;

        } else if (rightSideChars > 1) {
            // larger on right side
            errorLine = errorLine.substr(0, errorLine.length - 1);
            rightSideChars--;

        } else {
            break;
        }
    }

    const lineChars: string[] = [];
    const lineLength = Math.max(errorLine.length, errorCharStart + errorLength);
    for (var i = 0; i < lineLength; i++) {
        var chr = errorLine.charAt(i);
        if (i >= errorCharStart && i < errorCharStart + errorLength) {
            chr = color.bgRed(chr === '' ? ' ' : chr);
        }
        lineChars.push(chr);
    }

    return lineChars.join('');
}

function wordWrap(msg: any[], columns: number) {
    const lines: string[] = [];
    const words: any[] = [];

    msg.forEach(m => {
        if (m === null) {
            words.push('null');

        } else if (typeof m === 'undefined') {
            words.push('undefined');

        } else if (typeof m === 'string') {
            m.replace(/\s/gm, ' ').split(' ').forEach(strWord => {
                if (strWord.trim().length) {
                    words.push(strWord.trim());
                }
            });

        } else if (typeof m === 'number' || typeof m === 'boolean' || typeof m === 'function') {
            words.push(m.toString());

        } else if (Array.isArray(m)) {
            words.push(() => {
                return m.toString();
            });

        } else if (Object(m) === m) {
            words.push(() => {
                return m.toString();
            });

        } else {
            words.push(m.toString());
        }
    });

    let line = INDENT;
    words.forEach(word => {
        if (lines.length > 25) {
            return;
        }

        if (typeof word === 'function') {
            if (line.trim().length) {
                lines.push(line);
            }
            lines.push(word());
            line = INDENT;

        } else if (INDENT.length + word.length > columns - 1) {
            // word is too long to play nice, just give it its own line
            if (line.trim().length) {
                lines.push(line);
            }
            lines.push(INDENT + word);
            line = INDENT;

        } else if ((word.length + line.length) > columns - 1) {
            // this word would make the line too long
            // print the line now, then start a new one
            lines.push(line);
            line = INDENT + word + ' ';

        } else {
            line += word + ' ';
        }
    });

    if (line.trim().length) {
        lines.push(line);
    }

    return lines.map(line => {
        return (line as any).trimRight();
    });
}

const INDENT = '  ';
const MIN_COLUMNS = 60;
const MAX_COLUMNS = 120;

function getColumns() {
    const terminalWidth = (process.stdout && (process.stdout as any).columns) || 80;
    return Math.max(Math.min(MAX_COLUMNS, terminalWidth), MIN_COLUMNS);
}
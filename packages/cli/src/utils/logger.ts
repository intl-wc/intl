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
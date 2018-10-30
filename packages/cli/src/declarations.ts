export interface Diagnostic {
    level: 'error' | 'warn' | 'info' | 'log' | 'debug';
    type: 'json';
    header?: string;
    language?: string;
    messageText: string;
    code?: string;
    absFilePath?: string;
    relFilePath?: string;
    lineNumber?: number;
    columnNumber?: number;
    lines?: PrintLine[];
}


export interface PrintLine {
    lineIndex: number;
    lineNumber: number;
    text?: string;
    errorCharStart: number;
    errorLength?: number;
}

export interface LintResult {
    filePath: string;
    diagnostics?: Diagnostic[];
    pass?: boolean;
    fail?: boolean;
}
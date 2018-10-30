import { generateSchemas } from '@intl/utils';
import { readFile } from '../utils/fs';
import * as d from '../declarations';
import AJV from 'ajv';
import { printDiagnostics } from '../utils/logger';
import * as color from 'colorette';

const ajv = new AJV({ allErrors: true });

function lint(file: { path: string, content: any }, schema: any): d.LintResult {
    let { content, path: filePath } = file;
    
    const validate = ajv.compile(schema);
    const valid = validate(content);

    if (valid) {
        return { pass: true, filePath }
    } else {
        let diagnostics: d.Diagnostic[] = [];
        if (validate.errors) {
            diagnostics = validate.errors.map(err => convertToDiagnostic(err))
        }
        return {
            fail: true,
            diagnostics,
            filePath
        }
    }
}

export default async function () {
    await generateSchemas();
    const schema = await readFile('.intl/schema.json').then(x => JSON.parse(x.toString()));
    const files = ['src/assets/i18n/en/index.json'];
    
    const results = await Promise.all(files.map(async (path) => {
        const content = await readFile(path).then(x => JSON.parse(x.toString()))
        return lint({ path, content }, schema);
    }))

    const passes = results.filter(r => r.pass).length;
    const failures = results.filter(r => r.fail).length;

    console.log(`${color.green('✔')} ${color.bold(passes.toString())} passed`);
    console.log(`${color.red('✖')} ${color.bold(failures.toString())} failures`);

    results.forEach(result => {
        let output = '\n';
        output += color.cyan(result.filePath);
        if (result.pass) {
            output += `\n${color.green('✔')} pass`;
            console.log(output);
        } else if (result.fail) {
            const diagnostics = (result.diagnostics as d.Diagnostic[]).map(x => {
                x.relFilePath = '/' + result.filePath;
                return x;
            })
            printDiagnostics(diagnostics);
        }
    })


}

function convertToDiagnostic(error: AJV.ErrorObject): d.Diagnostic {
    let messageText = error.message || '';
    // if (isRequired(error.params)) {
    // } else {
        // messageText = (error.message as string);
    // }
    let diagnostic: d.Diagnostic = {
        level: 'error',
        type: 'json',
        language: 'json',
        messageText
    };

    return diagnostic;
}

function isRequired(params: AJV.ErrorParameters): params is AJV.RequiredParams {
    return !!(params as any).missingParam;
}
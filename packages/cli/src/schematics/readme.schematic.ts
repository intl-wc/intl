import { greeting } from '../utils/utils';
import * as d from './declarations';

interface Readme {
    srcDir: string
}

const { phrase } = greeting();

const schematic: d.Schematic<Readme> = {
    name: 'readme',
    actions: (opts) => (
        [
            {
                type: 'create',
                path: [opts.srcDir, 'README.md'],
                file: true,
                sourceText: `# ${phrase} *(Hello world!)*

This directory contains translations for your project.

Read [the intl docs](https://intljs.com/docs) for more information.

If you'd like to update your JSON schema, update the \`Schema\` interface in your \`intl.config.ts\`.
This will allow you to easily add new translations and ensure that existing tranlastions are covering your project.

To scaffold out new translations, you can run (where 'locale' is a single code or comma separated list of codes)
\`\`\`
intl add <locale>
\`\`\`
`
            }
        ]
    )
}

export default schematic;
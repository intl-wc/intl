import { dim, green, italic, bold, red } from 'colorette';
import { configExists, createConfig } from '../utils/config';
import { isGitProject, hasGitIgnore, addToGitIgnore, inGitIgnore } from '../utils/git';
import { greeting } from '../utils/utils';
import { printDuration, terminalPrompt } from '../utils/logger';

export default async function (...args: string[]) {
    const startTime = Date.now();
    const srcDir = args[0] || 'src/assets/i18n';

    if (await configExists()) {
        console.log(`${red('✖')} ${bold('intl')} has already been initialized\n`);
        return;
    }

    const [isGit, hasIgnore] = await Promise.all([
        isGitProject(),
        hasGitIgnore(),
        createConfig(srcDir)
    ]);

    if (isGit && hasIgnore) {
        const pattern = /^\.intl\/?\s*$/gm;
        if (!(await inGitIgnore(pattern))) {
            const ignore = '.intl/';
            const header = '# Intl generated schemas (https://intljs.com/docs/schemas)';
            await addToGitIgnore(header, ignore);
        };
    }

    const { language, phrase } = greeting();
    const time = printDuration(Date.now() - startTime);

    console.log(`  ${bold(phrase)} ${dim(`(that's "Hello world!" in ${italic(language)})`)}

${green('✔')} Project initialized ${dim(time)}

  ${dim('Next steps:')}
    ${dim(terminalPrompt())} ${green('intl add <locales>')}
    ${dim(terminalPrompt())} ${green(`cd ${srcDir}`)}
`)
}
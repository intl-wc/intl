import { init, audit } from './commands';

async function run() {
    const args = process.argv.slice(2);
    
    try {
        if (!args[0]) throw new Error();

        switch (args[0]) {
            case 'init':
                init(...args.slice(1));
                break;
            case 'lint':
            case 'audit':
                audit();
                break;
            default: throw new Error();
        }
    } catch (e) {
        if (!e.message) {
            console.log('Help!')
        } else {
            console.error(e.message);
        }
    }
}

run();
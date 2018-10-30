import { EventEmitter } from 'events';
import * as d from './declarations';

// class Test extends EventEmitter implements d.Test {
//     constructor(public name: string) {
//         super();
//     }
// }

// export default class Results extends EventEmitter {
//     count = 0;
//     fail = 0;
//     pass = 0;
//     tests: d.Test[] = [];

//     public push(...tests: d.Test[]) {
//         this.tests.push(...tests);
//     }

//     private createStream(opts: d.StreamOptions = {}) {
//         let output = 0;
//         let testId = 0;

//         if (opts.objectMode) {
//             this.on('__push', (test: Test, extra = {}) => {
//                 const id = testId++;
//                 const { name } = test;
//                 test.on('prerun', () => {
//                     const row = { type: 'test', name, id };
//                 })

//             })
//         }
//     }
// }

// function encodeResult(res: Result, count: string) {
//     var output = '';
//     output += (res.ok ? 'ok ' : 'not ok ') + count;
//     output += res.name ? ' ' + res.name.toString().replace(/\s+/g, ' ') : '';

//     if (res.skip) output += ' # SKIP';
//     else if (res.todo) output += ' # TODO';

//     output += '\n';
//     if (res.ok) return output;

//     var outer = '  ';
//     var inner = outer + '  ';
//     output += outer + '---\n';
//     output += inner + 'operator: ' + res.operator + '\n';

//     if (has(res, 'expected') || has(res, 'actual')) {
//         var ex = inspect(res.expected, { depth: res.objectPrintDepth });
//         var ac = inspect(res.actual, { depth: res.objectPrintDepth });

//         if (Math.max(ex.length, ac.length) > 65 || invalidYaml(ex) || invalidYaml(ac)) {
//             output += inner + 'expected: |-\n' + inner + '  ' + ex + '\n';
//             output += inner + 'actual: |-\n' + inner + '  ' + ac + '\n';
//         } else {
//             output += inner + 'expected: ' + ex + '\n';
//             output += inner + 'actual:   ' + ac + '\n';
//         }
//     }
//     if (res.at) {
//         output += inner + 'at: ' + res.at + '\n';
//     }

//     var actualStack = res.actual && (typeof res.actual === 'object' || typeof res.actual === 'function') ? res.actual.stack : undefined;
//     var errorStack = res.error && res.error.stack;
//     var stack = defined(actualStack, errorStack);
//     if (stack) {
//         var lines = String(stack).split('\n');
//         output += inner + 'stack: |-\n';
//         for (var i = 0; i < lines.length; i++) {
//             output += inner + '  ' + lines[i] + '\n';
//         }
//     }

//     output += outer + '...\n';
//     return output;
// }
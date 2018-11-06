// interface ICUArgument {
//     pos: { start: number, end: number },
//     key: string,
//     type?: string,
//     format?: string
// }

// const cache = new Map<string, ICUArgument[]>();

// const parse = (value: string): ICUArgument[] => {
//     if (cache.has(value)) { return cache.get(value) }

//     const pattern = /\{([^}]+)\}/gmi
//     const match = value.match(pattern);
//     const args = !match ? [] : match
//         .map(x => {
//             const str = x.trim();
//             const [ key, type, format ] = str.replace('\{', '').replace('\}', '').trim().split(',').map(y => y.trim())
//             const start = value.indexOf(str);
//             const end = start + str.length;
//             const pos = { start, end };
//             return { key, type, format, pos };
//         })
//     cache.set(value, args);
//     return args;
// }

// export const format = (value: string, data?: { [key: string]: string }) => {
//     if (!data) return value;
//     const args = parse(value);
//     console.log(args);
    
//     let parts = [];
//     for (const [index, char] of Object.entries(value)) {
//         let i = Number.parseInt(index);
//         let arg = args.find(a => i >= a.pos.start && i < a.pos.end);
        
//         if (arg) {
//             const v = data[arg.key]
//             if (parts.indexOf(v) === -1) parts = [...parts, v];
//         } else {
//             parts = [...parts, char]
//         }
//     }

//     return parts.join('');
// }
import { resolve } from "path";
import { writeFile, mkdirp, lazyProps } from './util';
import * as TJS from "typescript-json-schema";


export default async function generateSchemas() {
    const program = TJS.getProgramFromFiles([resolve('.', 'intl.config.ts')], null);
    const settings: TJS.PartialArgs = {
        ignoreErrors: false,
        required: true
    }
    // const schema = TJS.generateSchema(program, 'Schema');
    const generator = TJS.buildGenerator(program, settings);
    if (generator) {
        // const symbols = generator.getUserSymbols();
        // const symbols = generator.getMainFileSymbols(program);
        const schema = generator.getSchemaForSymbol('Schema', false);
        let generatedSchema = { ...schema };
        let lazyRefs = new Map<string, any>();
        
        if (schema.properties) {
            // Filter lazy props, get reference to their interfaces
            const lazy = Object.entries(schema.properties).filter(lazyProps())
            for (let [key, value] of lazy) {
                const lazyRef = value.properties.interface['$ref'].split('/').pop();
                lazyRefs.set(key, generator.getSchemaForSymbol(lazyRef, false));
                
                const newValue = { ...value };
                delete newValue.properties.interface;
                
                generatedSchema = { ...generatedSchema, ...{ properties: { ...generatedSchema.properties, [key]: newValue } } }
            }
        }
    
        await mkdirp('.intl')
        await writeFile(resolve('.', '.intl/schema.json'), JSON.stringify(generatedSchema, null, 2));
    
        const batched = [];
        for (let [key, value] of lazyRefs) {
            batched.push(writeFile(resolve('.', `.intl/${key}.json`), JSON.stringify(value, null, 2)));
        }
        await Promise.all(batched);
    }
    
}
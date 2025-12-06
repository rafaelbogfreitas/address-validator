import { openApiDocument } from '../src/openapi/doc';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const outputPath = resolve(process.cwd(), 'public', 'openapi.json');
writeFileSync(outputPath, JSON.stringify(openApiDocument, null, 2));
console.log(`OpenAPI spec written to ${outputPath}`);

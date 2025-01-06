#!/usr/bin/env node
import { program } from 'commander';
import { generateComponent } from './commands/component.js';
import { generateCRUD } from './commands/crud.js';
import { generateHook } from './commands/hook.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

program
    .name('codegen')
    .description('AI-powered code generation CLI')
    .version('1.0.0');

program
    .command('component')
    .description('Generate a React component')
    .option('-n, --name <name>', 'component name')
    .option('-t, --type <type>', 'functional/class component', 'functional')
    .action(generateComponent);

program
    .command('crud')
    .description('Generate CRUD operations')
    .option('-m, --model <name>', 'model/entity name')
    .option('-o, --operations <operations...>', 'CRUD operations to generate')
    .action(generateCRUD);

program
    .command('hook')
    .description('Generate a custom React hook')
    .option('-n, --name <name>', 'hook name (without use prefix)')
    .option('-t, --type <type>', 'hook type (state/effect/ref/custom/data-fetching/form/lifecycle)')
    .action(generateHook);

program.parse();
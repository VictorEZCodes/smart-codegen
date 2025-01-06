import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { generateWithAI } from '../utils/ai.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { crudTemplates } from '../templates/crud.js';
import { logger } from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CRUD_OPERATIONS = ['Create', 'Read', 'Update', 'Delete', 'List'];

export async function generateCRUD(options = {}) {
    try {
        // prompting if no name is provided
        if (!options.model) {
            const answers = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'model',
                    message: 'What is the model/entity name?',
                    validate: input => input.length > 0
                },
                {
                    type: 'checkbox',
                    name: 'operations',
                    message: 'Select CRUD operations to generate:',
                    choices: CRUD_OPERATIONS,
                    default: CRUD_OPERATIONS
                }
            ]);

            options.model = answers.model;
            options.operations = answers.operations;
        }

        const spinner = ora('Generating CRUD operations...').start();

        try {
            logger.info('Attempting AI generation for CRUD service...');

            // detailed prompt for the AI
            const servicePrompt = `Create a complete TypeScript service for ${options.model} with the following:
1. Interface for ${options.model} with common fields (id, createdAt, updatedAt)
2. CRUD service class with async methods for:
   - getAll(): Promise<${options.model}[]>
   - getById(id: number): Promise<${options.model}>
   - create(data: Create${options.model}Dto): Promise<${options.model}>
   - update(id: number, data: Partial<${options.model}>): Promise<${options.model}>
   - delete(id: number): Promise<void>
3. Error handling with try-catch blocks
4. TypeScript types and interfaces
5. Axios for HTTP requests with base URL from environment
6. Complete JSDoc documentation
7. Error types and custom error handling`;

            const hookPrompt = `Create a complete React custom hook for managing ${options.model} with:
1. State management for data, loading, and error states
2. CRUD operations integration with the service
3. TypeScript types and interfaces
4. Comprehensive error handling
5. Loading states for each operation
6. Complete JSDoc documentation
7. Usage examples in comments
8. React Query integration (optional)`;

            // generate code with AI
            spinner.text = 'Generating service code with AI...';
            const serviceCode = await generateWithAI(servicePrompt);
            
            spinner.text = 'Generating hook code with AI...';
            const hookCode = await generateWithAI(hookPrompt);

            logger.success('AI generation completed successfully');

            // create directory structure
            const modelDir = join(process.cwd(), 'src/features', options.model.toLowerCase());
            mkdirSync(modelDir, { recursive: true });

            // write files
            const serviceFilePath = join(modelDir, `${options.model.toLowerCase()}.service.ts`);
            const hookFilePath = join(modelDir, `use${options.model}.ts`);

            writeFileSync(serviceFilePath, serviceCode);
            writeFileSync(hookFilePath, hookCode);

            // log success with detailed information
            spinner.succeed(chalk.green(`CRUD operations for ${options.model} created successfully!`));
            logger.info(`Generated files:
- Service: ${serviceFilePath}
- Hook: ${hookFilePath}

Operations included: ${options.operations ? options.operations.join(', ') : 'All CRUD operations'}`);

        } catch (error) {
            logger.error(`AI generation failed: ${error.message}`);
            logger.info('Using fallback templates...');
            
            // using templates as fallback
            const serviceCode = crudTemplates.service(options.model);
            const hookCode = crudTemplates.hook(options.model);

            // create directory structure
            const modelDir = join(process.cwd(), 'src/features', options.model.toLowerCase());
            mkdirSync(modelDir, { recursive: true });

            // write files
            const serviceFilePath = join(modelDir, `${options.model.toLowerCase()}.service.ts`);
            const hookFilePath = join(modelDir, `use${options.model}.ts`);

            writeFileSync(serviceFilePath, serviceCode);
            writeFileSync(hookFilePath, hookCode);

            spinner.succeed(chalk.yellow(`CRUD operations for ${options.model} created using template!`));
            logger.info(`Files created:
- ${serviceFilePath}
- ${hookFilePath}`);
        }

    } catch (error) {
        spinner.fail(chalk.red(`Error: ${error.message}`));
        logger.error('Stack trace:', error.stack);
        process.exit(1);
    }
}
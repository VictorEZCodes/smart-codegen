import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { generateWithAI } from '../utils/ai.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { hookTemplates } from '../templates/hook.js';
import { logger } from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const HOOK_TYPES = [
    'state',
    'effect',
    'ref',
    'custom',
    'data-fetching',
    'form',
    'lifecycle'
];

export async function generateHook(options = {}) {
    let spinner;
    try {
        // prompting if no name is provided
        if (!options.name) {
            const answers = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'name',
                    message: 'What is the hook name?',
                    validate: input => input.length > 0
                },
                {
                    type: 'list',
                    name: 'type',
                    message: 'What type of hook is this?',
                    choices: HOOK_TYPES,
                    default: 'custom'
                }
            ]);

            options.name = answers.name;
            options.type = answers.type;
        }

        spinner = ora('Generating custom hook...').start();
        logger.info('Starting hook generation process...');

        const hookPrompt = `Create a complete React custom hook named use${options.name} with:
1. TypeScript types and interfaces
2. Proper error handling
3. Loading states if needed
4. Complete JSDoc documentation
5. Usage examples
6. Unit test examples
7. Best practices for ${options.type || 'custom'} hooks`;

        spinner.text = 'Generating hook code with AI...';
        
        let hookCode;
        try {
            hookCode = await generateWithAI(hookPrompt);
        } catch (error) {
            // Use logger.info instead of warn since it might not be implemented
            logger.info('AI generation failed, falling back to template');
            hookCode = hookTemplates[options.type || 'custom'](options.name);
        }

        // create directory structure
        const hooksDir = join(process.cwd(), 'src/hooks');
        try {
            mkdirSync(hooksDir, { recursive: true });
            logger.info(`Created hooks directory: ${hooksDir}`);
        } catch (error) {
            logger.error(`Failed to create directory: ${error.message}`);
            throw new Error(`Failed to create hooks directory: ${error.message}`);
        }

        // write file
        const hookFilePath = join(hooksDir, `use${options.name}.ts`);
        try {
            writeFileSync(hookFilePath, hookCode);
            logger.success(`Hook file created successfully: ${hookFilePath}`);
        } catch (error) {
            logger.error(`Failed to write file: ${error.message}`);
            throw new Error(`Failed to write hook file: ${error.message}`);
        }

        spinner.succeed(chalk.green(`Hook use${options.name} created successfully!`));
        logger.info(`Hook type: ${options.type || 'custom'}`);

    } catch (error) {
        logger.error(`Hook generation failed: ${error.message}`);
        
        if (spinner) {
            spinner.fail(chalk.red(`Failed to generate hook: ${error.message}`));
        } else {
            console.error(chalk.red(`Error: ${error.message}`));
        }
        process.exit(1);
    }
}
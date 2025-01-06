import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { generateWithAI } from '../utils/ai.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { componentTemplates } from '../templates/component.js';
import { logger } from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const COMPONENT_TYPES = ['functional', 'class'];

export async function generateComponent(options = {}) {
    try {
        // prompting if no name is provided
        if (!options.name) {
            const answers = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'name',
                    message: 'What is the component name?',
                    validate: input => input.length > 0
                },
                {
                    type: 'list',
                    name: 'type',
                    message: 'What type of component?',
                    choices: COMPONENT_TYPES,
                    default: 'functional'
                }
            ]);

            options.name = answers.name;
            options.type = answers.type;
        }

        const spinner = ora('Generating component...').start();

        try {
            logger.info('Attempting AI generation for component...');
            
            // detailed prompt for the AI
            const componentPrompt = `Create a complete React ${options.type || 'functional'} component named ${options.name} with:
1. TypeScript types and interfaces
2. Props interface with common fields
3. Proper component structure and organization
4. Complete JSDoc documentation
5. CSS module setup with proper typing
6. Error handling if needed
7. Loading state handling if needed
8. Best practices and modern React patterns`;

            // generate code with AI
            spinner.text = 'Generating component code with AI...';
            const componentCode = await generateWithAI(componentPrompt);
            
            logger.success('AI generation completed successfully');

            // create directory structure
            const componentDir = join(process.cwd(), 'src/components', options.name);
            mkdirSync(componentDir, { recursive: true });

            // write files
            const componentFilePath = join(componentDir, `${options.name}.tsx`);
            const styleFilePath = join(componentDir, `${options.name}.module.css`);

            writeFileSync(componentFilePath, componentCode);
            writeFileSync(styleFilePath, `/* 
* Styles for ${options.name} component
*/`);

            // log success with detailed information
            spinner.succeed(chalk.green(`Component ${options.name} created successfully!`));
            logger.info(`Generated files:
- Component: ${componentFilePath}
- Styles: ${styleFilePath}

Type: ${options.type || 'functional'}`);

        } catch (error) {
            logger.error(`AI generation failed: ${error.message}`);
            logger.info('Using fallback templates...');
            
            // using templates as fallback
            const componentCode = componentTemplates[options.type || 'functional'](options.name);

            // create directory structure
            const componentDir = join(process.cwd(), 'src/components', options.name);
            mkdirSync(componentDir, { recursive: true });

            // write files
            const componentFilePath = join(componentDir, `${options.name}.tsx`);
            const styleFilePath = join(componentDir, `${options.name}.module.css`);

            writeFileSync(componentFilePath, componentCode);
            writeFileSync(styleFilePath, `/* 
* Styles for ${options.name} component
*/`);

            spinner.succeed(chalk.yellow(`Component ${options.name} created using template!`));
            logger.info(`Files created:
- ${componentFilePath}
- ${styleFilePath}`);
        }

    } catch (error) {
        spinner.fail(chalk.red(`Error: ${error.message}`));
        logger.error('Stack trace:', error.stack);
        process.exit(1);
    }
}
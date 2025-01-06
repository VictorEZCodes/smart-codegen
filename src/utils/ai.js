import { logger } from './logger.js';

const PROXY_URL = 'https://codegen-proxy.vercel.app/api/generate';

export async function testOpenAIConnection() {
    try {
        const response = await fetch(PROXY_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: "Test" })
        });

        if (!response.ok) {
            return false;
        }

        const data = await response.json();
        return !!data.content;
    } catch (error) {
        logger.error(`API Test Error: ${error.message}`);
        return false;
    }
}

export async function generateWithAI(prompt) {
    try {
        logger.info('Attempting to generate code with AI...');
        
        const response = await fetch(PROXY_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt })
        });

        // log errors, not successful responses
        if (!response.ok) {
            logger.error('API Error:', {
                status: response.status,
                statusText: response.statusText
            });
        }

        const data = await response.json();

        if (!data.content) {
            throw new Error('No content in response');
        }

        logger.success('AI code generation successful');
        return data.content;

    } catch (error) {
        const errorMessage = error.message || 'Unknown error occurred';
        logger.error(`AI Generation Error: ${errorMessage}`);
        throw new Error(`AI generation failed: ${errorMessage}`);
    }
}

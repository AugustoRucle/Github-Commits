import OpenAI from "openai";

/**
 * @description Check if api key is valid for open AI api
 * @param {string | undefined} apiKey - Api key for authentication in open ai
 * @param {AbortSignal | undefined} signal - Optional AbortSignal for request cancellation
 * @return {Promise<boolean>}
 */
export async function testApiKeyOpenAI(apiKey?: string, signal?: AbortSignal): Promise<boolean> {
    try {
        const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });


        await openai.chat.completions.create({
            model: 'gpt-5-mini', // Or 'gpt-3.5-turbo'
            messages: [
                {
                    role: 'user',
                    content: 'Say this is a test!',
                }
            ],
        }, {
            signal,
        });

        return true;
    } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            throw new Error('Request was cancelled');
        }

        console.error(`Error testing api key for open AI:`, error);
        throw error;
    }
}
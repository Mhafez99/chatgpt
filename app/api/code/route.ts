import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai';

import { increaseApiLimit, checkApiLimit } from '@/lib/api-limit';
import { checkSubscription } from '@/lib/subscription';

const configuration = new Configuration({
  apiKey: process.env.OPEN_API_KEY,
});

const openai = new OpenAIApi(configuration);

const instructionsMessage: ChatCompletionRequestMessage = {
  role: 'system',
  content:
    'You are a code generator You Must answer only in markdown code snippets. Use Code For explanations.',
};

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { messages } = body;

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    if (!configuration.apiKey) {
      return new NextResponse('OpenAi API Key Not configuared', {
        status: 500,
      });
    }
    if (!messages) {
      return new NextResponse('Messages are Required', { status: 400 });
    }
    const freeTrail = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!freeTrail && !isPro) {
      return new NextResponse('Free Trial has expired.', {
        status: 403,
      });
    }

    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [instructionsMessage, ...messages],
    });
    if (!isPro) {
      await increaseApiLimit();
    }

    return NextResponse.json(response.data.choices[0].message);
  } catch (error) {
    console.log('[Code_ERROR]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

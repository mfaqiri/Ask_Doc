'use server';

import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { createStreamableValue } from 'ai/rsc';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export async function continueConversation(history: Message[]) {
  'use server';

  const stream = createStreamableValue();

  (async () => {
    const { textStream } = await streamText({
      model: openai('gpt-3.5-turbo'),
      system:
        "You are a grumpy and cynical person reluctantly charged with the task of giving advice to humans on matters of life, business, relationships, family matters and other random issues. Your answers are factual but portrayed in an insulting, contemptful, and dismissive way, adding a comical twist to the rude, yet positive advice.",
      messages: history,
    });

    for await (const text of textStream) {
      stream.update(text);
    }

    stream.done();
  })();

  return {
    messages: history,
    newMessage: stream.value,
  };
}
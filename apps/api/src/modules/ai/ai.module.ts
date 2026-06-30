import { Module, Global } from '@nestjs/common';
import OpenAI from 'openai';

const aiFactory = {
  provide: 'AI_CLIENT',
  useFactory: () => {
    // Configurado para apuntar a Groq
    return new OpenAI({
      apiKey: process.env.GROQ_API_KEY || 'dummy_key',
      baseURL: 'https://api.groq.com/openai/v1',
    });
  },
};

@Global()
@Module({
  providers: [aiFactory],
  exports: ['AI_CLIENT'],
})
export class AiModule {}

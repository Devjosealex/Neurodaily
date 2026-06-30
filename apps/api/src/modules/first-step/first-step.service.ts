import { Injectable, NotFoundException, ForbiddenException, Inject } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import OpenAI from 'openai';

@Injectable()
export class FirstStepService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('AI_CLIENT') private readonly openai: OpenAI,
  ) {}

  async generate(userId: string, data: { text?: string; taskId?: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true },
    });
    
    const isPro = user?.subscription?.plan === 'pro';

    let originalText = data.text || '';

    if (data.taskId) {
      const task = await this.prisma.task.findFirst({ where: { id: data.taskId, userId } });
      if (!task) throw new NotFoundException('Tarea no encontrada');
      originalText = task.title + (task.description ? ` - ${task.description}` : '');
    }

    if (!originalText) {
      throw new Error('Debe proveer texto o taskId');
    }

    // Check usage for Free users
    if (!isPro) {
      // Usaremos una fecha base muy lejana o simplemente una fecha constante 
      // porque queremos 3 usos totales de por vida (prueba), no diarios.
      const LIFETIME_DATE = new Date('2024-01-01'); 
      
      let counter = await this.prisma.usageCounter.findUnique({
        where: {
          userId_counterType_counterDate: {
            userId,
            counterType: 'first_step_ai',
            counterDate: LIFETIME_DATE,
          }
        }
      });

      if (!counter) {
        counter = await this.prisma.usageCounter.create({
          data: {
            userId,
            counterType: 'first_step_ai',
            counterDate: LIFETIME_DATE,
            count: 0
          }
        });
      }

      if (counter.count >= 3) {
        throw new ForbiddenException('Has agotado tus 3 usos gratuitos de la IA. ¡Mejora a Pro para usos ilimitados!');
      }

      // Incrementar contador
      await this.prisma.usageCounter.update({
        where: { id: counter.id },
        data: { count: { increment: 1 } }
      });
    }

    let generatedStep = '';
    let method = 'ai';

    try {
      const response = await this.openai.chat.completions.create({
        model: 'llama3-8b-8192', // Modelo rápido y gratuito en Groq
        messages: [
          { role: 'system', content: 'Actúa como un psicólogo conductual. Debes reducir la tarea abrumadora del usuario a su componente físico más microscópico e inofensivo para iniciar. Responde en español, sé directo, máximo 15 palabras. Ejemplo: "Abre el documento en blanco". No saludes, no des ánimos, solo da la instrucción.' },
          { role: 'user', content: `Mi tarea es: "${originalText}". ¿Cuál es el primer micromovimiento físico que debo hacer?` },
        ],
        max_tokens: 50,
        temperature: 0.7,
      });
      generatedStep = response.choices[0]?.message?.content?.trim() || '';
    } catch (err: any) {
      console.error('AI Error:', err);
      // Fallback in case API fails
      generatedStep = this.fallbackRules(originalText);
      method = 'rules';
    }

    // Guardar log
    await this.prisma.firstStepLog.create({
      data: {
        userId,
        taskId: data.taskId,
        originalText,
        generatedStep,
        difficultyLevel: 1, // siempre micro
        generationMethod: method,
      },
    });

    return { step: generatedStep, method };
  }

  private fallbackRules(text: string): string {
    const t = text.toLowerCase();
    if (t.includes('tesis') || t.includes('ensayo') || t.includes('escribir')) {
      return 'Abre el procesador de texto y crea un documento en blanco.';
    }
    if (t.includes('estudiar') || t.includes('leer')) {
      return 'Pon el libro sobre la mesa, cerrado.';
    }
    if (t.includes('limpiar') || t.includes('ordenar')) {
      return 'Recoge exactamente UN objeto que esté fuera de lugar.';
    }
    if (t.includes('entrenar') || t.includes('ejercicio')) {
      return 'Ponte las zapatillas de deporte, nada más.';
    }
    return `Abre la herramienta para tu tarea y no hagas nada más.`;
  }
}

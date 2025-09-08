import { Router, Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { validateAIRequest } from '../middleware/validateAIRequest'; // <<< VERIFIQUE ESTE CAMINHO

const router = Router();

// Adicionando um log para confirmar que o arquivo foi carregado e a rota foi criada
console.log("Arquivo aiRoutes.ts carregado. Criando rota POST /improve");

router.post("/improve", validateAIRequest, async (req: Request, res: Response) => {
  // Log para confirmar que a rota foi acessada
  console.log("Requisição recebida em /api/ai/improve com o corpo:", req.body);

  const { text, type } = req.body;

  // Esta verificação é redundante por causa do validateAIRequest, mas não causa mal
  if (!text || !type) {
    return res.status(400).json({ message: 'Texto e tipo são obrigatórios.' });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' }); // Usei um modelo comum, o seu pode ser diferente

    let prompt = '';

    switch (type) {
      case 'summary':
        prompt = `Resuma o seguinte texto de forma concisa e clara: ${text}`;
        break;
      case 'grammar_check':
        prompt = `Corrija a gramática e a ortografia do seguinte texto, retornando apenas o texto corrigido: ${text}`;
        break;
      case 'elaboration':
        prompt = `Elabore e expanda sobre o seguinte tópico ou texto, adicionando detalhes e profundidade: ${text}`;
        break;
      default:
        prompt = `Melhore o seguinte texto, tornando-o mais claro, conciso e profissional: ${text}`;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const improvedText = response.text();

    res.status(200).json({ improvedText });
  } catch (error) {
    console.error('Erro ao chamar a API da IA:', error);
    res.status(500).json({ message: 'Erro ao melhorar o texto. Tente novamente.' });
  }
});

export { router as aiRouter };


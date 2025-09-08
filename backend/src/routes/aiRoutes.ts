import { Router, Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { validateAIRequest } from '../middleware/validateAIRequest'; // <<< VERIFIQUE ESTE CAMINHO

const router = Router();

// Adicionando um log para confirmar que o arquivo foi carregado e a rota foi criada
console.log("Arquivo aiRoutes.ts carregado. Criando rota POST /improve");

router.post("/improve", validateAIRequest, async (req: Request, res: Response) => {
  // Log para confirmar que a rota foi acessada
  console.log("Requisição recebida em /api/ai/improve com o corpo:", req.body);
  
  // Debug da chave da API
  console.log('GEMINI_API_KEY presente:', !!process.env.GEMINI_API_KEY);
  console.log('GEMINI_API_KEY length:', process.env.GEMINI_API_KEY?.length || 0);
  console.log('GEMINI_API_URL:', process.env.GEMINI_API_URL || 'Não definida');

  const { text, type } = req.body;

  // Esta verificação é redundante por causa do validateAIRequest, mas não causa mal
  if (!text || !type) {
    return res.status(400).json({ message: 'Texto e tipo são obrigatórios.' });
  }

  try {
    console.log('Chamando IA real do Google Gemini...');
    
    // Configurar Gemini AI com URL customizada se fornecida
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
    
    // Usar modelo específico baseado na URL ou padrão
    const modelName = process.env.GEMINI_API_URL?.includes('gemini-2.5-flash') 
      ? 'gemini-2.5-flash' 
      : 'gemini-1.5-flash-latest';
    
    console.log('Usando modelo:', modelName);
    const model = genAI.getGenerativeModel({ model: modelName });

    let prompt = '';

    switch (type) {
      case 'summary':
        prompt = `Melhore este resumo profissional mantendo-o CONCISO (máximo 2-3 linhas). Use linguagem direta e profissional, destacando as habilidades reais da pessoa:

"${text}"

Retorne apenas o texto melhorado, sem explicações.`;
        break;
      case 'grammar_check':
        prompt = `Corrija a gramática e a ortografia do seguinte texto, retornando apenas o texto corrigido: ${text}`;
        break;
      case 'elaboration':
        if (text.length < 100) {
          prompt = `Transforme este texto em um OBJETIVO DE CARREIRA focado no FUTURO (máximo 2-3 linhas). Use verbos como "busco", "almejo", "pretendo", "desejo". Foque em metas e aspirações, não em experiência passada:

"${text}"

Exemplo: "Busco uma posição como chef onde possa desenvolver..."

Retorne apenas o objetivo melhorado, sem explicações.`;
        } else {
          prompt = `Melhore esta descrição de trabalho mantendo-a CONCISA (máximo 3-4 linhas). Use verbos de ação e destaque responsabilidades reais:

"${text}"

Retorne apenas a descrição melhorada, sem explicações.`;
        }
        break;
      case 'skills_suggestion':
        prompt = `Analise o seguinte conteúdo de currículo e sugira 6-8 habilidades relevantes com níveis apropriados. Retorne APENAS no formato JSON:

${text}

Formato esperado:
[
  {"name": "Nome da Habilidade", "level": "Básico|Intermediário|Avançado"},
  {"name": "Outra Habilidade", "level": "Intermediário"}
]

Retorne apenas o JSON, sem explicações.`;
        break;
      default:
        prompt = `Melhore este texto mantendo-o CONCISO e profissional:

"${text}"

Retorne apenas o texto melhorado, sem explicações.`;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const improvedText = response.text();

    // Para sugestão de habilidades, tentar parsear JSON
    if (type === 'skills_suggestion') {
      try {
        const skills = JSON.parse(improvedText);
        res.status(200).json({ skills });
      } catch (parseError) {
        console.log('Erro ao parsear JSON de skills, usando fallback');
        const fallbackSkills = [
          {"name": "Atendimento ao Cliente", "level": "Avançado"},
          {"name": "Comunicação", "level": "Intermediário"},
          {"name": "Trabalho em Equipe", "level": "Avançado"},
          {"name": "Organização", "level": "Intermediário"}
        ];
        res.status(200).json({ skills: fallbackSkills });
      }
    } else {
      res.status(200).json({ improvedText });
    }
  } catch (error) {
    console.error('Erro ao chamar a API da IA:', error);
    
    // Fallback para mock se IA falhar
    let fallbackText = '';
    switch (type) {
      case 'summary':
        fallbackText = `Profissional com experiência em atendimento e relacionamento com clientes, demonstrando habilidades de comunicação e trabalho em equipe.`;
        break;
      case 'elaboration':
        fallbackText = text.length < 100 
          ? `Busco oportunidades para aplicar minhas habilidades e contribuir para o crescimento da organização.`
          : `Responsável por atividades de atendimento e suporte, garantindo qualidade no serviço prestado.`;
        break;
      default:
        fallbackText = `${text} - versão aprimorada`;
    }
    
    res.status(200).json({ improvedText: fallbackText });
  }
});

export { router as aiRouter };


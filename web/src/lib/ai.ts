import type { TarefaData } from '../data/types';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

export async function generateOnboardingTasks(
  clienteNome: string,
  servico: string,
  responsavel_id: number
): Promise<Omit<TarefaData, 'id' | 'data_criacao' | 'comentarios'>[]> {
  if (!GROQ_API_KEY) {
    console.error('Groq API Key não configurada.');
    return [];
  }

  const prompt = `
Você é um assistente sênior de agências de marketing e tecnologia.
Um novo cliente acabou de fechar contrato.
Cliente: ${clienteNome}
Serviço contratado: ${servico}

Gere exatamente 3 tarefas iniciais de onboarding para a equipe (setup inicial, briefing, etc) focadas nesse serviço.
O responsável pelas tarefas será o ID: ${responsavel_id}.

Responda APENAS com um Array JSON puro e válido, sem markdown, contendo objetos com as seguintes chaves exatas:
- titulo (string)
- setor (string: 'Atendimento', 'Design', 'Planejamento', ou 'Geral')
- prioridade (string: 'Alta' ou 'Média')
- prazo (string: no formato YYYY-MM-DD, ex: 2026-07-10)

Exemplo:
[
  { "titulo": "Reunião de Kickoff e Alinhamento", "setor": "Atendimento", "prioridade": "Alta", "prazo": "2026-07-08" },
  { "titulo": "Criação de Identidade Visual", "setor": "Design", "prioridade": "Média", "prazo": "2026-07-10" }
]
`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'qwen/qwen3.6-27b',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'Erro na API');

    const content = data.choices?.[0]?.message?.content || '[]';
    
    // Limpar markdown code blocks se a IA os enviar mesmo pedindo para não enviar
    const cleanJson = content
      .replace(/<think>[\s\S]*?<\/think>/gi, '')
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();
    
    const parsed = JSON.parse(cleanJson);
    
    return parsed.map((item: any) => ({
      titulo: item.titulo,
      cliente_id: 0, // Será substituído pelo AppContext
      responsavel_id,
      setor: item.setor,
      prioridade: item.prioridade,
      prazo: item.prazo,
      status: 'A fazer'
    }));
  } catch (err) {
    console.error('Falha ao gerar tarefas da Inteligência Artificial:', err);
    return [];
  }
}

// ===== NOVO: Geração de Ideias de Conteúdo =====
export async function generateContentIdeas(nicho: string, quantidade: number = 5): Promise<string[]> {
  if (!GROQ_API_KEY) return ['Erro: API Key ausente'];

  const prompt = `
Aja como um Estrategista de Conteúdo Viral.
O nicho do cliente é: ${nicho}
Gere exatamente ${quantidade} ideias brilhantes e curtas para posts no Instagram (Reels ou Carrossel) que engajem muito.

Responda APENAS com um Array JSON de strings. Não use formatação markdown, apenas o JSON puro.
Exemplo:
["Reels: 3 erros fatais que todo [nicho] comete", "Carrossel: O guia definitivo para [resultado]"]
`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'qwen/qwen3.6-27b',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
      })
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '[]';
    const cleanJson = content
      .replace(/<think>[\s\S]*?<\/think>/gi, '')
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();
    return JSON.parse(cleanJson);
  } catch (e) {
    console.error('Erro gerar ideias:', e);
    return ['Dica: Mostre os bastidores do seu trabalho', 'Dica: Responda a maior dúvida dos clientes'];
  }
}

// ===== NOVO: Geração de Roteiro e Legenda =====
export async function generateScript(nicho: string, ideia: string): Promise<string> {
  if (!GROQ_API_KEY) return 'Erro: API Key ausente';

  const prompt = `
Aja como um Copywriter Sênior.
Crie um roteiro de vídeo (ou carrossel) e uma legenda para o Instagram com base nesta ideia: "${ideia}".
O nicho do cliente é: ${nicho}.

Siga a estrutura EXATA abaixo, não adicione saudações ou explicações fora da estrutura:

HOOK (GANCHO):
(Escreva a frase de impacto inicial)

ROTEIRO / TÓPICOS:
- (Tópico 1)
- (Tópico 2)
- (Tópico 3)

LEGENDA:
(Escreva a legenda completa e envolvente aqui, incluindo CTA forte e 5 hashtags relevantes no final)
`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'qwen/qwen3.6-27b',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
      })
    });

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content || 'Erro na geração.';
    return rawContent.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
  } catch (e) {
    console.error('Erro gerar roteiro:', e);
    return 'Houve um erro na comunicação com a IA. Tente novamente.';
  }
}

export async function qualifyLead(
  empresa: string,
  contato: string,
  valor: number,
  origem: string
): Promise<{ nota: number; resumo: string; tarefa: string } | null> {
  if (!GROQ_API_KEY) return null;

  const prompt = `
Você é um qualificador de leads especialista (SDR) da agência. 
Acabou de chegar um lead:
Empresa: ${empresa}
Contato: ${contato}
Origem: ${origem}
Valor Estimado (MRR): R$ ${valor}

Por favor, faça uma análise rápida desse lead e retorne APENAS um JSON com as seguintes chaves:
- "nota": Um número de 1 a 10 qualificando o quão quente/potencial é esse lead.
- "resumo": Uma frase muito curta (max 10 palavras) dizendo o que acha do lead.
- "tarefa": Sugestão de um título curto para a primeira tarefa do vendedor entrar em contato.

Exemplo:
{
  "nota": 8,
  "resumo": "Lead de alto valor via Instagram, prioridade alta.",
  "tarefa": "Fazer ligação de qualificação (Discovery)"
}
`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'qwen/qwen3.6-27b',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'Erro na API');

    const content = data.choices?.[0]?.message?.content || '{}';
    const cleanJson = content
      .replace(/<think>[\s\S]*?<\/think>/gi, '')
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();
    return JSON.parse(cleanJson);
  } catch (err) {
    console.error('Falha ao qualificar lead:', err);
    return null;
  }
}

export async function askCopilot(
  history: Array<{ role: 'user' | 'assistant' | 'system'; content: any }>,
  contextData: string,
  clientContext?: string,
  fileContext?: string,
  imageBase64?: string
): Promise<string> {
  if (!GROQ_API_KEY) return "Erro: Chave da Groq API não configurada.";

  let systemPrompt = `Você é o "Copilot Inteligente", um Copywriter Sênior e estrategista de marketing super avançado embutido no CRM. 
Você ajuda a equipe da agência a gerar conteúdo profissional.
Regra de Ouro: Se o usuário pedir para gerar um conteúdo, NUNCA inicie a resposta conversando (ex: "Entendi!", "Vou criar..."). Entregue DIRETAMENTE o conteúdo solicitado, sem aspas e sem explicações.
No entanto, se o usuário apenas enviar uma saudação (como "oi", "olá") ou fizer uma pergunta geral, seja educado, amigável e responda conversando normalmente.

Abaixo estão os dados em tempo real da agência no momento atual. Use essas informações caso o usuário pergunte sobre clientes, leads ou tarefas.
--- DADOS ATUAIS DA AGÊNCIA ---
${contextData}
-------------------------------`;

  if (clientContext) {
    systemPrompt += `\n\nATENÇÃO: Você está criando conteúdo para o cliente: "${clientContext}". 
Foque ESTRITAMENTE no nicho dele. NUNCA mencione que você é uma inteligência artificial.`;
  }

  let finalHistory = [...history];

  if (fileContext && finalHistory.length > 0) {
    const lastMsgIndex = finalHistory.length - 1;
    if (finalHistory[lastMsgIndex].role === 'user') {
      finalHistory[lastMsgIndex].content += `\n\n[DIRETRIZES OBRIGATÓRIAS DO DIRETOR DE CRIAÇÃO]: 
SE O USUÁRIO ESTIVER PEDINDO PARA CRIAR UMA LEGENDA/POST, você DEVE escrever no formato perfeito para o INSTAGRAM.
Nesse caso (e apenas nesse caso), siga EXATAMENTE esta estrutura:
1. **Gancho (Hook):** Uma frase curta e chamativa na primeira linha (com 1 emoji).
2. **Corpo do Texto:** 2 a 3 parágrafos curtos explicando o benefício/solução. Use quebras de linha para ficar fácil de ler no celular.
3. **Chamada para Ação (CTA):** Diga exatamente o que o usuário deve fazer (ex: clique no link, mande direct).
4. **Hashtags:** 3 a 5 hashtags focadas.

Se o usuário estiver apenas conversando ou tirando dúvidas (ex: "oi"), IGNORE essa estrutura de legenda e responda normalmente à mensagem dele.

[IMPORTANTE - SOBRE O TOM DE VOZ]:
Use o arquivo abaixo APENAS para absorver as gírias, o humor ou o nível de formalidade do cliente. 
NÃO copie e cole frases do arquivo! Você é um Copywriter Sênior, então eleve o nível do texto. Aplique as gírias de forma inteligente dentro da estrutura de Instagram acima.
Retorne SOMENTE a legenda final.

--- INÍCIO DO VOCABULÁRIO ---
${fileContext}
--- FIM DO VOCABULÁRIO ---`;
    }
  }

  // Se tiver imagem em base64, altera a estrutura da última mensagem
  if (imageBase64 && finalHistory.length > 0) {
    const lastMsgIndex = finalHistory.length - 1;
    if (finalHistory[lastMsgIndex].role === 'user') {
      const textContent = finalHistory[lastMsgIndex].content;
      finalHistory[lastMsgIndex].content = [
        { type: "text", text: textContent },
        { type: "image_url", image_url: { url: imageBase64 } }
      ];
    }
  }

  const messages = [
    { role: 'system', content: systemPrompt },
    ...finalHistory
  ];

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: imageBase64 ? 'qwen/qwen3.6-27b' : 'qwen/qwen3.6-27b',
        messages: messages,
        temperature: 0.7,
        max_tokens: 800
      })
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('Groq API Error:', data);
      throw new Error(`Erro Groq: ${data.error?.message || JSON.stringify(data)}`);
    }

    const rawContent = data.choices?.[0]?.message?.content || 'Desculpe, não consegui processar a resposta.';
    return rawContent.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
  } catch (err: any) {
    console.error('Falha no Copilot:', err);
    throw err;
  }
}

export async function generateDashboardInsight(
  tarefas: any[],
  clientes: any[],
  leads: any[]
): Promise<string> {
  if (!GROQ_API_KEY) return 'Nota da IA: API Key da Groq não configurada. Configure o .env para ter insights reais.';

  const activeTasks = tarefas.filter(t => t.status !== 'Concluído').length;
  const pendingLeads = leads.filter(l => l.status === 'Prospect' || l.status === 'Negociação').length;
  
  const prompt = `Você é o assistente IA do painel desta agência de marketing.
Analise os seguintes números de forma EXTREMAMENTE breve (1 frase curta).
- Tarefas ativas/pendentes: ${activeTasks}
- Leads em negociação/prospect: ${pendingLeads}
- Total de clientes: ${clientes.length}

Retorne APENAS uma frase útil sugerindo foco ou dando um alerta amigável. Não use aspas, nem saudações.`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'qwen/qwen3.6-27b',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.5,
        max_tokens: 60
      })
    });

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content || 'Foque nas tarefas com prazo próximo hoje!';
    return rawContent.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
  } catch (err) {
    return 'Dica: Organize suas prioridades do dia no Kanban para manter o fluxo.';
  }
}

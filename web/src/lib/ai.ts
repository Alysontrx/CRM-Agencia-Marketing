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
Você é um assistente sênior de agências de marketing e tecnologia (Sense AI).
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
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'Erro na API');

    const content = data.choices?.[0]?.message?.content || '[]';
    
    // Limpar markdown code blocks se a IA os enviar mesmo pedindo para não enviar
    const cleanJson = content.replace(/```json/g, '').replace(/```/g, '').trim();
    
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
    console.error('Falha ao gerar tarefas da Sense AI:', err);
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
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
      })
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '[]';
    const cleanJson = content.replace(/```json/g, '').replace(/```/g, '').trim();
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
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
      })
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || 'Erro na geração.';
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
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'Erro na API');

    const content = data.choices?.[0]?.message?.content || '{}';
    const cleanJson = content.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (err) {
    console.error('Falha ao qualificar lead:', err);
    return null;
  }
}

export async function askCopilot(
  history: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
  contextData: string
): Promise<string> {
  if (!GROQ_API_KEY) return "Erro: Chave da Groq API não configurada.";

  const systemPrompt = `Você é o "Sense Copilot", a Inteligência Artificial super avançada embutida no "Sense OS" (um CRM de agência de marketing de alto nível). 
Você ajuda a equipe da agência (vendedores, designers, gestores) a tomar decisões rápidas e gerar conteúdo.
Seja sempre direto, profissional e inspirador. Não dê respostas desnecessariamente longas a menos que peçam.

Abaixo estão os dados em tempo real da agência no momento atual. Use essas informações caso o usuário pergunte sobre clientes, leads ou tarefas.
Se o usuário pedir uma cópia, legenda ou planejamento, use sua inteligência de marketing para criar algo de altíssimo nível.

--- DADOS ATUAIS DA AGÊNCIA ---
${contextData}
-------------------------------`;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history
  ];

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: messages,
        temperature: 0.7,
        max_tokens: 800
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'Erro na API');

    return data.choices?.[0]?.message?.content || 'Desculpe, não consegui processar a resposta.';
  } catch (err: any) {
    console.error('Falha no Sense Copilot:', err);
    throw err;
  }
}

import { supabase } from './supabase';

export async function sendWelcomeEmail(leadName: string, leadEmail: string | undefined, leadId: number | string) {
  console.log(`[Email Service] Preparando envio de e-mail para ${leadName}...`);
  
  if (!leadEmail) {
    console.warn(`[Email Service] Lead ${leadName} não possui e-mail cadastrado.`);
    return false;
  }

  try {
    // Aqui no futuro será a chamada para seu servidor PHP com PHPMailer ou API do Resend.
    // Exemplo: await fetch('https://seusite.com/api/send-email.php', { method: 'POST', body: JSON.stringify({ to: leadEmail, subject: 'Bem-vindo!' }) })
    
    // Simulando o tempo de envio
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log(`[Email Service] E-mail enviado com sucesso para ${leadEmail}`);

    // Registra o log no banco de dados para o CRM saber que foi enviado
    await supabase.from('automacoes_logs').insert([{
      referencia_id: leadId,
      tipo: 'Email',
      acao: 'Email de Boas-vindas Enviado',
      status: 'Sucesso',
      detalhes: { para: leadEmail, assunto: 'Boas-vindas' }
    }]);

    return true;
  } catch (err) {
    console.error(`[Email Service] Erro ao enviar e-mail:`, err);
    
    await supabase.from('automacoes_logs').insert([{
      referencia_id: leadId,
      tipo: 'Email',
      acao: 'Email de Boas-vindas Enviado',
      status: 'Falha',
      detalhes: { erro: String(err) }
    }]);

    return false;
  }
}

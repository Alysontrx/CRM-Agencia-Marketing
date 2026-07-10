export interface InviteAgencyParams {
  agencyName: string;
  adminEmail: string;
  adminPassword: string;
  loginUrl: string; // URL of the admin login page
}

export function getInviteAgencyEmail({ agencyName, adminEmail, adminPassword, loginUrl }: InviteAgencyParams) {
  const subject = `🟢 Bem-vindo à ${agencyName} – Dados de acesso`;
  const html = `
    <div style="font-family: Inter, sans-serif; color: #e5e7eb; background: #111827; padding: 20px; border-radius: 8px; max-width: 600px; margin: auto;">
      <h1 style="color: #10b981;">Sua conta está pronta!</h1>
      <p>Olá,</p>
      <p>Uma nova agência <strong>${agencyName}</strong> foi criada em nossa plataforma. Seguem os dados de acesso ao painel de administração:</p>
      <ul style="list-style: none; padding: 0;">
        <li><strong>E‑mail:</strong> ${adminEmail}</li>
        <li><strong>Senha:</strong> ${adminPassword}</li>
      </ul>
      <p>Você pode fazer login imediatamente clicando no botão abaixo:</p>
      <a href="${loginUrl}" style="display: inline-block; background:#10b981; color:#fff; padding:10px 20px; border-radius:4px; text-decoration:none; margin-top:10px;">Acessar painel</a>
      <p style="margin-top:20px; font-size:0.9em; color:#9ca3af;">Caso não tenha solicitado, ignore este e‑mail.</p>
    </div>
  `;
  return { subject, html };
}

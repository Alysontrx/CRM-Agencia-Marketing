export interface ResetPasswordEmailParams {
  resetLink: string;
  agencyName?: string;
}

export function getResetPasswordEmail({ resetLink, agencyName }: ResetPasswordEmailParams) {
  const subject = '🔐 Redefinição de senha – Plataforma';
  const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
    <body style="margin:0;padding:0;background:#09090b;font-family:Inter,Segoe UI,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#09090b;padding:40px 20px;">
        <tr><td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#111117;border:1px solid #27272a;border-radius:16px;overflow:hidden;max-width:600px;">
            <!-- Header -->
            <tr>
              <td style="background:linear-gradient(135deg,#1e1b4b 0%,#312e81 100%);padding:40px 48px;text-align:center;">
                <div style="display:inline-block;background:rgba(99,102,241,0.2);border:1px solid rgba(99,102,241,0.4);border-radius:12px;padding:14px 18px;margin-bottom:20px;">
                  <span style="font-size:28px;">🔐</span>
                </div>
                <h1 style="color:#e0e7ff;font-size:26px;font-weight:800;margin:0 0 8px;letter-spacing:-0.5px;">Redefinição de Senha</h1>
                <p style="color:#a5b4fc;font-size:14px;margin:0;letter-spacing:2px;text-transform:uppercase;font-weight:600;">Plataforma CRM</p>
              </td>
            </tr>
            <!-- Body -->
            <tr>
              <td style="padding:48px;">
                <p style="color:#a1a1aa;font-size:15px;line-height:1.7;margin:0 0 24px;">
                  Olá${agencyName ? `, <strong style="color:#e4e4e7">${agencyName}</strong>` : ''}!<br><br>
                  Recebemos uma solicitação para redefinir a senha da sua conta. Clique no botão abaixo para criar uma nova senha:
                </p>

                <div style="text-align:center;margin:32px 0;">
                  <a href="${resetLink}" 
                     style="display:inline-block;background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#fff;font-size:15px;font-weight:700;padding:16px 40px;border-radius:12px;text-decoration:none;letter-spacing:0.3px;box-shadow:0 4px 24px rgba(99,102,241,0.4);">
                    Redefinir Minha Senha →
                  </a>
                </div>

                <div style="background:#18181b;border:1px solid #27272a;border-radius:10px;padding:16px 20px;margin:24px 0;">
                  <p style="color:#71717a;font-size:12px;margin:0 0 6px;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Link direto (caso o botão não funcione):</p>
                  <p style="color:#a5b4fc;font-size:12px;word-break:break-all;margin:0;">${resetLink}</p>
                </div>

                <div style="border-top:1px solid #27272a;margin-top:32px;padding-top:24px;">
                  <p style="color:#52525b;font-size:13px;line-height:1.6;margin:0;">
                    ⚠️ Este link é válido por <strong style="color:#71717a">1 hora</strong>.<br>
                    Se você não solicitou a redefinição de senha, ignore este e‑mail — sua conta está segura.
                  </p>
                </div>
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td style="background:#09090b;padding:20px 48px;text-align:center;border-top:1px solid #18181b;">
                <p style="color:#3f3f46;font-size:12px;margin:0;">© ${new Date().getFullYear()} Plataforma · Todos os direitos reservados</p>
              </td>
            </tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `;
  return { subject, html };
}

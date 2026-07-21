# FALTA FAZER

1. **Testar e Validar o Planejador:** Validar com a equipe se a visualização em grade atual no "Planejador de Posts" atende totalmente a necessidade e se já permite aposentar o Trello.
2. **Migrar o Planejador para o Banco de Dados:** Atualmente, os posts do planejador estão salvos temporariamente no `localStorage` do navegador para testes rápidos. O próximo passo é criar uma tabela chamada `posts_planejador` no **Supabase** para salvar tudo na nuvem, garantindo que nada seja perdido se a equipe limpar o cache do navegador.
3. **Integração Estúdio -> Planejador:** Avaliar se precisamos adicionar um botão "Enviar direto para o Planejador" lá dentro da tela do Estúdio de Conteúdo IA, para facilitar ainda mais o fluxo.
4. **Testes finais da IA de Visão:** Validar mais imagens no Copilot usando o novo modelo Llama 4 Scout.
5. **Acessos no Google Cloud (OAuth):** Adicionar os e-mails da dona da agência e dos funcionários como "Test Users" na Tela de Consentimento OAuth do Google Cloud Console, para que não sejam bloqueados ao tentar fazer login na fase de testes.
6. **Configuração de Permissões (Roles):** Definir os níveis de acesso (Admin vs Funcionário) no Supabase, garantindo que a dona da agência tenha visão geral e os membros vejam apenas o necessário.

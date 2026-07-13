const tarefas = [
  { id: 20, status: 'Aprovado', responsavel_id: 3, data_criacao: '2026-07-08T00:00:00+00:00' },
  { id: 21, status: 'Atrasado', responsavel_id: 1, data_criacao: '2026-07-01T00:00:00+00:00' }
];

const teamPdfPeriod = { start: '2026-06-11', end: '2026-07-11' };

const userTasks3 = tarefas.filter(t => t.responsavel_id === 3 && t.data_criacao >= teamPdfPeriod.start && t.data_criacao <= teamPdfPeriod.end);
console.log('User 3 tasks:', userTasks3);
const entregues = userTasks3.filter(t => t.status === 'Aprovado' || t.status === 'Fechado').length;
console.log('Entregues 3:', entregues);

const userTasks1 = tarefas.filter(t => t.responsavel_id === 1 && t.data_criacao >= teamPdfPeriod.start && t.data_criacao <= teamPdfPeriod.end);
console.log('User 1 tasks:', userTasks1);
const atrasadas = userTasks1.filter(t => t.status === 'Atrasado').length;
console.log('Atrasadas 1:', atrasadas);

// Atlas OS â€” AgÃªncia: Frontend Engine & Operational Controller

// Application State
let STATE = {
    currentUser: null,
    users: [],
    clients: [],
    tasks: [],
    corrections: [],
    reports: [],
    selectedClientId: null
};

// Map of standard statuses to display badge classes
const STATUS_BADGE_MAP = {
    'A fazer': 'badge pendente',
    'Em andamento': 'badge em_andamento',
    'Aguardando material': 'badge aguardando_material',
    'Aguardando revisÃ£o': 'badge aguardando_revisao',
    'Em correÃ§Ã£o': 'badge em_correcao',
    'Aprovado': 'badge aprovado',
    'Publicado': 'badge concluido',
    'Finalizado': 'badge concluido',
    'Atrasado': 'badge atrasado'
};

const CLIENT_STATUS_MAP = {
    'em_dia': 'badge em_dia',
    'atencao': 'badge atencao',
    'atrasado': 'badge atrasado',
    'em_producao': 'badge em_producao',
    'em_correcao': 'badge em_correcao'
};

const CLIENT_STATUS_LABELS = {
    'em_dia': 'ðŸŸ¢ Em Dia',
    'atencao': 'ðŸŸ¡ AtenÃ§Ã£o / Aguardando Material',
    'atrasado': 'ðŸ”´ Atrasado / Urgente',
    'em_producao': 'ðŸ”µ Em ProduÃ§Ã£o',
    'em_correcao': 'ðŸŸ£ Em CorreÃ§Ã£o'
};

// 1. Initial System Load
window.addEventListener('DOMContentLoaded', async () => {
    // Wait slightly for db.js to connect
    setTimeout(async () => {
        await loadSystemData();
        checkActiveSession();
    }, 100);
});

async function loadSystemData() {
    try {
        STATE.users = await DB.getUsers();
        STATE.clients = await DB.getClients();
        STATE.tasks = await DB.getTasks();
        STATE.corrections = await DB.getCorrections();
        STATE.reports = await DB.getReports();
    } catch (e) {
        console.error("Error loading system data: ", e);
    }
}

// 2. Authentication Logic
function checkActiveSession() {
    const savedUser = sessionStorage.getItem('atlas_logged_user');
    if (savedUser) {
        STATE.currentUser = JSON.parse(savedUser);
        enterApp();
    } else {
        document.getElementById('login-overlay').style.display = 'flex';
    }
}

function handleManualLogin() {
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-pass').value;
    
    // Find user in DB
    const user = STATE.users.find(u => u.email === email && u.senha === pass);
    if (user) {
        loginAs(user);
    } else {
        alert('Credenciais incorretas. Use um dos atalhos rÃ¡pidos ou tente novamente.');
    }
}

function handleShortcutLogin(profileName) {
    if (profileName === 'Client') {
        const clientUser = {
            id: 99,
            nome: 'Bella Store (Cliente)',
            funcao: 'Cliente',
            avatar: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=150&auto=format&fit=crop&q=80',
            clientId: 1 // Link to Bella Store
        };
        loginAs(clientUser);
        return;
    }

    const user = STATE.users.find(u => u.nome === profileName);
    if (user) {
        loginAs(user);
    } else {
        // Fallback user if DB not initialized yet
        const fallback = {
            Gabi: { id: 1, nome: 'Gabi', funcao: 'Administradora', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80' },
            Ana: { id: 2, nome: 'Ana', funcao: 'Designer', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80' },
            Lucas: { id: 3, nome: 'Lucas', funcao: 'Social Media', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80' },
            Marina: { id: 4, nome: 'Marina', funcao: 'SecretÃ¡ria/Revisora', avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80' }
        }[profileName];
        loginAs(fallback);
    }
}

function loginAs(user) {
    STATE.currentUser = user;
    sessionStorage.setItem('atlas_logged_user', JSON.stringify(user));
    enterApp();
}

function logout() {
    sessionStorage.removeItem('atlas_logged_user');
    STATE.currentUser = null;
    document.getElementById('login-overlay').style.display = 'flex';
    document.getElementById('menu-client-portal').style.display = 'none';
}

function enterApp() {
    document.getElementById('login-overlay').style.display = 'none';
    
    // Update User Profile Widget
    const avatarImg = document.getElementById('current-user-avatar');
    if (avatarImg) avatarImg.src = STATE.currentUser.avatar;
    
    const nameEl = document.getElementById('current-user-name');
    if (nameEl) nameEl.innerText = STATE.currentUser.nome;
    
    const roleEl = document.getElementById('current-user-role');
    if (roleEl) roleEl.innerText = STATE.currentUser.funcao;
    
    // Adjust interface according to user role
    const isClient = STATE.currentUser.funcao === 'Cliente';
    const clientPortalTab = document.getElementById('menu-client-portal');
    
    if (isClient) {
        if (clientPortalTab) clientPortalTab.style.display = 'flex';
        switchView('client-portal');
    } else {
        if (clientPortalTab) clientPortalTab.style.display = 'none';
        switchView('dashboard');
    }

    refreshAllViews();
}

// 3. Routing & Navigation
function switchView(viewId) {
    // Hide all views
    document.querySelectorAll('.view-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    
    // Deactivate menu items
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });

    // Show selected view
    const targetPanel = document.getElementById(`view-${viewId}`);
    if (targetPanel) {
        targetPanel.classList.add('active');
    }

    // Set active class on menu item
    const targetMenu = document.querySelector(`.menu-item[data-view="${viewId}"]`);
    if (targetMenu) {
        targetMenu.classList.add('active');
    }

    // Set header title
    const formattedTitle = {
        'dashboard': 'Painel Operacional',
        'clientes': 'Clientes',
        'cliente-detalhe': 'Painel do Cliente',
        'tarefas': 'Controle de Tarefas',
        'esteira': 'Esteira de ProduÃ§Ã£o',
        'correcoes': 'Central de CorreÃ§Ãµes',
        'equipe': 'Equipe & Demandas',
        'relatorios': 'RelatÃ³rios Mensais',
        'atlas-ai': 'Atlas InteligÃªncia Artificial',
        'client-portal': 'Acompanhamento do Projeto'
    }[viewId] || 'Atlas OS';

    document.getElementById('page-title').innerText = formattedTitle;
}

// 4. View Rendering Managers
async function refreshAllViews() {
    await loadSystemData();
    renderDashboard();
    renderClients();
    renderTasks();
    renderCorrections();
    renderTeam();
    populateDropdowns();
    renderSmartSuggestions();
    loadReportData();
    
    // Pipeline module renders (loaded from pipeline.js)
    if (typeof initPipelineData === 'function') initPipelineData();
    if (typeof renderEsteira === 'function') renderEsteira();
    if (typeof renderReviewQueue === 'function') renderReviewQueue();
    if (typeof renderPostingQueue === 'function') renderPostingQueue();

    if (STATE.currentUser.funcao === 'Cliente') {
        renderClientPortal();
    }
}

// Render Dashboard Panel
function renderDashboard() {
    // Metrics
    document.getElementById('dash-active-clients').innerText = STATE.clients.length;
    
    const pendingTasks = STATE.tasks.filter(t => t.status !== 'Publicado' && t.status !== 'Finalizado');
    document.getElementById('dash-pending-tasks').innerText = pendingTasks.length;
    
    const overdueTasks = STATE.tasks.filter(t => t.status === 'Atrasado' || (t.prazo && new Date(t.prazo) < new Date() && t.status !== 'Publicado' && t.status !== 'Finalizado'));
    document.getElementById('dash-overdue-tasks').innerText = overdueTasks.length;

    const pendingCorrections = STATE.corrections.filter(c => c.status !== 'Corrigido' && c.status !== 'Aprovado');
    document.getElementById('dash-pending-corrections').innerText = pendingCorrections.length;

    const awaitingMaterial = STATE.tasks.filter(t => t.status === 'Aguardando material');
    document.getElementById('dash-awaiting-material').innerText = awaitingMaterial.length;

    // Render "Attention of the Day"
    const attentionContainer = document.getElementById('attention-list-container');
    attentionContainer.innerHTML = '';

    let alertsCount = 0;
    
    // Add specific alerts
    STATE.clients.forEach(c => {
        if (c.status_geral === 'atencao' || c.status_geral === 'atrasado') {
            const isAtrasado = c.status_geral === 'atrasado';
            attentionContainer.innerHTML += `
                <div class="attention-item">
                    <span class="attention-icon ${isAtrasado ? 'red' : 'yellow'}">
                        <i class="fa-solid ${isAtrasado ? 'fa-triangle-exclamation' : 'fa-hourglass-start'}"></i>
                    </span>
                    <div class="attention-body">
                        <div class="attention-text">Cliente <strong>${c.nome}</strong>: ${c.pendencia_atual}</div>
                        <div class="attention-meta">Status Geral: ${CLIENT_STATUS_LABELS[c.status_geral]}</div>
                    </div>
                </div>
            `;
            alertsCount++;
        }
    });

    // Check overdue tasks
    STATE.tasks.forEach(t => {
        const isTaskOverdue = t.status === 'Atrasado' || (t.prazo && new Date(t.prazo) < new Date() && t.status !== 'Publicado' && t.status !== 'Finalizado');
        if (isTaskOverdue) {
            const clientName = (STATE.clients.find(c => c.id === t.cliente_id) || {nome: 'Geral'}).nome;
            const responsible = (STATE.users.find(u => u.id === t.responsavel_id) || {nome: 'Sem alocaÃ§Ã£o'}).nome;
            attentionContainer.innerHTML += `
                <div class="attention-item">
                    <span class="attention-icon red">
                        <i class="fa-solid fa-circle-exclamation"></i>
                    </span>
                    <div class="attention-body">
                        <div class="attention-text">Tarefa atrasada de <strong>${clientName}</strong>: "${t.titulo}" com <strong>${responsible}</strong></div>
                        <div class="attention-meta">Prazo limite era: ${formatDate(t.prazo)}</div>
                    </div>
                </div>
            `;
            alertsCount++;
        }
    });

    if (alertsCount === 0) {
        attentionContainer.innerHTML = `
            <div style="text-align: center; padding: 20px; color: var(--text-muted);">
                <i class="fa-solid fa-square-check" style="font-size: 24px; color: var(--status-green); margin-bottom: 8px;"></i>
                <p>Nenhum alerta crÃ­tico pendente. A operaÃ§Ã£o estÃ¡ rodando perfeitamente!</p>
            </div>
        `;
    }

    // Today's deliveries list
    const today = new Date().toISOString().split('T')[0];
    const todayDeliveries = STATE.tasks.filter(t => t.prazo === today || t.status === 'Atrasado').slice(0, 5);
    const deliveriesContainer = document.getElementById('today-deliveries-container');
    deliveriesContainer.innerHTML = '';

    if (todayDeliveries.length > 0) {
        todayDeliveries.forEach(t => {
            const clientName = (STATE.clients.find(c => c.id === t.cliente_id) || {nome: 'Geral'}).nome;
            const assigneeName = (STATE.users.find(u => u.id === t.responsavel_id) || {nome: 'NÃ£o alocado'}).nome;
            deliveriesContainer.innerHTML += `
                <tr>
                    <td style="font-weight: 500;">${t.titulo}</td>
                    <td>${clientName}</td>
                    <td>${assigneeName}</td>
                    <td><span class="badge ${t.prioridade === 'Urgente' || t.prioridade === 'Alta' ? 'urgente' : 'pendente'}">${t.prioridade}</span></td>
                    <td><span class="${STATUS_BADGE_MAP[t.status] || 'badge'}">${t.status}</span></td>
                </tr>
            `;
        });
    } else {
        deliveriesContainer.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; color: var(--text-muted); padding: 20px;">Nenhuma entrega agendada para hoje.</td>
            </tr>
        `;
    }

    // Workload Summary Side Card
    const workloadContainer = document.getElementById('workload-summary-container');
    workloadContainer.innerHTML = '';
    
    STATE.users.forEach(u => {
        if (u.funcao === 'Administradora') return; // Admin just checks the workload
        const activeTasksCount = STATE.tasks.filter(t => t.responsavel_id === u.id && t.status !== 'Publicado' && t.status !== 'Finalizado').length;
        const delayedTasksCount = STATE.tasks.filter(t => t.responsavel_id === u.id && (t.status === 'Atrasado' || (t.prazo && new Date(t.prazo) < new Date() && t.status !== 'Publicado' && t.status !== 'Finalizado'))).length;
        
        workloadContainer.innerHTML += `
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-color); padding-bottom:8px;">
                <div style="display:flex; align-items:center; gap:10px;">
                    <img src="${u.avatar}" style="width:30px; height:30px; border-radius:50%; object-fit:cover;">
                    <div>
                        <div style="font-size:13px; font-weight:600;">${u.nome}</div>
                        <div style="font-size:10px; color:var(--text-muted);">${u.funcao}</div>
                    </div>
                </div>
                <div style="display:flex; gap:12px; font-size:12px;">
                    <div><strong>${activeTasksCount}</strong> pends</div>
                    ${delayedTasksCount > 0 ? `<div style="color:var(--status-red);"><strong>${delayedTasksCount}</strong> atrasos</div>` : ''}
                </div>
            </div>
        `;
    });
}

// Render Clients View
function renderClients() {
    const clientsBody = document.getElementById('clients-table-body');
    clientsBody.innerHTML = '';

    STATE.clients.forEach(c => {
        const responsible = (STATE.users.find(u => u.id === c.responsavel_id) || {nome: 'Sem responsÃ¡vel'}).nome;
        
        clientsBody.innerHTML += `
            <tr>
                <td style="font-weight:600; cursor:pointer;" onclick="openClientDetail(${c.id})">${c.nome}</td>
                <td>${c.servico}</td>
                <td>${responsible}</td>
                <td><span class="${CLIENT_STATUS_MAP[c.status_geral] || 'badge'}">${CLIENT_STATUS_LABELS[c.status_geral]}</span></td>
                <td>
                    <div class="progress-container">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${c.progresso}%"></div>
                        </div>
                        <span>${c.progresso}%</span>
                    </div>
                </td>
                <td>${formatDate(c.proxima_entrega)}</td>
                <td style="font-size:12px; color:var(--text-secondary); max-width:200px; text-overflow:ellipsis; overflow:hidden; white-space:nowrap;">${c.pendencia_atual}</td>
                <td>
                    <button class="header-btn" style="padding:6px 12px; font-size:12px;" onclick="openClientDetail(${c.id})">
                        <i class="fa-solid fa-eye"></i> Detalhes
                    </button>
                </td>
            </tr>
        `;
    });
}

// Render Client Individual View Page
function openClientDetail(clientId) {
    STATE.selectedClientId = clientId;
    const client = STATE.clients.find(c => c.id === clientId);
    if (!client) return;

    switchView('cliente-detalhe');

    // UI Updates
    document.getElementById('detail-client-name').innerText = client.nome;
    document.getElementById('detail-client-status').className = CLIENT_STATUS_MAP[client.status_geral] || 'badge';
    document.getElementById('detail-client-status').innerText = CLIENT_STATUS_LABELS[client.status_geral];
    document.getElementById('detail-client-service').innerText = client.servico;
    document.getElementById('detail-client-delivery').innerText = formatDate(client.proxima_entrega);
    
    // Progresso
    document.getElementById('detail-client-progress-bar').style.width = `${client.progresso}%`;
    document.getElementById('detail-client-progress-val').innerText = `${client.progresso}%`;
    document.getElementById('detail-client-updated').innerText = formatDate(client.ultima_atualizacao);
    
    // Notes
    document.getElementById('client-notes').value = client.observacoes_internas || '';

    // Clear Client AI Output box
    document.getElementById('client-ai-result-box').style.display = 'none';

    // Render Timeline
    renderClientTimeline(client);

    // Render Tasks for this client
    renderClientTasks(client.id);

    // Render Simulated Metrics
    renderClientMetricsSimulator(client);
}

function renderClientTimeline(client) {
    const timelineContainer = document.getElementById('client-timeline');
    timelineContainer.innerHTML = '';

    // Defined milestones based on progress
    const milestones = [
        { label: 'Briefing Recebido', minProgress: 10 },
        { label: 'Material de Apoio Recebido', minProgress: 25 },
        { label: 'Roteiros Criados', minProgress: 40 },
        { label: 'Design e ProduÃ§Ã£o das MÃ­dias', minProgress: 60 },
        { label: 'RevisÃ£o OrtogrÃ¡fica e CoesÃ£o', minProgress: 75 },
        { label: 'AprovaÃ§Ã£o Final da Administradora', minProgress: 85 },
        { label: 'PublicaÃ§Ãµes Agendadas', minProgress: 95 },
        { label: 'RelatÃ³rio Mensal Gerado', minProgress: 100 }
    ];

    milestones.forEach(m => {
        const isCompleted = client.progresso >= m.minProgress;
        const isActive = !isCompleted && client.progresso + 15 >= m.minProgress;

        timelineContainer.innerHTML += `
            <div class="timeline-item ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}">
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                    <span class="timeline-title">${m.label}</span>
                    <span class="timeline-date">${isCompleted ? 'Finalizado' : 'Pendente'}</span>
                </div>
            </div>
        `;
    });
}

function renderClientTasks(clientId) {
    const clientTasksBody = document.getElementById('client-tasks-table-body');
    clientTasksBody.innerHTML = '';

    const clientTasks = STATE.tasks.filter(t => t.cliente_id === clientId);

    if (clientTasks.length > 0) {
        clientTasks.forEach(t => {
            const responsible = (STATE.users.find(u => u.id === t.responsavel_id) || {nome: 'Sem alocaÃ§Ã£o'}).nome;
            clientTasksBody.innerHTML += `
                <tr>
                    <td style="font-weight:500;">${t.titulo}</td>
                    <td>${responsible}</td>
                    <td>${t.setor}</td>
                    <td><span class="badge ${t.prioridade === 'Urgente' || t.prioridade === 'Alta' ? 'urgente' : 'pendente'}">${t.prioridade}</span></td>
                    <td>${formatDate(t.prazo)}</td>
                    <td><span class="${STATUS_BADGE_MAP[t.status] || 'badge'}">${t.status}</span></td>
                </tr>
            `;
        });
    } else {
        clientTasksBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; color: var(--text-muted); padding: 16px;">Nenhuma tarefa cadastrada para este cliente.</td>
            </tr>
        `;
    }
}

function renderClientMetricsSimulator(client) {
    const container = document.getElementById('client-metrics-simulator');
    container.innerHTML = '';

    const metrics = client.dados_metricas || { cliques_site: 0, cliques_whatsapp: 0, origem: 'N/A', crescimento: 0, melhor_campanha: 'N/A' };

    container.innerHTML = `
        <div class="mini-card">
            <span style="font-size:12px; color:var(--text-secondary);">Cliques no site este mÃªs</span>
            <strong style="font-size:20px; color:var(--accent);">${metrics.cliques_site}</strong>
        </div>
        <div class="mini-card">
            <span style="font-size:12px; color:var(--text-secondary);">Cliques no WhatsApp</span>
            <strong style="font-size:20px; color:var(--status-green);">${metrics.cliques_whatsapp}</strong>
        </div>
        <div class="mini-card">
            <span style="font-size:12px; color:var(--text-secondary);">Principal origem de acessos</span>
            <strong style="font-size:16px;">${metrics.origem}</strong>
        </div>
        <div class="mini-card">
            <span style="font-size:12px; color:var(--text-secondary);">Campanha com melhor performance</span>
            <strong style="font-size:14px; color:var(--status-purple);">${metrics.melhor_campanha}</strong>
        </div>
    `;
}

async function saveClientNotes() {
    const noteText = document.getElementById('client-notes').value;
    const client = STATE.clients.find(c => c.id === STATE.selectedClientId);
    if (client) {
        client.observacoes_internas = noteText;
        await DB.updateClient(client.id, { observacoes_internas: noteText });
        alert('ObservaÃ§Ãµes salvas com sucesso!');
        refreshAllViews();
    }
}

// Render Tasks List & Workflow Blocking Rules
function renderTasks() {
    const tasksBody = document.getElementById('tasks-table-body');
    tasksBody.innerHTML = '';

    const filterStatus = document.getElementById('task-filter-status').value;
    const filterSector = document.getElementById('task-filter-sector').value;

    let filteredTasks = STATE.tasks;

    if (filterStatus !== 'all') {
        filteredTasks = filteredTasks.filter(t => t.status === filterStatus);
    }
    if (filterSector !== 'all') {
        filteredTasks = filteredTasks.filter(t => t.setor === filterSector);
    }

    // Role restrictions for non-admin profiles
    if (STATE.currentUser && STATE.currentUser.funcao !== 'Administradora') {
        // filter tasks assigned to them or their sector
        const userFuncao = STATE.currentUser.funcao;
        filteredTasks = filteredTasks.filter(t => {
            return t.responsavel_id === STATE.currentUser.id || 
                   (userFuncao === 'Designer' && t.setor === 'Design') ||
                   (userFuncao === 'Social Media' && t.setor === 'Social Media') ||
                   (userFuncao === 'SecretÃ¡ria/Revisora' && t.setor === 'SecretÃ¡ria');
        });
    }

    filteredTasks.forEach(t => {
        const clientName = (STATE.clients.find(c => c.id === t.cliente_id) || {nome: 'Sem cliente'}).nome;
        const responsible = (STATE.users.find(u => u.id === t.responsavel_id) || {nome: 'Sem alocaÃ§Ã£o'}).nome;
        
        // Status Dropdown options
        const statuses = ['A fazer', 'Em andamento', 'Aguardando material', 'Aguardando revisÃ£o', 'Em correÃ§Ã£o', 'Aprovado', 'Publicado', 'Finalizado', 'Atrasado'];
        let dropdownHtml = `<select class="form-control" style="padding:6px; font-size:12px; width:150px; background:var(--bg-secondary); border-color:var(--border-color); color:var(--text-primary);" onchange="handleTaskStatusChange(${t.id}, this.value, '${t.status}')">`;
        
        statuses.forEach(s => {
            dropdownHtml += `<option value="${s}" ${t.status === s ? 'selected' : ''}>${s}</option>`;
        });
        dropdownHtml += `</select>`;

        tasksBody.innerHTML += `
            <tr>
                <td style="font-weight:600;">${t.titulo}</td>
                <td>${clientName}</td>
                <td>${responsible}</td>
                <td>${t.setor}</td>
                <td><span class="badge ${t.prioridade === 'Urgente' || t.prioridade === 'Alta' ? 'urgente' : 'pendente'}">${t.prioridade}</span></td>
                <td>${formatDate(t.prazo)}</td>
                <td>${dropdownHtml}</td>
                <td>
                    <button class="header-btn" style="padding:6px 12px; font-size:12px;" onclick="openTaskComments(${t.id})">
                        <i class="fa-solid fa-comments"></i> Notas
                    </button>
                </td>
            </tr>
        `;
    });
}

// WORKFLOW PROTECTIONS: Prevent marking as "Publicado" without approvals
async function handleTaskStatusChange(taskId, newStatus, oldStatus) {
    const task = STATE.tasks.find(t => t.id === taskId);
    if (!task) return;

    if (newStatus === 'Publicado') {
        // APPROVAL FLOW RULE: Must be approved (or currently Aprovado) to go to Published
        if (oldStatus !== 'Aprovado') {
            // BLOCK IT: open the workflow warning modal
            document.getElementById('workflow-warning-modal').style.display = 'flex';
            // Reset dropdown
            renderTasks();
            return;
        }
    }

    // Update status
    task.status = newStatus;
    
    // Automatically manage Client progress bar depending on task transitions
    await updateClientProgressOnTaskChange(task.cliente_id);

    await DB.updateTask(task.id, { status: newStatus });
    refreshAllViews();
}

async function updateClientProgressOnTaskChange(clientId) {
    const client = STATE.clients.find(c => c.id === clientId);
    if (!client) return;

    const clientTasks = STATE.tasks.filter(t => t.cliente_id === clientId);
    if (clientTasks.length === 0) return;

    const completed = clientTasks.filter(t => t.status === 'Publicado' || t.status === 'Finalizado' || t.status === 'Aprovado').length;
    const ratio = Math.round((completed / clientTasks.length) * 100);
    client.progresso = ratio;
    
    // Update general status
    const pendingTasks = clientTasks.filter(t => t.status !== 'Publicado' && t.status !== 'Finalizado');
    const overdueCount = pendingTasks.filter(t => t.status === 'Atrasado' || (t.prazo && new Date(t.prazo) < new Date())).length;
    
    if (overdueCount > 0) {
        client.status_geral = 'atrasado';
    } else if (pendingTasks.some(t => t.status === 'Aguardando material')) {
        client.status_geral = 'atencao';
    } else if (pendingTasks.length > 0) {
        client.status_geral = 'em_producao';
    } else {
        client.status_geral = 'em_dia';
    }

    client.ultima_atualizacao = new Date().toISOString();
    await DB.updateClient(client.id, { 
        progresso: client.progresso,
        status_geral: client.status_geral,
        ultima_atualizacao: client.ultima_atualizacao 
    });
}

function closeWorkflowModal() {
    document.getElementById('workflow-warning-modal').style.display = 'none';
}

async function openTaskComments(taskId) {
    const task = STATE.tasks.find(t => t.id === taskId);
    if (!task) return;
    
    let commentList = '';
    const comments = task.comentarios || [];
    
    comments.forEach(c => {
        commentList += `\n[${c.autor}]: ${c.texto}`;
    });

    const newComment = prompt(`AnotaÃ§Ãµes/ComentÃ¡rios para a tarefa: "${task.titulo}"${commentList}\n\nEscreva sua nova anotaÃ§Ã£o abaixo:`);
    if (newComment) {
        if (!task.comentarios) task.comentarios = [];
        const newCommentObj = {
            autor: STATE.currentUser.nome,
            texto: newComment,
            data: new Date().toISOString().split('T')[0]
        };
        task.comentarios.push(newCommentObj);
        await DB.updateTask(task.id, { comentarios: task.comentarios });
        refreshAllViews();
    }
}

// Render Corrections Queue
function renderCorrections() {
    const correctionsBody = document.getElementById('corrections-table-body');
    correctionsBody.innerHTML = '';

    STATE.corrections.forEach(c => {
        const clientName = (STATE.clients.find(cl => cl.id === c.cliente_id) || {nome: 'Geral'}).nome;
        const taskTitle = (STATE.tasks.find(t => t.id === c.tarefa_id) || {titulo: 'Geral'}).titulo;
        const responsible = (STATE.users.find(u => u.id === c.responsavel_id) || {nome: 'Sem alocaÃ§Ã£o'}).nome;

        const statuses = ['Pendente', 'Em andamento', 'Corrigido', 'Aprovado'];
        let dropdownHtml = `<select class="form-control" style="padding:6px; font-size:12px; width:130px;" onchange="handleCorrectionStatusChange(${c.id}, this.value)">`;
        statuses.forEach(s => {
            dropdownHtml += `<option value="${s}" ${c.status === s ? 'selected' : ''}>${s}</option>`;
        });
        dropdownHtml += `</select>`;

        correctionsBody.innerHTML += `
            <tr>
                <td style="font-weight:600;">${clientName}</td>
                <td>${taskTitle}</td>
                <td style="font-size:13px; max-width:250px;">${c.descricao}</td>
                <td>${responsible}</td>
                <td>${formatDate(c.prazo)}</td>
                <td>${dropdownHtml}</td>
                <td>
                    <button class="header-btn" style="padding:6px 12px; font-size:12px;" onclick="addCorrectionComment(${c.id})">
                        <i class="fa-solid fa-comment-medical"></i> Nota
                    </button>
                </td>
            </tr>
        `;
    });
}

async function handleCorrectionStatusChange(correctionId, newStatus) {
    const corr = STATE.corrections.find(c => c.id === correctionId);
    if (corr) {
        corr.status = newStatus;
        if (!corr.historico) corr.historico = [];
        corr.historico.push({
            data: new Date().toISOString().split('T')[0],
            acao: `Status alterado para ${newStatus} por ${STATE.currentUser.nome}`
        });

        // If status changed to "Corrigido", update parent task to "Aguardando revisÃ£o" so secretary approves it
        if (newStatus === 'Corrigido') {
            const task = STATE.tasks.find(t => t.id === corr.tarefa_id);
            if (task) {
                task.status = 'Aguardando revisÃ£o';
                await DB.updateTask(task.id, { status: 'Aguardando revisÃ£o' });
            }
        }

        await DB.updateCorrection(corr.id, { status: newStatus, historico: corr.historico });
        refreshAllViews();
    }
}

async function addCorrectionComment(corrId) {
    const corr = STATE.corrections.find(c => c.id === corrId);
    if (!corr) return;

    let commentList = '';
    const comments = corr.comentarios || [];
    comments.forEach(c => {
        commentList += `\n[${c.autor}]: ${c.texto}`;
    });

    const newComment = prompt(`ComentÃ¡rios da CorreÃ§Ã£o:${commentList}\n\nEscreva sua nota abaixo:`);
    if (newComment) {
        if (!corr.comentarios) corr.comentarios = [];
        const newCommentObj = {
            autor: STATE.currentUser.nome,
            texto: newComment
        };
        corr.comentarios.push(newCommentObj);
        await DB.updateCorrection(corr.id, { comentarios: corr.comentarios });
        refreshAllViews();
    }
}

// Render Team Screen
function renderTeam() {
    const teamGrid = document.getElementById('team-cards-grid');
    teamGrid.innerHTML = '';

    STATE.users.forEach(u => {
        const uTasks = STATE.tasks.filter(t => t.responsavel_id === u.id);
        const pendingCount = uTasks.filter(t => t.status !== 'Publicado' && t.status !== 'Finalizado').length;
        const overdueCount = uTasks.filter(t => t.status === 'Atrasado' || (t.prazo && new Date(t.prazo) < new Date() && t.status !== 'Publicado' && t.status !== 'Finalizado')).length;
        const completedCount = uTasks.filter(t => t.status === 'Publicado' || t.status === 'Finalizado').length;

        // Clients linked
        const clientIds = [...new Set(uTasks.map(t => t.cliente_id))];
        const clientNames = clientIds.map(id => (STATE.clients.find(c => c.id === id) || {nome: ''}).nome).filter(n => n !== '').join(', ') || 'Nenhum';

        teamGrid.innerHTML += `
            <div class="team-card">
                <img src="${u.avatar}" alt="${u.nome}" class="team-avatar">
                <h3 style="font-size:16px; font-weight:700; margin-bottom:4px;">${u.nome}</h3>
                <span class="badge" style="background:rgba(255,255,255,0.05); color:var(--text-secondary);">${u.funcao}</span>
                <p style="font-size:11px; color:var(--text-muted); margin-top:10px; line-height:1.4;">Clientes vinculados:<br><strong>${clientNames}</strong></p>
                <div class="team-stats">
                    <div class="team-stat-item">
                        <span class="team-stat-value" style="color: var(--accent);">${pendingCount}</span>
                        <span class="team-stat-label">Pendente</span>
                    </div>
                    <div class="team-stat-item">
                        <span class="team-stat-value" style="color: var(--status-red);">${overdueCount}</span>
                        <span class="team-stat-label">Atrasado</span>
                    </div>
                    <div class="team-stat-item">
                        <span class="team-stat-value" style="color: var(--status-green);">${completedCount}</span>
                        <span class="team-stat-label">Feito</span>
                    </div>
                </div>
            </div>
        `;
    });
}

// Render Reports Page
function loadReportData() {
    const clientSel = document.getElementById('report-client-selector');
    if (!clientSel) return;

    const currentSelVal = clientSel.value;
    clientSel.innerHTML = '';
    
    STATE.clients.forEach(c => {
        clientSel.innerHTML += `<option value="${c.id}" ${currentSelVal == c.id ? 'selected' : ''}>${c.nome}</option>`;
    });

    const selectedClientId = parseInt(clientSel.value);
    if (isNaN(selectedClientId)) return;

    const report = STATE.reports.find(r => r.cliente_id === selectedClientId) || {
        seguidores_crescimento: 50,
        alcance: 1200,
        cliques_site: 45,
        cliques_whatsapp: 10,
        engajamento: 2.1,
        observacoes: 'Dados simulados para demonstraÃ§Ã£o inicial.'
    };
    
    const client = STATE.clients.find(c => c.id === selectedClientId);

    document.getElementById('rep-followers').innerText = `+${report.seguidores_crescimento}`;
    document.getElementById('rep-reach').innerText = report.alcance.toLocaleString('pt-BR');
    document.getElementById('rep-engagement').innerText = `${report.engajamento}%`;
    document.getElementById('rep-clicks').innerText = report.cliques_whatsapp;
    document.getElementById('rep-obs').innerText = report.observacoes;
    
    const bestCampaign = (client && client.dados_metricas && client.dados_metricas.melhor_campanha) || 'Nenhuma';
    document.getElementById('rep-best-campaign').innerText = bestCampaign;
}

// Render Client Portal (If logged in as client)
function renderClientPortal() {
    const client = STATE.clients.find(c => c.id === STATE.currentUser.clientId);
    if (!client) return;

    document.getElementById('portal-client-name').innerText = client.nome;
    document.getElementById('portal-client-status').innerText = CLIENT_STATUS_LABELS[client.status_geral];
    document.getElementById('portal-client-pendency').innerText = client.pendencia_atual;

    const timelineContainer = document.getElementById('portal-timeline');
    timelineContainer.innerHTML = '';

    const milestones = [
        { label: 'Briefing Recebido', minProgress: 10 },
        { label: 'Material de Apoio Recebido', minProgress: 25 },
        { label: 'Roteiros Criados', minProgress: 40 },
        { label: 'Design e ProduÃ§Ã£o das MÃ­dias', minProgress: 60 },
        { label: 'RevisÃ£o OrtogrÃ¡fica e CoesÃ£o', minProgress: 75 },
        { label: 'AprovaÃ§Ã£o Final da Administradora', minProgress: 85 },
        { label: 'PublicaÃ§Ãµes Agendadas', minProgress: 95 },
        { label: 'RelatÃ³rio Mensal Gerado', minProgress: 100 }
    ];

    milestones.forEach(m => {
        const isCompleted = client.progresso >= m.minProgress;
        const isActive = !isCompleted && client.progresso + 15 >= m.minProgress;

        timelineContainer.innerHTML += `
            <div class="timeline-item ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}">
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                    <span class="timeline-title">${m.label}</span>
                    <span class="timeline-date">${isCompleted ? 'Finalizado' : 'Em progresso'}</span>
                </div>
            </div>
        `;
    });
}

// Populate dropdown select options
function populateDropdowns() {
    const taskClient = document.getElementById('task-client');
    const taskAssignee = document.getElementById('task-assignee');
    
    if (taskClient && taskAssignee) {
        taskClient.innerHTML = '';
        taskAssignee.innerHTML = '';

        STATE.clients.forEach(c => {
            taskClient.innerHTML += `<option value="${c.id}">${c.nome}</option>`;
        });

        STATE.users.forEach(u => {
            taskAssignee.innerHTML += `<option value="${u.id}">${u.nome} (${u.funcao})</option>`;
        });
    }
}

// 5. PREMIUM MODULE: ATLAS AI (OPERATIONAL INTELLIGENCE)
function showAIOutput(text) {
    const box = document.getElementById('ai-output-content-box');
    box.innerHTML = text;
    
    // Show Copy button
    document.getElementById('ai-btn-copy').style.display = 'block';
}

function runAIDaySummary() {
    // Generate an in-depth dynamic status of the agency operation
    const clientsCount = STATE.clients.length;
    const attentionClients = STATE.clients.filter(c => c.status_geral === 'atencao' || c.status_geral === 'atrasado');
    const awaitingMaterialCount = STATE.tasks.filter(t => t.status === 'Aguardando material').length;
    const overdueCount = STATE.tasks.filter(t => t.status === 'Atrasado' || (t.prazo && new Date(t.prazo) < new Date() && t.status !== 'Publicado' && t.status !== 'Finalizado')).length;
    const correctionsCount = STATE.corrections.filter(c => c.status !== 'Corrigido' && c.status !== 'Aprovado').length;
    const finishedToday = STATE.tasks.filter(t => t.status === 'Publicado' || t.status === 'Finalizado').length;

    let alertsHtml = '';
    STATE.clients.forEach(c => {
        if (c.status_geral === 'atencao' || c.status_geral === 'atrasado') {
            alertsHtml += `â€¢ <strong>${c.nome}</strong>: ${c.pendencia_atual}\n`;
        }
    });

    let suggestionHtml = '';
    if (overdueCount > 0) {
        suggestionHtml += `1. Resolver tarefas atrasadas (${overdueCount} pendentes).\n`;
    }
    if (awaitingMaterialCount > 0) {
        suggestionHtml += `2. Cobrar materiais pendentes dos clientes (${awaitingMaterialCount} no aguardo).\n`;
    }
    if (correctionsCount > 0) {
        suggestionHtml += `3. Priorizar e revisar correÃ§Ãµes abertas (${correctionsCount} pendentes) antes de criar novas demandas.`;
    }

    const reportText = `<strong>DiagnÃ³stico Operacional de Hoje:</strong>

Hoje existem <strong>${clientsCount} clientes ativos</strong> na agÃªncia.
âš ï¸ <strong>${attentionClients.length} clientes</strong> precisam de atenÃ§Ã£o operacional.
â³ <strong>${awaitingMaterialCount} clientes</strong> estÃ£o aguardando envio de material.
ðŸš¨ <strong>${overdueCount} tarefas</strong> estÃ£o registradas como atrasadas.
âœï¸ <strong>${correctionsCount} correÃ§Ãµes</strong> estÃ£o pendentes de ajuste pela equipe.
âœ… A equipe jÃ¡ publicou/concluiu <strong>${finishedToday} demandas</strong> nesta rodada.

<strong>Alertas CrÃ­ticos Ativos:</strong>
${alertsHtml}
<strong>SugestÃ£o de Prioridades Recomendadas pela IA:</strong>
${suggestionHtml || 'ParabÃ©ns! Sua agÃªncia estÃ¡ sem gargalos e com todas as prioridades em dia.'}`;

    showAIOutput(reportText);
}

function runAIWhatsAppSummary() {
    const clientsCount = STATE.clients.length;
    const activeClientsInDay = STATE.clients.filter(c => c.status_geral === 'em_dia').length;
    const awaitingMaterialCount = STATE.tasks.filter(t => t.status === 'Aguardando material').length;
    const overdueCount = STATE.tasks.filter(t => t.status === 'Atrasado' || (t.prazo && new Date(t.prazo) < new Date() && t.status !== 'Publicado' && t.status !== 'Finalizado')).length;
    const correctionsCount = STATE.corrections.filter(c => c.status !== 'Corrigido' && c.status !== 'Aprovado').length;

    let whatsappText = `Bom dia, Gabi!

Resumo rÃ¡pido da operaÃ§Ã£o da agÃªncia:

ðŸŸ¢ ${activeClientsInDay} clientes em dia
ðŸŸ¡ ${awaitingMaterialCount} clientes aguardando material
ðŸ”´ ${overdueCount} tarefas atrasadas
âœï¸ ${correctionsCount} correÃ§Ãµes pendentes
ðŸ“Š RelatÃ³rios mensais atualizados

Prioridade de Hoje recomendada pela Atlas AI:
`;

    let i = 1;
    STATE.clients.forEach(c => {
        if ((c.status_geral === 'atencao' || c.status_geral === 'atrasado') && i <= 3) {
            whatsappText += `- ${c.nome}: ${c.pendencia_atual}\n`;
            i++;
        }
    });

    showAIOutput(whatsappText);
}

function renderSmartSuggestions() {
    const container = document.getElementById('ai-smart-suggestions');
    if (!container) return;

    container.innerHTML = '';

    // Suggestion 1: Designer overload check
    const designer = STATE.users.find(u => u.funcao === 'Designer');
    if (designer) {
        const designerTasks = STATE.tasks.filter(t => t.responsavel_id === designer.id && t.status !== 'Publicado' && t.status !== 'Finalizado').length;
        if (designerTasks > 4) {
            container.innerHTML += `
                <div class="suggestion-item">
                    <i class="fa-solid fa-lightbulb"></i>
                    <span><strong>AlocaÃ§Ã£o desequilibrada:</strong> A designer ${designer.nome} estÃ¡ com ${designerTasks} demandas pendentes. Recomenda-se remanejar ou espaÃ§ar as datas.</span>
                </div>
            `;
        }
    }

    // Suggestion 2: Stagnated projects check
    STATE.clients.forEach(c => {
        if (c.status_geral === 'atencao' && c.pendencia_atual.includes('Aguardando aprovaÃ§Ã£o')) {
            container.innerHTML += `
                <div class="suggestion-item">
                    <i class="fa-solid fa-lightbulb"></i>
                    <span><strong>Gargalo do Cliente:</strong> O projeto de <strong>${c.nome}</strong> estÃ¡ parado por aprovaÃ§Ã£o. Recomenda-se enviar mensagem de cobranÃ§a.</span>
                </div>
            `;
        }
    });

    // Suggestion 3: Corrections count check
    const pendingCorr = STATE.corrections.filter(c => c.status !== 'Corrigido' && c.status !== 'Aprovado').length;
    if (pendingCorr > 2) {
        container.innerHTML += `
            <div class="suggestion-item">
                <i class="fa-solid fa-lightbulb"></i>
                <span><strong>Foco em Ajustes:</strong> Existem ${pendingCorr} correÃ§Ãµes no funil. Reduza a abertura de novos briefings para limpar a fila.</span>
            </div>
        `;
    }

    if (container.innerHTML === '') {
        container.innerHTML = `
            <div style="font-size:12px; color:var(--text-muted); text-align:center; padding:10px;">Sem sugestÃµes operacionais extras no momento. Tudo correndo bem!</div>
        `;
    }
}

// Individual Client AI summaries (located in Client detail view card)
function generateClientAISummary() {
    const client = STATE.clients.find(c => c.id === STATE.selectedClientId);
    if (!client) return;

    const totalTasks = STATE.tasks.filter(t => t.cliente_id === client.id).length;
    const doneTasks = STATE.tasks.filter(t => t.cliente_id === client.id && (t.status === 'Publicado' || t.status === 'Finalizado' || t.status === 'Aprovado')).length;
    const correctionCount = STATE.corrections.filter(c => c.cliente_id === client.id && c.status !== 'Corrigido').length;
    const nextDelivery = formatDate(client.proxima_entrega);

    const text = `Resumo do cliente ${client.nome}:

O cliente estÃ¡ com ${client.progresso}% das entregas do mÃªs concluÃ­das (${doneTasks}/${totalTasks} demandas).
Existem ${correctionCount} correÃ§Ãµes pendentes nos posts.
A prÃ³xima entrega de material estÃ¡ prevista para ${nextDelivery}.
Gargalo principal: ${client.pendencia_atual}.`;

    const box = document.getElementById('client-ai-result-box');
    box.style.display = 'block';
    box.innerText = text;
}

function generateClientAIMessage() {
    const client = STATE.clients.find(c => c.id === STATE.selectedClientId);
    if (!client) return;

    let text = '';
    if (client.status_geral === 'atencao' && client.pendencia_atual.toLowerCase().includes('material')) {
        text = `OlÃ¡, tudo bem?

Estamos passando para lembrar que ainda precisamos dos materiais pendentes (${client.pendencia_atual.toLowerCase()}) para dar continuidade ao seu projeto. Assim que recebermos, conseguimos avanÃ§ar para as prÃ³ximas etapas de design e redaÃ§Ã£o.

Ficamos Ã  disposiÃ§Ã£o!`;
    } else {
        text = `OlÃ¡, tudo bem?

Gostaria de informar que o status do seu projeto estÃ¡ em ${client.progresso}% de conclusÃ£o neste mÃªs.

JÃ¡ temos os relatÃ³rios e os posts agendados para a prÃ³xima semana. Se tiver alguma dÃºvida ou novo material para enviar, nos envie por aqui.

Tenha um excelente dia!`;
    }

    const box = document.getElementById('client-ai-result-box');
    box.style.display = 'block';
    box.innerText = text;
    
    // Auto copy client message
    navigator.clipboard.writeText(text);
    alert('Mensagem copiada para a Ã¡rea de transferÃªncia! Cole diretamente no WhatsApp do cliente.');
}

// Copy AI Output to Clipboard
function copyAIOutputText() {
    const content = document.getElementById('ai-output-content-box').innerText;
    navigator.clipboard.writeText(content).then(() => {
        alert("Texto copiado para a Ã¡rea de transferÃªncia!");
    });
}

// 6. Modal Open/Close Controls
function openNewTaskModal() {
    document.getElementById('new-task-modal').style.display = 'flex';
}

function closeNewTaskModal() {
    document.getElementById('new-task-modal').style.display = 'none';
}

async function handleCreateTask() {
    const title = document.getElementById('task-title').value;
    const clientId = parseInt(document.getElementById('task-client').value);
    const assigneeId = parseInt(document.getElementById('task-assignee').value);
    const sector = document.getElementById('task-sector').value;
    const priority = document.getElementById('task-priority').value;
    const dueDate = document.getElementById('task-due-date').value;

    const newTask = {
        id: STATE.tasks.length + 1,
        titulo: title,
        cliente_id: clientId,
        responsavel_id: assigneeId,
        setor: sector,
        prioridade: priority,
        prazo: dueDate,
        status: 'A fazer',
        data_criacao: new Date().toISOString(),
        comentarios: []
    };

    // Remove id from newTask so Supabase auto-generates it
    const { id, ...taskData } = newTask;
    const createdTask = await DB.createTask(taskData);
    if (createdTask) {
        STATE.tasks.push(createdTask);
    }
    
    // Update Client status to "em_producao"
    const client = STATE.clients.find(c => c.id === clientId);
    if (client && client.status_geral === 'em_dia') {
        client.status_geral = 'em_producao';
        await DB.updateClient(client.id, { status_geral: 'em_producao' });
    }

    closeNewTaskModal();
    refreshAllViews();
    alert('Nova demanda criada com sucesso!');
}

// Helper: Format ISO Dates
function formatDate(dateStr) {
    if (!dateStr) return 'NÃ£o definida';
    const parts = dateStr.split('T')[0].split('-');
    if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
}


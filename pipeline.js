// ============================================================
// ATLAS OS â€” PIPELINE / ESTEIRA DE PRODUÃ‡ÃƒO ENGINE
// ============================================================

// Pipeline Stages Configuration
const PIPELINE_STAGES = [
    { id: 'a_fazer',              name: 'A Fazer',                 color: '#64748b', icon: 'fa-inbox',               status: 'A fazer' },
    { id: 'em_producao',          name: 'Em ProduÃ§Ã£o',             color: '#3b82f6', icon: 'fa-hammer',              status: 'Em andamento' },
    { id: 'enviado_revisao',      name: 'Enviado para RevisÃ£o',    color: '#06b6d4', icon: 'fa-magnifying-glass',    status: 'Aguardando revisÃ£o' },
    { id: 'aguardando_correcao',  name: 'Aguardando CorreÃ§Ã£o',     color: '#ef4444', icon: 'fa-rotate-left',         status: 'Em correÃ§Ã£o' },
    { id: 'aprovado_postagem',    name: 'Aprovado p/ Postagem',    color: '#8b5cf6', icon: 'fa-circle-check',        status: 'Aprovado' },
    { id: 'em_postagem',          name: 'Em Postagem',             color: '#f59e0b', icon: 'fa-share-from-square',   status: 'Publicado' },
    { id: 'concluido',            name: 'ConcluÃ­do',               color: '#10b981', icon: 'fa-flag-checkered',      status: 'Finalizado' }
];

// Map task status back to stage id
function getStageForStatus(status) {
    const stage = PIPELINE_STAGES.find(s => s.status === status);
    if (stage) return stage.id;
    if (status === 'Aguardando material') return 'a_fazer';
    if (status === 'Atrasado') return 'a_fazer';
    return 'a_fazer';
}

// Delivery status class map
const DELIVERY_STATUS_CLASS = {
    'Enviado para revisÃ£o': 'delivery-status-review',
    'Em anÃ¡lise': 'delivery-status-analysis',
    'Aprovado': 'delivery-status-approved',
    'Reprovado': 'delivery-status-correction',
    'Precisa de correÃ§Ã£o': 'delivery-status-correction',
    'Aprovado para postagem': 'delivery-status-posting',
    'Em postagem': 'delivery-status-posting',
    'Finalizado': 'delivery-status-done'
};

// Type icon map
const TYPE_ICON_MAP = {
    'Arte para feed': { icon: 'fa-palette', class: 'type-arte' },
    'Carrossel': { icon: 'fa-images', class: 'type-carrossel' },
    'Reels': { icon: 'fa-video', class: 'type-video' },
    'VÃ­deo editado': { icon: 'fa-film', class: 'type-video' },
    'Roteiro': { icon: 'fa-scroll', class: 'type-roteiro' },
    'Legenda': { icon: 'fa-align-left', class: 'type-legenda' },
    'Link do Canva': { icon: 'fa-link', class: 'type-link' },
    'Link do Drive': { icon: 'fa-link', class: 'type-link' },
    'Link do vÃ­deo': { icon: 'fa-link', class: 'type-link' },
    'Documento': { icon: 'fa-file-lines', class: 'type-outro' },
    'Imagem': { icon: 'fa-image', class: 'type-arte' },
    'Outro': { icon: 'fa-paperclip', class: 'type-outro' }
};

// ============================================================
// MOCK DATA INITIALIZATION
// ============================================================

let _pipelineInitialized = false;

function initPipelineData() {
    if (_pipelineInitialized) return;
    _pipelineInitialized = true;

    // Task Deliveries
    STATE.deliveries = [
        {
            id: 1, task_id: 1, user_id: 3, title: 'Roteiro inicial do reels',
            type: 'Roteiro', link: 'https://docs.google.com/document/d/exemplo-roteiro',
            notes: 'Roteiro com 3 cenas curtas para reels de inverno da Bella Store.',
            version: 1, status: 'Aprovado', created_at: '2026-07-01T10:30:00'
        },
        {
            id: 2, task_id: 1, user_id: 5, title: 'Reels inverno V1',
            type: 'VÃ­deo editado', link: 'https://drive.google.com/file/d/exemplo-video-v1',
            notes: 'Primeira versÃ£o do vÃ­deo editado. DuraÃ§Ã£o: 45 segundos.',
            version: 1, status: 'Precisa de correÃ§Ã£o', created_at: '2026-07-02T14:30:00',
            correction_note: 'Reduzir duraÃ§Ã£o para 30 segundos e trocar mÃºsica de fundo.'
        },
        {
            id: 3, task_id: 1, user_id: 5, title: 'Reels inverno V2',
            type: 'VÃ­deo editado', link: 'https://drive.google.com/file/d/exemplo-video-v2',
            notes: 'Segunda versÃ£o com duraÃ§Ã£o ajustada para 30s e mÃºsica nova.',
            version: 2, status: 'Em anÃ¡lise', created_at: '2026-07-02T17:10:00'
        },
        {
            id: 4, task_id: 3, user_id: 2, title: 'Arte feed promoÃ§Ã£o inverno',
            type: 'Arte para feed', link: 'https://canva.com/design/exemplo-arte',
            notes: 'Arte finalizada com as cores da campanha de inverno.',
            version: 1, status: 'Aprovado', created_at: '2026-07-01T16:00:00'
        },
        {
            id: 5, task_id: 6, user_id: 2, title: 'Carrossel saÃºde preventiva',
            type: 'Carrossel', link: 'https://canva.com/design/exemplo-carrossel',
            notes: 'Carrossel com 5 slides sobre cuidados preventivos.',
            version: 1, status: 'Aprovado para postagem', created_at: '2026-07-02T11:00:00'
        },
        {
            id: 6, task_id: 9, user_id: 2, title: 'PromoÃ§Ã£o final de semana',
            type: 'Arte para feed', link: 'https://drive.google.com/file/d/arte-promo',
            notes: 'Encarte digital de ofertas.',
            version: 1, status: 'Finalizado', created_at: '2026-07-01T09:00:00',
            publication_link: 'https://instagram.com/p/exemplo-post'
        }
    ];

    // Client Pending Materials
    STATE.clientPendings = [
        {
            id: 1, client_id: 4, title: 'Fotos atualizadas da equipe',
            description: 'Cliente precisa enviar fotos profissionais para o novo site e redes.',
            requested_by: 4, status: 'Aguardando cliente', due_date: '2026-07-05',
            created_at: '2026-06-28T10:00:00'
        },
        {
            id: 2, client_id: 3, title: 'Fotos do evento de sÃ¡bado',
            description: 'Fotos e vÃ­deos do evento para ediÃ§Ã£o de conteÃºdo.',
            requested_by: 4, status: 'Aguardando cliente', due_date: '2026-07-03',
            created_at: '2026-06-30T09:00:00'
        },
        {
            id: 3, client_id: 1, title: 'Logo em PNG com fundo transparente',
            description: 'NecessÃ¡rio para peÃ§as de design e vÃ­deos.',
            requested_by: 2, status: 'Recebido', due_date: '2026-07-01',
            created_at: '2026-06-27T14:00:00'
        }
    ];

    // Activity Log
    STATE.activityLog = [
        { id: 1, task_id: 1, user_id: 3, action: 'add', description: 'Lucas anexou "Roteiro inicial do reels"', created_at: '2026-07-01T10:30:00' },
        { id: 2, task_id: 1, user_id: 5, action: 'add', description: 'JoÃ£o anexou "Reels inverno V1"', created_at: '2026-07-02T14:30:00' },
        { id: 3, task_id: 1, user_id: 4, action: 'correction', description: 'Marina solicitou correÃ§Ã£o: "Reduzir duraÃ§Ã£o para 30s e trocar mÃºsica"', created_at: '2026-07-02T15:10:00' },
        { id: 4, task_id: 1, user_id: 5, action: 'add', description: 'JoÃ£o anexou "Reels inverno V2"', created_at: '2026-07-02T17:10:00' },
        { id: 5, task_id: 1, user_id: 4, action: 'move', description: 'Marina moveu de "Em ProduÃ§Ã£o" para "Enviado para RevisÃ£o"', created_at: '2026-07-02T17:30:00' },
        { id: 6, task_id: 3, user_id: 2, action: 'add', description: 'Ana anexou "Arte feed promoÃ§Ã£o inverno"', created_at: '2026-07-01T16:00:00' },
        { id: 7, task_id: 3, user_id: 1, action: 'approve', description: 'Gabi aprovou a arte do feed', created_at: '2026-07-01T17:00:00' },
        { id: 8, task_id: 6, user_id: 2, action: 'add', description: 'Ana anexou "Carrossel saÃºde preventiva"', created_at: '2026-07-02T11:00:00' },
        { id: 9, task_id: 6, user_id: 1, action: 'approve', description: 'Gabi moveu para "Aprovado para Postagem"', created_at: '2026-07-02T13:00:00' },
        { id: 10, task_id: 9, user_id: 2, action: 'add', description: 'Ana anexou "PromoÃ§Ã£o final de semana"', created_at: '2026-07-01T09:00:00' },
        { id: 11, task_id: 9, user_id: 3, action: 'move', description: 'Lucas moveu para "ConcluÃ­do"', created_at: '2026-07-01T14:00:00' }
    ];

    // Currently open task detail
    STATE.openTaskDetailId = null;
}

// ============================================================
// ESTEIRA / KANBAN BOARD RENDERER
// ============================================================

function renderEsteira() {
    initPipelineData();
    const board = document.getElementById('kanban-board');
    if (!board) return;
    board.innerHTML = '';

    // Populate client filter dropdown
    const clientFilter = document.getElementById('kanban-filter-client');
    if (clientFilter) {
        const currentVal = clientFilter.value;
        clientFilter.innerHTML = '<option value="all">Todos os clientes</option>';
        STATE.clients.forEach(c => {
            clientFilter.innerHTML += `<option value="${c.id}" ${currentVal == c.id ? 'selected' : ''}>${c.nome}</option>`;
        });
    }

    const filterClient = document.getElementById('kanban-filter-client')?.value || 'all';
    const filterSector = document.getElementById('kanban-filter-sector')?.value || 'all';

    // Filter tasks
    let tasks = [...STATE.tasks];
    if (filterClient !== 'all') tasks = tasks.filter(t => t.cliente_id == filterClient);
    if (filterSector !== 'all') tasks = tasks.filter(t => t.setor === filterSector);

    // Non-admin: show only relevant tasks
    if (STATE.currentUser && STATE.currentUser.funcao !== 'Administradora' && STATE.currentUser.funcao !== 'Cliente') {
        tasks = tasks.filter(t =>
            t.responsavel_id === STATE.currentUser.id ||
            (STATE.currentUser.funcao === 'Designer' && t.setor === 'Design') ||
            (STATE.currentUser.funcao === 'Social Media' && t.setor === 'Social Media') ||
            (STATE.currentUser.funcao === 'SecretÃ¡ria/Revisora' && t.setor === 'SecretÃ¡ria')
        );
    }

    PIPELINE_STAGES.forEach(stage => {
        const stageTasks = tasks.filter(t => getStageForStatus(t.status) === stage.id);

        const col = document.createElement('div');
        col.className = 'kanban-column';
        col.dataset.stage = stage.id;

        col.innerHTML = `
            <div class="kanban-col-header">
                <div class="kanban-col-title">
                    <span class="kanban-col-dot" style="background:${stage.color}"></span>
                    ${stage.name}
                </div>
                <span class="kanban-col-count">${stageTasks.length}</span>
            </div>
            <div class="kanban-cards" id="kanban-col-${stage.id}"></div>
        `;

        const cardsContainer = col.querySelector('.kanban-cards');

        // Drag events on column
        cardsContainer.addEventListener('dragover', e => {
            e.preventDefault();
            col.classList.add('drag-over');
        });
        cardsContainer.addEventListener('dragleave', () => col.classList.remove('drag-over'));
        cardsContainer.addEventListener('drop', e => {
            e.preventDefault();
            col.classList.remove('drag-over');
            const taskId = parseInt(e.dataTransfer.getData('text/plain'));
            if (taskId) handleKanbanDrop(taskId, stage);
        });

        if (stageTasks.length === 0) {
            cardsContainer.innerHTML = '<div class="kanban-empty"><i class="fa-solid fa-inbox" style="display:block;margin-bottom:6px;font-size:16px;"></i>Sem itens</div>';
        } else {
            stageTasks.forEach(t => {
                const card = createKanbanCard(t);
                cardsContainer.appendChild(card);
            });
        }

        board.appendChild(col);
    });
}

function createKanbanCard(task) {
    const clientName = (STATE.clients.find(c => c.id === task.cliente_id) || { nome: 'Sem cliente' }).nome;
    const responsible = STATE.users.find(u => u.id === task.responsavel_id) || { nome: 'N/A', avatar: '' };
    const deliveries = (STATE.deliveries || []).filter(d => d.task_id === task.id);
    const comments = (task.comentarios || []).length;
    const isOverdue = task.prazo && new Date(task.prazo) < new Date() && task.status !== 'Publicado' && task.status !== 'Finalizado';

    const priorityClass = `priority-${(task.prioridade || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`;

    const card = document.createElement('div');
    card.className = `kanban-card ${priorityClass}`;
    card.draggable = true;
    card.dataset.taskId = task.id;
    card.style.cursor = 'grab';

    card.innerHTML = `
        <div class="kanban-card-client">${clientName}</div>
        <div class="kanban-card-title">${task.titulo}</div>
        <div class="kanban-card-meta">
            ${responsible.avatar ? `<img class="kanban-card-avatar" src="${responsible.avatar}" alt="${responsible.nome}">` : ''}
            <span class="kanban-card-responsible">${responsible.nome}</span>
            <span class="type-badge ${TYPE_ICON_MAP[task.setor === 'Design' ? 'Arte para feed' : 'Roteiro']?.class || 'type-outro'}">${task.setor}</span>
        </div>
        <div class="kanban-card-footer">
            <span class="kanban-card-due ${isOverdue ? 'overdue' : ''}"><i class="fa-regular fa-calendar"></i> ${formatDate(task.prazo)}</span>
            <div class="kanban-card-icons">
                ${deliveries.length > 0 ? `<span class="kanban-card-icon-item"><i class="fa-solid fa-paperclip"></i> ${deliveries.length}</span>` : ''}
                ${comments > 0 ? `<span class="kanban-card-icon-item"><i class="fa-regular fa-comment"></i> ${comments}</span>` : ''}
            </div>
        </div>
    `;

    // Drag events
    card.addEventListener('dragstart', e => {
        e.dataTransfer.setData('text/plain', task.id);
        card.classList.add('dragging');
    });
    card.addEventListener('dragend', () => card.classList.remove('dragging'));

    // Click to open detail
    card.addEventListener('click', e => {
        if (!card.classList.contains('dragging')) {
            openTaskDetail(task.id);
        }
    });

    return card;
}

// ============================================================
// KANBAN DROP HANDLER
// ============================================================

function handleKanbanDrop(taskId, newStage) {
    const task = STATE.tasks.find(t => t.id === taskId);
    if (!task) return;

    const oldStatus = task.status;
    const newStatus = newStage.status;

    if (oldStatus === newStatus) return;

    // Rule: Can't go to ConcluÃ­do without passing Aprovado first (unless admin)
    if (newStage.id === 'concluido' && STATE.currentUser.funcao !== 'Administradora') {
        const wasApproved = STATE.activityLog.some(l =>
            l.task_id === taskId && (l.action === 'approve' || l.description.includes('Aprovado'))
        );
        if (!wasApproved && oldStatus !== 'Aprovado' && oldStatus !== 'Publicado') {
            alert('Esta tarefa precisa passar por aprovaÃ§Ã£o antes de ser concluÃ­da.');
            return;
        }
    }

    // Update task status
    task.status = newStatus;

    // Log activity
    const userName = STATE.currentUser.nome;
    const oldStageName = PIPELINE_STAGES.find(s => s.status === oldStatus)?.name || oldStatus;

    addActivityLogEntry(taskId, 'move', `${userName} moveu de "${oldStageName}" para "${newStage.name}"`);

    // Refresh views
    renderEsteira();
    renderDashboard();
    renderReviewQueue();
    renderPostingQueue();
}

// ============================================================
// TASK DETAIL SIDE PANEL
// ============================================================

function openTaskDetail(taskId) {
    initPipelineData();
    STATE.openTaskDetailId = taskId;
    const task = STATE.tasks.find(t => t.id === taskId);
    if (!task) return;

    const client = STATE.clients.find(c => c.id === task.cliente_id) || { nome: 'Sem cliente' };
    const responsible = STATE.users.find(u => u.id === task.responsavel_id) || { nome: 'N/A' };
    const currentStage = PIPELINE_STAGES.find(s => s.status === task.status) || PIPELINE_STAGES[0];
    const nextStageIdx = PIPELINE_STAGES.indexOf(currentStage) + 1;
    const nextStage = nextStageIdx < PIPELINE_STAGES.length ? PIPELINE_STAGES[nextStageIdx] : null;
    const deliveries = (STATE.deliveries || []).filter(d => d.task_id === taskId);

    // Header
    document.getElementById('td-client-name').textContent = client.nome;
    document.getElementById('td-task-title').textContent = task.titulo;

    // Meta bar
    document.getElementById('td-meta-bar').innerHTML = `
        <div class="task-detail-meta-item"><i class="fa-solid fa-user"></i> ${responsible.nome}</div>
        <div class="task-detail-meta-item"><i class="fa-solid fa-layer-group"></i> ${task.setor}</div>
        <div class="task-detail-meta-item"><i class="fa-solid fa-flag"></i> <span class="badge ${task.prioridade === 'Urgente' || task.prioridade === 'Alta' ? 'urgente' : 'pendente'}">${task.prioridade}</span></div>
        <div class="task-detail-meta-item"><i class="fa-regular fa-calendar"></i> ${formatDate(task.prazo)}</div>
        <div class="task-detail-meta-item"><i class="fa-solid fa-circle" style="color:${currentStage.color};font-size:8px;"></i> ${currentStage.name}</div>
        ${nextStage ? `<div class="task-detail-meta-item" style="color:var(--text-muted);">â†’ ${nextStage.name}</div>` : ''}
    `;

    // Delivery count
    document.getElementById('td-delivery-count').textContent = deliveries.length;

    // Details tab
    renderTaskDetailDetails(task);

    // Deliveries tab
    renderTaskDetailDeliveries(taskId);

    // History tab
    renderTaskDetailHistory(taskId);

    // Show modal
    document.getElementById('task-detail-modal').style.display = 'flex';

    // Reset to first tab
    switchTaskDetailTab('td-tab-details', document.querySelector('.task-detail-tab'));
}

function closeTaskDetail() {
    document.getElementById('task-detail-modal').style.display = 'none';
    STATE.openTaskDetailId = null;
}

function switchTaskDetailTab(tabId, tabBtn) {
    document.querySelectorAll('#task-detail-modal .tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('#task-detail-modal .task-detail-tab').forEach(t => t.classList.remove('active'));
    document.getElementById(tabId)?.classList.add('active');
    tabBtn?.classList.add('active');
}

function renderTaskDetailDetails(task) {
    const container = document.getElementById('td-details-content');
    const corrections = STATE.corrections.filter(c => c.tarefa_id === task.id);
    const corrHtml = corrections.length > 0 ? corrections.map(c => {
        const respName = (STATE.users.find(u => u.id === c.responsavel_id) || { nome: 'N/A' }).nome;
        return `<div class="delivery-correction-note"><strong>${c.descricao}</strong><br><span style="font-size:10px;">ResponsÃ¡vel: ${respName} Â· Status: ${c.status}</span></div>`;
    }).join('') : '<p style="font-size:12px;color:var(--text-muted)">Nenhuma correÃ§Ã£o vinculada.</p>';

    container.innerHTML = `
        <div style="margin-bottom:16px;">
            <div class="section-divider">InformaÃ§Ãµes da Tarefa</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:12px;color:var(--text-secondary);">
                <div><strong style="color:var(--text-primary)">TÃ­tulo:</strong> ${task.titulo}</div>
                <div><strong style="color:var(--text-primary)">Setor:</strong> ${task.setor}</div>
                <div><strong style="color:var(--text-primary)">Prioridade:</strong> ${task.prioridade}</div>
                <div><strong style="color:var(--text-primary)">Prazo:</strong> ${formatDate(task.prazo)}</div>
                <div><strong style="color:var(--text-primary)">Status:</strong> ${task.status}</div>
                <div><strong style="color:var(--text-primary)">Criado em:</strong> ${formatDate(task.data_criacao)}</div>
            </div>
        </div>
        <div class="section-divider">CorreÃ§Ãµes Vinculadas</div>
        ${corrHtml}
    `;

    // Comments
    const commentsList = document.getElementById('td-comments-list');
    const comments = task.comentarios || [];
    if (comments.length === 0) {
        commentsList.innerHTML = '<p style="font-size:12px;color:var(--text-muted)">Nenhum comentÃ¡rio ainda.</p>';
    } else {
        commentsList.innerHTML = comments.map(c => `
            <div style="background:rgba(0,0,0,0.15);border-radius:8px;padding:10px;margin-bottom:6px;">
                <div style="font-size:12px;font-weight:600;color:var(--text-primary);">${c.autor} <span style="font-size:10px;color:var(--text-muted);font-weight:400;">${c.data || ''}</span></div>
                <div style="font-size:12px;color:var(--text-secondary);margin-top:3px;">${c.texto}</div>
            </div>
        `).join('');
    }
}

function addTaskDetailComment() {
    const input = document.getElementById('td-new-comment');
    const text = input.value.trim();
    if (!text || !STATE.openTaskDetailId) return;

    const task = STATE.tasks.find(t => t.id === STATE.openTaskDetailId);
    if (!task) return;

    if (!task.comentarios) task.comentarios = [];
    task.comentarios.push({
        autor: STATE.currentUser.nome,
        texto: text,
        data: new Date().toLocaleDateString('pt-BR')
    });

    addActivityLogEntry(task.id, 'comment', `${STATE.currentUser.nome} comentou: "${text.substring(0, 50)}..."`);

    input.value = '';
    renderTaskDetailDetails(task);
    renderTaskDetailHistory(task.id);
}

// ============================================================
// DELIVERIES RENDERER
// ============================================================

function renderTaskDetailDeliveries(taskId) {
    const container = document.getElementById('td-deliveries-list');
    const deliveries = (STATE.deliveries || []).filter(d => d.task_id === taskId);

    if (deliveries.length === 0) {
        container.innerHTML = '<p style="font-size:12px;color:var(--text-muted);text-align:center;padding:16px;">Nenhuma entrega registrada ainda. Use o formulÃ¡rio abaixo para adicionar.</p>';
        return;
    }

    container.innerHTML = deliveries.map(d => {
        const user = STATE.users.find(u => u.id === d.user_id) || { nome: 'Desconhecido' };
        const typeInfo = TYPE_ICON_MAP[d.type] || TYPE_ICON_MAP['Outro'];
        const statusClass = DELIVERY_STATUS_CLASS[d.status] || '';
        const showActions = STATE.currentUser.funcao === 'Administradora' || STATE.currentUser.funcao === 'SecretÃ¡ria/Revisora';

        return `
            <div class="delivery-card">
                <div class="delivery-card-header">
                    <div style="display:flex;align-items:center;gap:8px;">
                        <span class="type-badge ${typeInfo.class}"><i class="fa-solid ${typeInfo.icon}"></i> ${d.type}</span>
                        <span class="delivery-version-badge">V${d.version}</span>
                    </div>
                    <span class="delivery-status ${statusClass}">${d.status}</span>
                </div>
                <div class="delivery-title">${d.title}</div>
                ${d.notes ? `<div class="delivery-notes">${d.notes}</div>` : ''}
                ${d.link ? `<a href="${d.link}" target="_blank" class="delivery-link"><i class="fa-solid fa-arrow-up-right-from-square"></i> Abrir material</a>` : ''}
                ${d.correction_note ? `<div class="delivery-correction-note"><i class="fa-solid fa-exclamation-circle"></i> ${d.correction_note}</div>` : ''}
                ${d.publication_link ? `<a href="${d.publication_link}" target="_blank" class="delivery-link" style="background:rgba(16,185,129,0.1);color:#10b981;"><i class="fa-solid fa-globe"></i> Ver publicaÃ§Ã£o</a>` : ''}
                <div class="delivery-meta">
                    <span><i class="fa-solid fa-user"></i> ${user.nome}</span>
                    <span><i class="fa-regular fa-clock"></i> ${formatDateTime(d.created_at)}</span>
                </div>
                ${showActions && d.status !== 'Finalizado' ? `
                <div class="delivery-actions">
                    ${d.status !== 'Aprovado' && d.status !== 'Aprovado para postagem' ? `<button class="btn-delivery btn-approve" onclick="reviewDelivery(${d.id}, 'approve')"><i class="fa-solid fa-check"></i> Aprovar</button>` : ''}
                    ${d.status !== 'Precisa de correÃ§Ã£o' ? `<button class="btn-delivery btn-correction" onclick="openCorrectionRequestModal(${d.id})"><i class="fa-solid fa-rotate-left"></i> CorreÃ§Ã£o</button>` : ''}
                    ${d.status === 'Aprovado' ? `<button class="btn-delivery btn-post" onclick="reviewDelivery(${d.id}, 'post')"><i class="fa-solid fa-share"></i> Enviar p/ Postagem</button>` : ''}
                    ${d.status === 'Aprovado para postagem' || d.status === 'Em postagem' ? `<button class="btn-delivery btn-published" onclick="reviewDelivery(${d.id}, 'done')"><i class="fa-solid fa-flag-checkered"></i> Finalizar</button>` : ''}
                    <button class="btn-delivery btn-back-prod" onclick="reviewDelivery(${d.id}, 'back')"><i class="fa-solid fa-arrow-left"></i> Voltar produÃ§Ã£o</button>
                </div>` : ''}
            </div>
        `;
    }).join('');
}

function addNewDelivery() {
    if (!STATE.openTaskDetailId) return;

    const type = document.getElementById('new-delivery-type').value;
    const title = document.getElementById('new-delivery-title').value.trim();
    const link = document.getElementById('new-delivery-link').value.trim();
    const notes = document.getElementById('new-delivery-notes').value.trim();

    if (!title) { alert('Informe o tÃ­tulo da entrega.'); return; }

    const existingVersions = STATE.deliveries.filter(d => d.task_id === STATE.openTaskDetailId && d.type === type);
    const version = existingVersions.length + 1;

    const newDelivery = {
        id: STATE.deliveries.length + 1,
        task_id: STATE.openTaskDetailId,
        user_id: STATE.currentUser.id,
        title: title,
        type: type,
        link: link || null,
        notes: notes || null,
        version: version,
        status: 'Enviado para revisÃ£o',
        created_at: new Date().toISOString()
    };

    STATE.deliveries.push(newDelivery);

    addActivityLogEntry(STATE.openTaskDetailId, 'add', `${STATE.currentUser.nome} anexou "${title}"`);

    // Clear form
    document.getElementById('new-delivery-title').value = '';
    document.getElementById('new-delivery-link').value = '';
    document.getElementById('new-delivery-notes').value = '';

    // Re-render
    document.getElementById('td-delivery-count').textContent = STATE.deliveries.filter(d => d.task_id === STATE.openTaskDetailId).length;
    renderTaskDetailDeliveries(STATE.openTaskDetailId);
    renderTaskDetailHistory(STATE.openTaskDetailId);
    renderReviewQueue();
}

// ============================================================
// DELIVERY REVIEW ACTIONS
// ============================================================

function reviewDelivery(deliveryId, action) {
    const delivery = STATE.deliveries.find(d => d.id === deliveryId);
    if (!delivery) return;

    const task = STATE.tasks.find(t => t.id === delivery.task_id);
    const userName = STATE.currentUser.nome;

    switch (action) {
        case 'approve':
            delivery.status = 'Aprovado';
            addActivityLogEntry(delivery.task_id, 'approve', `${userName} aprovou "${delivery.title}"`);
            break;
        case 'post':
            delivery.status = 'Aprovado para postagem';
            if (task) task.status = 'Aprovado';
            addActivityLogEntry(delivery.task_id, 'move', `${userName} enviou "${delivery.title}" para postagem`);
            break;
        case 'done':
            delivery.status = 'Finalizado';
            delivery.publication_link = delivery.publication_link || delivery.link;
            if (task) task.status = 'Finalizado';
            addActivityLogEntry(delivery.task_id, 'done', `${userName} finalizou "${delivery.title}"`);
            break;
        case 'back':
            delivery.status = 'Enviado para revisÃ£o';
            if (task) task.status = 'Em andamento';
            addActivityLogEntry(delivery.task_id, 'move', `${userName} devolveu "${delivery.title}" para produÃ§Ã£o`);
            break;
    }

    // Refresh everything
    if (STATE.openTaskDetailId) {
        renderTaskDetailDeliveries(STATE.openTaskDetailId);
        renderTaskDetailHistory(STATE.openTaskDetailId);
        const deliveries = STATE.deliveries.filter(d => d.task_id === STATE.openTaskDetailId);
        document.getElementById('td-delivery-count').textContent = deliveries.length;
    }
    renderEsteira();
    renderReviewQueue();
    renderPostingQueue();
    renderDashboard();
}

// ============================================================
// CORRECTION REQUEST FLOW
// ============================================================

function openCorrectionRequestModal(deliveryId) {
    document.getElementById('correction-delivery-id').value = deliveryId;
    document.getElementById('correction-description').value = '';
    document.getElementById('correction-request-modal').style.display = 'flex';
}

function closeCorrectionRequestModal() {
    document.getElementById('correction-request-modal').style.display = 'none';
}

function submitCorrectionRequest() {
    const deliveryId = parseInt(document.getElementById('correction-delivery-id').value);
    const description = document.getElementById('correction-description').value.trim();

    if (!description) { alert('Descreva o que precisa ser corrigido.'); return; }

    const delivery = STATE.deliveries.find(d => d.id === deliveryId);
    if (!delivery) return;

    delivery.status = 'Precisa de correÃ§Ã£o';
    delivery.correction_note = description;

    const task = STATE.tasks.find(t => t.id === delivery.task_id);
    if (task) task.status = 'Em correÃ§Ã£o';

    addActivityLogEntry(delivery.task_id, 'correction', `${STATE.currentUser.nome} solicitou correÃ§Ã£o: "${description.substring(0, 80)}"`);

    closeCorrectionRequestModal();

    if (STATE.openTaskDetailId) {
        renderTaskDetailDeliveries(STATE.openTaskDetailId);
        renderTaskDetailHistory(STATE.openTaskDetailId);
    }
    renderEsteira();
    renderReviewQueue();
    renderDashboard();
}

// ============================================================
// ACTIVITY LOG
// ============================================================

function addActivityLogEntry(taskId, action, description) {
    if (!STATE.activityLog) STATE.activityLog = [];
    STATE.activityLog.push({
        id: STATE.activityLog.length + 1,
        task_id: taskId,
        user_id: STATE.currentUser.id,
        action: action,
        description: description,
        created_at: new Date().toISOString()
    });
}

function renderTaskDetailHistory(taskId) {
    const container = document.getElementById('td-activity-log');
    const logs = (STATE.activityLog || []).filter(l => l.task_id === taskId).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    if (logs.length === 0) {
        container.innerHTML = '<p style="font-size:12px;color:var(--text-muted);text-align:center;padding:16px;">Nenhuma atividade registrada.</p>';
        return;
    }

    container.innerHTML = logs.map(l => {
        const iconClass = l.action === 'move' ? 'move' : l.action === 'add' ? 'add' : l.action === 'correction' ? 'correction' : l.action === 'approve' ? 'approve' : l.action === 'done' ? 'done' : 'comment';
        const iconMap = { move: 'fa-arrows-left-right', add: 'fa-plus', correction: 'fa-rotate-left', approve: 'fa-check', comment: 'fa-comment', done: 'fa-flag-checkered' };
        return `
            <div class="activity-item">
                <div class="activity-icon ${iconClass}"><i class="fa-solid ${iconMap[l.action] || 'fa-circle-info'}"></i></div>
                <div class="activity-content">
                    <div class="activity-text">${l.description}</div>
                    <div class="activity-time">${formatDateTime(l.created_at)}</div>
                </div>
            </div>
        `;
    }).join('');
}

// ============================================================
// DASHBOARD QUEUES: REVIEW & POSTING
// ============================================================

function renderReviewQueue() {
    initPipelineData();
    const container = document.getElementById('review-queue-list');
    const countEl = document.getElementById('review-queue-count');
    if (!container) return;

    const reviewItems = (STATE.deliveries || []).filter(d =>
        d.status === 'Enviado para revisÃ£o' || d.status === 'Em anÃ¡lise'
    );

    if (countEl) countEl.textContent = reviewItems.length;

    if (reviewItems.length === 0) {
        container.innerHTML = '<div style="font-size:12px;color:var(--text-muted);text-align:center;padding:12px">Nenhuma entrega aguardando revisÃ£o</div>';
        return;
    }

    container.innerHTML = reviewItems.map(d => {
        const task = STATE.tasks.find(t => t.id === d.task_id) || {};
        const client = STATE.clients.find(c => c.id === task.cliente_id) || { nome: 'â€”' };
        const typeInfo = TYPE_ICON_MAP[d.type] || TYPE_ICON_MAP['Outro'];
        const timeSince = getTimeSince(d.created_at);

        return `
            <div class="queue-item" style="cursor:pointer;" onclick="openTaskDetail(${d.task_id})">
                <div class="queue-item-icon" style="background:rgba(6,182,212,0.12);color:#22d3ee;"><i class="fa-solid ${typeInfo.icon}"></i></div>
                <div class="queue-item-body">
                    <div class="queue-item-title">${d.title}</div>
                    <div class="queue-item-sub">${client.nome} Â· ${d.type} Â· ${timeSince}</div>
                </div>
                <span class="delivery-status delivery-status-review">${d.status}</span>
            </div>
        `;
    }).join('');
}

function renderPostingQueue() {
    initPipelineData();
    const container = document.getElementById('posting-queue-list');
    const countEl = document.getElementById('posting-queue-count');
    if (!container) return;

    const postItems = (STATE.deliveries || []).filter(d =>
        d.status === 'Aprovado para postagem' || d.status === 'Em postagem'
    );

    if (countEl) countEl.textContent = postItems.length;

    if (postItems.length === 0) {
        container.innerHTML = '<div style="font-size:12px;color:var(--text-muted);text-align:center;padding:12px">Nenhum material pronto para postagem</div>';
        return;
    }

    container.innerHTML = postItems.map(d => {
        const task = STATE.tasks.find(t => t.id === d.task_id) || {};
        const client = STATE.clients.find(c => c.id === task.cliente_id) || { nome: 'â€”' };
        const typeInfo = TYPE_ICON_MAP[d.type] || TYPE_ICON_MAP['Outro'];

        return `
            <div class="queue-item">
                <div class="queue-item-icon" style="background:rgba(139,92,246,0.12);color:#c084fc;"><i class="fa-solid ${typeInfo.icon}"></i></div>
                <div class="queue-item-body">
                    <div class="queue-item-title">${d.title}</div>
                    <div class="queue-item-sub">${client.nome} Â· Prazo: ${formatDate(task.prazo)}</div>
                </div>
                <div class="queue-item-actions">
                    <button class="btn-delivery btn-published" onclick="event.stopPropagation();reviewDelivery(${d.id},'done')"><i class="fa-solid fa-check"></i> Publicado</button>
                </div>
            </div>
        `;
    }).join('');
}

// ============================================================
// CLIENT TABS & MATERIALS
// ============================================================

function switchClientTab(tabId, btn) {
    document.querySelectorAll('.client-tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.client-tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(tabId)?.classList.add('active');
    btn?.classList.add('active');
}

function renderClientMaterials(clientId) {
    initPipelineData();
    const container = document.getElementById('client-materials-grid');
    if (!container) return;

    const filterType = document.getElementById('material-filter-type')?.value || 'all';
    const filterStatus = document.getElementById('material-filter-status')?.value || 'all';

    // Collect all deliveries for this client's tasks
    const clientTasks = STATE.tasks.filter(t => t.cliente_id === clientId);
    let materials = [];
    clientTasks.forEach(t => {
        const deliveries = (STATE.deliveries || []).filter(d => d.task_id === t.id);
        deliveries.forEach(d => materials.push({ ...d, taskTitle: t.titulo }));
    });

    if (filterType !== 'all') materials = materials.filter(m => m.type === filterType);
    if (filterStatus !== 'all') materials = materials.filter(m => m.status.includes(filterStatus));

    if (materials.length === 0) {
        container.innerHTML = '<p style="color:var(--text-muted);font-size:13px;grid-column:1/-1;text-align:center;padding:20px;">Nenhum material encontrado com os filtros selecionados.</p>';
        return;
    }

    container.innerHTML = materials.map(m => {
        const typeInfo = TYPE_ICON_MAP[m.type] || TYPE_ICON_MAP['Outro'];
        const statusClass = DELIVERY_STATUS_CLASS[m.status] || '';
        const bgColor = typeInfo.class.includes('arte') ? 'rgba(139,92,246,0.12)' :
                        typeInfo.class.includes('video') ? 'rgba(239,68,68,0.12)' :
                        typeInfo.class.includes('link') ? 'rgba(59,130,246,0.12)' :
                        typeInfo.class.includes('carrossel') ? 'rgba(6,182,212,0.12)' :
                        'rgba(100,116,139,0.12)';

        return `
            <div class="material-card" ${m.link ? `onclick="window.open('${m.link}','_blank')"` : ''}>
                <div class="material-card-icon" style="background:${bgColor};color:inherit;">
                    <i class="fa-solid ${typeInfo.icon}" style="color:${typeInfo.class.includes('arte') ? '#c084fc' : typeInfo.class.includes('video') ? '#f87171' : typeInfo.class.includes('link') ? '#60a5fa' : typeInfo.class.includes('carrossel') ? '#22d3ee' : '#94a3b8'}"></i>
                </div>
                <div class="material-card-title">${m.title}</div>
                <div class="material-card-sub">${m.type} Â· V${m.version} Â· <span class="delivery-status ${statusClass}" style="display:inline;padding:1px 6px;font-size:9px;">${m.status}</span></div>
                ${m.link ? `<a href="${m.link}" target="_blank" class="material-card-link" onclick="event.stopPropagation()"><i class="fa-solid fa-arrow-up-right-from-square"></i> Abrir</a>` : ''}
            </div>
        `;
    }).join('');
}

function renderClientPendings(clientId) {
    initPipelineData();
    const container = document.getElementById('client-pendings-list');
    if (!container) return;

    const pendings = (STATE.clientPendings || []).filter(p => p.client_id === clientId);

    if (pendings.length === 0) {
        container.innerHTML = '<p style="color:var(--text-muted);font-size:13px;text-align:center;padding:16px;">Nenhuma pendÃªncia registrada para este cliente.</p>';
        return;
    }

    container.innerHTML = pendings.map(p => {
        const reqBy = (STATE.users.find(u => u.id === p.requested_by) || { nome: 'â€”' }).nome;
        const isOverdue = p.due_date && new Date(p.due_date) < new Date() && p.status === 'Aguardando cliente';
        const statusLabel = isOverdue ? 'Atrasado' : p.status;
        const statusBadge = p.status === 'Recebido' ? 'delivery-status-approved' :
                           isOverdue ? 'delivery-status-correction' : 'delivery-status-analysis';

        return `
            <div class="pending-item ${p.status === 'Recebido' ? 'received' : ''}">
                <div>
                    <div class="pending-item-title">${p.title}</div>
                    <div class="pending-item-meta">${p.description} Â· Cobrado por: ${reqBy} Â· Prazo: ${formatDate(p.due_date)}</div>
                </div>
                <span class="delivery-status ${statusBadge}">${statusLabel}</span>
            </div>
        `;
    }).join('');
}

function openAddPendingModal() {
    const title = prompt('Descreva a pendÃªncia (ex: "Enviar fotos dos produtos"):');
    if (!title) return;
    const dueDate = prompt('Prazo (formato: YYYY-MM-DD):', new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]);

    STATE.clientPendings.push({
        id: STATE.clientPendings.length + 1,
        client_id: STATE.selectedClientId,
        title: title,
        description: 'PendÃªncia registrada pela equipe.',
        requested_by: STATE.currentUser.id,
        status: 'Aguardando cliente',
        due_date: dueDate,
        created_at: new Date().toISOString()
    });

    renderClientPendings(STATE.selectedClientId);
}

// ============================================================
// HELPERS
// ============================================================

function formatDateTime(isoStr) {
    if (!isoStr) return 'â€”';
    const d = new Date(isoStr);
    return `${d.toLocaleDateString('pt-BR')} Ã s ${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
}



function getTimeSince(isoStr) {
    if (!isoStr) return '';
    const diff = Date.now() - new Date(isoStr).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'agora';
    if (hours < 24) return 'ha ' + hours + 'h';
    const days = Math.floor(hours / 24);
    return 'ha ' + days + 'd';
}

// Safe runtime hook runs after all scripts are loaded
document.addEventListener('DOMContentLoaded', () => {
    const _origSwitchView = window.switchView;
    if (typeof _origSwitchView === 'function') {
        window.switchView = function(viewId) {
            _origSwitchView(viewId);
            if (viewId === 'esteira') {
                setTimeout(() => renderEsteira(), 20);
            }
        };
    }
    document.querySelectorAll('.menu-item[data-view]').forEach(item => {
        item.onclick = () => window.switchView(item.dataset.view);
    });
});

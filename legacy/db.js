// Atlas OS — Agência: Supabase Client Database Engine

const SUPABASE_URL = 'https://jkernhtvpwrzitirffwy.supabase.co';
const SUPABASE_KEY = 'sb_publishable_YlKOiI_-xTebSyqRnYAkFg_LaC_fUm8';

let supabaseClient = null;

// Initialize Database connection
async function initDb() {
    if (window.supabase) {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        console.log("Successfully connected to Supabase Database.");
    } else {
        console.error("Supabase library not loaded.");
    }
}

// General CRUD APIs that use Supabase
const DB = {
    // Auth & Users
    getUsers: async () => {
        const { data, error } = await supabaseClient.from('usuarios').select('*');
        if (error) console.error(error);
        return data || [];
    },
    
    // Clients
    getClients: async () => {
        const { data, error } = await supabaseClient.from('clientes').select('*');
        if (error) console.error(error);
        return data || [];
    },
    updateClient: async (id, updates) => {
        const { data, error } = await supabaseClient.from('clientes').update(updates).eq('id', id);
        if (error) console.error(error);
        return data;
    },
    
    // Tasks
    getTasks: async () => {
        const { data, error } = await supabaseClient.from('tarefas').select('*');
        if (error) console.error(error);
        return data || [];
    },
    createTask: async (task) => {
        const { data, error } = await supabaseClient.from('tarefas').insert(task).select();
        if (error) console.error(error);
        return data ? data[0] : null;
    },
    updateTask: async (id, updates) => {
        const { data, error } = await supabaseClient.from('tarefas').update(updates).eq('id', id);
        if (error) console.error(error);
        return data;
    },
    
    // Corrections
    getCorrections: async () => {
        const { data, error } = await supabaseClient.from('correcoes').select('*');
        if (error) console.error(error);
        return data || [];
    },
    updateCorrection: async (id, updates) => {
        const { data, error } = await supabaseClient.from('correcoes').update(updates).eq('id', id);
        if (error) console.error(error);
        return data;
    },
    
    // Reports
    getReports: async () => {
        const { data, error } = await supabaseClient.from('relatorios').select('*');
        if (error) console.error(error);
        return data || [];
    }
};

// Auto initialize on load
window.addEventListener('DOMContentLoaded', () => {
    initDb();
});

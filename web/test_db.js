import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hcwtqiqlrlcyzngtuzsf.supabase.co';
const supabaseKey = 'sb_publishable_H8YHt50L1kkKA78cQzeZsw_76YrcHOd';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log('Testando conexão com Supabase...');

  const { data: metricas, error: mErr } = await supabase.from('metricas').select('*');
  console.log('Metricas:', metricas?.length || 0);
  if (mErr) console.error('Erro Metricas:', mErr);

  const { data: clientes, error: cErr } = await supabase.from('clientes').select('*');
  console.log('Clientes:', clientes?.length || 0);
  if (cErr) console.error('Erro Clientes:', cErr);
}

test();

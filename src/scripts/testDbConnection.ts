// scripts/testConnection.ts
import supabase from '../config/supabase';

(async () => {
  console.log('Testing Supabase connection...');
  
  const { data, error } = await supabase
    .from('user_base')
    .select('count')
    .limit(1);
  
  if (error) {
    console.error('Connection failed:', error.message);
  } else {
    console.log('Supabase connected successfully');
  }
})();
import { createClient } from '@supabase/supabase-js'
import config from './config';

// Create a single supabase client for interacting with your database
const supabase = createClient(config.supabaseUrl, config.supabaseKey);

export default supabase;
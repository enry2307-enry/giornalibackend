import { createClient } from '@supabase/supabase-js'
import config from '../../config/config';

const supabase = createClient(config.supabaseUrl, config.supabaseKey);

export default supabase;
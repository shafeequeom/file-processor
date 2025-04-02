import { createClient } from '@supabase/supabase-js';
import config from '../Common/Config/config';

export const supabase = createClient(
    config.supabase.url!,
    config.supabase.serviceRoleKey!
);
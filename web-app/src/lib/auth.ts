import { supabase } from '@/util/supabase/client';

export async function getUserFromToken(token: string) {
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) return null;
    return data.user;
}

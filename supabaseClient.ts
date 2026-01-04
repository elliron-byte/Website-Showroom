
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://duifiohttfskolvbuykn.supabase.co';
const supabaseKey = 'sb_publishable_YpxLDihCXvpE6XIQx_sWkQ_uZ5Q3jqo';

export const supabase = createClient(supabaseUrl, supabaseKey);

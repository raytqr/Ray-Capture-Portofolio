
import { createClient } from '@supabase/supabase-js';
const url = 'https://tiqetlbettvqghlrhacu.supabase.co';
const key = 'sb_publishable_EggJYufLVYMnFh4miMHh0A_ePgVbkZO';
const supabase = createClient(url, key);

async function create() {
    console.log('Attempting to create "portfolio" bucket...');
    const { data, error } = await supabase.storage.createBucket('portfolio', {
        public: true,
        allowedMimeTypes: ['image/*'],
        fileSizeLimit: 5242880 // 5MB
    });

    if (error) {
        console.error('Create Bucket Error:', error.message);
    } else {
        console.log('Bucket "portfolio" created successfully!');
    }
}
create();

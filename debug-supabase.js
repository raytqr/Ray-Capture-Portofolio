
import { createClient } from '@supabase/supabase-js';

const url = 'https://tiqetlbettvqghlrhacu.supabase.co';
const key = 'sb_publishable_EggJYufLVYMnFh4miMHh0A_ePgVbkZO';

console.log('Testing Supabase Connection...');
console.log('URL:', url);
console.log('Key:', key);

const supabase = createClient(url, key);

async function test() {
    try {
        // Test 1: List buckets
        console.log('\n1. Testing Storage (List Buckets)...');
        const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
        if (bucketError) {
            console.error('❌ Storage Error:', bucketError.message);
            console.error('Full Error:', bucketError);
        } else {
            console.log('✅ Buckets found:', buckets.length);
            buckets.forEach(b => console.log(' - ' + b.name));
            const hasPortfolio = buckets.find(b => b.name === 'portfolio');
            if (hasPortfolio) console.log('✅ "portfolio" bucket exists.');
            else console.error('❌ "portfolio" bucket MISSING.');
        }

        // Test 2: Database Select
        console.log('\n2. Testing Database (Select from portfolio_items)...');
        const { data: items, error: dbError } = await supabase.from('portfolio_items').select('id').limit(1);
        if (dbError) {
            console.error('❌ Database Error:', dbError.message);
            console.error('Full Error:', dbError);
        } else {
            console.log('✅ Database connection successful. Items found:', items?.length ?? 0);
        }

        // Test 3: Upload Attempt (Mock)
        if (buckets && buckets.find(b => b.name === 'portfolio')) {
            console.log('\n3. Testing Upload Policy...');
            const blob = new Blob(['test content'], { type: 'text/plain' });
            // nodejs doesn't have Blob globally in older versions but recent ones do. 
            // If fail, we use Buffer or string. supabase-js supports string/buffer.

            const { error: uploadError } = await supabase.storage.from('portfolio').upload('debug_test_file.txt', 'test content', { upsert: true });
            if (uploadError) {
                console.error('❌ Upload Error:', uploadError.message);
            } else {
                console.log('✅ Upload successful!');
            }
        }

    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

test();

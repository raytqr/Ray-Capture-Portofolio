-- Run this in Supabase SQL Editor to bulk load the new pricing list
-- WARNING: This clears all existing pricing packages first!

truncate table public.pricing_packages;

insert into public.pricing_packages (category, title, price_real, price_fake, is_popular, features)
values
-- GRADUATION
('Graduation', 'Graduation Basic (Quick Session)', 'IDR 250.000', 'IDR 400.000', false, 
 ARRAY['30 Mins Session', 'Campus / Outdoor Location', '10 Edited Photos', 'All Files (Low Res)', '1 Printed Photo (5R)']
),
('Graduation', 'Graduation Premium (Most Favorite)', 'IDR 350.000', 'IDR 550.000', true, 
 ARRAY['1 Hour Exclusive Session', 'Unlimited Shutter/Shoots', '30 Edited High-Res Photos', 'All Original Files via Google Drive', '1 Printed Photo (10R) + Frame', 'Pose Direction & Styling Assist', 'Location: Campus/Outdoor Malang', 'Free 1 Reels Short Video (15s)']
),
('Graduation', 'Graduation Group (Squad Moments)', 'IDR 600.000', 'IDR 950.000', false, 
 ARRAY['Max 5 Pax', '2 Hours Session', 'Unlimited Shoots', '50 Edited High-Res Photos', 'Individual & Group Shots', '2 Printed Photos (10R) + Frame', 'Fun Props Included', 'Cinematic Group Reel (30s)']
),

-- WEDDING
('Wedding', 'Intimate Akad (Sacred Moments Only)', 'IDR 1.200.000', 'IDR 1.800.000', false, 
 ARRAY['3 Hours Coverage', '1 Professional Photographer', '50 Edited Photos', 'Flashdisk with All Files', '1 Printed Photo (12R)']
),
('Wedding', 'Wedding Reception (Paket Pelaminan Rame)', 'IDR 2.800.000', 'IDR 4.000.000', true, 
 ARRAY['Full Day Coverage (Akad + Resepsi)', '2 Professional Photographers', 'Unlimited Guests Coverage', 'Cinematic Teaser Video (1 Minute)', '150+ Tone-Graded Edited Photos', 'Exclusive Wooden Box Flashdisk', '2 Printed Photos (12RW) + Frame']
),
('Wedding', 'Platinum + Barcode (Full + Tech)', 'IDR 5.500.000', 'IDR 8.000.000', false, 
 ARRAY['Full Day Coverage', '2 Photographers + 2 Videographers', 'QR Code / Barcode for Instant Guest Photo Access', 'Drone / Aerial Footage', 'Same Day Edit (SDE) Video', 'Exclusive Wedding Album Book', 'Canvas Print (60x40cm)']
),

-- ART SESSION
('Art Session', 'Street/Park Session (No Studio)', 'IDR 400.000', 'IDR 600.000', false, 
 ARRAY['1 Hour Session', 'Malang City Area', 'Natural Light Focus', '15 High-Res Edited Photos', '1 Outfit']
),
('Art Session', 'Creative Outdoor (Conceptual)', 'IDR 750.000', 'IDR 1.200.000', true, 
 ARRAY['2 Hours Creative Session', 'Moodboard Development', 'Location Hunting (Nature/Urban)', '30 High-End Retouched Photos', '3 Outfit Changes', 'Styling Assistance', 'Reels Video Clip Included']
),

-- BIRTHDAY
('Birthday', 'Sweet 17 / Personal', 'IDR 500.000', 'IDR 800.000', false, 
 ARRAY['2 Hours Coverage', 'Candid & Posed Moments', '30 Edited Photos', '1 Printed Photo (10R)']
),
('Birthday', 'Kids Party / Event', 'IDR 1.000.000', 'IDR 1.500.000', true, 
 ARRAY['3 Hours Event Coverage', 'Unlimited Shoots', 'Documentation Video Highlight', 'All Files on Flashdisk', 'Family Portrait Session Included']
),

-- OTHERS
('Others', 'Lamaran / Engagement', 'IDR 1.500.000', 'IDR 2.200.000', false, 
 ARRAY['4 Hours Coverage', '2 Photographers', 'Couple Session + Family', '80 Edited Photos', '1 Minute Cinematic Teaser']
),
('Others', 'Family Gathering (Large Group)', 'IDR 800.000', 'IDR 1.200.000', false, 
 ARRAY['2 Hours Coverage', 'Outdoor/Home Location', 'Group & Sub-group photos', '40 Edited Photos', 'Framed 12R Photo']
);

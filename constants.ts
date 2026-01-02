import { PortfolioItem, PricingPackage } from "./types";

// Helper to generate more items for the showcase with distinct Portrait/Landscape ratios
const generatePortfolio = (): PortfolioItem[] => {
  const categories = ['Wedding', 'Graduation', 'Art Session', 'Birthday'];
  const items: PortfolioItem[] = [];
  
  for (let i = 1; i <= 24; i++) {
    const category = categories[(i - 1) % 4] as any;
    // Explicitly alternate between Portrait (600x800) and Landscape (800x600)
    const width = i % 2 === 0 ? 800 : 600;
    const height = i % 2 === 0 ? 600 : 800;
    
    items.push({
      id: i,
      category: category,
      imageUrl: `https://picsum.photos/seed/${category}${i}/${width}/${height}`,
      title: `${category} Moments ${i}`
    });
  }
  return items;
};

export const PORTFOLIO_ITEMS: PortfolioItem[] = generatePortfolio();

export const PRICING_PACKAGES: PricingPackage[] = [
  // --- GRADUATION PACKAGES ---
  {
    id: 'G1',
    category: 'Graduation',
    name: 'Graduation Basic',
    subtitle: 'Quick Session',
    price: 'IDR 250.000',
    originalPrice: 'IDR 400.000',
    features: [
      '30 Mins Session',
      'Campus / Outdoor Location',
      '10 Edited Photos',
      'All Files (Low Res)',
      '1 Printed Photo (5R)'
    ]
  },
  {
    id: 'G2',
    category: 'Graduation',
    name: 'Graduation Premium',
    subtitle: 'Most Favorite',
    price: 'IDR 350.000',
    originalPrice: 'IDR 550.000',
    recommended: true,
    features: [
      '1 Hour Exclusive Session',
      'Unlimited Shutter/Shoots',
      '30 Edited High-Res Photos',
      'All Original Files via Google Drive',
      '1 Printed Photo (10R) + Frame',
      'Pose Direction & Styling Assist',
      'Location: Campus/Outdoor Malang',
      'Free 1 Reels Short Video (15s)'
    ]
  },
  {
    id: 'G3',
    category: 'Graduation',
    name: 'Graduation Group',
    subtitle: 'Squad Moments (Max 5 Pax)',
    price: 'IDR 600.000',
    originalPrice: 'IDR 950.000',
    features: [
      '2 Hours Session',
      'Unlimited Shoots',
      '50 Edited High-Res Photos',
      'Individual & Group Shots',
      '2 Printed Photos (10R) + Frame',
      'Fun Props Included',
      'Cinematic Group Reel (30s)'
    ]
  },

  // --- WEDDING PACKAGES ---
  {
    id: 'W1',
    category: 'Wedding',
    name: 'Intimate Akad',
    subtitle: 'Sacred Moments Only',
    price: 'IDR 1.200.000',
    originalPrice: 'IDR 1.800.000',
    features: [
      '3 Hours Coverage',
      '1 Professional Photographer',
      '50 Edited Photos',
      'Flashdisk with All Files',
      '1 Printed Photo (12R)'
    ]
  },
  {
    id: 'W2',
    category: 'Wedding',
    name: 'Wedding Reception',
    subtitle: 'Paket Pelaminan (Rame)',
    price: 'IDR 2.800.000',
    originalPrice: 'IDR 4.000.000',
    recommended: true,
    features: [
      'Full Day Coverage (Akad + Resepsi)',
      '2 Professional Photographers',
      'Unlimited Guests Coverage',
      'Cinematic Teaser Video (1 Minute)',
      '150+ Tone-Graded Edited Photos',
      'Exclusive Wooden Box Flashdisk',
      '2 Printed Photos (12RW) + Frame'
    ]
  },
  {
    id: 'W3',
    category: 'Wedding',
    name: 'Platinum + Barcode',
    subtitle: 'Full Photo + Video + Tech',
    price: 'IDR 5.500.000',
    originalPrice: 'IDR 8.000.000',
    features: [
      'Full Day Coverage',
      '2 Photographers + 2 Videographers',
      'QR Code / Barcode for Instant Guest Photo Access',
      'Drone / Aerial Footage',
      'Same Day Edit (SDE) Video',
      'Exclusive Wedding Album Book',
      'Canvas Print (60x40cm)'
    ]
  },

  // --- ART SESSION (OUTDOOR ONLY) ---
  {
    id: 'A1',
    category: 'Art Session',
    name: 'Street/Park Session',
    subtitle: 'Outdoor (No Studio)',
    price: 'IDR 400.000',
    originalPrice: 'IDR 600.000',
    features: [
      '1 Hour Session',
      'Malang City Area',
      'Natural Light Focus',
      '15 High-Res Edited Photos',
      '1 Outfit'
    ]
  },
  {
    id: 'A2',
    category: 'Art Session',
    name: 'Creative Outdoor',
    subtitle: 'Conceptual & Styled',
    price: 'IDR 750.000',
    originalPrice: 'IDR 1.200.000',
    recommended: true,
    features: [
      '2 Hours Creative Session',
      'Moodboard Development',
      'Location Hunting (Nature/Urban)',
      '30 High-End Retouched Photos',
      '3 Outfit Changes',
      'Styling Assistance',
      'Reels Video Clip Included'
    ]
  },

  // --- BIRTHDAY PACKAGES ---
  {
    id: 'B1',
    category: 'Birthday',
    name: 'Sweet 17 / Personal',
    subtitle: 'Celebration Portrait',
    price: 'IDR 500.000',
    originalPrice: 'IDR 800.000',
    features: [
      '2 Hours Coverage',
      'Candid & Posed Moments',
      '30 Edited Photos',
      '1 Printed Photo (10R)'
    ]
  },
  {
    id: 'B2',
    category: 'Birthday',
    name: 'Kids Party / Event',
    subtitle: 'Full Party Documentation',
    price: 'IDR 1.000.000',
    originalPrice: 'IDR 1.500.000',
    recommended: true,
    features: [
      '3 Hours Event Coverage',
      'Unlimited Shoots',
      'Documentation Video Highlight',
      'All Files on Flashdisk',
      'Family Portrait Session Included'
    ]
  },

  // --- OTHERS ---
  {
    id: 'O1',
    category: 'Others',
    name: 'Lamaran / Engagement',
    subtitle: 'The Yes Day',
    price: 'IDR 1.500.000',
    originalPrice: 'IDR 2.200.000',
    features: [
      '4 Hours Coverage',
      '2 Photographers',
      'Couple Session + Family',
      '80 Edited Photos',
      '1 Minute Cinematic Teaser'
    ]
  },
  {
    id: 'O2',
    category: 'Others',
    name: 'Family Gathering',
    subtitle: 'Large Group',
    price: 'IDR 800.000',
    originalPrice: 'IDR 1.200.000',
    features: [
      '2 Hours Coverage',
      'Outdoor/Home Location',
      'Group & Sub-group photos',
      '40 Edited Photos',
      'Framed 12R Photo'
    ]
  }
];

export const ABOUT_TEXT = "With a passion for crafting intuitive digital experiences and visualizing ideas through photos and designs, I strive to deliver solutions that are not only aesthetically pleasing but also functional. Every project I undertake is driven by the desire to create work that tells a story and conveys messages in a unique and compelling way.";

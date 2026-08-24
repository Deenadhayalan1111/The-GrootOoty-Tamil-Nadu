/* =========================================================
   THE GROOT OOTY � Centralized Configuration
   ========================================================= */

const CONFIG = {
  // Contact numbers
  PHONE_NUMBER_1: '6382316323',
  PHONE_NUMBER_2: '7395965006',

  // WhatsApp (international format, no + prefix needed for wa.me)
  WHATSAPP_NUMBER: '916382316323',

  // Social
  INSTAGRAM_URL: 'https://www.instagram.com/the_groot_ooty/',
  INSTAGRAM_HANDLE: '@the_groot_ooty',

  // Property details
  PROPERTY_NAME: 'The Groot Ooty',
  ADDRESS: '204, Showdown Road, Mellakshminarayanapuram, Pudumund, Ooty, Tamil Nadu 643001',
  ADDRESS_SHORT: 'Pudumund, Ooty, Tamil Nadu 643001',
  MAP_URL: 'https://maps.app.goo.gl/uEjQ9X1234567890A', // Replace with actual Google Maps URL
  MAP_EMBED: 'https://maps.google.com/maps?q=11.404,76.695&z=15&output=embed', // Approximate Ooty coords

  // Website pages
  PAGES: {
    HOME: 'index.html',
    ROOMS: 'rooms.html',
    ROOM_DETAIL: 'room-detail.html',
    GALLERY: 'gallery.html',
    EXPERIENCES: 'experiences.html',
    OOTY: 'ooty.html',
    REVIEWS: 'reviews.html',
    CONTACT: 'contact.html',
    BOOKING: 'booking.html',
  },
};

// Rooms data
const ROOMS = [
  {
    id: 'standard',
    name: 'Standard Room',
    tagline: 'Cozy & comfortable',
    description: 'A warm, well-appointed room perfect for couples or solo travellers seeking comfort and a peaceful Ooty stay.',
    longDescription: 'Wake up to the crisp Nilgiri air in our Standard Room � a cozy, thoughtfully furnished space designed for comfort. With warm wooden accents, quality bedding, and a charming view of the surrounding greenery, it\'s your perfect base for exploring Ooty.',
    image: 'assets/images/IMG-20260821-WA0042.jpg',
    features: ['Double Bed', 'Hot Water', 'Wi-Fi', 'Private Bathroom'],
    amenities: [
      { icon: 'bed', label: 'Comfortable Double Bed' },
      { icon: 'droplet', label: 'Hot Water Shower' },
      { icon: 'wifi', label: 'Wi-Fi Access' },
      { icon: 'thermometer', label: 'Warm Blankets' },
      { icon: 'tv', label: 'TV' },
    ],
  },
  {
    id: 'aframe',
    name: 'A-Frame Room',
    tagline: 'Architectural charm',
    description: 'Our signature A-Frame cabin with its distinctive triangular design, wooden character, and deep forest ambiance.',
    longDescription: 'The A-Frame is the jewel of The Groot. Its distinctive triangular architecture, high ceilings, exposed wooden beams, and forest-framed windows create an experience unlike any ordinary hotel room. Fall asleep to the sounds of the Nilgiris and wake up to morning mist.',
    image: 'assets/images/IMG-20260821-WA0039.jpg',
    interiorImage: 'assets/images/IMG-20260821-WA0035.jpg',
    features: ['High Ceilings', 'Forest Views', 'Hot Water', 'Wi-Fi'],
    amenities: [
      { icon: 'triangle', label: 'Signature A-Frame Architecture' },
      { icon: 'tree', label: 'Forest Views' },
      { icon: 'droplet', label: 'Hot Water Shower' },
      { icon: 'wifi', label: 'Wi-Fi Access' },
      { icon: 'music', label: 'Music System' },
    ],
  },
  {
    id: 'suite',
    name: 'Luxurious Suite',
    tagline: 'Premium comfort',
    description: 'Our most spacious accommodation, the Luxurious Suite offers extra room, elevated furnishings, and a premium Ooty experience.',
    longDescription: 'Indulge in The Groot\'s premium offering. The Luxurious Suite features generous space, refined furnishings, and an ambiance that balances mountain character with elevated comfort. Perfect for those seeking that little extra on their Ooty getaway.',
    image: 'assets/images/IMG-20260821-WA0038.jpg',
    features: ['King Bed', 'Sitting Area', 'Hill Views', 'Hot Water'],
    amenities: [
      { icon: 'star', label: 'Premium Furnishings' },
      { icon: 'layout', label: 'Separate Sitting Area' },
      { icon: 'droplet', label: 'Hot Water Shower' },
      { icon: 'wifi', label: 'Wi-Fi Access' },
      { icon: 'music', label: 'Music System' },
    ],
  },
  {
    id: 'glasshouse',
    name: 'Glass House',
    tagline: 'Sleep in the forest',
    description: 'An extraordinary experience � glass walls surround you with the living forest of the Nilgiris.',
    longDescription: 'The Glass House is unlike anything else in Ooty. Glass panels replace traditional walls, immersing you in the Nilgiri landscape while keeping you cozy inside. Fall asleep watching the trees, and wake up with the forest light filling your room. A truly memorable experience.',
    image: 'assets/images/IMG-20260821-WA0037.jpg',
    interiorImage: 'assets/images/IMG-20260821-WA0037.jpg',
    features: ['Glass Walls', 'Forest Panorama', 'Hot Water', 'Wi-Fi'],
    amenities: [
      { icon: 'grid', label: 'Panoramic Glass Walls' },
      { icon: 'tree', label: 'Forest Immersion' },
      { icon: 'droplet', label: 'Hot Water Shower' },
      { icon: 'wifi', label: 'Wi-Fi Access' },
      { icon: 'star', label: 'Unique Experience' },
    ],
  },
];

// Reviews data (illustrative � replace with real reviews)
const REVIEWS = [
  {
    name: 'Priya M.',
    initial: 'P',
    rating: 5,
    text: 'The A-Frame was absolutely magical. Waking up to the Ooty mist through the wooden windows was something I\'ll never forget. The caretaker was so warm and helpful. Highly recommend!',
    source: 'Google',
    location: 'Chennai',
  },
  {
    name: 'Rahul & Divya',
    initial: 'R',
    rating: 5,
    text: 'We stayed in the Glass House for our anniversary and it was incredible. Felt like we were literally sleeping in the forest. The campfire in the evening made it even more special.',
    source: 'Google',
    location: 'Bangalore',
  },
  {
    name: 'Karthik S.',
    initial: 'K',
    rating: 5,
    text: 'Budget-friendly and genuinely beautiful. The property is exactly like the photos. Home food was amazing � loved the authentic Tamil food. Will definitely come back!',
    source: 'Instagram',
    location: 'Coimbatore',
  },
  {
    name: 'Meena & Family',
    initial: 'M',
    rating: 5,
    text: 'Perfect family stay. Clean rooms, hot water, and the kids loved the campfire. The location is peaceful and the hosts were incredibly welcoming. Felt like home.',
    source: 'Google',
    location: 'Erode',
  },
  {
    name: 'Aditya K.',
    initial: 'A',
    rating: 5,
    text: 'Stayed in the Standard Room and it was so cozy. The Groot has a very personal feel � not a big resort, but a real place where you feel at home. The music system and campfire were great.',
    source: 'Google',
    location: 'Hyderabad',
  },
];

// Ooty attractions
const OOTY_ATTRACTIONS = [
  {
    name: 'Botanical Garden',
    desc: 'The Government Botanical Garden is one of Ooty\'s finest attractions � a stunning 55-acre garden with rare plants and century-old trees.',
    image: 'assets/images/IMG-20260821-WA0039.jpg',
    category: 'Garden',
  },
  {
    name: 'Ooty Lake',
    desc: 'A scenic artificial lake perfect for boating and peaceful walks along the waterfront with panoramic Nilgiri views.',
    image: 'assets/images/IMG-20260821-WA0039.jpg',
    category: 'Lake',
  },
  {
    name: 'Nilgiri Tea Estates',
    desc: 'Walk through rolling hills of emerald green tea bushes and taste the world-famous Nilgiri tea fresh from the source.',
    image: 'assets/images/IMG-20260821-WA0034.jpg',
    category: 'Nature',
  },
  {
    name: 'Doddabetta Peak',
    desc: 'The highest point in the Nilgiris at 2,637 m. On a clear day, the views are simply breathtaking.',
    image: 'assets/images/IMG-20260821-WA0036.jpg',
    category: 'Trek',
  },
  {
    name: 'Pykara',
    desc: 'A beautiful waterfall and lake about 20 km from Ooty, perfect for a day trip into the heart of the Nilgiri forest.',
    image: 'assets/images/IMG-20260821-WA0037.jpg',
    category: 'Nature',
  },
  {
    name: 'Coonoor',
    desc: 'A charming neighbouring hill station just 18 km away, famous for its colonial-era gardens and Nilgiri Mountain Railway.',
    image: 'assets/images/IMG-20260821-WA0034.jpg',
    category: 'Town',
  },
];

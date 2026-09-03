/* =========================================================
   THE GROOT OOTY — Centralized Store & Data Architecture
   Single source of truth for Rooms, Pricing, Availability, 
   Gallery photo mappings, and Property settings.
   ========================================================= */

(function(window) {
  'use strict';

  const STORAGE_KEY_ROOMS = 'groot_rooms_data_v1';
  const STORAGE_KEY_GALLERY = 'groot_gallery_data_v1';
  const STORAGE_KEY_SETTINGS = 'groot_settings_data_v1';
  const STORAGE_KEY_AUTH = 'groot_admin_auth_v1';

  // TEMPORARY ADMIN PASSWORD CONFIGURATION
  // Used to protect the admin panel. Change this value to easily update the password.
  const TEMPORARY_ADMIN_USERNAME = 'admin';
  const TEMPORARY_ADMIN_PASSWORD = 'groot2026';

  // DEFAULT ROOMS — Exact required room names
  const DEFAULT_ROOMS = [
    {
      id: 'standard',
      name: 'Standard',
      price: 2500,
      status: 'available', // 'available' | 'unavailable'
      tagline: 'Cozy & comfortable double bedroom',
      shortDescription: 'Warm, well-appointed room perfect for couples or solo travelers seeking a peaceful stay in the Nilgiris.',
      longDescription: 'Wake up to the crisp Nilgiri air in our Standard room. A cozy, thoughtfully furnished double bedroom designed for calm comfort with quality bedding, warm blankets, hot water, and a charming view of the surrounding mountain greenery.',
      image: 'assets/images/1000032839_professional_4k.webp',
      interiorImage: 'assets/images/1000032839_professional_4k.webp',
      features: ['Double Bed', 'Hot Water 24/7', 'High-Speed Wi-Fi', 'Garden View'],
      amenities: [
        { label: 'Comfortable Double Bed' },
        { label: 'Hot Water Shower' },
        { label: 'High-Speed Wi-Fi' },
        { label: 'Warm Blankets & Linens' },
        { label: 'Electric Kettle & Tea' }
      ]
    },
    {
      id: 'aframe',
      name: 'A-frame',
      price: 4500,
      status: 'available',
      tagline: 'Signature architectural timber cabin',
      shortDescription: 'Distinctive triangular architectural cabin with exposed timber beams, high ceilings, and forest ambiance.',
      longDescription: 'The A-frame is the signature stay of The Groot Ooty. Its distinctive triangular architecture, soaring ceilings, exposed natural wooden beams, and forest-framed windows create an unforgettable Nilgiri mountain experience.',
      image: 'assets/images/1000032836_professional_4k.webp',
      interiorImage: 'assets/images/1000032836_professional_4k.webp',
      features: ['Signature Cabin', 'Forest Views', 'High Ceilings', 'Hot Water 24/7'],
      amenities: [
        { label: 'Signature A-frame Timber Architecture' },
        { label: 'Deep Forest Panoramas' },
        { label: 'Hot Water Shower' },
        { label: 'High-Speed Wi-Fi' },
        { label: 'Campfire & Garden Access' }
      ]
    },
    {
      id: 'suite',
      name: 'Luxurious suit',
      price: 5500,
      status: 'available',
      tagline: 'Spacious premium comfort',
      shortDescription: 'Our most expansive accommodation with elevated furnishings, plush king bed, and private lounge area.',
      longDescription: 'Indulge in The Groot\'s premium retreat. The Luxurious suit features generous living space, refined teak furnishings, plush king bedding, and an ambiance balancing authentic mountain tranquility with elevated comfort.',
      image: 'assets/images/1000032838_professional_4k.webp',
      interiorImage: 'assets/images/1000032838_professional_4k.webp',
      features: ['King Bed', 'Spacious Suite', 'Lounge Seating', 'Hill Panoramas'],
      amenities: [
        { label: 'Expansive Suite Layout' },
        { label: 'Premium King Bedding' },
        { label: 'Separate Lounge Seating Area' },
        { label: 'Hot Water Shower' },
        { label: 'Private Hillside View' }
      ]
    },
    {
      id: 'glasshouse',
      name: 'Glass house',
      price: 5000,
      status: 'available',
      tagline: 'Sleep surrounded by the forest',
      shortDescription: 'Panoramic glass walls immersing you directly in the lush green canopy of the Nilgiri hills.',
      longDescription: 'The Glass house provides a one-of-a-kind immersion in Ooty nature. Floor-to-ceiling glass panels replace traditional walls, surrounding you with the living forest while keeping you cozy and warm inside.',
      image: 'assets/images/1000032837_professional_4k.webp',
      interiorImage: 'assets/images/1000032837_professional_4k.webp',
      features: ['Glass Wall Panorama', 'Forest Immersion', 'Hot Water 24/7', 'Nature Views'],
      amenities: [
        { label: 'Panoramic Glass Wall Design' },
        { label: '360° Forest Immersion' },
        { label: 'Hot Water Shower' },
        { label: 'High-Speed Wi-Fi' },
        { label: 'Stargazing Experience' }
      ]
    }
  ];

  // DEFAULT GALLERY ITEMS
  const DEFAULT_GALLERY = [
    { id: 'gal-1', url: 'assets/images/1000032834_professional_4k.webp', title: 'The Groot Property Grounds & Garden', category: 'property', assignedRoom: 'property', enabled: true, order: 1 },
    { id: 'gal-2', url: 'assets/images/1000032835_professional_4k.webp', title: 'Nilgiri Morning Mist & Mountain Vista', category: 'nature', assignedRoom: 'property', enabled: true, order: 2 },
    { id: 'gal-3', url: 'assets/images/1000032836_professional_4k.webp', title: 'A-frame Cabin Exterior & Architecture', category: 'rooms', assignedRoom: 'aframe', enabled: true, order: 3 },
    { id: 'gal-4', url: 'assets/images/1000032837_professional_4k.webp', title: 'Glass house Forest View Panorama', category: 'rooms', assignedRoom: 'glasshouse', enabled: true, order: 4 },
    { id: 'gal-5', url: 'assets/images/1000032838_professional_4k.webp', title: 'Luxurious suit Bedroom & Living Space', category: 'rooms', assignedRoom: 'suite', enabled: true, order: 5 },
    { id: 'gal-6', url: 'assets/images/1000032839_professional_4k.webp', title: 'Standard Room Warm Interior', category: 'rooms', assignedRoom: 'standard', enabled: true, order: 6 },
    { id: 'gal-7', url: 'assets/images/1000032840_professional_4k.webp', title: 'Tea Plantation & Nature Trails', category: 'nature', assignedRoom: 'property', enabled: true, order: 7 },
    { id: 'gal-8', url: 'assets/images/1000032841_professional_4k.webp', title: 'Evening Campfire Under Starlit Sky', category: 'campfire', assignedRoom: 'property', enabled: true, order: 8 },
    { id: 'gal-9', url: 'assets/images/IMG-20260821-WA0034_4k.webp', title: 'Main Stay Entrance & Courtyard', category: 'property', assignedRoom: 'property', enabled: true, order: 9 },
    { id: 'gal-10', url: 'assets/images/IMG-20260821-WA0036_4k.webp', title: 'Outdoor Garden Gathering & Seating', category: 'campfire', assignedRoom: 'property', enabled: true, order: 10 },
    { id: 'gal-11', url: 'assets/images/IMG-20260821-WA0037_4k.webp', title: 'A-frame Timber Architecture Detail', category: 'rooms', assignedRoom: 'aframe', enabled: true, order: 11 },
    { id: 'gal-12', url: 'assets/images/IMG-20260821-WA0041_4k.webp', title: 'Fresh Authentic Home-Cooked Meals', category: 'food', assignedRoom: 'property', enabled: true, order: 12 },
    { id: 'gal-13', url: 'assets/images/gallery-new-img-1_4k.webp', title: 'Boutique Room Details & Decor', category: 'rooms', assignedRoom: 'suite', enabled: true, order: 13 },
    { id: 'gal-14', url: 'assets/images/gallery-new-img-2_4k.webp', title: 'Glass house Twilight Glow', category: 'rooms', assignedRoom: 'glasshouse', enabled: true, order: 14 },
    { id: 'gal-15', url: 'assets/images/gallery-new-img-3_4k.webp', title: 'Cozy Mountain Bedroom Setting', category: 'rooms', assignedRoom: 'standard', enabled: true, order: 15 },
    { id: 'gal-16', url: 'assets/images/gallery-new-img-7_4k.webp', title: 'Outdoor Firepit Night Setting', category: 'campfire', assignedRoom: 'property', enabled: true, order: 16 }
  ];

  // DEFAULT SETTINGS
  const DEFAULT_SETTINGS = {
    propertyName: 'The Groot Ooty',
    phone1: '6382316323',
    phone2: '7395965006',
    whatsapp: '916382316323',
    address: '204, Showdown Road, Mellakshminarayanapuram, Pudumund, Ooty, Tamil Nadu 643001',
    checkInTime: '12:00 PM',
    checkOutTime: '11:00 AM',
    bookingNote: '100% Direct Booking. Availability and final pricing are confirmed directly with The Groot via WhatsApp.',
    instagram: '@the_groot_ooty'
  };

  // STORE CLASS
  class GrootStore {
    constructor() {
      this.listeners = [];
    }

    // Helper: read from localStorage with fallback
    _read(key, defaultValue) {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch (e) {
        console.warn('GrootStore read error:', e);
        return defaultValue;
      }
    }

    // Helper: write to localStorage
    _write(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        this._notify();
      } catch (e) {
        console.error('GrootStore write error:', e);
      }
    }

    // ROOMS API
    getRooms() {
      return this._read(STORAGE_KEY_ROOMS, DEFAULT_ROOMS);
    }

    getRoom(id) {
      const rooms = this.getRooms();
      return rooms.find(r => r.id === id) || rooms[0];
    }

    updateRoom(id, updates) {
      const rooms = this.getRooms().map(r => {
        if (r.id === id) {
          return { ...r, ...updates };
        }
        return r;
      });
      this._write(STORAGE_KEY_ROOMS, rooms);
      return this.getRoom(id);
    }

    updateRoomPrice(id, newPrice) {
      const price = parseInt(newPrice, 10);
      if (isNaN(price) || price < 0) return false;
      return this.updateRoom(id, { price });
    }

    toggleRoomStatus(id) {
      const room = this.getRoom(id);
      if (!room) return false;
      const nextStatus = room.status === 'available' ? 'unavailable' : 'available';
      return this.updateRoom(id, { status: nextStatus });
    }

    setRoomStatus(id, status) {
      if (status !== 'available' && status !== 'unavailable') return false;
      return this.updateRoom(id, { status });
    }

    // GALLERY API
    getGallery(includeDisabled = false) {
      const items = this._read(STORAGE_KEY_GALLERY, DEFAULT_GALLERY);
      const filtered = includeDisabled ? items : items.filter(img => img.enabled !== false);
      return filtered.sort((a, b) => (a.order || 0) - (b.order || 0));
    }

    getGalleryItem(id) {
      const gallery = this.getGallery(true);
      return gallery.find(item => item.id === id);
    }

    updateGalleryItem(id, updates) {
      const gallery = this.getGallery(true).map(item => {
        if (item.id === id) {
          return { ...item, ...updates };
        }
        return item;
      });
      this._write(STORAGE_KEY_GALLERY, gallery);
      return this.getGalleryItem(id);
    }

    assignPhotoToRoom(photoId, roomId) {
      return this.updateGalleryItem(photoId, { assignedRoom: roomId });
    }

    toggleGalleryVisibility(photoId) {
      const item = this.getGalleryItem(photoId);
      if (!item) return false;
      return this.updateGalleryItem(photoId, { enabled: !item.enabled });
    }

    getRoomPhotos(roomId) {
      const room = this.getRoom(roomId);
      const gallery = this.getGallery(false);
      const assigned = gallery.filter(item => item.assignedRoom === roomId).map(item => item.url);
      
      const photos = [];
      if (room && room.image) photos.push(room.image);
      if (room && room.interiorImage && !photos.includes(room.interiorImage)) photos.push(room.interiorImage);
      assigned.forEach(url => {
        if (!photos.includes(url)) photos.push(url);
      });
      return photos;
    }

    // SETTINGS API
    getSettings() {
      return this._read(STORAGE_KEY_SETTINGS, DEFAULT_SETTINGS);
    }

    updateSettings(updates) {
      const current = this.getSettings();
      const updated = { ...current, ...updates };
      this._write(STORAGE_KEY_SETTINGS, updated);
      return updated;
    }

    // AUTH API (Admin dashboard session)
    isAuthenticated() {
      const auth = sessionStorage.getItem(STORAGE_KEY_AUTH);
      return auth === 'authenticated';
    }

    login(username, password) {
      if (!username || !password) return false;
      if (username === TEMPORARY_ADMIN_USERNAME && password === TEMPORARY_ADMIN_PASSWORD) {
        sessionStorage.setItem(STORAGE_KEY_AUTH, 'authenticated');
        return true;
      }
      return false;
    }

    logout() {
      sessionStorage.removeItem(STORAGE_KEY_AUTH);
    }

    // RESET TO DEFAULTS
    resetToDefaults() {
      localStorage.removeItem(STORAGE_KEY_ROOMS);
      localStorage.removeItem(STORAGE_KEY_GALLERY);
      localStorage.removeItem(STORAGE_KEY_SETTINGS);
      this._notify();
    }

    // SUBSCRIPTIONS
    subscribe(fn) {
      if (typeof fn === 'function') {
        this.listeners.push(fn);
      }
    }

    _notify() {
      this.listeners.forEach(fn => {
        try { fn(); } catch(e) { console.error(e); }
      });
    }
  }

  // Instantiate singleton
  window.GrootStore = new GrootStore();

})(window);

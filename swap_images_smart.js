const fs = require('fs');
const files = ['index.html', 'rooms.html', 'experiences.html', 'ooty.html', 'room-detail.html', 'booking.html', 'js/config.js', 'js/gallery.js'];

// Read files
let fileContents = {};
files.forEach(f => {
  if (fs.existsSync(f)) fileContents[f] = fs.readFileSync(f, 'utf8');
});

function replaceImg(file, searchStr, newImg) {
  if (fileContents[file] && fileContents[file].includes(searchStr)) {
    fileContents[file] = fileContents[file].replace(searchStr, searchStr.replace(/IMG-20260821-WA00\d{2}\.jpg/, newImg));
  }
}

// 1. Hero -> WA0037 (Square night property) - perfect fit
replaceImg('index.html', 'class="hero-bg-img parallax-img"\n      src="assets/images/IMG-20260821-WA0034_4k.webp"', 'IMG-20260821-WA0037_4k.webp');

// 2. Glass House -> WA0034 (Day A-Frame) - already WA0034, but let's make sure it uses WA0034.
// It's already WA0034.

// 3. Ooty Botanical Garden -> WA0039 (Landscape Day property)
replaceImg('ooty.html', 'assets/images/IMG-20260821-WA0034_4k.webp" alt="Ooty Botanical Garden"', 'IMG-20260821-WA0039_4k.webp');
replaceImg('js/config.js', 'assets/images/IMG-20260821-WA0034_4k.webp\',\n    category: \'Garden\'', 'IMG-20260821-WA0039_4k.webp\',\n    category: \'Garden\''); // wait, in config it's WA0034

// 4. Tea Estate Walk -> WA0034 (Day A-Frame landscape is better than Night String lights for a walk)
replaceImg('experiences.html', 'assets/images/IMG-20260821-WA0037_4k.webp" alt="Tea estate walk"', 'IMG-20260821-WA0034_4k.webp');
replaceImg('js/config.js', 'assets/images/IMG-20260821-WA0037_4k.webp\',\n    category: \'Nature\'', 'IMG-20260821-WA0034_4k.webp\',\n    category: \'Nature\'');

// 5. Property night at The Groot -> WA0037 (Night String lights) - already WA0037
// 6. Luxurious Suite -> WA0038 (Suite interior)
replaceImg('booking.html', 'assets/images/IMG-20260821-WA0037_4k.webp" alt="Luxurious Suite"', 'IMG-20260821-WA0038_4k.webp');

// 7. Ooty Lake -> WA0039 (Landscape Day)
replaceImg('js/config.js', 'assets/images/IMG-20260821-WA0039_4k.webp\',\n    category: \'Lake\'', 'IMG-20260821-WA0034_4k.webp\',\n    category: \'Lake\'');
replaceImg('experiences.html', 'assets/images/IMG-20260821-WA0034_4k.webp" alt="Ooty lake and town"', 'IMG-20260821-WA0039_4k.webp');

// Let's do a simpler fallback: Just swap WA0034 and WA0037 globally, but then fix the obvious bad ones.
files.forEach(f => {
  if (fileContents[f]) {
    let c = fileContents[f];
    c = c.replace(/WA0034\.jpg/g, 'TEMP_SWAP_34.jpg');
    c = c.replace(/WA0037\.jpg/g, 'WA0034.jpg');
    c = c.replace(/TEMP_SWAP_34\.jpg/g, 'WA0037.jpg');
    
    // Now fix bad ones
    // "Tea estate walk" got WA0034 (Day). That is good!
    // "Luxurious Suite" got WA0034 (Day Exterior). Let's change it to WA0038 (Interior)
    c = c.replace(/IMG-20260821-WA0034\.jpg" alt="Luxurious Suite"/, 'IMG-20260821-WA0038_4k.webp" alt="Luxurious Suite"');
    
    // "Property night" got WA0034 (Day). Let's change to WA0036 (Night campfire)
    c = c.replace(/IMG-20260821-WA0034\.jpg" alt="Property night at The Groot"/, 'IMG-20260821-WA0036_4k.webp" alt="Property night at The Groot"');
    c = c.replace(/IMG-20260821-WA0034\.jpg at night',(\s*)category: 'property'/g, 'IMG-20260821-WA0036_4k.webp at night\',$1category: \'property\'');

    // "Glass House" got WA0037 (Night string lights). This is fine, it looks beautiful at night.

    fileContents[f] = c;
    fs.writeFileSync(f, fileContents[f], 'utf8');
  }
});

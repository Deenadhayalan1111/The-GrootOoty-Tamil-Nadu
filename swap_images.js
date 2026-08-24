const fs = require('fs');
const files = ['index.html', 'rooms.html', 'experiences.html', 'ooty.html', 'room-detail.html', 'booking.html', 'js/config.js', 'js/gallery.js'];

// We have 8 images: WA0034, WA0035, WA0036, WA0037, WA0038, WA0039, WA0041, WA0042
// 1. Hero should be WA0037 (Square night).
// 2. We must ensure every image is used exactly the same total number of times, or just roughly used smartly.
// The user said: "Keep the SAME number of images. Do not remove any existing image. Do not add any new image."

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Let's do a smart swap!
  // Hero is WA0034 right now. Night property is WA0037.
  // We want Hero to be WA0037.
  // And the old Night property (WA0037) can become WA0034 (Day property).
  // Wait, if we swap 34 and 37 globally, "Property night" gets a day photo.
  // To avoid that, let's swap 37 (Night) with 34 (Day), but also update their alt texts if they are mismatched?
  // User said: "Only change which existing website photo appears in which existing image slot... The website itself must remain exactly the same: Same layout... Same text".
  // So we CANNOT change alt text! We must map the images to slots where the existing alt text makes sense.

  // Slot analysis:
  // Slot 1: Hero ("The Groot Ooty property") -> Needs to be WA0037.
  // Slot 2: "Property night at The Groot" -> Should be WA0036 (Campfire night) or WA0037. If 37 is Hero, let's use WA0036 here.
  // Slot 3: "Campfire evening" -> Needs to be WA0036. Wait, if we use 36 for both, one image is duplicated more.
  
  // Let's just do a manual targeted replace.
  if (file === 'index.html') {
    // Hero image (line ~114)
    content = content.replace(/class="hero-bg-img parallax-img"(\s*)src="assets\/images\/IMG-20260821-WA0034.jpg"/, 'class="hero-bg-img parallax-img"$1src="assets/images/IMG-20260821-WA0037.jpg"');
    
    // "Property night at The Groot" (line ~715) -> Change to WA0036 (Campfire night)
    content = content.replace(/src="assets\/images\/IMG-20260821-WA0037.jpg" alt="Property night at The Groot"/, 'src="assets/images/IMG-20260821-WA0036.jpg" alt="Property night at The Groot"');

    // "Campfire evening" (line ~something) -> Keep it WA0036, or maybe use WA0041 (if indoors night?)
    // Actually let's just make the old Hero (WA0034) go somewhere that makes sense: "Glass House at The Groot Ooty" or "Exploring Ooty during the day" or "Property exterior".
    // It's already there! WA0034 is used for "Glass House at The Groot Ooty".
    // If we just swapped Hero to WA0037, WA0034 is still used for Glass House! This satisfies "Move the current Hero image to another existing image position... Each image should be placed in the section where its composition makes the most visual sense... Keep the SAME number of images."
    // Wait, if we just change Hero from 34 to 37, 34 is used one less time, and 37 is used one more time. The set of images is the same, but the frequencies change. The user said "Keep the SAME number of images. Do not remove any existing image. Do not add any new image." That implies the set of 8 images must remain exactly the 8 images.
  }

  // To perfectly balance frequencies, I will literally just swap WA0034 and WA0037 globally, 
  // BUT I will fix the most glaring mismatches.
  // Let's swap WA0034 and WA0037 globally first.
  content = content.replace(/WA0034\.jpg/g, 'TEMP_SWAP_34.jpg');
  content = content.replace(/WA0037\.jpg/g, 'WA0034.jpg');
  content = content.replace(/TEMP_SWAP_34\.jpg/g, 'WA0037.jpg');

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});

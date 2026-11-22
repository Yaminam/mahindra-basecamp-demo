// Concept-demo catalogue. Products, prices, dealers and dates are illustrative unless noted.
// The 7.2 kW wallbox price matches Mahindra's quoted launch price for the BE 6 / XEV 9e.

export const img = (name) => `./img/${name}`;

export const MODELS = [
  { id: "thar", name: "Thar", line: "Thar", years: [2023, 2024, 2025, 2026], fourByFour: true, ev: false },
  { id: "roxx", name: "Thar Roxx", line: "Thar", years: [2024, 2025, 2026], fourByFour: true, ev: false },
  { id: "scorpion", name: "Scorpio-N", line: "Scorpio", years: [2022, 2023, 2024, 2025, 2026], fourByFour: true, ev: false },
  { id: "scorpioc", name: "Scorpio Classic", line: "Scorpio", years: [2022, 2023, 2024, 2025, 2026], fourByFour: false, ev: false },
  { id: "xuv700", name: "XUV700", line: "XUV", years: [2021, 2022, 2023, 2024, 2025, 2026], fourByFour: false, ev: false },
  { id: "xuv3xo", name: "XUV 3XO", line: "XUV", years: [2024, 2025, 2026], fourByFour: false, ev: false },
  { id: "boleroneo", name: "Bolero Neo", line: "Bolero", years: [2022, 2023, 2024, 2025, 2026], fourByFour: false, ev: false },
  { id: "be6", name: "BE 6", line: "Born Electric", years: [2025, 2026], fourByFour: false, ev: true },
  { id: "xev9e", name: "XEV 9e", line: "Born Electric", years: [2025, 2026], fourByFour: false, ev: true },
  { id: "xev9s", name: "XEV 9S", line: "Born Electric", years: [2026], fourByFour: false, ev: true },
];

export const VARIANTS = {
  thar: ["AX Opt", "LX Hard Top", "LX 4x4 AT"],
  roxx: ["MX1", "MX5", "AX5L", "AX7L 4x4"],
  scorpion: ["Z2", "Z4", "Z8", "Z8L 4XPLOR"],
  scorpioc: ["S", "S11"],
  xuv700: ["MX", "AX3", "AX5", "AX7", "AX7L"],
  xuv3xo: ["MX1", "MX3", "AX5", "AX7L"],
  boleroneo: ["N4", "N8", "N10 (O)"],
  be6: ["Pack One", "Pack Two", "Pack Three"],
  xev9e: ["Pack One", "Pack Two", "Pack Three"],
  xev9s: ["Pack One", "Pack Two", "Pack Three"],
};

export const modelById = (id) => MODELS.find((m) => m.id === id);

const ICE = ["thar", "roxx", "scorpion", "scorpioc", "xuv700", "xuv3xo", "boleroneo"];
const EV = ["be6", "xev9e", "xev9s"];
const ALL = [...ICE, ...EV];
const THARS = ["thar", "roxx"];
const OFFROAD = ["thar", "roxx", "scorpion"];

export const CATEGORIES = [
  { id: "roof", name: "Roof & carry" },
  { id: "offroad", name: "Off-road" },
  { id: "exterior", name: "Exterior" },
  { id: "interior", name: "Interior" },
  { id: "tech", name: "Tech" },
  { id: "charging", name: "Charging" },
  { id: "care", name: "Care" },
];

// fit: list of model ids. modes: ship (DIY home delivery), dealer (fitment at dealer), doorstep (technician visit)
export const ACCESSORIES = [
  { id: "trail-roof-carrier", name: "Trail Roof Carrier", cat: "roof", price: 24990, fit: OFFROAD, modes: ["dealer", "doorstep"], image: "acc/roof-carrier.jpg", world: "thar", tag: "Best seller",
    blurb: "Powder-coated steel platform rated for expedition loads. Mounts on factory points, so your warranty stays intact.",
    specs: [["Load rating", "75 kg dynamic"], ["Fitment time", "About 90 minutes"], ["Warranty", "2 years"]] },
  { id: "winch-bumper", name: "Off-road Front Bumper", cat: "offroad", price: 38500, fit: OFFROAD, modes: ["dealer"], image: "acc/bumper.jpg", world: "thar",
    blurb: "Winch-ready steel bumper with recovery points and fog-lamp cut-outs. Dealer fitment only, for airbag-sensor safety.",
    specs: [["Material", "3 mm steel"], ["Winch ready", "Up to 9,500 lb"], ["Warranty", "2 years"]] },
  { id: "led-bar", name: "32-inch LED Light Bar", cat: "offroad", price: 12990, fit: [...OFFROAD, "scorpioc", "boleroneo"], modes: ["dealer", "doorstep"], image: "acc/light-bar.jpg", world: "thar",
    blurb: "Combo spot and flood beam with a road-legal switch harness wired to your factory fuse box.",
    specs: [["Beam", "Spot + flood combo"], ["Rating", "IP68"], ["Warranty", "2 years"]] },
  { id: "rear-ladder", name: "Rear Access Ladder", cat: "roof", price: 6490, fit: THARS, modes: ["dealer", "doorstep"], image: "acc/ladder.jpg", world: "thar",
    blurb: "Bolt-on ladder for quick roof access. Pairs with the Trail Roof Carrier.",
    specs: [["Finish", "Textured black"], ["Fitment time", "About 40 minutes"], ["Warranty", "1 year"]] },
  { id: "recovery-kit", name: "Trail Recovery Kit", cat: "offroad", price: 4990, fit: [...OFFROAD, "scorpioc", "boleroneo"], modes: ["ship"], image: "acc/recovery.jpg", world: "thar", tag: "Trail essential",
    blurb: "Snatch strap, two soft shackles, gloves and a tough roll bag. Everything for your first river crossing.",
    specs: [["Strap rating", "8 tonne"], ["Contents", "5 pieces"], ["Warranty", "1 year"]] },
  { id: "snorkel", name: "Raised Air Intake (Snorkel)", cat: "offroad", price: 8990, fit: OFFROAD, modes: ["dealer"], image: "acc/snorkel.jpg", world: "thar",
    blurb: "Pulls clean air from roof height for deep water crossings and dusty trails.",
    specs: [["Wading aid", "Roof-height intake"], ["Material", "UV-stable polymer"], ["Warranty", "2 years"]] },
  { id: "aero-roof-box", name: "Aero Roof Box 420L", cat: "roof", price: 32990, fit: ["scorpion", "xuv700", "xuv3xo", "be6", "xev9e", "xev9s"], modes: ["dealer", "doorstep"], image: "scorpio-spiti.jpg",
    blurb: "Low-drag, lockable roof box that opens from both sides. Swallows a family week away.",
    specs: [["Volume", "420 litres"], ["Load", "75 kg"], ["Warranty", "2 years"]] },
  { id: "floor-mats", name: "3D Moulded Floor Mats", cat: "interior", price: 3490, fit: ALL, modes: ["ship"], image: "acc/floor-mats.jpg", tag: "Fits every Mahindra",
    blurb: "Laser-measured for your exact model. Raised edges hold mud, sand and monsoon water.",
    specs: [["Pieces", "Full cabin set"], ["Material", "TPE, odour-free"], ["Warranty", "1 year"]] },
  { id: "seat-covers", name: "Leatherette Seat Covers", cat: "interior", price: 14990, fit: ALL, modes: ["dealer", "doorstep"], image: "acc/seat-covers.jpg",
    blurb: "Airbag-compatible stitching, cut for each variant's seat layout.",
    specs: [["Material", "Perforated leatherette"], ["Airbag safe", "Yes, tear-seam"], ["Warranty", "1 year"]] },
  { id: "side-steps", name: "Aluminium Side Steps", cat: "exterior", price: 11490, fit: ["roxx", "scorpion", "xuv700"], modes: ["dealer"], image: "acc/side-steps.jpg",
    blurb: "Anti-slip treads that make climbing in easier for the whole family.",
    specs: [["Material", "Anodised aluminium"], ["Load", "150 kg per side"], ["Warranty", "2 years"]] },
  { id: "alloy-18", name: "18-inch Trail Alloy (each)", cat: "exterior", price: 9990, fit: ["roxx", "scorpion", "xuv700"], modes: ["dealer"], image: "acc/alloy.jpg",
    blurb: "Gunmetal finish, OEM offset. Balanced and fitted at your dealer.",
    specs: [["Size", "18 x 7.5 in"], ["Finish", "Gunmetal"], ["Warranty", "2 years"]] },
  { id: "body-cover", name: "Weatherproof Body Cover", cat: "care", price: 2790, fit: ALL, modes: ["ship"], image: "acc/body-cover.jpg",
    blurb: "UV and monsoon-resistant, cut to your model's exact shape.",
    specs: [["Layers", "3-ply"], ["Storage bag", "Included"], ["Warranty", "6 months"]] },
  { id: "care-kit", name: "Basecamp Car Care Kit", cat: "care", price: 1490, fit: ALL, modes: ["ship"], image: "acc/care-kit.jpg",
    blurb: "Shampoo, wax, microfibre cloths and interior cleaner, sized for a full season.",
    specs: [["Contents", "6 items"], ["Safe for", "Paint, glass, trim"], ["Shelf life", "24 months"]] },
  { id: "dashcam", name: "Front + Rear Dashcam", cat: "tech", price: 8990, fit: ALL, modes: ["dealer", "doorstep", "ship"], image: "acc/dashcam.jpg",
    blurb: "2K front, 1080p rear, parking mode, hard-wired by a technician or DIY with the plug-in kit.",
    specs: [["Resolution", "2K + 1080p"], ["Storage", "128 GB included"], ["Warranty", "1 year"]] },
  { id: "pet-hammock", name: "Trail Dog Seat Hammock", cat: "interior", price: 2490, fit: ALL, modes: ["ship"], image: "acc/pet-hammock.jpg", world: "pets",
    blurb: "Waterproof rear-seat hammock with a mesh window, so your dog sees the trail too.",
    specs: [["Fits", "Rear bench"], ["Washable", "Yes"], ["Warranty", "6 months"]] },
  { id: "mud-flaps", name: "Mud Flap Set", cat: "exterior", price: 1290, fit: ICE, modes: ["ship", "doorstep"], image: "acc/mud-flaps.jpg",
    blurb: "Keeps trail spray off your paint. Model-specific mounts, no drilling.",
    specs: [["Set", "4 pieces"], ["Material", "Flexible TPO"], ["Warranty", "1 year"]] },
  { id: "wallbox-72", name: "7.2 kW AC Wallbox", cat: "charging", price: 50000, fit: EV, modes: ["doorstep"], image: "acc/wallbox.jpg", world: "electric", tag: "Includes installation",
    blurb: "Home charging with a certified electrician's site survey and installation, booked right here.",
    specs: [["Output", "7.2 kW AC"], ["Install", "Site survey included"], ["Warranty", "2 years"]] },
  { id: "portable-charger", name: "Portable Charger 3.3 kW", cat: "charging", price: 18990, fit: EV, modes: ["ship"], image: "acc/portable-charger.jpg", world: "electric",
    blurb: "Plugs into a 15 A socket. Lives in your frunk for road trips.",
    specs: [["Output", "3.3 kW"], ["Cable", "6 m"], ["Warranty", "1 year"]] },
  { id: "type2-cable", name: "Type 2 Public Charging Cable", cat: "charging", price: 12490, fit: EV, modes: ["ship"], image: "acc/type2-cable.jpg", world: "electric",
    blurb: "For AC public chargers that need your own cable.",
    specs: [["Length", "5 m"], ["Rating", "32 A, 3-phase"], ["Warranty", "1 year"]] },
];

export const COLLECTIONS = [
  { id: "racing", name: "Mahindra Racing", line: "2026 Team Collection", image: "racing.jpg", blurb: "Official Formula E teamwear. Worn in the garage, priced in rupees, shipped from India." },
  { id: "thar", name: "Thar Trail", line: "Off-road lifestyle", image: "thar-red.jpg", blurb: "Built for dust, rain and the drive home." },
  { id: "electric", name: "Born Electric", line: "BE 6 and XEV 9e", image: "ev.jpg", blurb: "Clean lines, reflective details, made for night drives." },
  { id: "heritage", name: "Heritage 1947", line: "Archive collection", image: "heritage.jpg", blurb: "Numbered pieces inspired by the Willys years." },
];

export const MERCH_CATS = ["Teamwear", "Apparel", "Headwear", "Accessories", "Collectibles", "Kids", "Pets"];

const AP = ["XS", "S", "M", "L", "XL", "XXL"];
// image = product shot, image2 = second view on hover. Files under img/merch/ fall back gracefully if missing.
export const MERCH = [
  { id: "team-polo", name: "Team Polo", collection: "racing", cat: "Teamwear", price: 3499, image: "merch/polo-black.jpg", image2: "merch/polo-white.jpg", sizes: AP, colors: ["#1c1c1c", "#ffffff"], colorNames: ["Black", "White"], colorImages: { "#1c1c1c": "merch/polo-black.jpg", "#ffffff": "merch/polo-white.jpg" }, tag: "New", personalise: true,
    blurb: "The polo the team wears in the garage. Moisture-wicking pique with the team crest." },
  { id: "team-softshell", name: "Team Padded Jacket", collection: "racing", cat: "Teamwear", price: 7999, image: "merch/softshell.jpg", image2: "jacket.jpg", sizes: AP, colors: ["#1c1c1c"], colorNames: ["Black"], colorImages: { "#1c1c1c": "merch/softshell.jpg" }, tag: "Bestseller",
    blurb: "Lightweight insulated shell. Built for cold grandstands and colder pit lanes." },
  { id: "racing-tee", name: "Team Tee", collection: "racing", cat: "Teamwear", price: 2299, image: "merch/tee-red.jpg", image2: "tee.jpg", sizes: AP, colors: ["#dd052b", "#1c1c1c"], colorNames: ["Mahindra Red", "Black"], colorImages: { "#dd052b": "merch/tee-red.jpg", "#1c1c1c": "tee.jpg" }, personalise: true,
    blurb: "Team colours on soft combed cotton. Add your name and number on the back." },
  { id: "team-cap", name: "Team Trucker Cap", collection: "racing", cat: "Headwear", price: 1799, image: "merch/cap-black.jpg", image2: "cap.jpg", colors: ["#1c1c1c"], colorNames: ["Black / White"], colorImages: { "#1c1c1c": "merch/cap-black.jpg" }, tag: "Bestseller",
    blurb: "Six-panel structured cap with an embroidered team crest." },
  { id: "team-bottle", name: "Team Steel Bottle", collection: "racing", cat: "Accessories", price: 1299, image: "merch/bottle.jpg",
    blurb: "Double-wall insulated, keeps chai hot for 12 hours." },
  { id: "trail-hoodie", name: "Trail Hoodie", collection: "thar", cat: "Apparel", price: 2499, image: "hoodie.jpg", image2: "merch/hoodie-grey.jpg", world: "thar", sizes: AP, colors: ["#1c1c1c", "#8d8f93"], colorNames: ["Black", "Grey Marl"], colorImages: { "#1c1c1c": "hoodie.jpg", "#8d8f93": "merch/hoodie-grey.jpg" }, tag: "Bestseller",
    blurb: "Heavyweight 380 gsm cotton fleece with a tonal Thar trail map on the back." },
  { id: "icon-tee", name: "Thar Icon Tee", collection: "thar", cat: "Apparel", price: 1299, image: "merch/tee-white.jpg", image2: "tee.jpg", world: "thar", sizes: AP, colors: ["#ffffff", "#1c1c1c"], colorNames: ["White", "Black"], colorImages: { "#ffffff": "merch/tee-white.jpg", "#1c1c1c": "tee.jpg" },
    blurb: "Garment-dyed, relaxed fit, built to survive trail dust and many wash cycles." },
  { id: "utility-jacket", name: "Trail Utility Jacket", collection: "thar", cat: "Apparel", price: 6499, image: "merch/jacket-utility.jpg", image2: "thar-2.jpg", world: "thar", sizes: AP, tag: "New",
    blurb: "Ripstop shell, eight pockets, packs into its own chest pocket." },
  { id: "basecamp-cap", name: "Basecamp Cap", collection: "thar", cat: "Headwear", price: 799, image: "merch/cap-white.jpg", image2: "cap.jpg", world: "thar", colors: ["#ffffff", "#1c1c1c"], colorNames: ["White", "Black"], colorImages: { "#ffffff": "merch/cap-white.jpg", "#1c1c1c": "cap.jpg" },
    blurb: "Structured front, curved peak, embroidered Basecamp patch." },
  { id: "trail-beanie", name: "Trail Beanie", collection: "thar", cat: "Headwear", price: 899, image: "merch/beanie.jpg", image2: "hero-thar.jpg", world: "thar",
    blurb: "Ribbed merino blend for Spiti mornings." },
  { id: "trail-pack", name: "28L Trail Backpack", collection: "thar", cat: "Accessories", price: 3999, image: "backpack.jpg", world: "thar",
    blurb: "Weather-resistant shell, laptop sleeve, hydration port." },
  { id: "enamel-mug", name: "Enamel Trail Mug", collection: "thar", cat: "Accessories", price: 599, image: "mug.jpg", image2: "camp.jpg", world: "thar",
    blurb: "Campfire-proof enamel steel. Holds chai for the whole convoy." },
  { id: "camp-chair", name: "Basecamp Camp Chair", collection: "thar", cat: "Accessories", price: 3499, image: "camp.jpg", world: "thar",
    blurb: "Folds to the size of a water bottle. Holds 120 kg." },
  { id: "diecast-roxx", name: "1:18 Thar Roxx Die-cast", collection: "thar", cat: "Collectibles", price: 4999, image: "diecast.jpg", image2: "thar-red.jpg", world: "thar", tag: "Bestseller",
    blurb: "Opening doors and bonnet, detailed underbody, display base included." },
  { id: "electric-tee", name: "Born Electric Polo", collection: "electric", cat: "Apparel", price: 1499, image: "merch/polo-white.jpg", image2: "ev.jpg", world: "electric", sizes: AP, colors: ["#ffffff"], colorNames: ["White"], colorImages: { "#ffffff": "merch/polo-white.jpg" },
    blurb: "Minimal graphic, organic cotton, reflective print." },
  { id: "electric-tote", name: "Born Electric Canvas Tote", collection: "electric", cat: "Accessories", price: 999, image: "merch/tote.jpg", image2: "ev.jpg", world: "electric", tag: "New",
    blurb: "Heavy cotton canvas with a reflective charge-port graphic." },
  { id: "electric-shades", name: "Polarised Drive Sunglasses", collection: "electric", cat: "Accessories", price: 2499, image: "merch/sunglasses.jpg", image2: "ev.jpg", world: "electric",
    blurb: "Polarised lenses tuned for glare off wet roads." },
  { id: "electric-notebook", name: "Born Electric Notebook", collection: "electric", cat: "Accessories", price: 699, image: "merch/notebook.jpg", world: "electric",
    blurb: "Dot-grid, lay-flat binding, recycled paper." },
  { id: "heritage-jacket", name: "Heritage Field Jacket", collection: "heritage", cat: "Apparel", price: 9999, image: "jacket.jpg", image2: "heritage.jpg", world: "heritage", sizes: ["S", "M", "L", "XL"], drop: true, tag: "Limited",
    blurb: "Waxed cotton, archive-inspired detailing, numbered inner label. 1,947 pieces only." },
  { id: "heritage-duffel", name: "Heritage Weekender", collection: "heritage", cat: "Accessories", price: 5499, image: "merch/duffel.jpg", image2: "heritage.jpg", world: "heritage",
    blurb: "Waxed canvas weekender, sized for cabin bins." },
  { id: "heritage-keyring", name: "Heritage Keyring", collection: "heritage", cat: "Accessories", price: 499, image: "merch/keychain.jpg", image2: "heritage.jpg", world: "heritage",
    blurb: "Solid brass, stamped with the 1947 archive mark." },
  { id: "heritage-socks", name: "Heritage Socks (2 pairs)", collection: "heritage", cat: "Accessories", price: 599, image: "merch/socks.jpg", world: "heritage",
    blurb: "Combed cotton with archive-stripe cuffs." },
  { id: "kids-tee", name: "Little Driver Tee", collection: "thar", cat: "Kids", price: 899, image: "merch/kids-tee.jpg", image2: "kids-ride.jpg", world: "little", sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"],
    blurb: "Soft cotton tee for future trail leaders." },
  { id: "kids-thar", name: "Kids Ride-on Thar 12V", collection: "thar", cat: "Kids", price: 29999, image: "kids-ride.jpg", world: "little", tag: "New",
    blurb: "Parental remote, soft-start motor, working headlamps. Ages 3 to 7." },
  { id: "kids-tractor", name: "Kids Ride-on Tractor", collection: "heritage", cat: "Kids", price: 23000, image: "farm.jpg", world: "farm",
    blurb: "Pedal-powered with a detachable trailer. From the Mahindra tractor range." },
  { id: "dog-harness", name: "Trail Dog Harness", collection: "thar", cat: "Pets", price: 1499, image: "dog.jpg", world: "pets",
    blurb: "Padded, reflective, with a seatbelt clip for safe road trips." },
];

export const EXPERIENCES = [
  { id: "ge-sakleshpur", name: "Great Escape: Sakleshpur", date: "13-14 Dec 2026", price: 6500, image: "trail-ladakh.jpg", seats: 18, level: "Beginner friendly", needs4x4: true,
    blurb: "Coffee-estate trails, a guided convoy and a night under the stars. Completing it unlocks the Western Ghats patch." },
  { id: "academy-1", name: "Off-road Academy: Level 1", date: "Every Saturday", price: 4500, image: "thar-splash.jpg", seats: 12, level: "No experience needed", needs4x4: false,
    blurb: "Learn traction, approach angles and water crossings with certified instructors." },
  { id: "spiti", name: "Spiti Expedition", date: "June 2027", price: 64000, image: "scorpio-spiti.jpg", seats: 10, level: "Advanced", needs4x4: true,
    blurb: "Nine days through high passes and the cold desert, with a support crew and expedition gear included." },
];

export const WORLDS = [
  { id: "thar", name: "Thar", kicker: "Explore the impossible", image: "thar-red.jpg", tint: "from-black/60", blurb: "Trail gear, recovery kits and the clothes that come home muddy." },
  { id: "electric", name: "Born Electric", kicker: "Charge ahead", image: "range/xev9e.jpg", tint: "from-black/60", blurb: "Home charging, travel cables and quiet, minimal design." },
  { id: "scorpio", name: "Scorpio-N", kicker: "Big presence", image: "range/scorpio-n.jpg", tint: "from-black/60", blurb: "Touring kit, family packs, premium rugged wear." },
  { id: "xuv", name: "XUV", kicker: "City-ready", image: "range/xuv700.jpg", tint: "from-black/60", blurb: "Dashcams, comfort upgrades and travel gear for the XUV700 and XUV 3XO." },
  { id: "racing", name: "Racing", kicker: "Formula E", image: "racing.jpg", tint: "from-black/60", blurb: "Team kit and race-weekend capsules, shipped from India." },
  { id: "heritage", name: "Heritage", kicker: "Since the Willys days", image: "heritage.jpg", tint: "from-black/60", blurb: "Archive graphics and numbered pieces for the collectors." },
  { id: "little", name: "Little Mahindra", kicker: "Kids", image: "kids-ride.jpg", tint: "from-black/60", blurb: "Ride-ons and die-casts for the next generation of drivers." },
  { id: "pets", name: "Trail Dogs", kicker: "Pets", image: "dog.jpg", tint: "from-black/60", blurb: "Harnesses and seat hammocks for your co-pilot." },
  { id: "farm", name: "Farm", kicker: "Roots", image: "range/tractor.jpg", tint: "from-black/60", blurb: "Tractor-range merch and ride-ons." },
];

export const PACKS = [
  { id: "trail-pack", name: "Trail Pack", for: THARS, items: ["trail-roof-carrier", "rear-ladder", "led-bar", "recovery-kit"], save: 0.12, image: "thar-splash.jpg" },
  { id: "family-pack", name: "Family Pack", for: ["scorpion", "xuv700", "roxx"], items: ["side-steps", "seat-covers", "floor-mats", "dashcam"], save: 0.1, image: "scorpio-spiti.jpg" },
  { id: "electric-pack", name: "Born Electric Pack", for: EV, items: ["wallbox-72", "type2-cable", "floor-mats"], save: 0.08, image: "range/be6.jpg" },
  { id: "city-pack", name: "City Pack", for: ["xuv3xo", "xuv700", "boleroneo", "scorpioc"], items: ["dashcam", "floor-mats", "body-cover", "care-kit"], save: 0.09, image: "range/xuv700.jpg" },
];

export const DEALERS = [
  { id: "d1", name: "Basecamp Partner Dealer, Baner", city: "Pune", km: 4.2 },
  { id: "d2", name: "Basecamp Partner Dealer, Wakad", city: "Pune", km: 9.8 },
  { id: "d3", name: "Basecamp Partner Dealer, Hadapsar", city: "Pune", km: 13.1 },
];

export const SLOTS = ["Sat 10:30", "Sat 14:00", "Sun 11:00", "Mon 09:30", "Tue 16:00"];

// next numbered drop (demo date)
export const DROP_AT = new Date("2026-11-28T19:00:00+05:30");

export const ALL_PRODUCTS = [
  ...ACCESSORIES.map((p) => ({ ...p, kind: "accessory" })),
  ...MERCH.map((p) => ({ ...p, kind: "merch", fit: null, modes: ["ship"] })),
];
export const productById = (id) => ALL_PRODUCTS.find((p) => p.id === id);

export const inr = (n) => "₹" + Math.round(n).toLocaleString("en-IN");
export const fits = (p, vehicle) => !p.fit || (vehicle && p.fit.includes(vehicle.model));

// 3D configurator: each toggle maps to a real catalogue item
export const BUILD_ACC = [
  { key: "rack", product: "trail-roof-carrier", label: "Trail Roof Carrier" },
  { key: "roofbox", product: "aero-roof-box", label: "Aero Roof Box 420L" },
  { key: "lightbar", product: "led-bar", label: "32-inch LED Light Bar" },
  { key: "bumper", product: "winch-bumper", label: "Off-road Winch Bumper" },
  { key: "snorkel", product: "snorkel", label: "Raised Air Intake" },
  { key: "steps", product: "side-steps", label: "Aluminium Side Steps" },
  { key: "ladder", product: "rear-ladder", label: "Rear Access Ladder" },
];

// configurator line-up: body style + the catalogue model id used for fitment
export const BUILD_MODELS = [
  { id: "roxx", fit: "roxx", name: "Thar Roxx", real: true, acc: ["rack", "lightbar", "bumper", "snorkel"], start: { rack: true, lightbar: true } },
  { id: "thar", fit: "thar", name: "Thar", real: true, acc: ["rack", "lightbar", "bumper", "snorkel", "ladder"], start: { lightbar: true } },
  { id: "scorpio", fit: "scorpion", name: "Scorpio-N", real: true, acc: ["rack", "lightbar", "bumper", "snorkel"], start: { rack: true } },
  { id: "xuv", fit: "xuv3xo", name: "XUV 3XO", real: true, factoryPaint: true, acc: ["roofbox", "steps"], start: { roofbox: true } },
];

// Backup shot for any photo that fails to load (keeps tiles from going blank)
export const FALLBACK = {
  "range/be6.jpg": "ev.jpg",
  "range/xuv700.jpg": "scorpio.jpg",
  "acc/roof-carrier.jpg": "camp.jpg",
  "acc/bumper.jpg": "thar-2.jpg",
  "acc/light-bar.jpg": "light.jpg",
  "acc/ladder.jpg": "thar-red.jpg",
  "acc/recovery.jpg": "thar-splash.jpg",
  "acc/snorkel.jpg": "thar-splash.jpg",
  "acc/floor-mats.jpg": "interior.jpg",
  "acc/seat-covers.jpg": "interior.jpg",
  "acc/side-steps.jpg": "scorpio-spiti.jpg",
  "acc/alloy.jpg": "tyre.jpg",
  "acc/body-cover.jpg": "car-care.jpg",
  "acc/care-kit.jpg": "car-care.jpg",
  "acc/dashcam.jpg": "scorpio.jpg",
  "acc/pet-hammock.jpg": "dog.jpg",
  "acc/mud-flaps.jpg": "convoy.jpg",
  "acc/wallbox.jpg": "ev.jpg",
  "acc/portable-charger.jpg": "ev.jpg",
  "acc/type2-cable.jpg": "ev.jpg",
  "merch/polo-black.jpg": "tee.jpg",
  "merch/softshell.jpg": "tee.jpg",
  "merch/tee-red.jpg": "tee.jpg",
  "merch/cap-black.jpg": "cap.jpg",
  "merch/racecar-model.jpg": "tee.jpg",
  "merch/bottle.jpg": "mug.jpg",
  "merch/hoodie-grey.jpg": "hoodie.jpg",
  "merch/tee-white.jpg": "tee.jpg",
  "merch/jacket-utility.jpg": "jacket.jpg",
  "merch/cap-white.jpg": "cap.jpg",
  "merch/beanie.jpg": "hoodie.jpg",
  "merch/polo-white.jpg": "tee.jpg",
  "merch/bomber.jpg": "jacket.jpg",
  "merch/sunglasses.jpg": "ev.jpg",
  "merch/notebook.jpg": "ev.jpg",
  "merch/duffel.jpg": "backpack.jpg",
  "merch/keychain.jpg": "heritage.jpg",
  "merch/socks.jpg": "heritage.jpg",
  "merch/kids-tee.jpg": "kids-ride.jpg"
};

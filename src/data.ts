import type { Variant } from './icons';

export type Agent = { id: string; name: string; short: string; color: string; variant: Variant; access: string };

export const AGENTS: Agent[] = [
  { id: 'social', name: 'Social agent', short: 'Social', color: '#4f9c4a', variant: 'strips', access: 'Instagram Stories · web search' },
  { id: 'resv', name: 'Table agent', short: 'Tables', color: '#e2564a', variant: 'antenna', access: 'availability feeds · waitlists' },
  { id: 'events', name: 'Events agent', short: 'Events', color: '#3d8ee8', variant: 'spine', access: 'event listings · newsletters' },
  { id: 'news', name: 'Local agent', short: 'Local', color: '#d99a2b', variant: 'brim', access: 'municipal notices · weather · transit' },
  { id: 'triage', name: 'Adventure agent', short: 'Adventure', color: '#7c6fd0', variant: 'ears', access: 'adventure listings · safety · profile · itinerary' },
];

export const BY_ID: Record<string, Agent> = Object.fromEntries(AGENTS.map(a => [a.id, a]));

export const QUICK = [
  { label: 'Tonight', when: '20:00 open', variant: 'antenna' as Variant, color: '#e2564a' },
  { label: 'Taste dial', when: 'Surprise me · 7', variant: 'ears' as Variant, color: '#7c6fd0' },
  { label: 'Auto-add', when: 'Free items only', variant: 'strips' as Variant, color: '#4f9c4a' },
];

export type Card = {
  id: string; agentId: string; title: string; meta: string; status: string;
  match: number; price: string; when: string; hasHold: boolean; cta: string;
  wash: [string, string]; citation: string; source: string; captured: string;
  confidence: string; pipeline: string; blurb: string; reasons: string[];
  sourceUrl: string;
  confirmTitle: string; confirmBody: string;
};

export const cardImage = (card: Card) => {
  const title = card.title.toLowerCase();
  if (title.includes('east austin') || title.includes("chef’s counter")) return require('../assets/explore/austin-counter.png');
  if (title.includes('songwriter')) return require('../assets/explore/austin-songwriter.png');
  if (title.includes('contemporary austin')) return require('../assets/explore/austin-gallery.png');
  if (title.includes('heat changed')) return require('../assets/explore/austin-shade.png');
  if (title.includes('board game')) return require('../assets/explore/boardgames.png');
  if (title.includes('vinyl')) return require('../assets/explore/vinyl-room.png');
  if (title.includes('cocktail')) return require('../assets/explore/cocktail-lab.png');
  if (title.includes('batik')) return require('../assets/explore/batik-studio.png');
  if (title.includes('cycling')) return require('../assets/explore/night-cycle.png');
  if (title.includes('sunrise hike')) return require('../assets/explore/sunrise-hike.png');
  if (title.includes('rafting')) return require('../assets/explore/rafting.png');
  if (title.includes('storm') || title.includes('heat') || title.includes('closed')) return require('../assets/explore/kl-rain-route.png');
  if (title.includes('gallery') || title.includes('opening') || title.includes('view')) return require('../assets/explore/ilham.png');
  if (title.includes('counter') || title.includes('rooftop') || title.includes('songwriter')) return require('../assets/explore/kampung-counter.png');
  return require('../assets/explore/dewakan.png');
};

export const CARDS: Card[] = [
  {
    id: 'belcanto', agentId: 'resv', title: 'A table just opened at Belcanto, tonight 20:00',
    meta: 'Two seats · tasting menu · Chiado, 11 min away', status: 'hold expiring',
    match: 92, price: 'RM788 pp', when: 'Tonight 20:00', hasHold: true, cta: 'Hold the table',
    wash: ['#fdeee9', '#f6f1e8'],
    citation: 'Reservation feed · cancellation at 20:04:12',
    source: 'Belcanto availability feed', captured: '20:04:12 · 42s ago', confidence: '0.94',
    sourceUrl: 'https://www.belcanto.pt/',
    pipeline: 'Table agent → Adventure → Ranking',
    blurb: 'A two-cover cancellation cleared on the 20:00 seating. Detour has watched this waitlist since Tuesday; the seats surfaced 42 seconds ago and usually go inside four minutes.',
    reasons: [
      'Your taste profile weights chef tasting menus above everything else',
      'Tonight 20:00–23:00 is the only unfilled block in your itinerary',
      'Inside your RM800 spontaneous-add ceiling',
      'A cancellation, not held inventory. This was not bookable an hour ago',
    ],
    confirmTitle: 'Held for 10 minutes',
    confirmBody: 'Two covers at Belcanto, 20:00 tonight. Detour will nudge you at 19:15 with the walking route. Nothing has been charged.',
  },
  {
    id: 'rooftop', agentId: 'social', title: 'One-night rooftop takeover in Alfama',
    meta: 'Eight seats · 21:30 tomorrow · announced on a Story', status: '8 seats left',
    match: 88, price: 'RM180 pp', when: 'Sat 21:30', hasHold: false, cta: 'Request a seat',
    wash: ['#e9f4ea', '#eef4f8'],
    citation: 'Instagram Story @tascadaalfama · 14 min ago',
    source: 'Instagram Story, @tascadaalfama', captured: '19:50 · 14 min ago', confidence: '0.81',
    sourceUrl: 'https://www.instagram.com/tascadaalfama/',
    pipeline: 'Social agent → Adventure → Ranking',
    blurb: 'A visiting chef is cooking a single seating on a private rooftop above Alfama. Announced in a Story that expires in ten hours, with no listing anywhere else.',
    reasons: [
      "Matches your 'surprise me' dial at its current setting",
      'Small-format dining, low crowd tolerance respected',
      'Fifteen minutes from your hotel',
    ],
    confirmTitle: 'Seat requested',
    confirmBody: 'Detour messaged the host and will confirm both seats within the hour.',
  },
  {
    id: 'gallery', agentId: 'events', title: "Private view: 'Atlântico' at Galeria Madragoa",
    meta: 'Free · Fri 19:00 · Santos, before your dinner', status: 'auto-added',
    match: 81, price: 'Free', when: 'Fri 19:00', hasHold: false, cta: 'Keep in itinerary',
    wash: ['#e8f0fb', '#f3eef8'],
    citation: 'Gallery mailing list + local listings · 2h ago',
    source: 'Galeria Madragoa mailing list', captured: '18:02 · 2h ago', confidence: '0.88',
    sourceUrl: 'https://www.galeriamadragoa.pt/',
    pipeline: 'Events agent → Adventure → Ranking → auto-add',
    blurb: 'An opening night with the artist present, an hour before your dinner reservation and four streets from it. Free and non-committal, so Detour added it without asking.',
    reasons: [
      'No cost and no commitment, inside your auto-add rules',
      'Contemporary art is your second-highest profile weight',
      'Slots cleanly into the 19:00 gap before dinner',
    ],
    confirmTitle: 'Kept in your itinerary',
    confirmBody: 'Friday 19:00, Galeria Madragoa. Detour will drop the address into your morning brief.',
  },
  {
    id: 'closure', agentId: 'news', title: 'Miradouro de Santa Catarina closed for filming',
    meta: 'Through Saturday · affects your sunset stop', status: 'advisory',
    match: 74, price: 'No cost', when: 'Sat 18:00', hasHold: false, cta: 'Swap for Santa Luzia',
    wash: ['#fbf3e4', '#f2f5f8'],
    citation: 'Local news desk · 3h ago',
    source: 'Municipal notice, reported locally', captured: '17:10 · 3h ago', confidence: '0.91',
    sourceUrl: 'https://www.lisboa.pt/',
    pipeline: 'Local agent → Adventure → Ranking',
    blurb: 'A film permit closes the terrace all weekend. Detour found a west-facing alternative the same distance from your Saturday afternoon.',
    reasons: [
      'Directly affects a booked item in your itinerary',
      'Santa Luzia holds the same sunset aspect, seven minutes further',
      'Flagged as a change, not a suggestion. Nothing was moved',
    ],
    confirmTitle: 'Swapped',
    confirmBody: 'Saturday sunset now points at Miradouro de Santa Luzia. The original entry stays in your change log.',
  },
];

export type Destination = 'lisbon' | 'malaysia' | 'texas';

const LOCAL_CARDS: Record<Exclude<Destination, 'lisbon'>, Partial<Card>[]> = {
  malaysia: [
    { title: 'A table just opened at Dewakan, tonight 20:00', meta: 'Two seats · modern Malaysian tasting · Naza Tower', price: 'RM788 pp', source: 'Dewakan reservation feed', sourceUrl: 'https://www.dewakan.my/', citation: 'Dewakan availability · cancellation detected moments ago', blurb: 'A two-cover cancellation opened at Malaysia’s destination restaurant. The table fits your open evening and tasting-menu profile.', confirmTitle: 'Dewakan held for 10 minutes', confirmBody: 'Two seats at Dewakan, 20:00 tonight. Detour will send the route before departure. Nothing has been charged.' },
    { title: 'Late-night chef counter in Kampung Baru', meta: 'Six stools · 22:00 tomorrow · announced today', price: 'RM180 pp', source: 'Chef announcement', sourceUrl: 'https://www.instagram.com/', citation: 'Local chef post · Kuala Lumpur · 14 min ago', blurb: 'A tiny one-night counter serving a modern take on Negeri Sembilan dishes, shared only through the chef’s social feed.' },
    { title: 'After-hours viewing at ILHAM Gallery', meta: 'Free · tonight 18:30 · Ilham Tower', price: 'Free', source: 'ILHAM Gallery programme', sourceUrl: 'https://ilhamgallery.com/', citation: 'ILHAM Gallery programme · checked 2 min ago', blurb: 'A curator-led evening viewing fits cleanly before dinner and sits inside your automatic free-item policy.' },
    { title: 'Storm window moved your rooftop stop', meta: 'Heavy rain at 17:00 · dry alternative nearby', price: 'No cost', source: 'Open-Meteo forecast', sourceUrl: 'https://open-meteo.com/', citation: 'Open-Meteo · Kuala Lumpur · current forecast', blurb: 'Detour found a dry indoor stop nearby and left the rest of your evening untouched.' },
  ],
  texas: [
    { title: 'Two seats opened at a chef’s counter, tonight 19:30', meta: 'East Austin · intimate tasting · 12 min away', price: '$185 pp', source: 'Restaurant availability feed', sourceUrl: 'https://www.austintexas.org/', citation: 'Austin availability · cancellation detected moments ago', blurb: 'A last-minute counter seating matches your dining profile and the open block in your Austin itinerary.' },
    { title: 'Secret songwriter set off South Congress', meta: 'Small room · 21:30 tomorrow · announced today', price: '$35 pp', source: 'Venue social announcement', sourceUrl: 'https://www.austintexas.org/', citation: 'Venue post · Austin · 11 min ago', blurb: 'A one-night acoustic set surfaced through a venue post before it reached the listings.' },
    { title: 'Sunset opening at The Contemporary Austin', meta: 'Free · tonight 18:00 · Jones Center', price: 'Free', source: 'The Contemporary Austin', sourceUrl: 'https://thecontemporaryaustin.org/', citation: 'Museum programme · checked 3 min ago', blurb: 'A free evening programme fits before dinner and matches your contemporary-art profile.' },
    { title: 'Heat changed your afternoon route', meta: 'Peak heat at 16:00 · shaded alternative ready', price: 'No cost', source: 'Open-Meteo forecast', sourceUrl: 'https://open-meteo.com/', citation: 'Open-Meteo · Austin · current forecast', blurb: 'Detour shifted the walking leg toward shaded streets without moving anything booked.' },
  ],
};

const malaysia = CARDS.map((card, index) => ({ ...card, ...LOCAL_CARDS.malaysia[index] }));
const underground: Card[] = [
  { ...malaysia[2], id: 'boardgames', title: 'Underground board game night in Chow Kit', meta: 'Local meetup · tonight 20:30 · 10 seats', match: 89, source: 'Community meetup feed', citation: 'Community RSVP feed · posted 9 min ago', blurb: 'A small local tabletop group opened guest seats for tonight.', price: 'RM20', when: 'Tonight 20:30', status: '10 seats', cta: 'Join meetup', reasons: ['Visitors are explicitly welcome', 'Matches your social discovery profile', 'Fourteen minutes from your hotel'] },
  { ...malaysia[1], id: 'vinyl', title: 'Hidden vinyl listening room in Bangsar', meta: 'Six guests · rare Malaysian pressings · 21:00', match: 91, source: 'Private listening club', citation: 'Member channel · shared 12 min ago', blurb: 'A private listening room opened six guest spots for a Malaysian jazz session.', price: 'RM45', when: 'Tonight 21:00', status: '6 spots', cta: 'Request a spot', reasons: ['Rare Malaysian jazz selected tonight', 'Intimate six-guest room', 'Fits your open late-evening slot'] },
  { ...malaysia[1], id: 'cocktail', title: 'Pandan cocktail lab behind an unmarked door', meta: 'Bukit Bintang · four bar seats · 22:30', match: 86, source: 'Bartender social post', citation: 'Bartender post · 7 min ago', blurb: 'A tiny experimental bar released four seats for its off-menu pandan tasting.', price: 'RM95', when: 'Tonight 22:30', status: '4 seats', cta: 'Hold a seat', reasons: ['Off-menu tasting announced minutes ago', 'Four counter seats keep it intimate', 'Inside your spontaneous budget'] },
  { ...malaysia[2], id: 'hike', title: 'Guided sunrise hike above Kuala Lumpur', meta: 'Small group · tomorrow 05:30 · transport included', match: 90, source: 'Local adventure guide', citation: 'Guide cancellation feed · 18 min ago', blurb: 'Two places opened on a guided sunrise ridge hike overlooking the city.', price: 'RM140', when: 'Tomorrow 05:30', status: '2 places', cta: 'Hold a place', reasons: ['High adventure match with a licensed guide', 'Transport and safety equipment included', 'Returns before your first booked plan'] },
  { ...malaysia[2], id: 'rafting', title: 'Last-minute white water rafting crew', meta: 'Kuala Kubu Bharu · tomorrow 08:00 · guide included', match: 93, source: 'Licensed rafting operator', citation: 'Operator availability · checked 5 min ago', blurb: 'A guided rafting crew has space after a last-minute cancellation.', price: 'RM220', when: 'Tomorrow 08:00', status: '3 places', cta: 'Hold a place', reasons: ['Your strongest adventure-profile match', 'Licensed guide and safety equipment included', 'A cancellation created three places moments ago'] },
];

export const cardsFor = (destination: Destination) => destination === 'lisbon'
  ? CARDS
  : destination === 'malaysia' ? malaysia.concat(underground)
  : CARDS.map((card, index) => ({ ...card, ...LOCAL_CARDS.texas[index] }));

export const TABS = [
  { label: 'Feed', icon: 'home' },
  { label: 'Explore', icon: 'compass' },
  { label: 'Trips', icon: 'van' },
  { label: 'Profile', icon: 'user' },
] as const;

export const SWARM = { scanned: '1,284', kept: 4, lastPoll: '38s ago' };

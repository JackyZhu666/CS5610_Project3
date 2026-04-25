const roots = [
  'Coconut', 'Silver', 'Red', 'Blue', 'Golden', 'Quiet', 'Brave', 'Hidden',
  'Lucky', 'Rapid', 'Crystal', 'Shadow', 'Bright', 'Velvet', 'Forest',
  'River', 'Mountain', 'Ocean', 'Puzzle', 'Logic', 'Neon', 'Cosmic',
  'Solar', 'Lunar', 'Cherry', 'Maple', 'Pine', 'Cloud', 'Storm', 'Flame',
  'Frost', 'Echo', 'Nova', 'Pixel', 'Ruby', 'Amber', 'Jade', 'Ivory',
  'Copper', 'Marble', 'Sapphire', 'Emerald', 'Coral', 'Cedar', 'Willow',
  'Lotus', 'Orchid', 'Bamboo', 'Comet', 'Galaxy', 'Orbit', 'Zen', 'Maze'
];

export const wordBank = Array.from({ length: 1200 }, (_, index) => {
  const root = roots[index % roots.length];
  const suffix = Math.floor(index / roots.length) + 1;
  return `${root}${suffix}`;
});

function pickRandomWord() {
  return wordBank[Math.floor(Math.random() * wordBank.length)];
}

export function generateGameName() {
  return `${pickRandomWord()} ${pickRandomWord()} ${pickRandomWord()}`;
}
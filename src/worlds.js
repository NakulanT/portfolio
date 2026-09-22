// The journey (stops) and each world's voice. Content itself stays in data.js; this file
// only decides how each world *tells* it: chapter names, numbering, labels and Bit's lines.
import { work } from './data';

export const STOPS = [
  { kind: 'hello' },
  { kind: 'stats' },
  { kind: 'principles' },
  ...work.map((item, n) => ({ kind: 'work', item, n })),
  { kind: 'projects' },
  { kind: 'stack' },
  { kind: 'timeline' },
  { kind: 'contact' },
];

export const WORLDS = [
  { id: 'neural', key: '1', name: 'Neural Lab', blurb: 'An RL agent walks a live value grid under a pulsing neural net.' },
  { id: 'arcade', key: '2', name: 'Arcade', blurb: 'A neon highway of arcade cabinets, one boss fight per project.' },
  { id: 'zen', key: '3', name: 'Zen', blurb: 'A path of torii and stone lanterns under falling sakura.' },
  { id: 'olympus', key: '4', name: 'Olympus', blurb: 'A marble agora where each labour sits on a golden solid.' },
  { id: 'cosmos', key: '5', name: 'Cosmos', blurb: 'A solar system where every project is a planet.' },
];
export const WORLD_BY_ID = Object.fromEntries(WORLDS.map((w) => [w.id, w]));

export const GATE_LINE = "Hi! I'm Bit, Nakulan's guide. This portfolio lives in five worlds: same story, five very different places. Pick one and I'll come along.";

const pad = (n, w = 2) => String(n).padStart(w, '0');
const kanji = (n) => {
  const d = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  if (n < 10) return d[n];
  return (n >= 20 ? d[Math.floor(n / 10)] : '') + '十' + d[n % 10];
};
const greek = (n) => {
  const ones = ['', 'Α', 'Β', 'Γ', 'Δ', 'Ε', 'Ϛ', 'Ζ', 'Η', 'Θ'];
  const tens = ['', 'Ι', 'Κ', 'Λ'];
  return tens[Math.floor(n / 10)] + ones[n % 10] + 'ʹ';
};

const fill = (s, t) => s.replace('{t}', t);

export const VOICE = {
  neural: {
    num: (n) => `ep_${pad(n)}`,
    rank: (i) => `r${i + 1}`,
    rail: { hello: 'init', stats: 'reward', principles: 'policy', work: 'episodes', projects: 'replay', stack: 'actions', timeline: 'trajectory', contact: 'terminal' },
    title: { stats: 'Reward signal', principles: 'Policy π', work: 'Episodes', projects: 'Replay buffer', stack: 'Action space', timeline: 'Trajectory', contact: 'Terminal state' },
    labels: { problem: 'state s', solution: 'action a', tags: 'policy π' },
    hello: { kicker: '> agent.reset()  // episode 0', hint: 'scroll ↓ to call step()' },
    contact: 'The episode ends here. Send a message and it starts again.',
    say: {
      hello: "Hi, I'm Bit. Think of me as the agent: every scroll is one step() through Nakulan's work.",
      stats: 'Reward so far. Real numbers only; I checked the logs.',
      principles: 'His policy, learned the hard way: problem first, whole experience, observable systems.',
      work: ['New goal state: {t}. Watch the value spread across the grid.', 'Reward found at {t}. Logging it.', 'Exploit mode: {t}. Worth a closer look.'],
      projects: 'The replay buffer: side projects he keeps learning from.',
      stack: 'Action space. Every move he can make.',
      timeline: 'Trajectory: how the agent got here.',
      contact: 'Terminal state. Say hi, or restart the episode in another world.',
    },
    nudge: (w) => `Psst: this exact story becomes ${w.name} in world ${w.key}. Tap it up top.`,
  },
  arcade: {
    num: (n) => `LEVEL ${n}`,
    rank: (i) => ['1ST', '2ND', '3RD', '4TH'][i],
    rail: { hello: 'START', stats: 'SCORES', principles: 'RULES', work: 'LEVELS', projects: 'BONUS', stack: 'ITEMS', timeline: 'SAVES', contact: 'CONTINUE' },
    title: { stats: 'High scores', principles: 'Rules of play', work: 'Levels', projects: 'Bonus stages', stack: 'Inventory', timeline: 'Save files', contact: 'Continue?' },
    labels: { problem: 'BOSS', solution: 'POWER-UP', tags: 'LOOT' },
    hello: { kicker: 'PLAYER 1 · INSERT COIN', hint: 'PRESS ↓ TO START' },
    contact: 'Game over? Never. Pick a controller below.',
    say: {
      hello: "PLAYER ONE READY! I'm Bit. Scroll to run the stages.",
      stats: 'HIGH SCORES! All legit, no cheat codes.',
      principles: 'House rules. Break them and the boss wins.',
      work: ['BOSS FIGHT: {t}!', 'LEVEL CLEAR: {t}. +1000 XP!', 'Stage unlocked: {t}. Go go go!'],
      projects: 'Bonus stages! Hidden levels he built for fun.',
      stack: 'Inventory check. Fully loaded.',
      timeline: 'Save files. Every checkpoint so far.',
      contact: 'CONTINUE? Send a message, or insert a coin into another world.',
    },
    nudge: (w) => `SECRET UNLOCKED: press ${w.key} for ${w.name}. Same game, new cartridge!`,
  },
  zen: {
    num: (n) => kanji(n),
    rank: (i) => kanji(i + 1),
    rail: { hello: '始 Begin', stats: '実 Harvest', principles: '心 Way', work: '仕 Works', projects: '道 Paths', stack: '具 Tools', timeline: '歩 Steps', contact: '縁 Connect' },
    title: { stats: '実り · Harvest', principles: '心得 · The way of working', work: '仕事 · Works', projects: '小道 · Side paths', stack: '道具 · Tools', timeline: '歩み · Footsteps', contact: '縁 · Connection' },
    labels: { problem: '問 · the question', solution: '答 · the answer', tags: '道具 · tools' },
    hello: { kicker: 'ようこそ · welcome, traveller', alt: 'ナクラン', hint: 'scroll gently to walk the path' },
    contact: 'The path ends where a conversation begins.',
    say: {
      hello: 'Welcome, traveller. I am Bit. Walk slowly; each gate holds one story.',
      stats: 'Small harvests, honestly counted.',
      principles: 'Three quiet rules he returns to.',
      work: ['Here, beneath this gate: {t}.', 'Pause a moment. {t}.', 'A lantern lit for {t}.'],
      projects: 'Side paths, walked for curiosity.',
      stack: 'The tools, kept clean and ready.',
      timeline: 'Footsteps, one after another.',
      contact: 'The path ends where a conversation begins.',
    },
    nudge: (w) => `The same path looks very different in ${w.name}. Press ${w.key} whenever you wish.`,
  },
  olympus: {
    num: (n) => greek(n),
    rank: (i) => greek(i + 1),
    rail: { hello: 'Prologue', stats: 'Honours', principles: 'Maxims', work: 'Labours', projects: 'Minor labours', stack: 'Armoury', timeline: 'Chronicle', contact: 'Oracle' },
    title: { stats: 'The Honours', principles: 'The Three Maxims', work: 'The Labours', projects: 'The Minor Labours', stack: 'The Armoury', timeline: 'The Chronicle', contact: 'The Oracle' },
    labels: { problem: 'The trial', solution: 'The labour', tags: 'The instruments' },
    hello: { kicker: 'Chaire · Hail, traveller', hint: 'Descend, and the agora will open' },
    contact: 'The oracle answers every message. Choose your offering.',
    say: {
      hello: 'Hail! I am Bit, herald of this agora. Every plinth honours one labour.',
      stats: 'Honours earned, carved in marble. Nothing embellished.',
      principles: 'Three maxims, as the oracle would say them.',
      work: ['Behold the labour: {t}.', 'Upon this plinth: {t}.', 'Let the chroniclers record {t}.'],
      projects: 'The minor labours, lesser only in size.',
      stack: 'The armoury of a modern engineer.',
      timeline: 'The chronicle, from the academy to Grootan.',
      contact: 'Consult the oracle. It answers email.',
    },
    nudge: (w) => `Mortals may also visit ${w.name}. Press ${w.key}, or choose it above.`,
  },
  cosmos: {
    num: (n) => `NK-${pad(n, 3)}`,
    rank: (i) => `CH-${i + 1}`,
    rail: { hello: 'Launch', stats: 'Telemetry', principles: 'Flight rules', work: 'Planets', projects: 'Outposts', stack: 'Payload', timeline: 'Flight log', contact: 'Channel' },
    title: { stats: 'Telemetry', principles: 'Flight rules', work: 'Planets', projects: 'Moons & outposts', stack: 'Payload bay', timeline: 'Flight log', contact: 'Open channel' },
    labels: { problem: 'Anomaly', solution: 'Mission', tags: 'Payload' },
    hello: { kicker: 'TRANSMISSION · INBOUND', hint: 'scroll to engage thrusters' },
    contact: 'Channel open. Pick a frequency.',
    say: {
      hello: "Transmission received. I'm Bit, your navigator. Each planet is a mission.",
      stats: 'Telemetry is nominal. Real readings.',
      principles: 'Flight rules. Non-negotiable in deep space.',
      work: ['Approaching planet {t}.', 'Entering orbit: {t}.', 'Signal locked on {t}.'],
      projects: 'Moons and outposts: smaller worlds, same care.',
      stack: 'Payload bay. Everything on board.',
      timeline: 'Flight log, from launch to now.',
      contact: 'Open channel. Hail him, or warp to another world.',
    },
    nudge: (w) => `Warp route found: ${w.name}, key ${w.key}.`,
  },
};

export function lineFor(world, i, switched) {
  const V = VOICE[world];
  const s = STOPS[i];
  if (!switched && (i === 2 || i === 7 || i === 12)) {
    const idx = WORLDS.findIndex((w) => w.id === world);
    return V.nudge(WORLDS[(idx + 2) % WORLDS.length]);
  }
  if (s.kind === 'work') return fill(V.say.work[s.n % V.say.work.length], s.item.title);
  return V.say[s.kind];
}

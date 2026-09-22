// Tiny reinforcement-learning engine used by the Arena: a grid world and a tabular Q-learning agent.
// Pure JavaScript with no dependencies, so it can be tested outside the browser.

export const ACTIONS = [
  { dx: 0, dz: -1, name: 'up' },
  { dx: 1, dz: 0, name: 'right' },
  { dx: 0, dz: 1, name: 'down' },
  { dx: -1, dz: 0, name: 'left' },
];
export const EMPTY = 0;
export const WALL = 1;
export const PIT = 2;

export const REWARD = { goal: 1, pit: -1, step: -0.04, bump: -0.3 };

export class GridEnv {
  constructor(n = 8) {
    this.n = n;
    this.reset();
  }

  reset() {
    const n = this.n;
    this.cells = new Uint8Array(n * n);
    this.start = (n - 1) * n; // bottom-left
    this.goal = n - 1; // top-right
    const set = (x, z, v) => { this.cells[z * n + x] = v; };
    [[3, 1], [3, 2], [3, 3], [3, 4], [5, 3], [5, 4], [5, 5], [5, 6], [1, 4], [2, 4]].forEach(([x, z]) => set(x, z, WALL));
    [[2, 6], [4, 2], [6, 4]].forEach(([x, z]) => set(x, z, PIT));
  }

  xy(s) { return [s % this.n, Math.floor(s / this.n)]; }

  step(s, a) {
    const n = this.n;
    const [x, z] = this.xy(s);
    const nx = x + ACTIONS[a].dx;
    const nz = z + ACTIONS[a].dz;
    if (nx < 0 || nx >= n || nz < 0 || nz >= n || this.cells[nz * n + nx] === WALL) {
      return { s2: s, r: REWARD.bump, done: false, bump: true };
    }
    const s2 = nz * n + nx;
    if (s2 === this.goal) return { s2, r: REWARD.goal, done: true, win: true };
    if (this.cells[s2] === PIT) return { s2, r: REWARD.pit, done: true, fell: true };
    return { s2, r: REWARD.step, done: false };
  }

  // Can the agent reach the goal at all? Pits end the episode, so they cannot be crossed.
  reachable() {
    const n = this.n;
    const seen = new Uint8Array(n * n);
    const queue = [this.start];
    seen[this.start] = 1;
    while (queue.length) {
      const s = queue.shift();
      if (s === this.goal) return true;
      const [x, z] = this.xy(s);
      for (const { dx, dz } of ACTIONS) {
        const nx = x + dx; const nz = z + dz;
        if (nx < 0 || nx >= n || nz < 0 || nz >= n) continue;
        const t = nz * n + nx;
        if (seen[t] || this.cells[t] !== EMPTY && t !== this.goal) continue;
        seen[t] = 1;
        queue.push(t);
      }
    }
    return false;
  }

  // Length of the shortest safe route (breadth-first search), or -1 when there is none.
  shortest() {
    const n = this.n;
    const dist = new Int16Array(n * n).fill(-1);
    dist[this.start] = 0;
    const queue = [this.start];
    while (queue.length) {
      const s = queue.shift();
      if (s === this.goal) return dist[s];
      const [x, z] = this.xy(s);
      for (const { dx, dz } of ACTIONS) {
        const nx = x + dx; const nz = z + dz;
        if (nx < 0 || nx >= n || nz < 0 || nz >= n) continue;
        const t = nz * n + nx;
        if (dist[t] !== -1 || (this.cells[t] !== EMPTY && t !== this.goal)) continue;
        dist[t] = dist[s] + 1;
        queue.push(t);
      }
    }
    return -1;
  }

  countOf(kind) {
    let c = 0;
    for (let i = 0; i < this.cells.length; i += 1) if (this.cells[i] === kind) c += 1;
    return c;
  }
}

export class QAgent {
  constructor(n, { alpha = 0.5, gamma = 0.95 } = {}) {
    this.n = n;
    this.alpha = alpha;
    this.gamma = gamma;
    this.q = new Float32Array(n * n * 4);
  }

  reset() { this.q.fill(0); }

  maxQ(s) {
    const o = s * 4;
    return Math.max(this.q[o], this.q[o + 1], this.q[o + 2], this.q[o + 3]);
  }

  // Best action; ties are broken at random so an untrained agent wanders.
  best(s, rng = Math.random) {
    const o = s * 4;
    const m = this.maxQ(s);
    const ties = [];
    for (let a = 0; a < 4; a += 1) if (this.q[o + a] === m) ties.push(a);
    return ties[Math.floor(rng() * ties.length)];
  }

  act(s, epsilon, rng = Math.random) {
    return rng() < epsilon ? Math.floor(rng() * 4) : this.best(s, rng);
  }

  learn(s, a, r, s2, done) {
    const target = r + (done ? 0 : this.gamma * this.maxQ(s2));
    const i = s * 4 + a;
    this.q[i] += this.alpha * (target - this.q[i]);
  }
}

export class Trainer {
  constructor(env, agent, { maxSteps = 80 } = {}) {
    this.env = env;
    this.agent = agent;
    this.maxSteps = maxSteps;
    this.epsMin = 0.04;
    this.decay = 0.99;
    this.resetAll();
  }

  resetAll() {
    this.agent.reset();
    this.eps = 1;
    this.episode = 0;
    this.s = this.env.start;
    this.steps = 0;
    this.ret = 0;
    this.returns = [];
    this.wins = [];
  }

  // Called when the visitor edits the world: the agent must adapt, so exploration comes back.
  bumpEpsilon(v = 0.35) { this.eps = Math.max(this.eps, v); }

  step() {
    const { env, agent } = this;
    const from = this.s;
    const a = agent.act(from, this.eps);
    const res = env.step(from, a);
    agent.learn(from, a, res.r, res.s2, res.done);
    this.s = res.s2;
    this.steps += 1;
    this.ret += res.r;
    const end = res.done || this.steps >= this.maxSteps;
    const ev = { from, to: res.s2, action: a, reward: res.r, bump: !!res.bump, win: !!res.win, fell: !!res.fell, end };
    if (end) {
      this.returns.push(this.ret);
      this.wins.push(res.win ? 1 : 0);
      if (this.returns.length > 200) { this.returns.shift(); this.wins.shift(); }
      this.episode += 1;
      this.eps = Math.max(this.epsMin, this.eps * this.decay);
      this.s = env.start;
      this.steps = 0;
      this.ret = 0;
    }
    return ev;
  }

  successRate(window = 30) {
    const w = this.wins.slice(-window);
    return w.length ? w.reduce((a, b) => a + b, 0) / w.length : 0;
  }

  // Follow the greedy policy from the start; report the route if it reaches the goal.
  greedyRoute() {
    const { env, agent } = this;
    let s = env.start;
    const path = [s];
    const seen = new Set([s]);
    for (let i = 0; i < this.maxSteps; i += 1) {
      const o = s * 4;
      if (agent.maxQ(s) === 0 && agent.q[o] === 0 && agent.q[o + 1] === 0 && agent.q[o + 2] === 0 && agent.q[o + 3] === 0) return { success: false, path };
      const a = agent.best(s, () => 0);
      const res = env.step(s, a);
      s = res.s2;
      path.push(s);
      if (res.win) return { success: true, path };
      if (res.done || seen.has(s)) return { success: false, path };
      seen.add(s);
    }
    return { success: false, path };
  }
}

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{ seed?: number }>(),
  { seed: 0x1a2b3c4d },
)

// ── Config ───────────────────────────────────────────────────────────────────
const PARTICLE_COUNT_START          = 60
const MAX_ORGANISMS                 = 130
const MAX_FOOD                      = 160
const START_ENERGY                  = 0.72
const ENERGY_DECAY_RATE             = 0.00055
const FOOD_ENERGY_GAIN              = 0.38
const REPRODUCTION_ENERGY_THRESHOLD = 1.65
const DEATH_FADE_SPEED              = 0.013
const FOOD_SPAWN_INTERVAL_MS        = 750
const FOOD_BURST_MIN_MS             = 1000  // burst every 1–5 s
const FOOD_BURST_MAX_MS             = 5000
const FOOD_BURST_COUNT_MIN          = 8
const FOOD_BURST_COUNT_MAX          = 22
const ATTRACTION_RADIUS_SQ          = 0.079  // ~0.28 units
const REPULSION_RADIUS_SQ           = 0.003  // ~0.055 units
const ATTRACTION_FORCE              = 0.0005
const REPULSION_FORCE               = 0.0012
const WANDER_FORCE                  = 0.00018
const VELOCITY_DAMPING              = 0.965
const MAX_SPEED                     = 0.0035
const EAT_RADIUS_SQ                 = 0.00026 // ~0.016 units
const MOUSE_ATTRACTION_FORCE        = 0.00042
const SAME_TYPE_ATTRACTION_FORCE     = 0.000065
const SAME_TYPE_ATTRACTION_RADIUS_SQ = 0.0225  // ~0.15 units
const PREDATOR_COUNT_START           = 3
const MAX_PREDATORS                  = 10
const HUNT_RADIUS_SQ                 = 0.12    // ~0.35 units
const HUNT_FORCE                     = 0.00082 // slightly faster than prey flee
const KILL_RADIUS_SQ                 = 0.0028  // ~0.053 units — above repulsion radius (0.055)
const PREY_ENERGY_GAIN               = 0.75
const FLEE_RADIUS_SQ                 = 0.018   // ~0.13 units — prey notices earlier
const FLEE_FORCE                     = 0.00075 // prey can nearly match predator
const ALIGNMENT_RADIUS_SQ           = 0.04    // ~0.20 units
const ALIGNMENT_FORCE                = 0.00010
const STARVATION_TICKS              = 600   // ~10 s at 60 fps
const SPEED_ENERGY_COST             = 0.10  // reduced — speed isn't as punishing
const GLOW_STRENGTH                 = 2.4
const TRAIL_STRENGTH                = 0.87
const GLOBAL_ALPHA                  = 0.94
const MAX_DPR                       = 2
const BG                            = [0.005, 0.007, 0.014] as const

// ── Types ────────────────────────────────────────────────────────────────────
type OrgType = 0 | 1 | 2  // 0=cyan prey, 1=violet prey, 2=predator

interface Organism {
  x: number; y: number
  vx: number; vy: number
  energy: number
  type: OrgType
  alive: boolean
  alpha: number
  ticksSinceEat: number
  // Heritable traits — evolve via natural selection in both predators and prey
  speedMult: number   // scales MAX_SPEED for all; predators: also scales base decay
  huntMult: number    // predators: scales HUNT_FORCE + KILL_RADIUS; prey: scales FLEE_FORCE
  killCooldown: number // predators only: ticks until next kill is allowed
}

interface FoodParticle {
  x: number; y: number
  alpha: number
  active: boolean
}

interface Spark {
  x: number; y: number
  vx: number; vy: number
  alpha: number
  ptype: number  // 0=amber kill, 1=cyan birth, 2=violet birth, 3=red predator death
}

const MAX_SPARKS = 120

// ── PRNG ─────────────────────────────────────────────────────────────────────
function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// ── Component ────────────────────────────────────────────────────────────────
const canvas = ref<HTMLCanvasElement | null>(null)

interface Sim {
  destroy: () => void
  reseed: (s: number) => void
  pause: () => void
  resume: () => void
}

let sim: Sim | null = null

const { register, unregister, isActive } = useAnimationManager()
const ecoActive = isActive('eco')

onMounted(() => {
  if (!canvas.value) return
  sim = createSim(canvas.value)
  register('eco', 'Particle Ecosystem')
  if (!ecoActive.value) sim.pause()
})

watch(ecoActive, (active) => {
  if (!sim) return
  active ? sim.resume() : sim.pause()
})

watch(() => props.seed, s => sim?.reseed(s))

onBeforeUnmount(() => {
  sim?.destroy()
  sim = null
  unregister('eco')
})

// ── WebGL helpers ─────────────────────────────────────────────────────────────
function compileShader(gl: WebGL2RenderingContext, type: number, src: string): WebGLShader {
  const s = gl.createShader(type)!
  gl.shaderSource(s, src); gl.compileShader(s)
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(s); gl.deleteShader(s)
    throw new Error(`Shader: ${log}`)
  }
  return s
}

function buildProg(gl: WebGL2RenderingContext, vs: string, fs: string): WebGLProgram {
  const p = gl.createProgram()!
  gl.attachShader(p, compileShader(gl, gl.VERTEX_SHADER, vs))
  gl.attachShader(p, compileShader(gl, gl.FRAGMENT_SHADER, fs))
  gl.linkProgram(p)
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(p); gl.deleteProgram(p)
    throw new Error(`Program: ${log}`)
  }
  return p
}

// ── Simulation ────────────────────────────────────────────────────────────────
function createSim(el: HTMLCanvasElement): Sim {
  const gl = el.getContext('webgl2', { antialias: false, alpha: false, powerPreference: 'high-performance' })
  if (!gl) return { destroy: () => {}, reseed: () => {}, pause: () => {}, resume: () => {} }

  // Enable float FBO for HDR accumulation (no clipping on bright particles)
  gl.getExtension('EXT_color_buffer_float')

  // ── Shaders ──────────────────────────────────────────────────────────────────
  const quadVS = /* glsl */`#version 300 es
    layout(location=0) in vec2 a_pos;
    out vec2 v_uv;
    void main() { v_uv = a_pos * 0.5 + 0.5; gl_Position = vec4(a_pos, 0.0, 1.0); }
  `

  const decayFS = /* glsl */`#version 300 es
    precision highp float;
    in vec2 v_uv; out vec4 o;
    uniform sampler2D u_prev;
    uniform float u_trail;
    uniform vec3 u_bg;
    void main() {
      vec3 prev = texture(u_prev, v_uv).rgb;
      o = vec4(mix(u_bg, prev, u_trail), 1.0);
    }
  `

  const particleVS = /* glsl */`#version 300 es
    layout(location=0) in vec2 a_pos;
    layout(location=1) in float a_energy;
    layout(location=2) in float a_ptype;
    layout(location=3) in float a_alpha;
    layout(location=4) in float a_trait;
    out float v_energy; out float v_ptype; out float v_alpha; out float v_trait;
    uniform float u_glow;
    uniform vec2 u_canvas;
    void main() {
      vec2 clip = a_pos * 2.0 - 1.0; clip.y = -clip.y;
      gl_Position = vec4(clip, 0.0, 1.0);
      float minDim = min(u_canvas.x, u_canvas.y);
      float sz;
      if (a_ptype < 0.5) {
        sz = minDim * 0.024;
      } else {
        // Evolved organisms (high trait) grow slightly larger — visible adaptation
        float baseScale = (a_ptype > 2.5) ? 1.6 : 1.0;
        float evoScale  = 1.0 + a_trait * 0.25;
        sz = minDim * (0.02 + a_energy * 0.036) * (0.65 + u_glow * 0.35) * baseScale * evoScale;
      }
      gl_PointSize = max(1.0, sz * a_alpha);
      v_energy = a_energy; v_ptype = a_ptype; v_alpha = a_alpha; v_trait = a_trait;
    }
  `

  const particleFS = /* glsl */`#version 300 es
    precision highp float;
    in float v_energy; in float v_ptype; in float v_alpha; in float v_trait;
    out vec4 o;
    void main() {
      vec2 uv = gl_PointCoord - 0.5;
      float dist = length(uv) * 2.0;
      if (dist > 1.0) discard;

      float core   = smoothstep(0.45, 0.0, dist);
      float bloom  = exp(-dist * dist * 2.2);
      float intens = core * 0.55 + bloom * 0.55;

      vec3 color;
      if (v_ptype < 0.5) {
        // food / kill spark: warm amber
        color  = vec3(0.98, 0.65, 0.08);
        intens *= 0.65;
      } else if (v_ptype < 1.5) {
        // cyan prey: evolves toward bright electric white-blue
        color = mix(vec3(0.07, 0.70, 0.84), vec3(0.40, 0.92, 1.00), v_trait * 0.85);
      } else if (v_ptype < 2.5) {
        // violet prey: evolves toward bright pink-white
        color = mix(vec3(0.48, 0.17, 0.90), vec3(0.80, 0.50, 1.00), v_trait * 0.85);
      } else {
        // predator: evolves from deep red toward hot orange
        color = mix(vec3(0.95, 0.18, 0.04), vec3(1.00, 0.58, 0.00), v_trait * 0.90);
      }

      if (v_ptype >= 0.5) {
        float vit = 0.20 + v_energy * 0.80;
        color *= vit;
        // bright white hot-spot at core for high-energy evolved organisms
        color += vec3(0.25 + v_trait * 0.15) * max(0.0, v_energy - 0.55) * core;
      }

      float a = intens * v_alpha * 0.36;
      o = vec4(color * a, a);
    }
  `

  const screenFS = /* glsl */`#version 300 es
    precision highp float;
    in vec2 v_uv; out vec4 o;
    uniform sampler2D u_tex;
    uniform float u_alpha;
    void main() {
      vec3 c = texture(u_tex, v_uv).rgb;
      c = c / (c + vec3(0.42));           // Reinhard tonemap
      // Radial vignette — darkens edges, focuses eye on center
      vec2  cv   = v_uv - 0.5;
      float vign = 1.0 - smoothstep(0.28, 0.72, length(cv) * 1.75);
      c *= 0.55 + 0.45 * vign;
      o = vec4(c * u_alpha, 1.0);
    }
  `

  const decayProg = buildProg(gl, quadVS, decayFS)
  const pProg     = buildProg(gl, particleVS, particleFS)
  const sProg     = buildProg(gl, quadVS, screenFS)

  // ── Quad VAO (fullscreen triangle) ──────────────────────────────────────────
  const quadVAO = gl.createVertexArray()!
  gl.bindVertexArray(quadVAO)
  const quadBuf = gl.createBuffer()!
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  gl.enableVertexAttribArray(0)
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)

  // ── Particle VAO ─────────────────────────────────────────────────────────────
  const MAX_PTS    = MAX_ORGANISMS + MAX_PREDATORS + MAX_FOOD + MAX_SPARKS
  const STRIDE_F   = 6           // floats per particle: x y energy ptype alpha trait
  const ptData     = new Float32Array(MAX_PTS * STRIDE_F)

  const ptVAO = gl.createVertexArray()!
  gl.bindVertexArray(ptVAO)
  const ptBuf = gl.createBuffer()!
  gl.bindBuffer(gl.ARRAY_BUFFER, ptBuf)
  gl.bufferData(gl.ARRAY_BUFFER, ptData.byteLength, gl.DYNAMIC_DRAW)
  const S4 = STRIDE_F * 4
  gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, S4, 0)
  gl.enableVertexAttribArray(1); gl.vertexAttribPointer(1, 1, gl.FLOAT, false, S4, 8)
  gl.enableVertexAttribArray(2); gl.vertexAttribPointer(2, 1, gl.FLOAT, false, S4, 12)
  gl.enableVertexAttribArray(3); gl.vertexAttribPointer(3, 1, gl.FLOAT, false, S4, 16)
  gl.enableVertexAttribArray(4); gl.vertexAttribPointer(4, 1, gl.FLOAT, false, S4, 20)
  gl.bindVertexArray(null)

  // ── Uniforms ─────────────────────────────────────────────────────────────────
  const uPrev   = gl.getUniformLocation(decayProg, 'u_prev')
  const uTrail  = gl.getUniformLocation(decayProg, 'u_trail')
  const uBg     = gl.getUniformLocation(decayProg, 'u_bg')
  const uGlow   = gl.getUniformLocation(pProg, 'u_glow')
  const uCanvas = gl.getUniformLocation(pProg, 'u_canvas')
  const uTex    = gl.getUniformLocation(sProg, 'u_tex')
  const uAlpha  = gl.getUniformLocation(sProg, 'u_alpha')

  // ── FBOs ─────────────────────────────────────────────────────────────────────
  let texs: WebGLTexture[]       = []
  let fbs:  WebGLFramebuffer[]   = []
  let front = 0
  let fbW = 1; let fbH = 1

  function createFBOs(w: number, h: number): void {
    texs.forEach(t => gl.deleteTexture(t))
    fbs.forEach(f => gl.deleteFramebuffer(f))
    texs = []; fbs = []
    for (let i = 0; i < 2; i++) {
      const tex = gl.createTexture()!
      gl.bindTexture(gl.TEXTURE_2D, tex)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.HALF_FLOAT, null)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      const fb = gl.createFramebuffer()!
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb)
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0)
      texs.push(tex); fbs.push(fb)
    }
    // Clear both FBOs to background
    for (let i = 0; i < 2; i++) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbs[i])
      gl.clearColor(BG[0], BG[1], BG[2], 1.0)
      gl.clear(gl.COLOR_BUFFER_BIT)
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    fbW = w; fbH = h
  }

  // ── Mouse tracking ────────────────────────────────────────────────────────────
  let mouseX = -1
  let mouseY = -1

  function onMouseMove(e: MouseEvent): void {
    const r = el.getBoundingClientRect()
    mouseX = (e.clientX - r.left) / r.width
    mouseY = (e.clientY - r.top) / r.height
  }
  function onMouseLeave(): void { mouseX = -1; mouseY = -1 }

  function onMouseDown(e: MouseEvent): void {
    if (e.button !== 0 && e.button !== 2) return
    e.preventDefault()
    const r  = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top)  / r.height
    const x  = Math.max(0.01, Math.min(0.99, px))
    const y  = Math.max(0.01, Math.min(0.99, py))

    if (e.button === 2) {
      // Right-click: spawn predator
      if (orgs.filter(o => o.alive && o.type === 2).length >= MAX_PREDATORS) return
      const p: Organism = {
        x, y, vx: (rng() - 0.5) * MAX_SPEED, vy: (rng() - 0.5) * MAX_SPEED,
        energy: START_ENERGY, type: 2, alive: true, alpha: 1,
        ticksSinceEat: 0, speedMult: 1, huntMult: 1, killCooldown: 0,
      }
      const slot = orgs.find(o => !o.alive && o.alpha <= 0)
      if (slot) Object.assign(slot, p); else orgs.push(p)
    } else {
      // Left-click: spawn prey (alternates cyan/violet)
      if (orgs.filter(o => o.alive && o.type < 2).length >= MAX_ORGANISMS) return
      const type = (orgs.filter(o => o.type === 0).length <= orgs.filter(o => o.type === 1).length ? 0 : 1) as OrgType
      const p: Organism = {
        x, y, vx: (rng() - 0.5) * MAX_SPEED, vy: (rng() - 0.5) * MAX_SPEED,
        energy: START_ENERGY, type, alive: true, alpha: 1,
        ticksSinceEat: 0, speedMult: 1, huntMult: 1, killCooldown: 0,
      }
      const slot = orgs.find(o => !o.alive && o.alpha <= 0)
      if (slot) Object.assign(slot, p); else orgs.push(p)
    }
  }

  el.addEventListener('mousemove', onMouseMove)
  el.addEventListener('mouseleave', onMouseLeave)
  el.addEventListener('mousedown', onMouseDown)
  el.addEventListener('contextmenu', (e) => e.preventDefault())

  // ── CPU Simulation state ──────────────────────────────────────────────────────
  let orgs:   Organism[]     = []
  let food:   FoodParticle[] = []
  let sparks: Spark[]        = []
  let rng = mulberry32(props.seed)

  function initState(seed: number): void {
    rng = mulberry32(seed)
    orgs = []; food = []; sparks = []
    for (let i = 0; i < PARTICLE_COUNT_START; i++) {
      orgs.push({
        x: rng(), y: rng(),
        vx: (rng() - 0.5) * MAX_SPEED * 0.4,
        vy: (rng() - 0.5) * MAX_SPEED * 0.4,
        energy: START_ENERGY * (0.6 + rng() * 0.4),
        type: (i % 2) as OrgType,
        alive: true, alpha: 1,
        ticksSinceEat: Math.floor(rng() * 200),
        speedMult: 1, huntMult: 1, killCooldown: 0,
      })
    }
    for (let i = 0; i < PREDATOR_COUNT_START; i++) {
      orgs.push({
        x: rng(), y: rng(),
        vx: (rng() - 0.5) * MAX_SPEED * 0.3,
        vy: (rng() - 0.5) * MAX_SPEED * 0.3,
        energy: START_ENERGY * (0.7 + rng() * 0.3),
        type: 2,
        alive: true, alpha: 1,
        ticksSinceEat: Math.floor(rng() * 150),
        speedMult: 1, huntMult: 1, killCooldown: 0,
      })
    }
    const initFood = Math.floor(MAX_FOOD * 0.35)
    for (let i = 0; i < initFood; i++) {
      food.push({ x: rng(), y: rng(), alpha: 1, active: true })
    }
  }

  function trySpawnFood(): void {
    const active = food.filter(f => f.active).length
    if (active >= MAX_FOOD) return
    const slot = food.find(f => !f.active && f.alpha <= 0)
    const nf = { x: rng(), y: rng(), alpha: 0, active: true }
    if (slot) { slot.x = nf.x; slot.y = nf.y; slot.alpha = 0; slot.active = true }
    else if (food.length < MAX_FOOD) food.push(nf)
  }

  function trySpawnChild(parent: Organism): void {
    const alive = orgs.filter(o => o.alive)
    if (parent.type === 2) {
      if (alive.filter(o => o.type === 2).length >= MAX_PREDATORS) return
    } else {
      if (alive.filter(o => o.type < 2).length >= MAX_ORGANISMS) return
    }
    const angle = rng() * Math.PI * 2
    const d = 0.018 + rng() * 0.022
    const mutate = (v: number) => Math.max(0.5, Math.min(3.0, v * (0.92 + rng() * 0.16)))
    const child: Organism = {
      x: Math.max(0.01, Math.min(0.99, parent.x + Math.cos(angle) * d)),
      y: Math.max(0.01, Math.min(0.99, parent.y + Math.sin(angle) * d)),
      vx: parent.vx * 0.4 + (rng() - 0.5) * MAX_SPEED * 0.3,
      vy: parent.vy * 0.4 + (rng() - 0.5) * MAX_SPEED * 0.3,
      energy: parent.energy * 0.44,
      type: parent.type,
      alive: true, alpha: 1,
      ticksSinceEat: 0,
      speedMult:    mutate(parent.speedMult),
      huntMult:     mutate(parent.huntMult),
      killCooldown: 0,
    }
    parent.energy *= 0.44
    const slot = orgs.find(o => !o.alive && o.alpha <= 0)
    if (slot) Object.assign(slot, child)
    else orgs.push(child)
  }

  // Adaptive balance: scales hunt effectiveness based on predator/prey ratio
  // Target ratio ~1:12; slow EMA (~5 s) prevents oscillation
  let balanceScale = 1.0

  function stepSim(): void {
    // Update balance scale — target 1 predator per 12 prey
    const nPrey  = orgs.filter(o => o.alive && o.type < 2).length
    const nPred  = orgs.filter(o => o.alive && o.type === 2).length
    const ratio  = nPred / Math.max(nPrey, 1)
    const target = Math.max(0.25, Math.min(2.5, 0.083 / Math.max(ratio, 0.004)))
    balanceScale = balanceScale * 0.988 + target * 0.012  // EMA τ ≈ 80 ticks / ~1.3 s

    // Advance and fade sparks
    for (const s of sparks) {
      s.x += s.vx; s.y += s.vy
      s.vx *= 0.88; s.vy *= 0.88
      s.alpha -= 0.055
    }
    if (sparks.length > MAX_SPARKS) sparks = sparks.filter(s => s.alpha > 0)

    // Fade in spawned food, fade out eaten food
    for (const f of food) {
      if (f.active && f.alpha < 1) f.alpha = Math.min(1, f.alpha + 0.04)
      else if (!f.active && f.alpha > 0) f.alpha = Math.max(0, f.alpha - 0.07)
    }

    const activeFood = food.filter(f => f.active)

    for (const org of orgs) {
      if (!org.alive) {
        org.alpha = Math.max(0, org.alpha - DEATH_FADE_SPEED)
        continue
      }

      // Wander force
      let fx = (rng() - 0.5) * WANDER_FORCE * 2
      let fy = (rng() - 0.5) * WANDER_FORCE * 2

      // Mouse attraction
      if (mouseX >= 0) {
        let mdx = mouseX - org.x; let mdy = mouseY - org.y
        const md = Math.hypot(mdx, mdy) + 0.1
        fx += (mdx / md) * MOUSE_ATTRACTION_FORCE
        fy += (mdy / md) * MOUSE_ATTRACTION_FORCE
      }

      // Food attraction (prey only)
      if (org.type < 2) {
        let bestD2 = ATTRACTION_RADIUS_SQ
        let bx = 0; let by = 0; let hasFood = false
        for (const f of activeFood) {
          if (!f.active) continue
          const dx = f.x - org.x; const dy = f.y - org.y
          const d2 = dx * dx + dy * dy
          if (d2 < bestD2) { bestD2 = d2; bx = dx; by = dy; hasFood = true }
        }
        if (hasFood) {
          const d = Math.sqrt(bestD2) + 1e-4
          fx += (bx / d) * ATTRACTION_FORCE
          fy += (by / d) * ATTRACTION_FORCE
        }
      }

      // Organism interactions: repulsion, same-type cohesion, boids alignment, flee/hunt
      let alignVx = 0; let alignVy = 0; let alignN = 0
      let huntD2 = HUNT_RADIUS_SQ; let hx = 0; let hy = 0; let hasPrey = false

      for (const other of orgs) {
        if (other === org || !other.alive) continue
        const dx = org.x - other.x; const dy = org.y - other.y
        const d2 = dx * dx + dy * dy

        if (d2 < REPULSION_RADIUS_SQ && d2 > 1e-8 && other.type === org.type) {
          // Same-type close-range repulsion only — predator↔prey must not repel each other
          const d = Math.sqrt(d2)
          fx += (dx / d) * (REPULSION_FORCE / (d2 + 1e-4))
          fy += (dy / d) * (REPULSION_FORCE / (d2 + 1e-4))
        } else if (org.type < 2 && other.type === org.type && d2 < SAME_TYPE_ATTRACTION_RADIUS_SQ) {
          // Prey cohesion toward same type
          const d = Math.sqrt(d2)
          fx -= (dx / d) * SAME_TYPE_ATTRACTION_FORCE
          fy -= (dy / d) * SAME_TYPE_ATTRACTION_FORCE
          // Boids: accumulate neighbours' velocity for alignment
          if (d2 < ALIGNMENT_RADIUS_SQ) {
            alignVx += other.vx; alignVy += other.vy; alignN++
          }
        } else if (org.type < 2 && other.type === 2 && d2 < FLEE_RADIUS_SQ) {
          const d = Math.sqrt(d2)
          const mag = FLEE_FORCE * org.huntMult * (1 - d / Math.sqrt(FLEE_RADIUS_SQ))
          fx += (dx / d) * mag; fy += (dy / d) * mag
        } else if (org.type === 2 && other.type < 2 && d2 < huntD2) {
          // Predator tracks nearest prey
          huntD2 = d2; hx = -dx; hy = -dy; hasPrey = true
        }
      }

      // Apply boids alignment (prey only)
      if (alignN > 0) {
        const avgSpd = Math.hypot(alignVx / alignN, alignVy / alignN)
        if (avgSpd > 1e-5) {
          fx += (alignVx / alignN / avgSpd) * ALIGNMENT_FORCE
          fy += (alignVy / alignN / avgSpd) * ALIGNMENT_FORCE
        }
      }

      // Apply hunt force (predator only) — scaled by adaptive balance
      if (hasPrey) {
        const d = Math.sqrt(huntD2) + 1e-4
        const dynHunt = HUNT_FORCE * balanceScale * org.huntMult
        fx += (hx / d) * dynHunt; fy += (hy / d) * dynHunt
      }

      // Integrate
      org.vx = (org.vx + fx) * VELOCITY_DAMPING
      org.vy = (org.vy + fy) * VELOCITY_DAMPING
      const spd = Math.hypot(org.vx, org.vy)
      const maxSpd = MAX_SPEED * org.speedMult
      if (spd > maxSpd) { org.vx = org.vx / spd * maxSpd; org.vy = org.vy / spd * maxSpd }
      org.x += org.vx
      org.y += org.vy
      if (org.x < 0)      { org.x = 0;   org.vx =  Math.abs(org.vx) * 0.6 }
      else if (org.x > 1) { org.x = 1;   org.vx = -Math.abs(org.vx) * 0.6 }
      if (org.y < 0)      { org.y = 0;   org.vy =  Math.abs(org.vy) * 0.6 }
      else if (org.y > 1) { org.y = 1;   org.vy = -Math.abs(org.vy) * 0.6 }

      // Energy decay — predators burn 1.8× faster; speed adds extra cost
      // Higher speedMult = more base energy cost; predators pay extra 1.3× on top
      const decayRate = ENERGY_DECAY_RATE * org.speedMult * (org.type === 2 ? 1.3 : 1.0) + spd * SPEED_ENERGY_COST
      org.energy -= decayRate
      org.ticksSinceEat++

      // Prey eat food
      if (org.type < 2) {
        for (const f of activeFood) {
          if (!f.active) continue
          const dx = f.x - org.x; const dy = f.y - org.y
          if (dx * dx + dy * dy < EAT_RADIUS_SQ) {
            org.energy = Math.min(2, org.energy + FOOD_ENERGY_GAIN)
            org.ticksSinceEat = 0
            f.active = false
          }
        }
      }

      // Predator kills prey — cooldown prevents mass-slaughter inside clusters
      if (org.killCooldown > 0) org.killCooldown--
      if (org.type === 2 && org.killCooldown === 0) {
        for (const prey of orgs) {
          if (!prey.alive || prey.type === 2) continue
          const dx = prey.x - org.x; const dy = prey.y - org.y
          if (dx * dx + dy * dy < KILL_RADIUS_SQ * balanceScale * org.huntMult) {
            org.energy = Math.min(2, org.energy + PREY_ENERGY_GAIN)
            org.ticksSinceEat = 0
            org.killCooldown = 90  // ~1.5 s before next kill
            prey.alive = false; prey.energy = 0
            // Kill sparks — amber burst at impact site
            for (let s = 0; s < 7; s++) {
              const a = rng() * Math.PI * 2
              const sp = 0.004 + rng() * 0.009
              if (sparks.length < MAX_SPARKS)
                sparks.push({ x: prey.x, y: prey.y, vx: Math.cos(a)*sp, vy: Math.sin(a)*sp, alpha: 1.4, ptype: 0 })
            }
            // Shockwave — nearby prey scatter in panic
            for (const bystander of orgs) {
              if (!bystander.alive || bystander.type === 2 || bystander === prey) continue
              const bx = bystander.x - prey.x; const by = bystander.y - prey.y
              const bd2 = bx * bx + by * by
              if (bd2 < 0.06 && bd2 > 1e-6) {
                const bd = Math.sqrt(bd2)
                const shock = 0.0022 * (1 - bd / Math.sqrt(0.06))
                bystander.vx += (bx / bd) * shock; bystander.vy += (by / bd) * shock
              }
            }
            // Killed prey leaves food scraps
            if (rng() < 0.5) {
              const slot = food.find(f => !f.active && f.alpha <= 0)
              if (slot) { slot.x = prey.x; slot.y = prey.y; slot.alpha = 0; slot.active = true }
              else if (food.length < MAX_FOOD) food.push({ x: prey.x, y: prey.y, alpha: 0, active: true })
            }
            break
          }
        }
      }

      // Death — energy depletion or starvation
      if (org.energy <= 0 || org.ticksSinceEat >= STARVATION_TICKS) {
        org.alive = false; org.energy = 0
        // Dim death sparks
        const deathPtype = org.type === 2 ? 3 : (1 + org.type)
        for (let s = 0; s < 3; s++) {
          const a = rng() * Math.PI * 2; const sp = 0.001 + rng() * 0.003
          if (sparks.length < MAX_SPARKS)
            sparks.push({ x: org.x, y: org.y, vx: Math.cos(a)*sp, vy: Math.sin(a)*sp, alpha: 0.55, ptype: deathPtype })
        }
        if (org.type < 2 && rng() < 0.35) {
          const slot = food.find(f => !f.active && f.alpha <= 0)
          if (slot) { slot.x = org.x; slot.y = org.y; slot.alpha = 0; slot.active = true }
          else if (food.length < MAX_FOOD) food.push({ x: org.x, y: org.y, alpha: 0, active: true })
        }
      }

      // Reproduce — predators need 1.4× more energy
      const reproThresh = org.type === 2 ? REPRODUCTION_ENERGY_THRESHOLD * 1.15 : REPRODUCTION_ENERGY_THRESHOLD
      if (org.energy > reproThresh) trySpawnChild(org)
    }

    // Respawn a predator if none alive
    if (!orgs.some(o => o.alive && o.type === 2)) {
      const slot = orgs.find(o => !o.alive && o.alpha <= 0)
      const p: Organism = {
        x: 0.1 + rng() * 0.8, y: 0.1 + rng() * 0.8,
        vx: (rng() - 0.5) * MAX_SPEED, vy: (rng() - 0.5) * MAX_SPEED,
        energy: START_ENERGY, type: 2, alive: true, alpha: 1, ticksSinceEat: 0,
        speedMult: 1, huntMult: 1, killCooldown: 0,
      }
      if (slot) Object.assign(slot, p)
      else orgs.push(p)
    }

    // Prune fully-faded corpses so array doesn't grow forever
    if (orgs.length > (MAX_ORGANISMS + MAX_PREDATORS) * 2) {
      orgs = orgs.filter(o => o.alive || o.alpha > 0)
    }
  }

  function packParticles(): number {
    let n = 0
    for (const o of orgs) {
      if (!o.alive && o.alpha <= 0.01) continue
      const b = n * STRIDE_F
      ptData[b]     = o.x; ptData[b + 1] = o.y
      const hungerGlow = o.alive ? Math.max(0.15, 1 - (o.ticksSinceEat / STARVATION_TICKS) * 0.85) : 1
      // Kill glow: predator flashes bright for ~20 ticks after a kill
      const killBoost = (o.type === 2 && o.ticksSinceEat < 20) ? (1 - o.ticksSinceEat / 20) * 0.5 : 0
      ptData[b + 2] = Math.min(1, Math.max(0, Math.min(1, o.energy / 2)) * hungerGlow + killBoost)
      ptData[b + 3] = 1 + o.type
      ptData[b + 4] = o.alpha
      // Trait: prey → speedMult, predator → huntMult (both normalized 0→1 over range 0.5→3.0)
      const mult = o.type === 2 ? o.huntMult : o.speedMult
      ptData[b + 5] = Math.min(1, Math.max(0, (mult - 0.5) / 2.5))
      if (++n >= MAX_PTS) break
    }
    for (const f of food) {
      if (!f.active && f.alpha <= 0.01) continue
      const b = n * STRIDE_F
      ptData[b] = f.x; ptData[b+1] = f.y
      ptData[b+2] = 1; ptData[b+3] = 0; ptData[b+4] = f.alpha; ptData[b+5] = 0
      if (++n >= MAX_PTS) break
    }
    for (const s of sparks) {
      if (s.alpha <= 0) continue
      const b = n * STRIDE_F
      ptData[b] = s.x; ptData[b+1] = s.y
      ptData[b+2] = 1; ptData[b+3] = s.ptype; ptData[b+4] = Math.max(0, s.alpha); ptData[b+5] = 0
      if (++n >= MAX_PTS) break
    }
    return n
  }

  // ── Render ────────────────────────────────────────────────────────────────────
  function render(ptCount: number): void {
    const back = front ^ 1

    // Pass 1 — decay previous frame into back FBO
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbs[back])
    gl.viewport(0, 0, fbW, fbH)
    gl.disable(gl.BLEND)
    gl.useProgram(decayProg)
    gl.bindVertexArray(quadVAO)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, texs[front])
    gl.uniform1i(uPrev, 0); gl.uniform1f(uTrail, TRAIL_STRENGTH); gl.uniform3fv(uBg, BG)
    gl.drawArrays(gl.TRIANGLES, 0, 3)

    // Pass 2 — draw particles (additive) on top
    if (ptCount > 0) {
      gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE)
      gl.useProgram(pProg)
      gl.bindVertexArray(ptVAO)
      gl.uniform1f(uGlow, GLOW_STRENGTH); gl.uniform2f(uCanvas, fbW, fbH)
      gl.bindBuffer(gl.ARRAY_BUFFER, ptBuf)
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, ptData, 0, ptCount * STRIDE_F)
      gl.drawArrays(gl.POINTS, 0, ptCount)
      gl.disable(gl.BLEND)
    }

    // Pass 3 — tonemap + display to canvas
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.viewport(0, 0, el.width, el.height)
    gl.useProgram(sProg)
    gl.bindVertexArray(quadVAO)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, texs[back])
    gl.uniform1i(uTex, 0); gl.uniform1f(uAlpha, GLOBAL_ALPHA)
    gl.drawArrays(gl.TRIANGLES, 0, 3)

    front = back
  }

  // ── Resize ────────────────────────────────────────────────────────────────────
  function resize(): void {
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
    const w = Math.max(1, Math.round(el.clientWidth * dpr))
    const h = Math.max(1, Math.round(el.clientHeight * dpr))
    el.width = w; el.height = h
    createFBOs(w, h)
  }

  // ── Loop ──────────────────────────────────────────────────────────────────────
  let raf     = 0
  let running = false
  let lastFood  = performance.now()
  let nextBurst = performance.now() + FOOD_BURST_MIN_MS + rng() * (FOOD_BURST_MAX_MS - FOOD_BURST_MIN_MS)
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  function loop(now: number): void {
    if (now - lastFood > FOOD_SPAWN_INTERVAL_MS) {
      trySpawnFood(); lastFood = now
    }
    if (now >= nextBurst) {
      const count = FOOD_BURST_COUNT_MIN + Math.floor(rng() * (FOOD_BURST_COUNT_MAX - FOOD_BURST_COUNT_MIN + 1))
      const livingPrey = orgs.filter(o => o.alive && o.type < 2)
      // 50% chance: cluster the burst near the prey centre-of-mass (feeding frenzy zone)
      const doCluster = livingPrey.length >= 6 && rng() < 0.5
      let cx = 0.5; let cy = 0.5
      if (doCluster) {
        const sample = livingPrey.slice(0, Math.min(10, livingPrey.length))
        cx = sample.reduce((s, o) => s + o.x, 0) / sample.length
        cy = sample.reduce((s, o) => s + o.y, 0) / sample.length
      }
      for (let i = 0; i < count; i++) {
        if (doCluster) {
          const a = rng() * Math.PI * 2; const r = 0.04 + rng() * 0.14
          const fx = Math.max(0.02, Math.min(0.98, cx + Math.cos(a) * r))
          const fy = Math.max(0.02, Math.min(0.98, cy + Math.sin(a) * r))
          if (food.filter(f => f.active).length < MAX_FOOD) {
            const slot = food.find(f => !f.active && f.alpha <= 0)
            if (slot) { slot.x = fx; slot.y = fy; slot.alpha = 0; slot.active = true }
            else if (food.length < MAX_FOOD) food.push({ x: fx, y: fy, alpha: 0, active: true })
          }
        } else {
          trySpawnFood()
        }
      }
      nextBurst = now + FOOD_BURST_MIN_MS + rng() * (FOOD_BURST_MAX_MS - FOOD_BURST_MIN_MS)
    }
    stepSim()
    render(packParticles())
    if (running) raf = requestAnimationFrame(loop)
  }

  function pause(): void { running = false; cancelAnimationFrame(raf) }

  function resume(): void {
    if (running || reducedMotion) return
    running = true; raf = requestAnimationFrame(loop)
  }

  // Init
  resize(); initState(props.seed)
  if (reducedMotion) render(packParticles())
  else resume()

  let resizeRaf = 0
  const ro = new ResizeObserver(() => {
    cancelAnimationFrame(resizeRaf)
    resizeRaf = requestAnimationFrame(() => resize())
  })
  ro.observe(el)

  return {
    destroy: () => {
      pause(); cancelAnimationFrame(resizeRaf); ro.disconnect()
      el.removeEventListener('mousemove', onMouseMove)
      el.removeEventListener('mouseleave', onMouseLeave)
      el.removeEventListener('mousedown', onMouseDown)
      texs.forEach(t => gl.deleteTexture(t)); fbs.forEach(f => gl.deleteFramebuffer(f))
      gl.deleteBuffer(quadBuf); gl.deleteBuffer(ptBuf)
      gl.deleteVertexArray(quadVAO); gl.deleteVertexArray(ptVAO)
      gl.deleteProgram(decayProg); gl.deleteProgram(pProg); gl.deleteProgram(sProg)
    },
    reseed: (s: number) => {
      initState(s >>> 0)
      nextBurst = performance.now() + FOOD_BURST_MIN_MS + rng() * (FOOD_BURST_MAX_MS - FOOD_BURST_MIN_MS)
    },
    pause, resume,
  }
}
</script>

<template>
  <canvas ref="canvas" class="block size-full" aria-hidden="true" />
</template>

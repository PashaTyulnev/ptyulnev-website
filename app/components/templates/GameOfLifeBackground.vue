<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

/**
 * GPU-accelerated Conway's Game of Life rendered with WebGL2.
 *
 * The simulation runs entirely on the GPU using a ping-pong pair of
 * framebuffer-backed textures. The red channel stores the alive state, the
 * green channel stores a decaying "heat" value that produces the glowing
 * trails behind cells. Sampling is toroidal (REPEAT), so gliders wrap around
 * the edges and the field never settles into empty corners.
 */
const props = withDefaults(
  defineProps<{
    seed?: number
  }>(),
  {
    seed: 0x9e3779b9,
  },
)

// --- Visual & simulation configuration -------------------------------------
// CELL_SIZE: device-independent pixels per simulated cell. Smaller values mean
// a higher simulation resolution and smaller, more detailed cells on screen.
const CELL_SIZE = 6
const MAX_DPR   = 2
const STEP_INTERVAL_MS = 100
const RESEED_INTERVAL_MS = 22000

// GLOW_STRENGTH: overall intensity and radius of the soft bloom in the shader.
const GLOW_STRENGTH = 3.2
// TRAIL_DECAY: set to 1.0 to eliminate trails — heat drops to zero each step.
const TRAIL_DECAY = 1.0
// GLOBAL_ALPHA: brightness of the rendered field behind the content.
const GLOBAL_ALPHA = 0.92

// COLOR_THEME: vibrant bioluminescent palette (linear RGB in [0, 1]).
const COLOR_THEME = {
  background: [0.005, 0.007, 0.013], // deep space black
  alive: [0.0, 0.75, 0.65],           // vivid teal-green
  core: [0.5, 1.0, 0.92],             // bright mint-white
  trail: [0.0, 0.0, 0.0],             // no trail — disabled
} as const

// Scene tuning. Asymmetric, cluster-based distribution: a handful of clusters
// with varying density, separated by large empty regions. Every placement is
// independent - no mirroring, no duplication across axes.
const CLUSTER_AREA_PER = 10000 // grid cells per cluster (lower = more clusters)
const CLUSTER_MIN_MEMBERS = 1
const CLUSTER_MAX_MEMBERS = 6
const CLUSTER_MIN_SPREAD = 5 // tight, busy cluster (in cells)
const CLUSTER_MAX_SPREAD = 45 // loose, sparse cluster (in cells)
const LONER_AREA_PER = 60000 // grid cells per lone scattered pattern

// Pattern-type distribution: 40% ships, 40% guns, 20% oscillators.
const SHIP_WEIGHT = 0.4
const GUN_WEIGHT = 0.4

const canvas = ref<HTMLCanvasElement | null>(null)

interface Simulation {
  destroy: () => void
  reseed: (seed: number) => void
  pause: () => void
  resume: () => void
}

let simulation: Simulation | null = null

const { register, unregister, isActive } = useAnimationManager()
const golActive = isActive('gol')

onMounted(() => {
  const element = canvas.value
  if (!element) return
  simulation = createSimulation(element)
  register('gol', 'Game of Life')
  if (!golActive.value) simulation.pause()
})

watch(golActive, (active) => {
  if (!simulation) return
  active ? simulation.resume() : simulation.pause()
})

watch(
  () => props.seed,
  (seed) => simulation?.reseed(seed),
)

onBeforeUnmount(() => {
  simulation?.destroy()
  simulation = null
  unregister('gol')
})

/** Deterministic PRNG so a given seed always yields the same pattern. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

type Pattern = ReadonlyArray<readonly [number, number]>

interface Grid {
  data: Uint8Array
  width: number
  height: number
}

interface StampOptions {
  rotation?: 0 | 90 | 180 | 270
  mirrorX?: boolean
  mirrorY?: boolean
  /** When true, the cell's heat (green channel) is pre-lit for an instant glow. */
  heat?: boolean
}

/**
 * Pattern library. Each entry is an array of [x, y] coordinates relative to
 * the pattern's top-left origin (0, 0).
 *
 * To add a new pattern: append a property here whose value is the list of
 * live-cell coordinates, then place it from buildScene() via stampPattern().
 * Guns keep the scene alive forever; spaceships add travelling motion;
 * oscillators add stable decorative pulses.
 */
const PATTERNS = {
  // Smallest spaceship - travels diagonally forever.
  glider: [
    [1, 0],
    [2, 1],
    [0, 2],
    [1, 2],
    [2, 2],
  ],
  // Lightweight spaceship - travels orthogonally.
  lightweightSpaceship: [
    [1, 0], [4, 0],
    [0, 1],
    [0, 2], [4, 2],
    [0, 3], [1, 3], [2, 3], [3, 3],
  ],
  // Middleweight spaceship.
  middleweightSpaceship: [
    [3, 0],
    [1, 1], [5, 1],
    [0, 2],
    [0, 3], [5, 3],
    [0, 4], [1, 4], [2, 4], [3, 4], [4, 4],
  ],
  // Heavyweight spaceship.
  heavyweightSpaceship: [
    [3, 0], [4, 0],
    [1, 1], [6, 1],
    [0, 2],
    [0, 3], [6, 3],
    [0, 4], [1, 4], [2, 4], [3, 4], [4, 4], [5, 4],
  ],
  // Gosper glider gun - emits a glider every 30 generations; the engine of
  // never-ending motion.
  gosperGliderGun: [
    [24, 0],
    [22, 1], [24, 1],
    [12, 2], [13, 2], [20, 2], [21, 2], [34, 2], [35, 2],
    [11, 3], [15, 3], [20, 3], [21, 3], [34, 3], [35, 3],
    [0, 4], [1, 4], [10, 4], [16, 4], [20, 4], [21, 4],
    [0, 5], [1, 5], [10, 5], [14, 5], [16, 5], [17, 5], [22, 5], [24, 5],
    [10, 6], [16, 6], [24, 6],
    [11, 7], [15, 7],
    [12, 8], [13, 8],
  ],
  // Pulsar - period-3 oscillator.
  pulsar: [
    [2, 0], [3, 0], [4, 0], [8, 0], [9, 0], [10, 0],
    [0, 2], [5, 2], [7, 2], [12, 2],
    [0, 3], [5, 3], [7, 3], [12, 3],
    [0, 4], [5, 4], [7, 4], [12, 4],
    [2, 5], [3, 5], [4, 5], [8, 5], [9, 5], [10, 5],
    [2, 7], [3, 7], [4, 7], [8, 7], [9, 7], [10, 7],
    [0, 8], [5, 8], [7, 8], [12, 8],
    [0, 9], [5, 9], [7, 9], [12, 9],
    [0, 10], [5, 10], [7, 10], [12, 10],
    [2, 12], [3, 12], [4, 12], [8, 12], [9, 12], [10, 12],
  ],
  // Pentadecathlon - period-15 oscillator.
  pentadecathlon: [
    [2, 0], [7, 0],
    [0, 1], [1, 1], [3, 1], [4, 1], [5, 1], [6, 1], [8, 1], [9, 1],
    [2, 2], [7, 2],
  ],
  // Beacon - period-2 oscillator.
  beacon: [
    [0, 0], [1, 0],
    [0, 1], [1, 1],
    [2, 2], [3, 2],
    [2, 3], [3, 3],
  ],
} as const

/**
 * Stamps a pattern into the toroidal grid at (originX, originY).
 *
 * Supports 0/90/180/270 rotation and X/Y mirroring; coordinates wrap around
 * the edges because the world is a torus. Live cells are written to the red
 * channel, with optional initial heat in the green channel.
 */
function stampPattern(
  grid: Grid,
  pattern: Pattern,
  originX: number,
  originY: number,
  options: StampOptions = {},
): void {
  const { rotation = 0, mirrorX = false, mirrorY = false, heat = false } = options

  for (const [px, py] of pattern) {
    const mx = mirrorX ? -px : px
    const my = mirrorY ? -py : py

    let rx = mx
    let ry = my
    switch (rotation) {
      case 90:
        rx = -my
        ry = mx
        break
      case 180:
        rx = -mx
        ry = -my
        break
      case 270:
        rx = my
        ry = -mx
        break
    }

    const gx = (((originX + rx) % grid.width) + grid.width) % grid.width
    const gy = (((originY + ry) % grid.height) + grid.height) % grid.height
    const index = (gy * grid.width + gx) * 4

    grid.data[index] = 255
    if (heat) grid.data[index + 1] = 255
    grid.data[index + 3] = 255
  }
}

/**
 * Deterministic, asymmetric scene generator. For a given seed it always
 * produces the same world; a different seed produces a completely different
 * one. Patterns are placed in independent clusters of varying density with
 * large empty regions in between, so the field evolves like a natural digital
 * ecosystem rather than a symmetric kaleidoscope.
 */
function buildScene(width: number, height: number, seed: number): Uint8Array {
  const random = mulberry32(seed)
  const grid: Grid = { data: new Uint8Array(width * height * 4), width, height }

  const randInt = (min: number, max: number): number =>
    min + Math.floor(random() * (max - min + 1))
  const randFloat = (min: number, max: number): number =>
    min + random() * (max - min)
  const pick = <T>(items: readonly T[]): T =>
    items[Math.floor(random() * items.length)] as T
  // Random rotation only - never mirrored - so orientation varies without
  // introducing reflective symmetry.
  const rotation = (): 0 | 90 | 180 | 270 => pick([0, 90, 180, 270] as const)

  const ships: Pattern[] = [
    PATTERNS.glider,
    PATTERNS.lightweightSpaceship,
    PATTERNS.middleweightSpaceship,
  ]
  const oscillators: Pattern[] = [
    PATTERNS.pulsar,
    PATTERNS.pentadecathlon,
    PATTERNS.beacon,
  ]

  // Places a single pattern, choosing its type by the weighted distribution:
  // 40% ships, 40% glider guns, 20% oscillators.
  const placeOne = (x: number, y: number): void => {
    const roll = random()
    let pattern: Pattern
    if (roll < SHIP_WEIGHT) {
      pattern = pick(ships)
    } else if (roll < SHIP_WEIGHT + GUN_WEIGHT) {
      pattern = PATTERNS.gosperGliderGun
    } else {
      pattern = pick(oscillators)
    }
    stampPattern(grid, pattern, x, y, { rotation: rotation() })
  }

  // Clusters: each has an independent centre, a varying member count and a
  // varying spread. Some clusters are tight and full of interacting patterns,
  // others are loose and nearly empty. A sum-of-randoms offset clumps members
  // organically toward the cluster centre.
  const clusterCount = Math.max(
    3,
    Math.round((width * height) / CLUSTER_AREA_PER),
  )
  for (let c = 0; c < clusterCount; c++) {
    const centerX = randInt(0, width - 1)
    const centerY = randInt(0, height - 1)
    const members = randInt(CLUSTER_MIN_MEMBERS, CLUSTER_MAX_MEMBERS)
    const spread = randFloat(CLUSTER_MIN_SPREAD, CLUSTER_MAX_SPREAD)
    for (let m = 0; m < members; m++) {
      const offsetX = Math.round((random() + random() + random() - 1.5) * spread)
      const offsetY = Math.round((random() + random() + random() - 1.5) * spread)
      placeOne(centerX + offsetX, centerY + offsetY)
    }
  }

  // A few fully independent loners drifting through the empty void.
  const loners = Math.max(2, Math.round((width * height) / LONER_AREA_PER))
  for (let i = 0; i < loners; i++) {
    placeOne(randInt(0, width - 1), randInt(0, height - 1))
  }

  return grid.data
}

function compileShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string,
): WebGLShader {
  const shader = gl.createShader(type)
  if (!shader) throw new Error('Shader konnte nicht erstellt werden.')
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader)
    gl.deleteShader(shader)
    throw new Error(`Shader-Fehler: ${log}`)
  }
  return shader
}

function createSimulation(element: HTMLCanvasElement): Simulation {
  const gl = element.getContext('webgl2', {
    antialias: false,
    alpha: false,
    powerPreference: 'low-power',
  })

  if (!gl) {
    return { destroy: () => {}, reseed: () => {} }
  }

  const vertexSource = /* glsl */ `#version 300 es
    in vec2 a_pos;
    out vec2 v_uv;
    void main() {
      v_uv = a_pos * 0.5 + 0.5;
      gl_Position = vec4(a_pos, 0.0, 1.0);
    }
  `

  const updateSource = /* glsl */ `#version 300 es
    precision highp float;
    in vec2 v_uv;
    out vec4 outColor;
    uniform sampler2D u_state;
    uniform vec2 u_texel;
    uniform float u_decay;

    float cell(vec2 offset) {
      return texture(u_state, v_uv + offset * u_texel).r;
    }

    void main() {
      float neighbours =
        cell(vec2(-1.0, -1.0)) + cell(vec2(0.0, -1.0)) + cell(vec2(1.0, -1.0)) +
        cell(vec2(-1.0, 0.0)) + cell(vec2(1.0, 0.0)) +
        cell(vec2(-1.0, 1.0)) + cell(vec2(0.0, 1.0)) + cell(vec2(1.0, 1.0));

      vec4 self = texture(u_state, v_uv);
      bool alive = self.r > 0.5;
      bool next = alive
        ? (neighbours > 1.5 && neighbours < 3.5)
        : (neighbours > 2.5 && neighbours < 3.5);

      float heat = next ? 1.0 : max(0.0, self.g - u_decay);
      outColor = vec4(next ? 1.0 : 0.0, heat, 0.0, 1.0);
    }
  `

  const renderSource = /* glsl */ `#version 300 es
    precision highp float;
    in vec2 v_uv;
    out vec4 outColor;
    uniform sampler2D u_state;
    uniform vec2 u_grid;
    uniform float u_glow;
    uniform float u_alpha;
    uniform vec3 u_bg;
    uniform vec3 u_alive;
    uniform vec3 u_core;
    uniform vec3 u_trail;

    void main() {
      // Work in grid (cell) space so distances are measured in cells.
      vec2 gp = v_uv * u_grid;
      vec2 baseCell = floor(gp);

      float coreField = 0.0;  // tight bright centre of living cells
      float bodyField = 0.0;  // soft rounded body of living cells
      float trailField = 0.0; // wide halo from fading heat trails

      // Sample the 3x3 cell neighbourhood and accumulate a smooth distance
      // falloff per cell, so each cell renders as a soft round particle with
      // bloom instead of a hard square. Sampling wraps (REPEAT) toroidally.
      for (int dy = -1; dy <= 1; dy++) {
        for (int dx = -1; dx <= 1; dx++) {
          vec2 cellId = baseCell + vec2(float(dx), float(dy));
          vec2 center = cellId + 0.5;
          vec4 s = texture(u_state, center / u_grid);
          float d2 = dot(gp - center, gp - center);

          coreField += s.r * exp(-d2 * 6.5);
          bodyField += s.r * exp(-d2 * 1.6);
          trailField += s.g * exp(-d2 * (1.1 / u_glow));
        }
      }

      // Additive emissive light over a near-black base.
      vec3 emissive =
        u_alive * bodyField * 1.1 +
        u_core * coreField;

      vec3 color = u_bg + emissive * u_glow;
      // Gentle filmic-style rolloff prevents harsh clipping of the cores.
      color = color / (color + vec3(0.55));
      // Dim globally so the field stays atmospheric behind the content.
      color *= u_alpha;

      outColor = vec4(color, 1.0);
    }
  `

  const updateProgram = buildProgram(gl, vertexSource, updateSource)
  const renderProgram = buildProgram(gl, vertexSource, renderSource)

  const quad = new Float32Array([-1, -1, 3, -1, -1, 3])
  const vao = gl.createVertexArray()
  gl.bindVertexArray(vao)
  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW)
  const positionLocation = gl.getAttribLocation(updateProgram, 'a_pos')
  gl.enableVertexAttribArray(positionLocation)
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

  const uStateUpdate = gl.getUniformLocation(updateProgram, 'u_state')
  const uTexel = gl.getUniformLocation(updateProgram, 'u_texel')
  const uDecay = gl.getUniformLocation(updateProgram, 'u_decay')
  const uStateRender = gl.getUniformLocation(renderProgram, 'u_state')
  const uGrid = gl.getUniformLocation(renderProgram, 'u_grid')
  const uGlow = gl.getUniformLocation(renderProgram, 'u_glow')
  const uAlpha = gl.getUniformLocation(renderProgram, 'u_alpha')
  const uBg = gl.getUniformLocation(renderProgram, 'u_bg')
  const uAlive = gl.getUniformLocation(renderProgram, 'u_alive')
  const uCore = gl.getUniformLocation(renderProgram, 'u_core')
  const uTrail = gl.getUniformLocation(renderProgram, 'u_trail')

  const bgColor = new Float32Array(COLOR_THEME.background)
  const aliveColor = new Float32Array(COLOR_THEME.alive)
  const coreColor = new Float32Array(COLOR_THEME.core)
  const trailColor = new Float32Array(COLOR_THEME.trail)

  let gridWidth = 1
  let gridHeight = 1
  let textures: WebGLTexture[] = []
  let framebuffers: WebGLFramebuffer[] = []
  let front = 0
  let currentSeed = props.seed

  function createState(seed: number): void {
    disposeState()

    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
    const cssWidth = element.clientWidth || 1
    const cssHeight = element.clientHeight || 1

    element.width = Math.max(1, Math.round(cssWidth * dpr))
    element.height = Math.max(1, Math.round(cssHeight * dpr))

    gridWidth = Math.max(2, Math.round(cssWidth / CELL_SIZE))
    gridHeight = Math.max(2, Math.round(cssHeight / CELL_SIZE))

    const seedData = buildScene(gridWidth, gridHeight, seed)

    for (let i = 0; i < 2; i++) {
      const texture = gl.createTexture()
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gridWidth,
        gridHeight,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        i === 0 ? seedData : null,
      )
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)

      const framebuffer = gl.createFramebuffer()
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        texture,
        0,
      )

      textures.push(texture as WebGLTexture)
      framebuffers.push(framebuffer as WebGLFramebuffer)
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    front = 0
  }

  function disposeState(): void {
    textures.forEach((texture) => gl.deleteTexture(texture))
    framebuffers.forEach((framebuffer) => gl.deleteFramebuffer(framebuffer))
    textures = []
    framebuffers = []
  }

  function step(): void {
    const back = front ^ 1
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffers[back])
    gl.viewport(0, 0, gridWidth, gridHeight)
    gl.useProgram(updateProgram)
    gl.bindVertexArray(vao)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, textures[front])
    gl.uniform1i(uStateUpdate, 0)
    gl.uniform2f(uTexel, 1 / gridWidth, 1 / gridHeight)
    gl.uniform1f(uDecay, TRAIL_DECAY)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
    front = back
  }

  function render(): void {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.viewport(0, 0, element.width, element.height)
    gl.useProgram(renderProgram)
    gl.bindVertexArray(vao)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, textures[front])
    gl.uniform1i(uStateRender, 0)
    gl.uniform2f(uGrid, gridWidth, gridHeight)
    gl.uniform1f(uGlow, GLOW_STRENGTH)
    gl.uniform1f(uAlpha, GLOBAL_ALPHA)
    gl.uniform3fv(uBg, bgColor)
    gl.uniform3fv(uAlive, aliveColor)
    gl.uniform3fv(uCore, coreColor)
    gl.uniform3fv(uTrail, trailColor)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }

  createState(currentSeed)

  let animationFrame = 0
  let lastStep = performance.now()
  let lastReseed = performance.now()
  let running = false
  const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches

  function loop(now: number): void {
    if (now - lastStep >= STEP_INTERVAL_MS) {
      step()
      lastStep = now
    }
    if (now - lastReseed >= RESEED_INTERVAL_MS) {
      currentSeed = (currentSeed + 0x85ebca6b) >>> 0
      createState(currentSeed)
      lastReseed = now
    }
    render()
    if (running) animationFrame = requestAnimationFrame(loop)
  }

  function pause(): void {
    running = false
    cancelAnimationFrame(animationFrame)
  }

  function resume(): void {
    if (running || reducedMotion) return
    running = true
    lastStep = performance.now()
    animationFrame = requestAnimationFrame(loop)
  }

  if (reducedMotion) {
    render()
  } else {
    resume()
  }

  let resizeFrame = 0
  const resizeObserver = new ResizeObserver(() => {
    cancelAnimationFrame(resizeFrame)
    resizeFrame = requestAnimationFrame(() => createState(currentSeed))
  })
  resizeObserver.observe(element)

  return {
    destroy: () => {
      cancelAnimationFrame(animationFrame)
      cancelAnimationFrame(resizeFrame)
      resizeObserver.disconnect()
      disposeState()
      gl.deleteProgram(updateProgram)
      gl.deleteProgram(renderProgram)
      gl.deleteBuffer(buffer)
      gl.deleteVertexArray(vao)
    },
    reseed: (seed: number) => {
      currentSeed = seed >>> 0
      lastReseed = performance.now()
      createState(currentSeed)
    },
    pause,
    resume,
  }
}

function buildProgram(
  gl: WebGL2RenderingContext,
  vertexSource: string,
  fragmentSource: string,
): WebGLProgram {
  const program = gl.createProgram()
  if (!program) throw new Error('Programm konnte nicht erstellt werden.')
  gl.attachShader(program, compileShader(gl, gl.VERTEX_SHADER, vertexSource))
  gl.attachShader(
    program,
    compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource),
  )
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program)
    gl.deleteProgram(program)
    throw new Error(`Programm-Linkfehler: ${log}`)
  }
  return program
}
</script>

<template>
  <canvas ref="canvas" class="block size-full" aria-hidden="true" />
</template>

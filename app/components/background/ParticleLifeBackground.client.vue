<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

// `.client.vue` suffix: stripped from the server bundle entirely, so WebGL
// never touches the DOM during SSR.
//
// Adapted from the "03 · Particle Life" demo on /templates
// (components/templates/ParticleLifeBackground.vue) — same hunar4321-style
// rule-matrix simulation, bloom/glow rendering and fixed neon palette, which
// is what actually reads as "clearly different" preset to preset (unlike the
// muted, CPU-rendered ecosystem this replaced). This version drops that
// demo's useAnimationManager single-active-preview wiring (meant for a
// gallery of toggleable demos, not an always-on site background) and adds:
// a randomly generated seed per load, periodic re-seeding for variety across
// a long visit, window-level pointer tracking (so it reacts even behind
// foreground cards/text), and tab-visibility pausing.
const props = withDefaults(
  defineProps<{
    enablePointerInteraction?: boolean
    enableAutomaticPresetChange?: boolean
    presetChangeInterval?: number
    opacity?: number
    paused?: boolean
    theme?: 'dark' | 'light'
  }>(),
  {
    enablePointerInteraction: true,
    enableAutomaticPresetChange: true,
    presetChangeInterval: 90000,
    opacity: 0.7,
    paused: false,
    theme: 'dark',
  },
)

// ── Config ───────────────────────────────────────────────────────────────────
const TYPES               = 5
const MIN_PER_TYPE_DESKTOP = 9
const MAX_PER_TYPE_DESKTOP = 17
const MIN_PER_TYPE_TOUCH   = 5
const MAX_PER_TYPE_TOUCH   = 9
const SPAWN_FADE_TICKS    = 70
const MOUSE_RADIUS_SQ     = 16      // 4 units — exceeds the ~0.7 max wrapped distance, so this reaches every particle on screen
// Combined with the rule-matrix forces into `fx`/`fy` below, which then both
// get multiplied by the same tiny `forceScale` — so this needs to be on the
// same order as a single neighbor's raw (unscaled) force, not pre-scaled
// itself, or the cursor push is imperceptible next to particle-particle forces.
const MOUSE_FORCE         = 0.6
const MAX_DPR             = 2

// The additive-glow render pipeline (decay trail + bloom compositing) is
// tuned for a near-black canvas; on a light page the same blend would just
// wash out to white, so light theme gets its own weaker, faster-decaying
// look instead of pure-white particles.
const LOOK = {
  // `dark.bg` matches body's --color-ink (#050505) and `light.bg` matches
  // its light-theme value (#f6f6f8) so the canvas has no visible seam
  // against the page background.
  dark:  { bg: [0.004, 0.005, 0.011] as const, glow: 2.1, trail: 0.86, alpha: 0.95 },
  light: { bg: [0.965, 0.965, 0.973] as const, glow: 1.15, trail: 0.8, alpha: 0.9 },
}

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

function randomSeed(): number {
  return (Math.random() * 0xffffffff) >>> 0
}

// ── Component ────────────────────────────────────────────────────────────────
const canvas = ref<HTMLCanvasElement | null>(null)

interface Sim {
  destroy: () => void
  reseed: (s: number) => void
  pause: () => void
  resume: () => void
  setTheme: (t: 'dark' | 'light') => void
}

let sim: Sim | null = null
let reseedTimer = 0

function onVisibilityChange(): void {
  if (!sim) return
  if (document.hidden) sim.pause()
  else if (!props.paused) sim.resume()
}

watch(() => props.paused, (paused) => {
  if (!sim) return
  if (paused) sim.pause()
  else if (!document.hidden) sim.resume()
})

watch(() => props.theme, (t) => {
  sim?.setTheme(t)
})

onMounted(async () => {
  // `.client.vue` components mount one tick after their `onMounted` fires
  // (Nuxt swaps the real component in after an internal client-only flag
  // flips), so the template ref can still read null here on the first pass.
  if (!canvas.value) await nextTick()
  if (!canvas.value) return

  sim = createSim(canvas.value, props.theme)
  document.addEventListener('visibilitychange', onVisibilityChange)

  if (props.enableAutomaticPresetChange) {
    reseedTimer = window.setInterval(() => {
      sim?.reseed(randomSeed())
    }, props.presetChangeInterval)
  }

  if (props.paused) sim.pause()
})

onBeforeUnmount(() => {
  sim?.destroy()
  sim = null
  window.clearInterval(reseedTimer)
  document.removeEventListener('visibilitychange', onVisibilityChange)
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
function createSim(el: HTMLCanvasElement, initialTheme: 'dark' | 'light'): Sim {
  const gl = el.getContext('webgl2', { antialias: false, alpha: false, powerPreference: 'high-performance' })
  if (!gl) return { destroy: () => {}, reseed: () => {}, pause: () => {}, resume: () => {}, setTheme: () => {} }

  gl.getExtension('EXT_color_buffer_float')

  let look = LOOK[initialTheme]
  let bg: number[] = [...look.bg]
  let glowStrength = look.glow
  let trailStrength = look.trail
  let globalAlpha = look.alpha

  const isTouch = window.matchMedia('(pointer: coarse)').matches
  const minPerType = isTouch ? MIN_PER_TYPE_TOUCH : MIN_PER_TYPE_DESKTOP
  const maxPerType = isTouch ? MAX_PER_TYPE_TOUCH : MAX_PER_TYPE_DESKTOP
  const maxParticles = TYPES * maxPerType

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
    layout(location=1) in float a_ptype;
    layout(location=2) in float a_alpha;
    out float v_ptype; out float v_alpha;
    uniform float u_glow;
    uniform vec2 u_canvas;
    void main() {
      vec2 clip = a_pos * 2.0 - 1.0; clip.y = -clip.y;
      gl_Position = vec4(clip, 0.0, 1.0);
      float minDim = min(u_canvas.x, u_canvas.y);
      float sz = minDim * 0.017 * (0.7 + u_glow * 0.3);
      gl_PointSize = max(1.0, sz * a_alpha);
      v_ptype = a_ptype; v_alpha = a_alpha;
    }
  `

  const particleFS = /* glsl */`#version 300 es
    precision highp float;
    in float v_ptype; in float v_alpha;
    out vec4 o;
    void main() {
      vec2 uv = gl_PointCoord - 0.5;
      float dist = length(uv) * 2.0;
      if (dist > 1.0) discard;

      float core   = smoothstep(0.45, 0.0, dist);
      float bloom  = exp(-dist * dist * 2.2);
      float intens = core * 0.55 + bloom * 0.55;

      vec3 color;
      if (v_ptype < 0.5)      color = vec3(0.12, 0.85, 0.95); // cyan
      else if (v_ptype < 1.5) color = vec3(0.95, 0.18, 0.62); // magenta
      else if (v_ptype < 2.5) color = vec3(0.98, 0.65, 0.08); // amber
      else if (v_ptype < 3.5) color = vec3(0.55, 0.95, 0.22); // lime
      else                    color = vec3(0.58, 0.32, 0.98); // violet

      float a = intens * v_alpha * 0.4;
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
      c = c / (c + vec3(0.42));
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
  const STRIDE_F = 4 // x, y, ptype, alpha
  const ptData   = new Float32Array(maxParticles * STRIDE_F)

  const ptVAO = gl.createVertexArray()!
  gl.bindVertexArray(ptVAO)
  const ptBuf = gl.createBuffer()!
  gl.bindBuffer(gl.ARRAY_BUFFER, ptBuf)
  gl.bufferData(gl.ARRAY_BUFFER, ptData.byteLength, gl.DYNAMIC_DRAW)
  const S4 = STRIDE_F * 4
  gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, S4, 0)
  gl.enableVertexAttribArray(1); gl.vertexAttribPointer(1, 1, gl.FLOAT, false, S4, 8)
  gl.enableVertexAttribArray(2); gl.vertexAttribPointer(2, 1, gl.FLOAT, false, S4, 12)
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
  let texs: WebGLTexture[]     = []
  let fbs:  WebGLFramebuffer[] = []
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
    for (let i = 0; i < 2; i++) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbs[i])
      gl.clearColor(bg[0]!, bg[1]!, bg[2]!, 1.0)
      gl.clear(gl.COLOR_BUFFER_BIT)
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    fbW = w; fbH = h
  }

  // ── Pointer tracking ──────────────────────────────────────────────────────────
  // Window-level (not canvas-level): this canvas sits behind every other
  // element (z-index -1), so it must react to the cursor everywhere on the
  // page, not just over the empty gaps between foreground content.
  let mouseX = -1
  let mouseY = -1

  function onPointerMove(e: PointerEvent): void {
    mouseX = e.clientX / window.innerWidth
    mouseY = e.clientY / window.innerHeight
  }
  function onPointerLeave(): void { mouseX = -1; mouseY = -1 }

  if (props.enablePointerInteraction && !isTouch) {
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerleave', onPointerLeave, { passive: true })
  }

  // ── Rule-matrix particle-life state ───────────────────────────────────────────
  let rng = mulberry32(randomSeed())

  let count = 0
  let px = new Float32Array(maxParticles)
  let py = new Float32Array(maxParticles)
  let pvx = new Float32Array(maxParticles)
  let pvy = new Float32Array(maxParticles)
  let ptype = new Float32Array(maxParticles)
  let page = new Float32Array(maxParticles) // ticks alive, for spawn fade-in

  let matrix   = new Float32Array(TYPES * TYPES)
  let rMax     = 0.14
  let rMin     = 0.014
  let damping  = 0.94
  let maxSpeed = 0.003
  const forceScale = 0.0016
  const TIME_SCALE = 0.2 // 5x slower overall drift

  function initState(seed: number): void {
    rng = mulberry32(seed)

    // Re-roll the rule matrix — every pair of species gets its own
    // attraction (positive) or repulsion (negative) coefficient.
    for (let i = 0; i < TYPES * TYPES; i++) matrix[i] = rng() * 2 - 1

    rMax     = 0.09 + rng() * 0.10
    rMin     = rMax * (0.05 + rng() * 0.05)
    damping  = 0.90 + rng() * 0.07
    maxSpeed = 0.0022 + rng() * 0.0018

    count = 0
    for (let t = 0; t < TYPES; t++) {
      const n = minPerType + Math.floor(rng() * (maxPerType - minPerType))
      for (let i = 0; i < n && count < maxParticles; i++, count++) {
        px[count] = rng(); py[count] = rng()
        pvx[count] = (rng() - 0.5) * maxSpeed
        pvy[count] = (rng() - 0.5) * maxSpeed
        ptype[count] = t
        page[count] = 0
      }
    }
  }

  function stepSim(): void {
    const rMaxSq = rMax * rMax

    for (let i = 0; i < count; i++) {
      let fx = 0; let fy = 0
      const xi = px[i]; const yi = py[i]; const ti = ptype[i] * TYPES

      for (let j = 0; j < count; j++) {
        if (j === i) continue
        let dx = xi - px[j]
        let dy = yi - py[j]
        // Toroidal minimum-image wrap so forces flow seamlessly across edges.
        if (dx > 0.5) dx -= 1; else if (dx < -0.5) dx += 1
        if (dy > 0.5) dy -= 1; else if (dy < -0.5) dy += 1
        const d2 = dx * dx + dy * dy
        if (d2 > rMaxSq || d2 < 1e-9) continue

        const d = Math.sqrt(d2)
        let f: number
        if (d < rMin) {
          // Universal short-range repulsion prevents collapse regardless of rule sign.
          f = (d / rMin - 1)
        } else {
          const g = matrix[ti + ptype[j]]!
          f = g * (1 - Math.abs(2 * d - rMin - rMax) / (rMax - rMin))
        }
        fx += (dx / d) * f
        fy += (dy / d) * f
      }

      // Gentle repulsion from the cursor.
      if (mouseX >= 0) {
        let mdx = xi - mouseX; let mdy = yi - mouseY
        if (mdx > 0.5) mdx -= 1; else if (mdx < -0.5) mdx += 1
        if (mdy > 0.5) mdy -= 1; else if (mdy < -0.5) mdy += 1
        const md2 = mdx * mdx + mdy * mdy
        if (md2 < MOUSE_RADIUS_SQ && md2 > 1e-9) {
          const md = Math.sqrt(md2)
          fx += (mdx / md) * MOUSE_FORCE * (1 - md / Math.sqrt(MOUSE_RADIUS_SQ))
          fy += (mdy / md) * MOUSE_FORCE * (1 - md / Math.sqrt(MOUSE_RADIUS_SQ))
        }
      }

      let vx = (pvx[i]! + fx * forceScale) * damping
      let vy = (pvy[i]! + fy * forceScale) * damping
      const spd = Math.hypot(vx, vy)
      if (spd > maxSpeed) { vx = vx / spd * maxSpeed; vy = vy / spd * maxSpeed }
      pvx[i] = vx; pvy[i] = vy

      let nx = xi + vx * TIME_SCALE
      let ny = yi + vy * TIME_SCALE
      if (nx < 0) nx += 1; else if (nx > 1) nx -= 1
      if (ny < 0) ny += 1; else if (ny > 1) ny -= 1
      px[i] = nx; py[i] = ny

      if (page[i]! < SPAWN_FADE_TICKS) page[i]++
    }
  }

  function packParticles(): number {
    for (let i = 0; i < count; i++) {
      const b = i * STRIDE_F
      ptData[b] = px[i]!; ptData[b + 1] = py[i]!
      ptData[b + 2] = ptype[i]!
      ptData[b + 3] = Math.min(1, page[i]! / SPAWN_FADE_TICKS)
    }
    return count
  }

  // ── Render ────────────────────────────────────────────────────────────────────
  function render(ptCount: number): void {
    const back = front ^ 1

    gl.bindFramebuffer(gl.FRAMEBUFFER, fbs[back]!)
    gl.viewport(0, 0, fbW, fbH)
    gl.disable(gl.BLEND)
    gl.useProgram(decayProg)
    gl.bindVertexArray(quadVAO)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, texs[front]!)
    gl.uniform1i(uPrev, 0); gl.uniform1f(uTrail, trailStrength); gl.uniform3fv(uBg, bg)
    gl.drawArrays(gl.TRIANGLES, 0, 3)

    if (ptCount > 0) {
      gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE)
      gl.useProgram(pProg)
      gl.bindVertexArray(ptVAO)
      gl.uniform1f(uGlow, glowStrength); gl.uniform2f(uCanvas, fbW, fbH)
      gl.bindBuffer(gl.ARRAY_BUFFER, ptBuf)
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, ptData, 0, ptCount * STRIDE_F)
      gl.drawArrays(gl.POINTS, 0, ptCount)
      gl.disable(gl.BLEND)
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.viewport(0, 0, el.width, el.height)
    gl.useProgram(sProg)
    gl.bindVertexArray(quadVAO)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, texs[back]!)
    gl.uniform1i(uTex, 0); gl.uniform1f(uAlpha, globalAlpha)
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
  let raf = 0
  let running = false
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  function loop(): void {
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
  resize(); initState(randomSeed())
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
      if (props.enablePointerInteraction && !isTouch) {
        window.removeEventListener('pointermove', onPointerMove)
        window.removeEventListener('pointerleave', onPointerLeave)
      }
      texs.forEach(t => gl.deleteTexture(t)); fbs.forEach(f => gl.deleteFramebuffer(f))
      gl.deleteBuffer(quadBuf); gl.deleteBuffer(ptBuf)
      gl.deleteVertexArray(quadVAO); gl.deleteVertexArray(ptVAO)
      gl.deleteProgram(decayProg); gl.deleteProgram(pProg); gl.deleteProgram(sProg)
    },
    reseed: (s: number) => {
      initState(s >>> 0)
    },
    setTheme: (t: 'dark' | 'light') => {
      look = LOOK[t]
      bg = [...look.bg]
      glowStrength = look.glow
      trailStrength = look.trail
      globalAlpha = look.alpha
    },
    pause, resume,
  }
}
</script>

<template>
  <canvas
    ref="canvas"
    class="fixed inset-0 z-[-1] block size-full"
    :style="{ opacity: props.opacity }"
    aria-hidden="true"
  />
</template>

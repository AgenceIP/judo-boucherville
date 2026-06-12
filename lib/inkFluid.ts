/**
 * GPU ink — a compact Navier-Stokes fluid simulation (WebGL2) tuned to look
 * like sumi-e ink bleeding into paper. The cursor is the brush: pointer
 * movement injects velocity and dye; vorticity confinement gives the swirls.
 *
 * Renders black ink with alpha over a transparent canvas so the paper
 * (the page background) shows through. Gracefully returns null when WebGL2
 * or float render targets are unavailable.
 */

type FBO = {
  texture: WebGLTexture
  fbo: WebGLFramebuffer
  width: number
  height: number
  attach: (id: number) => number
}

type DoubleFBO = {
  read: FBO
  write: FBO
  swap: () => void
  width: number
  height: number
}

export type InkFluid = {
  splat: (x: number, y: number, dx: number, dy: number, amount?: number) => void
  setPaused: (p: boolean) => void
  resize: () => void
  destroy: () => void
}

const VERT = `#version 300 es
precision highp float;
in vec2 aPos;
out vec2 vUv;
out vec2 vL; out vec2 vR; out vec2 vT; out vec2 vB;
uniform vec2 texelSize;
void main () {
  vUv = aPos * 0.5 + 0.5;
  vL = vUv - vec2(texelSize.x, 0.0);
  vR = vUv + vec2(texelSize.x, 0.0);
  vT = vUv + vec2(0.0, texelSize.y);
  vB = vUv - vec2(0.0, texelSize.y);
  gl_Position = vec4(aPos, 0.0, 1.0);
}`

const FRAG = {
  advection: `#version 300 es
precision highp float; precision highp sampler2D;
in vec2 vUv; out vec4 frag;
uniform sampler2D uVelocity; uniform sampler2D uSource;
uniform vec2 texelSize; uniform float dt; uniform float dissipation;
void main () {
  vec2 coord = vUv - dt * texture(uVelocity, vUv).xy * texelSize;
  frag = dissipation * texture(uSource, coord);
  frag.a = 1.0;
}`,

  splat: `#version 300 es
precision highp float; precision highp sampler2D;
in vec2 vUv; out vec4 frag;
uniform sampler2D uTarget; uniform float aspectRatio;
uniform vec3 color; uniform vec2 point; uniform float radius;
void main () {
  vec2 p = vUv - point;
  p.x *= aspectRatio;
  vec3 splat = exp(-dot(p, p) / radius) * color;
  vec3 base = texture(uTarget, vUv).xyz;
  frag = vec4(base + splat, 1.0);
}`,

  curl: `#version 300 es
precision mediump float; precision mediump sampler2D;
in vec2 vUv; in vec2 vL; in vec2 vR; in vec2 vT; in vec2 vB; out vec4 frag;
uniform sampler2D uVelocity;
void main () {
  float L = texture(uVelocity, vL).y;
  float R = texture(uVelocity, vR).y;
  float T = texture(uVelocity, vT).x;
  float B = texture(uVelocity, vB).x;
  frag = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
}`,

  vorticity: `#version 300 es
precision highp float; precision highp sampler2D;
in vec2 vUv; in vec2 vL; in vec2 vR; in vec2 vT; in vec2 vB; out vec4 frag;
uniform sampler2D uVelocity; uniform sampler2D uCurl;
uniform float curl; uniform float dt;
void main () {
  float L = texture(uCurl, vL).x;
  float R = texture(uCurl, vR).x;
  float T = texture(uCurl, vT).x;
  float B = texture(uCurl, vB).x;
  float C = texture(uCurl, vUv).x;
  vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
  force /= length(force) + 0.0001;
  force *= curl * C;
  force.y *= -1.0;
  vec2 velocity = texture(uVelocity, vUv).xy + force * dt;
  velocity = clamp(velocity, -1000.0, 1000.0);
  frag = vec4(velocity, 0.0, 1.0);
}`,

  divergence: `#version 300 es
precision mediump float; precision mediump sampler2D;
in vec2 vUv; in vec2 vL; in vec2 vR; in vec2 vT; in vec2 vB; out vec4 frag;
uniform sampler2D uVelocity;
void main () {
  float L = texture(uVelocity, vL).x;
  float R = texture(uVelocity, vR).x;
  float T = texture(uVelocity, vT).y;
  float B = texture(uVelocity, vB).y;
  vec2 C = texture(uVelocity, vUv).xy;
  if (vL.x < 0.0) { L = -C.x; }
  if (vR.x > 1.0) { R = -C.x; }
  if (vT.y > 1.0) { T = -C.y; }
  if (vB.y < 0.0) { B = -C.y; }
  frag = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
}`,

  pressure: `#version 300 es
precision mediump float; precision mediump sampler2D;
in vec2 vUv; in vec2 vL; in vec2 vR; in vec2 vT; in vec2 vB; out vec4 frag;
uniform sampler2D uPressure; uniform sampler2D uDivergence;
void main () {
  float L = texture(uPressure, vL).x;
  float R = texture(uPressure, vR).x;
  float T = texture(uPressure, vT).x;
  float B = texture(uPressure, vB).x;
  float divergence = texture(uDivergence, vUv).x;
  float pressure = (L + R + B + T - divergence) * 0.25;
  frag = vec4(pressure, 0.0, 0.0, 1.0);
}`,

  gradientSubtract: `#version 300 es
precision mediump float; precision mediump sampler2D;
in vec2 vUv; in vec2 vL; in vec2 vR; in vec2 vT; in vec2 vB; out vec4 frag;
uniform sampler2D uPressure; uniform sampler2D uVelocity;
void main () {
  float L = texture(uPressure, vL).x;
  float R = texture(uPressure, vR).x;
  float T = texture(uPressure, vT).x;
  float B = texture(uPressure, vB).x;
  vec2 velocity = texture(uVelocity, vUv).xy;
  velocity.xy -= vec2(R - L, T - B);
  frag = vec4(velocity, 0.0, 1.0);
}`,

  display: `#version 300 es
precision highp float; precision highp sampler2D;
in vec2 vUv; out vec4 frag;
uniform sampler2D uTexture; uniform vec3 inkColor;
void main () {
  float d = texture(uTexture, vUv).x;
  float a = clamp(d, 0.0, 1.0);
  a = smoothstep(0.0, 1.0, a);
  frag = vec4(inkColor * a, a);
}`,
}

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)!
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader) ?? 'shader compile failed')
  }
  return shader
}

class Program {
  program: WebGLProgram
  uniforms: Record<string, WebGLUniformLocation> = {}
  constructor(private gl: WebGL2RenderingContext, vert: WebGLShader, fragSrc: string) {
    const frag = compile(gl, gl.FRAGMENT_SHADER, fragSrc)
    const program = gl.createProgram()!
    gl.attachShader(program, vert)
    gl.attachShader(program, frag)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program) ?? 'program link failed')
    }
    this.program = program
    const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS)
    for (let i = 0; i < count; i++) {
      const name = gl.getActiveUniform(program, i)!.name
      this.uniforms[name] = gl.getUniformLocation(program, name)!
    }
  }
  bind() { this.gl.useProgram(this.program) }
}

export function createInkFluid(canvas: HTMLCanvasElement, opts?: {
  inkColor?: [number, number, number]
  simRes?: number
  dyeRes?: number
}): InkFluid | null {
  const gl = canvas.getContext('webgl2', { alpha: true, depth: false, stencil: false, antialias: false, premultipliedAlpha: true })
  if (!gl) return null
  if (!gl.getExtension('EXT_color_buffer_float')) return null
  // Linear filtering of half-float textures is core WebGL2
  const filtering = gl.LINEAR

  const inkColor = opts?.inkColor ?? [0.075, 0.066, 0.058]
  const SIM_RES = opts?.simRes ?? 144
  const DYE_RES = opts?.dyeRes ?? 512
  const PRESSURE_ITERATIONS = 20
  const CURL = 26
  const VELOCITY_DISSIPATION = 0.985
  const DYE_DISSIPATION = 0.982

  // Fullscreen quad
  const vao = gl.createVertexArray()
  gl.bindVertexArray(vao)
  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  gl.enableVertexAttribArray(0)
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)

  const vert = compile(gl, gl.VERTEX_SHADER, VERT)
  const programs = {
    advection: new Program(gl, vert, FRAG.advection),
    splat: new Program(gl, vert, FRAG.splat),
    curl: new Program(gl, vert, FRAG.curl),
    vorticity: new Program(gl, vert, FRAG.vorticity),
    divergence: new Program(gl, vert, FRAG.divergence),
    pressure: new Program(gl, vert, FRAG.pressure),
    gradientSubtract: new Program(gl, vert, FRAG.gradientSubtract),
    display: new Program(gl, vert, FRAG.display),
  }

  function createFBO(w: number, h: number, internalFormat: number, format: number, filter: number): FBO {
    const texture = gl!.createTexture()!
    gl!.bindTexture(gl!.TEXTURE_2D, texture)
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, filter)
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, filter)
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE)
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE)
    gl!.texImage2D(gl!.TEXTURE_2D, 0, internalFormat, w, h, 0, format, gl!.HALF_FLOAT, null)
    const fbo = gl!.createFramebuffer()!
    gl!.bindFramebuffer(gl!.FRAMEBUFFER, fbo)
    gl!.framebufferTexture2D(gl!.FRAMEBUFFER, gl!.COLOR_ATTACHMENT0, gl!.TEXTURE_2D, texture, 0)
    gl!.viewport(0, 0, w, h)
    gl!.clearColor(0, 0, 0, 1)
    gl!.clear(gl!.COLOR_BUFFER_BIT)
    return {
      texture, fbo, width: w, height: h,
      attach(id: number) {
        gl!.activeTexture(gl!.TEXTURE0 + id)
        gl!.bindTexture(gl!.TEXTURE_2D, texture)
        return id
      },
    }
  }

  function createDoubleFBO(w: number, h: number, internalFormat: number, format: number, filter: number): DoubleFBO {
    let fbo1 = createFBO(w, h, internalFormat, format, filter)
    let fbo2 = createFBO(w, h, internalFormat, format, filter)
    return {
      get read() { return fbo1 }, get write() { return fbo2 },
      swap() { const t = fbo1; fbo1 = fbo2; fbo2 = t },
      width: w, height: h,
    } as DoubleFBO
  }

  let velocity: DoubleFBO, dye: DoubleFBO, divergence: FBO, curlFBO: FBO, pressure: DoubleFBO
  let simW = 0, simH = 0, dyeW = 0, dyeH = 0

  function initFBOs() {
    const aspect = canvas.width / Math.max(1, canvas.height)
    simH = SIM_RES; simW = Math.round(SIM_RES * aspect)
    dyeH = DYE_RES; dyeW = Math.round(DYE_RES * aspect)
    velocity = createDoubleFBO(simW, simH, gl!.RG16F, gl!.RG, filtering)
    dye = createDoubleFBO(dyeW, dyeH, gl!.R16F, gl!.RED, filtering)
    divergence = createFBO(simW, simH, gl!.R16F, gl!.RED, gl!.NEAREST)
    curlFBO = createFBO(simW, simH, gl!.R16F, gl!.RED, gl!.NEAREST)
    pressure = createDoubleFBO(simW, simH, gl!.R16F, gl!.RED, gl!.NEAREST)
  }

  function blit(target: FBO | null) {
    if (target == null) {
      gl!.viewport(0, 0, canvas.width, canvas.height)
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, null)
    } else {
      gl!.viewport(0, 0, target.width, target.height)
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, target.fbo)
    }
    gl!.drawArrays(gl!.TRIANGLES, 0, 3)
  }

  function resizeCanvas() {
    const dpr = Math.min(1.5, window.devicePixelRatio || 1)
    const w = Math.round(canvas.clientWidth * dpr)
    const h = Math.round(canvas.clientHeight * dpr)
    if (w > 0 && h > 0 && (canvas.width !== w || canvas.height !== h)) {
      canvas.width = w
      canvas.height = h
      initFBOs()
    }
  }

  resizeCanvas()
  if (canvas.width === 0 || canvas.height === 0) {
    canvas.width = 2; canvas.height = 2
  }
  initFBOs()

  type Splat = { x: number; y: number; dx: number; dy: number; amount: number }
  const pending: Splat[] = []

  function applySplat(s: Splat) {
    const aspect = canvas.width / Math.max(1, canvas.height)
    programs.splat.bind()
    gl!.uniform1i(programs.splat.uniforms.uTarget, velocity.read.attach(0))
    gl!.uniform1f(programs.splat.uniforms.aspectRatio, aspect)
    gl!.uniform2f(programs.splat.uniforms.point, s.x, 1 - s.y)
    gl!.uniform3f(programs.splat.uniforms.color, s.dx, -s.dy, 0)
    gl!.uniform1f(programs.splat.uniforms.radius, 0.0016)
    blit(velocity.write)
    velocity.swap()

    gl!.uniform1i(programs.splat.uniforms.uTarget, dye.read.attach(0))
    gl!.uniform3f(programs.splat.uniforms.color, s.amount, 0, 0)
    gl!.uniform1f(programs.splat.uniforms.radius, 0.0011)
    blit(dye.write)
    dye.swap()
  }

  let raf = 0
  let paused = false
  let lastTime = performance.now()

  function step() {
    raf = requestAnimationFrame(step)
    if (paused) return
    const now = performance.now()
    const dt = Math.min(0.0166, (now - lastTime) / 1000)
    lastTime = now
    if (canvas.width === 0 || canvas.height === 0) return

    gl!.disable(gl!.BLEND)

    while (pending.length) applySplat(pending.shift()!)

    const simTexel: [number, number] = [1 / simW, 1 / simH]

    programs.curl.bind()
    gl!.uniform2f(programs.curl.uniforms.texelSize, simTexel[0], simTexel[1])
    gl!.uniform1i(programs.curl.uniforms.uVelocity, velocity.read.attach(0))
    blit(curlFBO)

    programs.vorticity.bind()
    gl!.uniform2f(programs.vorticity.uniforms.texelSize, simTexel[0], simTexel[1])
    gl!.uniform1i(programs.vorticity.uniforms.uVelocity, velocity.read.attach(0))
    gl!.uniform1i(programs.vorticity.uniforms.uCurl, curlFBO.attach(1))
    gl!.uniform1f(programs.vorticity.uniforms.curl, CURL)
    gl!.uniform1f(programs.vorticity.uniforms.dt, dt)
    blit(velocity.write)
    velocity.swap()

    programs.divergence.bind()
    gl!.uniform2f(programs.divergence.uniforms.texelSize, simTexel[0], simTexel[1])
    gl!.uniform1i(programs.divergence.uniforms.uVelocity, velocity.read.attach(0))
    blit(divergence)

    programs.pressure.bind()
    gl!.uniform2f(programs.pressure.uniforms.texelSize, simTexel[0], simTexel[1])
    gl!.uniform1i(programs.pressure.uniforms.uDivergence, divergence.attach(1))
    for (let i = 0; i < PRESSURE_ITERATIONS; i++) {
      gl!.uniform1i(programs.pressure.uniforms.uPressure, pressure.read.attach(0))
      blit(pressure.write)
      pressure.swap()
    }

    programs.gradientSubtract.bind()
    gl!.uniform2f(programs.gradientSubtract.uniforms.texelSize, simTexel[0], simTexel[1])
    gl!.uniform1i(programs.gradientSubtract.uniforms.uPressure, pressure.read.attach(0))
    gl!.uniform1i(programs.gradientSubtract.uniforms.uVelocity, velocity.read.attach(1))
    blit(velocity.write)
    velocity.swap()

    programs.advection.bind()
    gl!.uniform2f(programs.advection.uniforms.texelSize, simTexel[0], simTexel[1])
    gl!.uniform1i(programs.advection.uniforms.uVelocity, velocity.read.attach(0))
    gl!.uniform1i(programs.advection.uniforms.uSource, velocity.read.attach(0))
    gl!.uniform1f(programs.advection.uniforms.dt, dt)
    gl!.uniform1f(programs.advection.uniforms.dissipation, VELOCITY_DISSIPATION)
    blit(velocity.write)
    velocity.swap()

    gl!.uniform1i(programs.advection.uniforms.uVelocity, velocity.read.attach(0))
    gl!.uniform1i(programs.advection.uniforms.uSource, dye.read.attach(1))
    gl!.uniform1f(programs.advection.uniforms.dissipation, DYE_DISSIPATION)
    blit(dye.write)
    dye.swap()

    // Composite: premultiplied ink over the page
    gl!.bindFramebuffer(gl!.FRAMEBUFFER, null)
    gl!.viewport(0, 0, canvas.width, canvas.height)
    gl!.clearColor(0, 0, 0, 0)
    gl!.clear(gl!.COLOR_BUFFER_BIT)
    programs.display.bind()
    gl!.uniform1i(programs.display.uniforms.uTexture, dye.read.attach(0))
    gl!.uniform3f(programs.display.uniforms.inkColor, inkColor[0], inkColor[1], inkColor[2])
    blit(null)
  }

  raf = requestAnimationFrame(step)
  const onResize = () => resizeCanvas()
  window.addEventListener('resize', onResize)

  return {
    splat(x, y, dx, dy, amount = 0.5) {
      pending.push({ x, y, dx, dy, amount })
      if (pending.length > 24) pending.splice(0, pending.length - 24)
    },
    setPaused(p) {
      paused = p
      if (!p) lastTime = performance.now()
    },
    resize: resizeCanvas,
    destroy() {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      gl!.getExtension('WEBGL_lose_context')?.loseContext()
    },
  }
}

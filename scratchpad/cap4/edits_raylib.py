#!/usr/bin/env python3
# edits_raylib.py — the "make it doable" content decisions for raylib (2026-09-25).
# The owner's own example: "read AND practice a whole chapter of Nature of Code in one
# task in one day". So: no NoC or Book-of-Shaders chapter is one leaf any more — each is
# split at its own section boundaries, and the p5.js exercise / raylib port that follow
# are priced as the real sittings they are (a video minute ported to C++ is not a minute).
import json, os, collections
E = collections.OrderedDict()
Q = chr(34)
def split(leaf, *parts): E[leaf] = {"split": [dict(p) for p in parts]}
def price(leaf, est): E[leaf] = {"est": est}
def P(est, label, **kw): return dict(est=est, label=label, **kw)
A = lambda url, text: f'<a href="{url}" target="_blank" rel="noopener">{text}</a>'
NOC = lambda slug, text: A(f"https://natureofcode.com/{slug}/", text)

# ---- Nature of Code: one chapter is never one sitting ----
split("d02.t1.s1",
  P(30, f'Read NoC {NOC("random", "Introduction")} I.1–I.3: the random walker, and why a uniform distribution looks wrong. (Local PDF pp.1–26.)'),
  P(30, 'Then the Introduction I.4–I.6: non-uniform & Gaussian distributions, then Perlin noise.'))
split("d04.t1.s1",
  P(30, f'Read NoC {NOC("vectors", "Ch.1")} 1.1–1.3: what a vector is, adding and subtracting them.'),
  P(30, 'Then NoC Ch.1 1.4–1.6: scaling, magnitude, and normalization.'))
split("d09.t1.s1",
  P(30, f'Read NoC {NOC("forces", "Ch.2")} 2.1–2.3: Newton’s laws, and <code>a = F/m</code> as code.'),
  P(25, 'Then NoC Ch.2 2.4–2.5: force accumulation, and what mass changes.'))
split("d11.t1.s1",
  P(25, 'Read NoC Ch.2 2.6: modeling gravity as weight (<code>m·g</code>) — not as attraction.'),
  P(30, 'Then NoC Ch.2 2.7–2.8: friction, and air/fluid resistance.'))
split("d16.t1.s1",
  P(30, f'Read NoC {NOC("oscillation", "Ch.3")} 3.1–3.3: angles, angular motion, and trig on screen.'),
  P(25, 'Then NoC Ch.3 3.4–3.5: <b>polar ↔ Cartesian</b>, the conversion the whole burst depends on.'))
split("d18.t1.s1",
  P(30, 'Read NoC Ch.3 3.6–3.8: amplitude, period, and waves.'),
  P(30, 'Then NoC Ch.3 3.9–3.10: the pendulum, and <b>spring forces</b> (Hooke’s law <code>F = −k·x</code>).'))
split("d21.t1.s1",
  P(25, f'Read NoC {NOC("particles", "Ch.4")} 4.1–4.3: a Particle (pos/vel/acc/lifespan), and an array of them.'),
  P(25, 'Then NoC Ch.4 4.4–4.5: the ParticleSystem class, and a system of systems.'))
price("d25.t1.s1", 40)

# ---- The Book of Shaders: same treatment ----
split("d43.t1.s1",
  P(25, f'Read {A("https://thebookofshaders.com/", "The Book of Shaders")} Ch.1: what a fragment shader is — one program, run per pixel.'),
  P(30, 'Then BoS Ch.2: GLSL, Hello World, uniforms and <code>gl_FragCoord</code>.'))
split("d44.t1.s1",
  P(25, 'Read BoS Ch.3.1: step, smoothstep, and sin/cos shaping functions.'),
  P(25, 'Then BoS Ch.3.2: mix, gradients, and HSB colour.'))
split("d47.t1.s1",
  P(30, 'Read BoS Ch.4.1–4.4: <code>random</code> on the GPU, and controlling chaos.'),
  P(30, 'Then BoS Ch.4.5–4.8: 2D value & gradient noise, and using noise.'))
split("d50.t1.s1",
  P(25, 'Read BoS Ch.5 up to kernel convolution: textures and blend modes.'),
  P(30, 'Then the rest of BoS Ch.5: kernel convolution and the Gaussian blur.'))

# ---- Clear Code port-along: porting a video minute to C++ is not a video minute ----
price("d15.t1.s1", 40)
price("d15.t1.s2", 40)
price("d15.t1.s3", 40)
split("d28.t1.s1",
  P(40, 'Clear Code 1:17–1:40 (Cameras, Using classes) — port to C++.'),
  P(35, 'Clear Code 1:40–2:00 (Collision resolution) — port to C++.'),
  P(40, 'Clear Code 2:00–2:18 (Timers, Animations) — port to C++.'))
split("d40.t1.s1",
  P(40, 'Clear Code 3:21–3:50 (3D basics, 3D imports) — port to C++.'),
  P(40, 'Clear Code 3:50–end (3D collisions, Shaders, the 3D game) — port to C++.'))

# ---- Udemy course: the two 60-minute watch leaves ----
split("d03.t1.s1",
  P(30, 'Udemy §3 Shapes (first part): the screen coordinate system and <code>DrawRectangle</code>/<code>DrawCircle</code>/<code>DrawLine</code>.'),
  P(30, 'Udemy §3 (continued): <code>Color</code> structs & constants, and the y-axis convention that will bite every ported formula.'))
split("d20.t1.s1",
  P(35, 'Udemy §6 Projects: follow the first guided game as far as its core loop.'),
  P(30, 'Finish that project — scoring, reset, and the polish pass.'))

# ---- the long tail, by kind ----
E["_rules"] = [
  # p5.js exercise leaves: the owner asked for these to be real practice, not a skim
  {"cat": "exercise", "mul": 1.4},
  # the raylib port / Big Bang build leaves: typing, compiling and debugging C++
  {"cat": "project", "mul": 1.2},
  {"cat": "code", "min": 25, "mul": 1.2},
]

if __name__ == "__main__":
    json.dump(E, open(os.path.join(os.path.dirname(__file__), "edits/raylib.json"), "w"), indent=1, ensure_ascii=False)
    print(f"{len(E) - 1} raylib leaf decisions + {len(E['_rules'])} by-kind rules")

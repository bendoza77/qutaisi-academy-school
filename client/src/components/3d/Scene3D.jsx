import { useEffect, useRef } from "react";
import {
  AdditiveBlending,
  BufferGeometry,
  Float32BufferAttribute,
  Group,
  IcosahedronGeometry,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  OctahedronGeometry,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  TetrahedronGeometry,
  TorusGeometry,
  TorusKnotGeometry,
  WebGLRenderer,
} from "three";

/* Brand palette, as the hex numbers three.js wants. Kept in step with the
   accent / primary / gold ramps in index.css — the 3D layer has to read as
   part of the design system, not as a demo dropped on top of it. */
const ACCENT_200 = 0xa3e6ef;
const ACCENT_300 = 0x6ad3e2;
const ACCENT_400 = 0x33bad0;
const PRIMARY_300 = 0x8fadd2;
const PRIMARY_900 = 0x12233f;
const GOLD_300 = 0xe8d093;

/** Spherical to cartesian, in the order the ring builders below want it. */
function spherical(r, lon, lat) {
  return [r * Math.sin(lat) * Math.cos(lon), r * Math.cos(lat), r * Math.sin(lat) * Math.sin(lon)];
}

/**
 * A latitude/longitude cage as a single LineSegments buffer — one draw call
 * for the whole globe. `wireframe: true` on a sphere mesh would draw the
 * triangulation instead, which reads as a disco ball rather than a map.
 */
function globeCage(radius, meridians, parallels, segments) {
  const points = [];

  for (let m = 0; m < meridians; m++) {
    const lon = (m / meridians) * Math.PI * 2;
    for (let s = 0; s < segments; s++) {
      points.push(
        ...spherical(radius, lon, (s / segments) * Math.PI),
        ...spherical(radius, lon, ((s + 1) / segments) * Math.PI),
      );
    }
  }

  for (let p = 1; p <= parallels; p++) {
    const lat = (p / (parallels + 1)) * Math.PI;
    for (let s = 0; s < segments; s++) {
      points.push(
        ...spherical(radius, (s / segments) * Math.PI * 2, lat),
        ...spherical(radius, ((s + 1) / segments) * Math.PI * 2, lat),
      );
    }
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(points, 3));
  return geometry;
}

/** Evenly spread points on a sphere — the Fibonacci lattice. */
function fibonacciSphere(count, radius) {
  const points = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const ring = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    points.push(Math.cos(theta) * ring * radius, y * radius, Math.sin(theta) * ring * radius);
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(points, 3));
  return geometry;
}

/** Wireframe solid plus a barely-there glass body, as one animatable unit. */
function wireSolid(geometry, color, opacity) {
  const group = new Group();
  group.add(
    new Mesh(geometry, new MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity })),
  );
  group.add(
    new Mesh(geometry, new MeshBasicMaterial({ color, transparent: true, opacity: opacity * 0.16 })),
  );
  return group;
}

/* Variant: drifting polyhedra. Behind the hero and the closing CTA. Low-poly
   on purpose — the wireframe has to stay readable behind text. */
function buildShapes(root, dense) {
  /* Positions hug the corners and the outer gutters. Every section that uses
     this variant runs copy down the middle-left and a panel on the right, so
     the middle band is left empty on purpose — a wireframe crossing an H1 is
     noise, not depth. */
  const specs = [
    { geometry: new IcosahedronGeometry(1.05, 0),        color: ACCENT_300,  opacity: 0.34, position: [-5.2,  1.95, -2.0], spin:  0.11, float: 0.30 },
    { geometry: new OctahedronGeometry(0.85, 0),         color: PRIMARY_300, opacity: 0.30, position: [ 4.7, -2.05, -1.5], spin: -0.15, float: 0.36 },
    { geometry: new TorusKnotGeometry(0.5, 0.16, 72, 6), color: ACCENT_400,  opacity: 0.28, position: [ 3.5,  2.30, -2.6], spin:  0.09, float: 0.24 },
    { geometry: new TorusGeometry(0.6, 0.17, 6, 28),     color: GOLD_300,    opacity: 0.22, position: [-6.3, -2.60, -3.0], spin: -0.12, float: 0.30 },
    { geometry: new TetrahedronGeometry(0.7, 0),         color: ACCENT_300,  opacity: 0.26, position: [ 0.6,  2.70, -3.4], spin:  0.17, float: 0.42 },
    { geometry: new IcosahedronGeometry(0.5, 0),         color: PRIMARY_300, opacity: 0.26, position: [ 5.5,  0.60, -3.0], spin:  0.14, float: 0.28 },
  ];

  const solids = (dense ? specs : specs.slice(0, 4)).map((spec, i) => {
    const node = wireSolid(spec.geometry, spec.color, spec.opacity);
    node.position.set(...spec.position);
    root.add(node);
    return { node, spin: spec.spin, float: spec.float, baseY: spec.position[1], phase: i * 1.7 };
  });

  const positions = [];
  for (let i = 0; i < (dense ? 160 : 90); i++) {
    positions.push((Math.random() - 0.5) * 16, (Math.random() - 0.5) * 9, -Math.random() * 7 - 1);
  }
  const starGeometry = new BufferGeometry();
  starGeometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  const starField = new Points(
    starGeometry,
    new PointsMaterial({
      color: ACCENT_200,
      size: 0.055,
      transparent: true,
      opacity: 0.45,
      blending: AdditiveBlending,
      depthWrite: false,
    }),
  );
  root.add(starField);

  return (t) => {
    for (const solid of solids) {
      solid.node.rotation.x = t * solid.spin;
      solid.node.rotation.y = t * solid.spin * 1.35;
      solid.node.position.y = solid.baseY + Math.sin(t * 0.5 + solid.phase) * solid.float;
    }
    starField.rotation.y = t * 0.014;
  };
}

/* Variant: the ICEF globe. A network, not a planet — a lat/long cage, a node
   for every partner, two inclined orbits and three satellites. It carries the
   meaning of the section it sits behind: an academy plugged into a worldwide
   body of accredited agencies. */
function buildGlobe(root, dense) {
  const R = 1.75;

  const cage = new LineSegments(
    globeCage(R, dense ? 14 : 10, dense ? 7 : 5, dense ? 56 : 36),
    new LineBasicMaterial({ color: ACCENT_400, transparent: true, opacity: 0.24 }),
  );
  root.add(cage);

  const nodes = new Points(
    fibonacciSphere(dense ? 120 : 70, R * 1.012),
    new PointsMaterial({
      color: ACCENT_300,
      size: 0.06,
      transparent: true,
      opacity: 0.85,
      blending: AdditiveBlending,
      depthWrite: false,
    }),
  );
  root.add(nodes);

  /* An opaque-ish core so the far side of the cage reads as "behind" — depth
     without a single light in the scene. */
  const core = new Mesh(
    new IcosahedronGeometry(R * 0.985, 2),
    new MeshBasicMaterial({ color: PRIMARY_900, transparent: true, opacity: 0.55 }),
  );
  root.add(core);

  const orbits = [
    { radius: R * 1.38, tilt: [1.15, 0, 0.35],   color: ACCENT_300, opacity: 0.35 },
    { radius: R * 1.62, tilt: [1.42, 0.4, -0.25], color: GOLD_300,  opacity: 0.26 },
  ].map(({ radius, tilt, color, opacity }) => {
    const ring = new Mesh(
      new TorusGeometry(radius, 0.006, 3, 128),
      new MeshBasicMaterial({ color, transparent: true, opacity }),
    );
    ring.rotation.set(...tilt);
    root.add(ring);
    return ring;
  });

  const satelliteGeometry = new OctahedronGeometry(0.075, 0);
  const satellites = [0, 2.1, 4.2].map((phase, i) => {
    const mesh = new Mesh(
      satelliteGeometry,
      new MeshBasicMaterial({ color: i === 1 ? GOLD_300 : ACCENT_300, transparent: true, opacity: 0.9 }),
    );
    root.add(mesh);
    return { mesh, phase, radius: R * (1.38 + i * 0.12), speed: 0.32 - i * 0.07 };
  });

  return (t) => {
    cage.rotation.y = t * 0.075;
    nodes.rotation.y = t * 0.075;
    orbits[0].rotation.z = 0.35 + t * 0.06;
    orbits[1].rotation.z = -0.25 - t * 0.045;

    for (const satellite of satellites) {
      const a = t * satellite.speed + satellite.phase;
      satellite.mesh.position.set(
        Math.cos(a) * satellite.radius,
        Math.sin(a * 0.6) * satellite.radius * 0.42,
        Math.sin(a) * satellite.radius,
      );
      satellite.mesh.rotation.set(a, a * 1.3, 0);
    }
  };
}

const BUILDERS = { shapes: buildShapes, globe: buildGlobe };

/**
 * WebGL decoration layer. Fills its parent, never takes pointer events, and is
 * only ever mounted by <Lazy3D>, which owns the "should this run at all"
 * decision (idle, in view, motion preference, device class).
 *
 * Everything expensive is bounded:
 *  - device pixel ratio capped at 1.5. The extra pixels are invisible on a
 *    wireframe at this opacity and cost fill rate a phone does not have;
 *  - the loop stops the moment the canvas leaves the viewport or the tab is
 *    hidden, so a backgrounded page burns nothing;
 *  - prefers-reduced-motion composes one static frame and never starts a loop;
 *  - every geometry, material and the GL context itself are released on
 *    unmount, which matters on a SPA where routes come and go.
 *
 * @param {{ variant?: 'shapes'|'globe', cameraZ?: number }} props
 */
export default function Scene3D({ variant = "shapes", cameraZ = 6 }) {
  const hostRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer;
    try {
      renderer = new WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
    } catch {
      return; // No WebGL context — the CSS field underneath is the whole design already.
    }

    const dense = window.innerWidth >= 1024;
    const scene = new Scene();
    const camera = new PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.z = cameraZ;

    /* pivot carries the pointer parallax, root carries the animation, so the
       two never fight over the same rotation. */
    const pivot = new Group();
    const root = new Group();
    pivot.add(root);
    scene.add(pivot);

    const tick = (BUILDERS[variant] || buildShapes)(root, dense);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.domElement.style.cssText = "display:block;width:100%;height:100%";
    host.appendChild(renderer.domElement);

    const resize = () => {
      const { clientWidth: width, clientHeight: height } = host;
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);

    /* Pointer parallax, mouse only: the scene leans a few degrees towards the
       cursor. Enough to feel like depth, not enough to distract from copy. */
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const target = { x: 0, y: 0 };
    const onPointerMove = (event) => {
      target.x = (event.clientX / window.innerWidth - 0.5) * 0.26;
      target.y = (event.clientY / window.innerHeight - 0.5) * 0.18;
    };
    if (finePointer) window.addEventListener("pointermove", onPointerMove, { passive: true });

    let frame = 0;
    let elapsed = 0;
    let last = 0;
    let onScreen = true;

    const draw = (now) => {
      frame = requestAnimationFrame(draw);
      // Clamped: a tab restored after a minute must not teleport the scene.
      elapsed += Math.min((now - last) / 1000, 0.05);
      last = now;

      tick(elapsed);

      if (finePointer) {
        pivot.rotation.y += (target.x - pivot.rotation.y) * 0.035;
        pivot.rotation.x += (-target.y - pivot.rotation.x) * 0.035;
      }

      renderer.render(scene, camera);
    };

    const start = () => {
      if (frame || !onScreen || document.hidden) return;
      last = performance.now();
      frame = requestAnimationFrame(draw);
    };
    const stop = () => {
      if (!frame) return;
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let intersectionObserver;
    const onVisibilityChange = () => (document.hidden ? stop() : start());

    if (reduced) {
      tick(0);
      renderer.render(scene, camera);
    } else {
      intersectionObserver = new IntersectionObserver(([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen) start();
        else stop();
      });
      intersectionObserver.observe(host);
      document.addEventListener("visibilitychange", onVisibilityChange);
      start();
    }

    return () => {
      stop();
      intersectionObserver?.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      resizeObserver.disconnect();
      if (finePointer) window.removeEventListener("pointermove", onPointerMove);

      scene.traverse((object) => {
        object.geometry?.dispose();
        if (Array.isArray(object.material)) object.material.forEach((m) => m.dispose());
        else object.material?.dispose();
      });
      renderer.dispose();
      renderer.forceContextLoss?.();
      renderer.domElement.remove();
    };
  }, [variant, cameraZ]);

  return <div ref={hostRef} className="h-full w-full" />;
}

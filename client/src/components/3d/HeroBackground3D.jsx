import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'

function Geo({ type }) {
  if (type === 'icosa') return <icosahedronGeometry args={[1, 0]} />
  if (type === 'octa')  return <octahedronGeometry  args={[1, 0]} />
  if (type === 'torus') return <torusGeometry        args={[1, 0.22, 8, 24]} />
  return <icosahedronGeometry args={[1, 0]} />
}

function Shape({ position, type, color, scale = 1, speed = 1, rotOffset = 0 }) {
  const groupRef = useRef()

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.getElapsedTime()
    groupRef.current.rotation.x = Math.sin(t * 0.2 * speed + rotOffset) * 0.55
    groupRef.current.rotation.z = Math.cos(t * 0.15 * speed + rotOffset) * 0.35
  })

  return (
    <Float speed={speed * 0.75} floatIntensity={0.55} rotationIntensity={0.15}>
      <group ref={groupRef} position={position} scale={scale}>
        {/* Glass interior */}
        <mesh>
          <Geo type={type} />
          <meshPhysicalMaterial
            color={color}
            metalness={0.95}
            roughness={0.0}
            transparent
            opacity={0.07}
          />
        </mesh>
        {/* Wireframe edges */}
        <mesh>
          <Geo type={type} />
          <meshBasicMaterial color={color} wireframe transparent opacity={0.22} />
        </mesh>
      </group>
    </Float>
  )
}

function Particles({ count = 650 }) {
  const pointsRef = useRef()

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 26
      arr[i * 3 + 1] = (Math.random() - 0.5) * 15
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6
    }
    return arr
  }, [count])

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.011
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#93c5fd"
        transparent
        opacity={0.32}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

function HeroScene() {
  return (
    <>
      <ambientLight intensity={0.4} color="#93c5fd" />
      <directionalLight position={[5, 5, 5]} intensity={0.6} color="#60a5fa" />

      <Particles />

      {/* Left cluster */}
      <Shape position={[-6.2, 2.6, -2]}  type="icosa" color="#60a5fa" scale={1.7}  speed={0.72} rotOffset={0}   />
      <Shape position={[-7.5, -0.8, -3]} type="octa"  color="#60a5fa" scale={1.1}  speed={0.88} rotOffset={3.0} />

      {/* Right cluster */}
      <Shape position={[6.8, -1.5, -3]}  type="octa"  color="#93c5fd" scale={1.45} speed={1.05} rotOffset={1.2} />
      <Shape position={[7.8, 1.8, -4]}   type="torus" color="#93c5fd" scale={0.82} speed={1.18} rotOffset={1.8} />

      {/* Center / depth */}
      <Shape position={[-2.8, -3.2, -4]} type="torus" color="#3b82f6" scale={1.3}  speed={0.62} rotOffset={2.1} />
      <Shape position={[4.2, 3.8, -5]}   type="icosa" color="#bfdbfe" scale={0.92} speed={1.28} rotOffset={0.7} />
      <Shape position={[1.2, -2.2, -6]}  type="icosa" color="#dbeafe" scale={0.65} speed={0.9}  rotOffset={4.2} />
    </>
  )
}

export function HeroBackground3D() {
  return (
    <div
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }}
    >
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
      >
        <HeroScene />
      </Canvas>
    </div>
  )
}

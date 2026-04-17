import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'

function AboutScene() {
  const sphereRef = useRef()
  const wireRef   = useRef()
  const ring1     = useRef()
  const ring2     = useRef()
  const ring3     = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (sphereRef.current) {
      sphereRef.current.rotation.y = t * 0.2
      sphereRef.current.rotation.x = t * 0.07
    }
    if (wireRef.current) {
      wireRef.current.rotation.y = -t * 0.14
      wireRef.current.rotation.x =  t * 0.04
    }
    if (ring1.current) ring1.current.rotation.z = t * 0.44
    if (ring2.current) ring2.current.rotation.z = -t * 0.28
    if (ring3.current) {
      ring3.current.rotation.z = t * 0.18
      ring3.current.rotation.x = t * 0.09
    }
  })

  return (
    <>
      <ambientLight intensity={0.3} color="#3b82f6" />
      <pointLight position={[4, 4, 4]}   intensity={2.5} color="#60a5fa" distance={22} />
      <pointLight position={[-3, -2, 2]} intensity={1.2} color="#1e40af" distance={14} />

      {/* Globe body */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshPhysicalMaterial
          color="#1e3a8a"
          metalness={0.95}
          roughness={0.05}
          transparent
          opacity={0.45}
        />
      </mesh>

      {/* Wireframe latitude/longitude lines */}
      <mesh ref={wireRef} scale={1.018}>
        <sphereGeometry args={[1.2, 14, 14]} />
        <meshBasicMaterial color="#60a5fa" wireframe transparent opacity={0.28} />
      </mesh>

      {/* Orbiting ring 1 */}
      <mesh ref={ring1}>
        <torusGeometry args={[2.05, 0.022, 8, 80]} />
        <meshStandardMaterial color="#60a5fa" emissive="#60a5fa" emissiveIntensity={1.8} transparent opacity={0.65} />
      </mesh>

      {/* Orbiting ring 2 — tilted */}
      <mesh ref={ring2} rotation={[1.1, 0, 0]}>
        <torusGeometry args={[2.55, 0.018, 8, 80]} />
        <meshStandardMaterial color="#93c5fd" emissive="#93c5fd" emissiveIntensity={1.2} transparent opacity={0.5} />
      </mesh>

      {/* Orbiting ring 3 — tilted opposite */}
      <mesh ref={ring3} rotation={[-0.75, 0.45, 0]}>
        <torusGeometry args={[1.65, 0.016, 8, 60]} />
        <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={1.4} transparent opacity={0.55} />
      </mesh>
    </>
  )
}

export function AboutOrb3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.2], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      dpr={[1, 1.5]}
      style={{ width: '100%', height: '100%' }}
    >
      <AboutScene />
    </Canvas>
  )
}

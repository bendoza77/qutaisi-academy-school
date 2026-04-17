import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'

function CTAScene() {
  const sphereRef = useRef()
  const wireRef   = useRef()
  const ring1     = useRef()
  const ring2     = useRef()
  const ring3     = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (sphereRef.current) {
      sphereRef.current.rotation.y = t * 0.07
      sphereRef.current.rotation.x = t * 0.03
    }
    if (wireRef.current) {
      wireRef.current.rotation.y = -t * 0.05
    }
    if (ring1.current) ring1.current.rotation.z =  t * 0.14
    if (ring2.current) ring2.current.rotation.z = -t * 0.09
    if (ring3.current) ring3.current.rotation.z =  t * 0.06
  })

  return (
    <>
      <ambientLight intensity={0.25} color="#3b82f6" />
      <pointLight position={[5, 5, 3]} intensity={3.5} color="#60a5fa" distance={35} />

      {/* Central sphere */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[4, 32, 32]} />
        <meshPhysicalMaterial
          color="#1e3a8a"
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.1}
        />
      </mesh>

      {/* Wireframe latitude/longitude */}
      <mesh ref={wireRef} scale={1.015}>
        <sphereGeometry args={[4, 18, 18]} />
        <meshBasicMaterial color="#3b82f6" wireframe transparent opacity={0.07} />
      </mesh>

      {/* Large decorative rings */}
      <mesh ref={ring1} rotation={[0.5, 0, 0]}>
        <torusGeometry args={[5.8, 0.018, 8, 120]} />
        <meshStandardMaterial color="#60a5fa" emissive="#60a5fa" emissiveIntensity={0.9} transparent opacity={0.14} />
      </mesh>
      <mesh ref={ring2} rotation={[-0.3, 0.6, 0]}>
        <torusGeometry args={[7.2, 0.015, 8, 140]} />
        <meshStandardMaterial color="#93c5fd" emissive="#93c5fd" emissiveIntensity={0.7} transparent opacity={0.09} />
      </mesh>
      <mesh ref={ring3} rotation={[1.0, -0.3, 0.4]}>
        <torusGeometry args={[4.4, 0.014, 8, 100]} />
        <meshStandardMaterial color="#bfdbfe" emissive="#bfdbfe" emissiveIntensity={0.6} transparent opacity={0.1} />
      </mesh>
    </>
  )
}

export function CTABackground3D() {
  return (
    <div
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2 }}
    >
      <Canvas
        camera={{ position: [0, 0, 12], fov: 55 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
      >
        <CTAScene />
      </Canvas>
    </div>
  )
}

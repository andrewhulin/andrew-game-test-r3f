import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import * as THREE from 'three'
import { COLORS } from '../utils/constants'

export function SceneEnvironment() {
  const { scene } = useThree()

  useEffect(() => {
    scene.background = new THREE.Color(COLORS.background)
    scene.fog = new THREE.Fog(COLORS.fog, 12, 28)
  }, [scene])

  return null
}

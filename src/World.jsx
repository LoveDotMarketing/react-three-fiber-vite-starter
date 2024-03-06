import { useFrame } from "@react-three/fiber"
import { useRef } from "react"

export default function World()
{
    const knotRef = useRef()

    useFrame((state, delta) =>
    {
        //Called Every Frame
        knotRef.current.rotation.y += delta
    })

    return <>
        <mesh ref={ knotRef }>
            <torusKnotGeometry />
            <meshNormalMaterial />
        </mesh>
    </>
}
import React, { useEffect, useRef } from 'react';
import {MindARThree} from 'mind-ar/dist/mindar-image-three.prod.js';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const mindarThree = new MindARThree({
      container: containerRef.current,
      imageTargetSrc: "/business-card.mind"
    });
    const {renderer, scene, camera} = mindarThree;
    const anchor = mindarThree.addAnchor(0);

    /*const geometry = new THREE.PlaneGeometry(1, 0.55);
    const material = new THREE.MeshBasicMaterial( {color: 0x00ffff, transparent: true, opacity: 0.5} );
    const plane = new THREE.Mesh( geometry, material );*/

    const loader = new GLTFLoader();
    loader.load('/plane_sculpture-contrail_asm_asm.glb', (gltf) => {
      const model = gltf.scene;

      model.scale.set(0.1, 0.1, 0.1);

      // Apply steel-like material
      model.traverse((child) => {
        if (child.isMesh) {
          const steelMaterial = new THREE.MeshStandardMaterial({
            color: 0x808080, // Steel color
            metalness: 1.0, // Full metalness to mimic steel
            roughness: 0.2 // Slightly rough to mimic steel's appearance
          });
          child.material = steelMaterial;
        }
      });

      anchor.group.add(model);
    });


    mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });

    return () => {
      renderer.setAnimationLoop(null);
      mindarThree.stop();
    }
  }, []);

  return (
    <div style={{width: "100%", height: "100%"}} ref={containerRef}>
    </div>
  )
}
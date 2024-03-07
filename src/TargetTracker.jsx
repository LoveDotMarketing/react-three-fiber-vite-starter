import React, { useEffect, useRef } from 'react';
import {MindARThree} from 'mind-ar/dist/mindar-image-three.prod.js';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

export default () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const mindarThree = new MindARThree({
      container: containerRef.current,
      imageTargetSrc: "/business-card.mind"
    });
    const {renderer, scene, camera} = mindarThree;

    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 2;
    renderer.outputEncoding = THREE.sRGBEncoding;


    const anchor = mindarThree.addAnchor(0);

    const ambientLight = new THREE.AmbientLight(0xffffff, 2.0); // soft white light
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0);
    directionalLight.position.set(0, 1, 0); // adjust the direction
    scene.add(directionalLight);

    /*const geometry = new THREE.PlaneGeometry(1, 0.55);
    const material = new THREE.MeshBasicMaterial( {color: 0x00ffff, transparent: true, opacity: 0.5} );
    const plane = new THREE.Mesh( geometry, material );*/

    const loader = new GLTFLoader();
    loader.load('/plane_sculpture-contrail_asm_asm.glb', (gltf) => {
      const model = gltf.scene;

      model.scale.set(0.1, 0.1, 0.1);
      model.rotation.x = Math.PI / 2;
      model.rotation.z = Math.PI / 3;

      model.position.x = 0.5;

      // Apply steel-like material
      model.traverse((child) => {
        if (child.isMesh) {
          const steelMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff, // Steel color
            metalness: 1.0, // Full metalness to mimic steel
            roughness: 0.1 // Slightly rough to mimic steel's appearance
          });
          child.material = steelMaterial;
        }
      });

      anchor.group.add(model);
    });


    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    new RGBELoader()
      .setDataType(THREE.HalfFloatType) // If your HDR is not in float/ half float format
      .load('/venice_sunset_1k.hdr', (texture) => {
        const envMap = pmremGenerator.fromEquirectangular(texture).texture;
        pmremGenerator.dispose();
        scene.environment = envMap; // Set the processed HDR texture as the scene environment
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
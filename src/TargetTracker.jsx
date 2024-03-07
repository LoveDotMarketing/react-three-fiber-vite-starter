import React, { useEffect, useRef } from 'react';
import {MindARThree} from 'mind-ar/dist/mindar-image-three.prod.js';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

export default () => {
  const containerRef = useRef(null);
  const modelRef = useRef();

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

    const circleGeometry = new THREE.CircleGeometry(0.6, 32); // Adjust the radius as needed
    const circleMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const circleMesh = new THREE.Mesh(circleGeometry, circleMaterial);
    circleMesh.rotation.z = -Math.PI / 2; // Rotate the circle to be parallel to the ground
    circleMesh.position.z = -0.15; // Adjust the Y position to place it below the model

    anchor.group.add(circleMesh);

    const slabGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1); // Width, Height, Depth - adjust as needed
    const slabMaterial = new THREE.MeshLambertMaterial({ color: 0x808080 }); // Concrete color
    const slabMesh = new THREE.Mesh(slabGeometry, slabMaterial);
    slabMesh.position.z = 0; // Adjust so that it's right on top of the circle
    slabMesh.rotation.z = -Math.PI / 2;

    anchor.group.add(slabMesh);


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

      model.position.z = 0.25;
      model.position.y = -0.05;

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


      modelRef.current = model;

      anchor.group.add(model);
    });


    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    new RGBELoader()
      .setDataType(THREE.HalfFloatType)
      .load('/venice_sunset_1k.hdr', (texture) => {
        const envMap = pmremGenerator.fromEquirectangular(texture).texture;
        pmremGenerator.dispose();
        scene.environment = envMap; // Set the processed HDR texture as the scene environment
      });

    mindarThree.start();
    renderer.setAnimationLoop(() => {
      if (modelRef.current) {
        // This will rotate the model on the Z-axis over time
        //modelRef.current.rotation.y += 0.01;
      }
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
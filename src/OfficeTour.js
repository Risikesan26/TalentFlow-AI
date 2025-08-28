import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default function OfficeTour() {
  const mountRef = useRef(null);

  useEffect(() => {
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xFFFFFF);

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 1.6, 5); // like standing height

    // Renderer
    while (mountRef.current.firstChild) {
      mountRef.current.removeChild(mountRef.current.firstChild);
    }

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    // Lights
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(10, 10, 10);
    scene.add(light);

    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambient);

    // Load 3D model
    const loader = new GLTFLoader();
    loader.load(
      process.env.PUBLIC_URL + "/models/office.glb", // put your office.glb in public/models/
      (gltf) => {
        scene.add(gltf.scene);
      },
      undefined,
      (error) => {
        console.error("Error loading model:", error);
      }
    );

    // OrbitControls (scroll + rotate + pan)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enablePan = true;
    controls.enableZoom = true;
    controls.target.set(0, 1.6, 0);

    // Animate loop
    const animate = () => {
      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    // Cleanup
// Cleanup
return () => {
  renderer.dispose();
  if (mountRef.current && renderer.domElement && mountRef.current.contains(renderer.domElement)) {
    mountRef.current.removeChild(renderer.domElement);
  }
};
  }, []);

  return (
    <div
      ref={mountRef}
      style={{ width: "100%", height: "80vh", background: "black" }}
    />
  );
}

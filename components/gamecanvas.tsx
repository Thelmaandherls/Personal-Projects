import {useEffect, useRef} from 'react'
import * as THREE from 'three'

export default function GameCanvas() {
    const mountRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        const renderer = new THREE.WebGLRenderer()
        renderer.setSize(window.innerWidth, window.innerHeight)
        mountRef.current!.appendChild(renderer.domElement)

        const backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--background-color');
        scene.background = new THREE.Color(backgroundColor.trim());

        // Removed the rotating cube setup and animation
        // const geometry = new THREE.BoxGeometry();
        // const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
        // const cube = new THREE.Mesh(geometry, material);
        // scene.add(cube);

        const light = new THREE.PointLight(0xffffff, 1)
        light.position.set(5,5,5)
        scene.add(light)

        camera.position.z = 5

        // const animate = function () {
        //     requestAnimationFrame(animate);
        //     cube.rotation.x += 0.01;
        //     cube.rotation.y += 0.01;
        //     renderer.render(scene, camera);
        // };

        // animate();

    }, [])

    return <div className='absolute top-0 left-0 w-full h-full z-0' ref={mountRef} />
}
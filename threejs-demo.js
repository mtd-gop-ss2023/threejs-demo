import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GlitchPass } from 'three/addons/postprocessing/GlitchPass.js';
import { RenderPixelatedPass } from 'three/addons/postprocessing/RenderPixelatedPass.js';


function main() {
    const clock = new THREE.Clock(); // Used for animating the scene

    function initScene(scene) {
        // Add a plane 
        const planeGeometry = new THREE.PlaneGeometry(5, 5);
        const planeMaterial = new THREE.MeshStandardMaterial({ color: 'fuchsia' });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = -Math.PI / 2;
        scene.add(plane);

        // Add a cube
        const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: 0x00ff00 }));
        cube.position.set(-1, 1, 2);
        cube.update = function (dt) {
            // Rotate the cube
            cube.rotation.x += 1 * dt;
            cube.rotation.y += 2 * dt;
        };
        scene.add(cube);

        // Add another cube
        const cube2 = new THREE.Mesh(new THREE.BoxGeometry(.5, .5, .5), new THREE.MeshStandardMaterial({ color: 0x00ffff }));
        cube2.position.set(1.5, 1, -1);
        cube2.update = function (dt) {
            // Rotate the cube
            cube2.rotation.x += 3 * dt;
            cube2.rotation.y += 4 * dt;
        };
        scene.add(cube2);
    }

    // Create and init a scene
    const scene = new THREE.Scene();
    initScene(scene);


    // Create a camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(3, 2, 5);
    camera.lookAt(0, 0, 0);



    // Create a renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Create our nice camera controller
    const orbCtrl = new OrbitControls(camera, renderer.domElement);




    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.01);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);




    // Animation loop
    function animate() {
        requestAnimationFrame(animate); // ask for the browser to call this function on the next repaint

        const dt = clock.getDelta(); // get the time since the last repaint in seconds

        // call the update function for every object in the scene
        scene.traverse((obj) => {
            if (typeof obj.update === 'function') {
                obj.update(dt);
            }
        });

        // Render the scene
        renderer.render(scene, camera);
    }

    animate(); // Start the animation loop

}

main();
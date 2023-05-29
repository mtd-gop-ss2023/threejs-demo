import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GlitchPass } from 'three/addons/postprocessing/GlitchPass.js';
import { RenderPixelatedPass } from 'three/addons/postprocessing/RenderPixelatedPass.js';


function main() {
    let mixer, clips;
    const clock = new THREE.Clock(); // Used for animating the scene

    function initScene(scene) {
        // Add a plane with a texture
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load('https://threejs.org/examples/textures/brick_diffuse.jpg');
        const planeGeometry = new THREE.PlaneGeometry(5, 5);
        const planeMaterial = new THREE.MeshStandardMaterial({ map: texture });
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





        const loader = new GLTFLoader();
        loader.load('https://threejs.org/examples/models/gltf/RobotExpressive/RobotExpressive.glb', function (gltf) {

            const model = gltf.scene;


            model.castShadow = true;
            model.receiveShadow = true;
            //model.position.y = .1;
            //model.position.x=-1;
            model.scale.set(0.3, 0.3, 0.3);
            scene.add(model);

            // Create an AnimationMixer, and get the list of AnimationClip instances
            mixer = new THREE.AnimationMixer(model);
            clips = gltf.animations;

            // Play a specific animation
            const clip = THREE.AnimationClip.findByName(clips, 'Running');
            const action = mixer.clipAction(clip);
            action.play();

            // Enable shadows for ALL objects
            scene.traverse((obj) => {
                if (obj.isMesh) {
                    obj.castShadow = true;
                    obj.receiveShadow = true;
                }
            });

        }, undefined, function (e) {

            console.error(e);

        });
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
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    document.body.appendChild(renderer.domElement);


    const composer = new EffectComposer(renderer);

    composer.addPass(new RenderPass(scene, camera));
    //composer.addPass(new RenderPixelatedPass(6, scene, camera));
    //composer.addPass(new GlitchPass());




    const orbCtrl = new OrbitControls(camera, renderer.domElement);




    // Add lights for shadow casting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.01);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Set up shadow properties for the light
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;





    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        const dt = clock.getDelta();

        if (mixer) mixer.update(dt);

        scene.traverse((obj) => {
            if (obj.update) {
                obj.update(dt);
            }
        });


        //renderer.render(scene, camera);
        composer.render();
    }

    animate();

}

main();

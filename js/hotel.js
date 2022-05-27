
    function CreateRotationAnimation( period, axis = 'x' ) {

        const times = [ 0, period ], values = [ 0, 360 ];

        const trackName = '.rotation[' + axis + ']';

        const track = new NumberKeyframeTrack( trackName, times, values );

        return new AnimationClip( null, period, [ track ] );

    }

    function loadModels() {

        loader.load(
            "./room/room.gltf",
            // model loaded
            function(gltf){
    
                gltf.animations; // Array<THREE.AnimationClip>
                object = gltf.scene; // THREE.Group
                gltf.scenes; // Array<THREE.Group>
                gltf.cameras; // Array<THREE.Camera>
                gltf.asset; // Object
    
                console.log(gltf.scene);
    
                // const doorlight = new THREE.PointLight( 0xffff55, 10, 100 );
                // doorlight.position.set( -5, 5, -10 );
                // scene.add( doorlight );
                // const sphereSize = 1;
                // const pointLightHelper = new THREE.PointLightHelper( doorlight, sphereSize );
                // scene.add( pointLightHelper );

                // const clips = gltf.animations;
                // mixer = new THREE.AnimationMixer(gltf.scene)
                // const action = mixer.clipAction(clips[0])
                // action.reset().play()
    
                scene.add(gltf.scene);
    
            },
    
            // model loading
            function(xhr){
                console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
            },
            // called when loading has errors
            function ( error ) {
                console.log( 'An error happened' );
            }
        );
        
        // loader.load(
        //     "./doorAlone/door.gltf",
        //     // model loaded
        //     function(gltf){
    
        //         gltf.animations; // Array<THREE.AnimationClip>
        //         object = gltf.scene; // THREE.Group
        //         gltf.scenes; // Array<THREE.Group>
        //         gltf.cameras; // Array<THREE.Camera>
        //         gltf.asset; // Object
    
        //         console.log(gltf.scene);
    
        //         // const doorlight = new THREE.PointLight( 0xffff55, 10, 100 );
        //         // doorlight.position.set( -5, 5, -10 );
        //         // scene.add( doorlight );
        //         // const sphereSize = 1;
        //         // const pointLightHelper = new THREE.PointLightHelper( doorlight, sphereSize );
        //         // scene.add( pointLightHelper );

        //         const clips = gltf.animations;
        //         const mixerDoor = new THREE.AnimationMixer(gltf.scene)
        //         const action = mixerDoor.clipAction(clips[0])
        //         action.reset().play()
    
        //         scene.add(gltf.scene);
        //         mixers.push(mixerDoor)
    
        //         animate();
        //     },
    
        //     // model loading
        //     function(xhr){
        //         console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        //     },
        //     // called when loading has errors
        //     function ( error ) {
        //         console.log( 'An error happened' );
        //     }
        // );
    }

    // on resize
    window.addEventListener( 'resize', onWindowResize );



    // scene
    const scene = new THREE.Scene();

    // camera
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.set( -1, 2, -1 );
    // camera.lookAt( 0, 0, 0 );

    // renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    // light
    const light = new THREE.PointLight( 0xffff55, 10, 100 );
    light.position.set( -5, 5, 0 );
    // scene.add( light );

    const sphereSize = 1;
    const pointLightHelper = new THREE.PointLightHelper( light, sphereSize );
    scene.add( pointLightHelper );

    const whiteAmbient = new THREE.AmbientLight( 0x808080 , 5); // white ambient
    scene.add( whiteAmbient );

    // spotlight 1
    const spotLight = new THREE.SpotLight( 0xffffcc );
    spotLight.position.set( -1, 2.0, 1.9 );
    spotLight.castShadow = true;
    scene.add( spotLight );

    spotLight.target.position.set(-1, 5, 1.9);
    scene.add( spotLight.target );

    const spotLightHelper = new THREE.SpotLightHelper( spotLight );
    spotLightHelper.update();
    scene.add( spotLightHelper );

    // clock
    const clock = new THREE.Clock();

    // control
    const controls = new THREE.OrbitControls(camera, renderer.domElement);

    // loader
    const loader = new THREE.GLTFLoader();

    const mixers = [];

    var mixer;

    // Load obj
    loadModels()

    function animate() {
        requestAnimationFrame( animate );

        for ( const mixer of mixers ) mixer.update( delta );
        spotLightHelper.update();

        renderer.render( scene, camera );
    }
    animate();

    // on resize
    window.addEventListener( 'resize', onWindowResize );
    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

    }
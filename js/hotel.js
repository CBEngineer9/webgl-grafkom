
    function CreateRotationAnimation( period, axis = 'x' ) {

        const times = [ 0, period ], values = [ 0, 360 ];

        const trackName = '.rotation[' + axis + ']';

        const track = new NumberKeyframeTrack( trackName, times, values );

        return new AnimationClip( null, period, [ track ] );

    }



    // scene
    const scene = new THREE.Scene();

    // camera
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.set( -5, 2, -6 );
    camera.lookAt( 0, 0, 0 );

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
    spotLight.position.set( -4.7, 2.3, -0.7 );
    spotLight.castShadow = true;
    scene.add( spotLight );

    spotLight.target.position.set(-4.9, 5, -0.7);
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

    // Load obj
    loader.load(
        "./corridor/scene.gltf",
        // model loaded
        function(gltf){

            gltf.animations; // Array<THREE.AnimationClip>
            object = gltf.scene; // THREE.Group
            gltf.scenes; // Array<THREE.Group>
            gltf.cameras; // Array<THREE.Camera>
            gltf.asset; // Object

            scene.add(gltf.scene);

            animate();
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

    function animate() {
        requestAnimationFrame( animate );

        // mixer.update(clock.getDelta());

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
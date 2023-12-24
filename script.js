var camera,
    scene,
    light,
    mesh,
    renderer,
    raycaster,
    mouse,
    mouseX = 0,
    mouseY = 0,
    colors = [],
    meshes = [];

init();

function init() {
    camera = new THREE.PerspectiveCamera(80, window.innerWidth/window.innerHeight, 1, 4000);
    camera.position.z = 1000;

    scene = new THREE.Scene();
    scene.add(camera);

    light = new THREE.AmbientLight( 0xf4f4f4 );
    scene.add(light);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000012);

    document.body.appendChild(renderer.domElement);

    makeMeshes();

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    document.addEventListener('mousemove', onMouseMove, false);
    document.addEventListener('mousedown', onMouseDown, false);

    animate();
}

function animate() {
    requestAnimationFrame(animate);

    updateMeshes();
    renderer.render(scene, camera);
}

function makeMeshes() {
    var material,
        icosa = new THREE.IcosahedronGeometry(5, 0),
        dodeca = new THREE.DodecahedronGeometry(5, 0),
        octa = new THREE.OctahedronGeometry(5, 0),
        shapes = [icosa, dodeca, octa],
        geometry,
        zpos;

    for (zpos = -1000; zpos < 1000; zpos += 20) {
        material = new THREE.MeshLambertMaterial({color: Math.random() * 0xffffff, wireframe: true, wireframeLinewidth: 2});
        geometry = shapes[Math.floor(Math.random()*shapes.length)];
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = Math.random() * 1000 - 500;
        mesh.position.y = Math.random() * 1000 - 500;
        mesh.position.z = zpos;
        mesh.scale.x = mesh.scale.y = mesh.scale.z = 10;
        color = mesh.material.color;

        scene.add(mesh);
        meshes.push(mesh);
        colors.push(color);
    }
}

function updateMeshes() {
    var i;

    for (i = 0; i < meshes.length; i++) {
        mesh = meshes[i];
        mesh.rotation.x = Date.now() * 0.0005;
        mesh.rotation.y = Date.now() * 0.00025;

        mesh.position.z += 1;

        if (mesh.position.z > 1000) {
            mesh.position.z -= 2000;
        }
    }
}

function onMouseMove(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
}

function onMouseDown(event) {
    var intersects;

    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = - (event.clientY / renderer.domElement.clientHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    intersects = raycaster.intersectObjects(meshes);

    if (intersects.length > 0) {
        intersects[0].object.material.wireframe = false;
        intersects[0].object.material.opacity = 0.5;
    }
}
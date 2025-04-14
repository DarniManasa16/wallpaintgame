// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 1, 0);
scene.add(directionalLight);

// Create wall
const wallGeometry = new THREE.PlaneGeometry(10, 6);

// Initialize paint texture
const paintTexture = new THREE.DataTexture(
    new Uint8Array(1024 * 1024 * 4),
    1024,
    1024,
    THREE.RGBAFormat
);
paintTexture.needsUpdate = true;

// Create wall material with paint texture
const wallMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xffffff,
    side: THREE.DoubleSide,
    map: paintTexture
});

const wall = new THREE.Mesh(wallGeometry, wallMaterial);
wall.rotation.y = Math.PI / 4;
scene.add(wall);

// Camera position
camera.position.set(0, 2, 8);
camera.lookAt(0, 0, 0);

// Painting variables
let isPainting = false;
const colorPicker = document.getElementById('colorPicker');
const brushSize = document.getElementById('brushSize');
const clearButton = document.getElementById('clearButton');

// Raycaster for painting
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Painting function
function paint(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(wall);

    if (intersects.length > 0) {
        const intersect = intersects[0];
        const uv = intersect.uv;
        
        // Update paint texture
        const size = parseInt(brushSize.value);
        const color = new THREE.Color(colorPicker.value);
        
        for (let i = -size; i <= size; i++) {
            for (let j = -size; j <= size; j++) {
                const x = Math.floor(uv.x * 1024 + i);
                const y = Math.floor(uv.y * 1024 + j);
                
                if (x >= 0 && x < 1024 && y >= 0 && y < 1024) {
                    const index = (y * 1024 + x) * 4;
                    paintTexture.image.data[index] = color.r * 255;
                    paintTexture.image.data[index + 1] = color.g * 255;
                    paintTexture.image.data[index + 2] = color.b * 255;
                    paintTexture.image.data[index + 3] = 255;
                }
            }
        }
        paintTexture.needsUpdate = true;
    }
}

// Clear wall function
function clearWall() {
    const data = paintTexture.image.data;
    for (let i = 0; i < data.length; i += 4) {
        data[i] = 255;     // R
        data[i + 1] = 255; // G
        data[i + 2] = 255; // B
        data[i + 3] = 255; // A
    }
    paintTexture.needsUpdate = true;
}

// Event listeners
renderer.domElement.addEventListener('mousedown', () => isPainting = true);
renderer.domElement.addEventListener('mouseup', () => isPainting = false);
renderer.domElement.addEventListener('mousemove', (event) => {
    if (isPainting) paint(event);
});
clearButton.addEventListener('click', clearWall);

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate(); 
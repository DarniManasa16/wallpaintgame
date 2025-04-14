import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Controls
const controls = new PointerLockControls(camera, document.body);
scene.add(controls.getObject());

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 10, 5);
directionalLight.castShadow = true;
scene.add(directionalLight);

// Create room
const roomGeometry = new THREE.BoxGeometry(20, 10, 20);
const roomMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xffffff,
    side: THREE.BackSide
});
const room = new THREE.Mesh(roomGeometry, roomMaterial);
room.receiveShadow = true;
scene.add(room);

// Create paintable walls
const wallGeometry = new THREE.PlaneGeometry(10, 6);
const paintTexture = new THREE.DataTexture(
    new Uint8Array(1024 * 1024 * 4),
    1024,
    1024,
    THREE.RGBAFormat
);
paintTexture.needsUpdate = true;

const wallMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xffffff,
    side: THREE.DoubleSide,
    map: paintTexture
});

// Create multiple walls
const walls = [];
const wallPositions = [
    { x: 0, z: -9.9, rotation: 0 },
    { x: 9.9, z: 0, rotation: Math.PI / 2 },
    { x: 0, z: 9.9, rotation: Math.PI },
    { x: -9.9, z: 0, rotation: -Math.PI / 2 }
];

wallPositions.forEach(pos => {
    const wall = new THREE.Mesh(wallGeometry, wallMaterial.clone());
    wall.position.set(pos.x, 0, pos.z);
    wall.rotation.y = pos.rotation;
    wall.receiveShadow = true;
    scene.add(wall);
    walls.push(wall);
});

// Painting variables
let isPainting = false;
const colorPicker = document.getElementById('colorPicker');
const brushSize = document.getElementById('brushSize');
const clearButton = document.getElementById('clearButton');
const styleButton = document.getElementById('styleButton');
let currentStyle = 'normal';
const styles = ['normal', 'spray', 'brush', 'marker'];

// Raycaster for painting
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Movement variables
const moveSpeed = 0.15;
const keys = {
    w: false,
    a: false,
    s: false,
    d: false
};

// Painting function
function paint(event) {
    if (!isPainting) return;
    
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(walls);

    if (intersects.length > 0) {
        const intersect = intersects[0];
        const wall = intersect.object;
        const uv = intersect.uv;
        
        // Update paint texture
        const size = parseInt(brushSize.value);
        const color = new THREE.Color(colorPicker.value);
        
        // Different painting styles
        switch(currentStyle) {
            case 'normal':
                drawNormalPaint(uv, size, color, wall);
                break;
            case 'spray':
                drawSprayPaint(uv, size, color, wall);
                break;
            case 'brush':
                drawBrushPaint(uv, size, color, wall);
                break;
            case 'marker':
                drawMarkerPaint(uv, size, color, wall);
                break;
        }
        
        wall.material.map.needsUpdate = true;
    }
}

// Painting styles
function drawNormalPaint(uv, size, color, wall) {
    for (let i = -size; i <= size; i++) {
        for (let j = -size; j <= size; j++) {
            const x = Math.floor(uv.x * 1024 + i);
            const y = Math.floor(uv.y * 1024 + j);
            
            if (x >= 0 && x < 1024 && y >= 0 && y < 1024) {
                const index = (y * 1024 + x) * 4;
                wall.material.map.image.data[index] = color.r * 255;
                wall.material.map.image.data[index + 1] = color.g * 255;
                wall.material.map.image.data[index + 2] = color.b * 255;
                wall.material.map.image.data[index + 3] = 255;
            }
        }
    }
}

function drawSprayPaint(uv, size, color, wall) {
    for (let i = 0; i < 50; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * size;
        const x = Math.floor(uv.x * 1024 + Math.cos(angle) * distance);
        const y = Math.floor(uv.y * 1024 + Math.sin(angle) * distance);
        
        if (x >= 0 && x < 1024 && y >= 0 && y < 1024) {
            const index = (y * 1024 + x) * 4;
            wall.material.map.image.data[index] = color.r * 255;
            wall.material.map.image.data[index + 1] = color.g * 255;
            wall.material.map.image.data[index + 2] = color.b * 255;
            wall.material.map.image.data[index + 3] = 255;
        }
    }
}

function drawBrushPaint(uv, size, color, wall) {
    const points = 10;
    for (let i = 0; i < points; i++) {
        const x = Math.floor(uv.x * 1024 + (Math.random() - 0.5) * size);
        const y = Math.floor(uv.y * 1024 + (Math.random() - 0.5) * size);
        
        if (x >= 0 && x < 1024 && y >= 0 && y < 1024) {
            const index = (y * 1024 + x) * 4;
            wall.material.map.image.data[index] = color.r * 255;
            wall.material.map.image.data[index + 1] = color.g * 255;
            wall.material.map.image.data[index + 2] = color.b * 255;
            wall.material.map.image.data[index + 3] = 255;
        }
    }
}

function drawMarkerPaint(uv, size, color, wall) {
    for (let i = -size; i <= size; i++) {
        const x = Math.floor(uv.x * 1024 + i);
        const y = Math.floor(uv.y * 1024);
        
        if (x >= 0 && x < 1024 && y >= 0 && y < 1024) {
            const index = (y * 1024 + x) * 4;
            wall.material.map.image.data[index] = color.r * 255;
            wall.material.map.image.data[index + 1] = color.g * 255;
            wall.material.map.image.data[index + 2] = color.b * 255;
            wall.material.map.image.data[index + 3] = 255;
        }
    }
}

// Clear walls
function clearWalls() {
    walls.forEach(wall => {
        const data = wall.material.map.image.data;
        for (let i = 0; i < data.length; i += 4) {
            data[i] = 255;     // R
            data[i + 1] = 255; // G
            data[i + 2] = 255; // B
            data[i + 3] = 255; // A
        }
        wall.material.map.needsUpdate = true;
    });
}

// Change painting style
function changeStyle() {
    const currentIndex = styles.indexOf(currentStyle);
    currentStyle = styles[(currentIndex + 1) % styles.length];
    styleButton.textContent = `Style: ${currentStyle}`;
}

// Event listeners
document.addEventListener('click', () => {
    controls.lock();
});

controls.addEventListener('lock', () => {
    document.getElementById('info').style.display = 'none';
});

controls.addEventListener('unlock', () => {
    document.getElementById('info').style.display = 'block';
});

// Keyboard event listeners
document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    if (key in keys) {
        keys[key] = true;
    }
});

document.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    if (key in keys) {
        keys[key] = false;
    }
});

// Painting event listeners
renderer.domElement.addEventListener('mousedown', () => isPainting = true);
renderer.domElement.addEventListener('mouseup', () => isPainting = false);
renderer.domElement.addEventListener('mousemove', paint);
renderer.domElement.addEventListener('mouseleave', () => isPainting = false);
clearButton.addEventListener('click', clearWalls);
styleButton.addEventListener('click', changeStyle);

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Set initial camera position
camera.position.set(0, 2, 0);

// Animation loop with improved movement
function animate() {
    requestAnimationFrame(animate);
    
    // Handle movement
    if (controls.isLocked) {
        const direction = new THREE.Vector3();
        
        // Get camera direction
        const cameraDirection = new THREE.Vector3();
        controls.getObject().getWorldDirection(cameraDirection);
        cameraDirection.y = 0; // Keep movement on the horizontal plane
        cameraDirection.normalize();
        
        // Calculate movement direction
        if (keys.w) direction.add(cameraDirection);
        if (keys.s) direction.sub(cameraDirection);
        if (keys.a) direction.add(new THREE.Vector3(-cameraDirection.z, 0, cameraDirection.x));
        if (keys.d) direction.add(new THREE.Vector3(cameraDirection.z, 0, -cameraDirection.x));
        
        // Normalize and apply movement
        if (direction.length() > 0) {
            direction.normalize();
            controls.moveForward(direction.z * moveSpeed);
            controls.moveRight(direction.x * moveSpeed);
        }
    }
    
    renderer.render(scene, camera);
}

// Start animation loop
animate(); 
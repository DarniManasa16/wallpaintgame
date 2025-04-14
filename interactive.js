// Create main canvas
const canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.getElementById('canvas-container').appendChild(canvas);

// Create effects canvas (for glow, etc.)
const effectsCanvas = document.createElement('canvas');
effectsCanvas.width = window.innerWidth;
effectsCanvas.height = window.innerHeight;
effectsCanvas.style.zIndex = '1';
document.getElementById('canvas-container').appendChild(effectsCanvas);

// Get contexts
const ctx = canvas.getContext('2d');
const effectsCtx = effectsCanvas.getContext('2d');

// Set background
ctx.fillStyle = '#000';
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Painting variables
let isPainting = false;
let lastX = 0;
let lastY = 0;
let currentTool = 'brush';
let activeEffects = {
    glow: false,
    rainbow: false,
    mirror: false,
    symmetry: false
};
let hue = 0;
let lastDrawTime = 0;
let particles = [];

// Get controls
const colorPicker = document.getElementById('colorPicker');
const brushSize = document.getElementById('brushSize');
const clearButton = document.getElementById('clearButton');
const saveButton = document.getElementById('saveButton');
const toolButtons = document.querySelectorAll('.tool-button');
const effectButtons = document.querySelectorAll('.effect-button');

// Tool functions
function drawBrush(x, y, size, color) {
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
}

function drawSpray(x, y, size, color) {
    const density = 50;
    for (let i = 0; i < density; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * size;
        const sprayX = x + radius * Math.cos(angle);
        const sprayY = y + radius * Math.sin(angle);
        
        ctx.beginPath();
        ctx.arc(sprayX, sprayY, size / 10, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
    }
}

function drawEraser(x, y, size) {
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = '#000';
    ctx.fill();
}

function fillCanvas(x, y, color) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    
    // Get the color at the clicked position
    const targetColor = {
        r: pixels[(y * canvas.width + x) * 4],
        g: pixels[(y * canvas.width + x) * 4 + 1],
        b: pixels[(y * canvas.width + x) * 4 + 2],
        a: pixels[(y * canvas.width + x) * 4 + 3]
    };
    
    // Convert hex color to RGB
    const fillColor = hexToRgb(color);
    
    // Flood fill algorithm
    const stack = [[x, y]];
    while (stack.length > 0) {
        const [currentX, currentY] = stack.pop();
        const pos = (currentY * canvas.width + currentX) * 4;
        
        // Check if we're still within bounds and if the pixel matches the target color
        if (currentX < 0 || currentX >= canvas.width || currentY < 0 || currentY >= canvas.height) continue;
        if (pixels[pos] !== targetColor.r || pixels[pos + 1] !== targetColor.g || 
            pixels[pos + 2] !== targetColor.b || pixels[pos + 3] !== targetColor.a) continue;
        
        // Set the pixel to the fill color
        pixels[pos] = fillColor.r;
        pixels[pos + 1] = fillColor.g;
        pixels[pos + 2] = fillColor.b;
        pixels[pos + 3] = 255;
        
        // Add adjacent pixels to the stack
        stack.push([currentX + 1, currentY]);
        stack.push([currentX - 1, currentY]);
        stack.push([currentX, currentY + 1]);
        stack.push([currentX, currentY - 1]);
    }
    
    ctx.putImageData(imageData, 0, 0);
}

// Helper function to convert hex to RGB
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : {r: 0, g: 0, b: 0};
}

// Effect functions
function applyGlow() {
    // Create a temporary canvas for the glow effect
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    
    // Draw the main canvas onto the temporary canvas
    tempCtx.drawImage(canvas, 0, 0);
    
    // Apply a blur effect
    tempCtx.filter = 'blur(10px)';
    tempCtx.drawImage(canvas, 0, 0);
    
    // Draw the blurred image onto the effects canvas
    effectsCtx.clearRect(0, 0, effectsCanvas.width, effectsCanvas.height);
    effectsCtx.drawImage(tempCanvas, 0, 0);
    
    // Draw the original canvas on top
    effectsCtx.drawImage(canvas, 0, 0);
}

function applyRainbow() {
    // Update hue for rainbow effect
    hue = (hue + 1) % 360;
    return `hsl(${hue}, 100%, 50%)`;
}

function applyMirror(x, y, size, color) {
    // Draw on the opposite side of the canvas
    const mirrorX = canvas.width - x;
    if (currentTool === 'brush') {
        drawBrush(mirrorX, y, size, color);
    } else if (currentTool === 'spray') {
        drawSpray(mirrorX, y, size, color);
    } else if (currentTool === 'eraser') {
        drawEraser(mirrorX, y, size);
    }
}

function applySymmetry(x, y, size, color) {
    // Draw in 4 symmetrical points
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Calculate symmetrical points
    const points = [
        {x: x, y: y},
        {x: canvas.width - x, y: y},
        {x: x, y: canvas.height - y},
        {x: canvas.width - x, y: canvas.height - y}
    ];
    
    // Draw at each point
    points.forEach(point => {
        if (currentTool === 'brush') {
            drawBrush(point.x, point.y, size, color);
        } else if (currentTool === 'spray') {
            drawSpray(point.x, point.y, size, color);
        } else if (currentTool === 'eraser') {
            drawEraser(point.x, point.y, size);
        }
    });
}

// Particle system for effects
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 6 - 3;
        this.speedY = Math.random() * 6 - 3;
        this.life = 1;
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= 0.01;
        this.size -= 0.1;
    }
    
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color + Math.floor(this.life * 255).toString(16).padStart(2, '0');
        ctx.fill();
    }
}

function createParticles(x, y, color) {
    for (let i = 0; i < 10; i++) {
        particles.push(new Particle(x, y, color));
    }
}

function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();
        
        if (particles[i].life <= 0 || particles[i].size <= 0) {
            particles.splice(i, 1);
        }
    }
}

// Painting functions
function startPainting(e) {
    isPainting = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
    
    // Handle fill tool
    if (currentTool === 'fill') {
        fillCanvas(lastX, lastY, colorPicker.value);
        isPainting = false;
    }
}

function stopPainting() {
    isPainting = false;
}

function paint(e) {
    if (!isPainting) return;
    
    const x = e.offsetX;
    const y = e.offsetY;
    const size = parseInt(brushSize.value);
    let color = colorPicker.value;
    
    // Apply rainbow effect if active
    if (activeEffects.rainbow) {
        color = applyRainbow();
    }
    
    // Draw based on current tool
    if (currentTool === 'brush') {
        drawBrush(x, y, size, color);
        
        // Create particles for brush effect
        if (Date.now() - lastDrawTime > 50) {
            createParticles(x, y, color);
            lastDrawTime = Date.now();
        }
    } else if (currentTool === 'spray') {
        drawSpray(x, y, size, color);
    } else if (currentTool === 'eraser') {
        drawEraser(x, y, size);
    }
    
    // Apply mirror effect if active
    if (activeEffects.mirror) {
        applyMirror(x, y, size, color);
    }
    
    // Apply symmetry effect if active
    if (activeEffects.symmetry) {
        applySymmetry(x, y, size, color);
    }
    
    // Apply glow effect if active
    if (activeEffects.glow) {
        applyGlow();
    }
    
    [lastX, lastY] = [x, y];
}

// Clear canvas
function clearCanvas() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    effectsCtx.clearRect(0, 0, effectsCanvas.width, effectsCanvas.height);
    particles = [];
}

// Save canvas
function saveCanvas() {
    const link = document.createElement('a');
    link.download = 'wall-art.png';
    link.href = canvas.toDataURL();
    link.click();
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    updateParticles();
}

// Event listeners
canvas.addEventListener('mousedown', startPainting);
canvas.addEventListener('mouseup', stopPainting);
canvas.addEventListener('mouseout', stopPainting);
canvas.addEventListener('mousemove', paint);
clearButton.addEventListener('click', clearCanvas);
saveButton.addEventListener('click', saveCanvas);

// Tool selection
toolButtons.forEach(button => {
    button.addEventListener('click', () => {
        toolButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentTool = button.dataset.tool;
    });
});

// Effect toggles
effectButtons.forEach(button => {
    button.addEventListener('click', () => {
        const effect = button.dataset.effect;
        activeEffects[effect] = !activeEffects[effect];
        button.classList.toggle('active');
        
        // Clear effects canvas if no effects are active
        if (!Object.values(activeEffects).some(value => value)) {
            effectsCtx.clearRect(0, 0, effectsCanvas.width, effectsCanvas.height);
        }
    });
});

// Handle window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    effectsCanvas.width = window.innerWidth;
    effectsCanvas.height = window.innerHeight;
    
    // Redraw background
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Reapply effects if needed
    if (activeEffects.glow) {
        applyGlow();
    }
});

// Start animation loop
animate(); 
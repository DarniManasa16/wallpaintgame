// Get canvas and context
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Set up canvas
ctx.fillStyle = 'white';
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.lineCap = 'round';
ctx.lineJoin = 'round';

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
    ctx.fillStyle = 'white';
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

// Painting functions
function startPosition(e) {
    isPainting = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
    
    // Handle fill tool
    if (currentTool === 'fill') {
        fillCanvas(lastX, lastY, colorPicker.value);
        isPainting = false;
    }
}

function endPosition() {
    isPainting = false;
}

function draw(e) {
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
    
    [lastX, lastY] = [x, y];
}

// Clear canvas
function clearCanvas() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Save canvas
function saveCanvas() {
    const link = document.createElement('a');
    link.download = 'wall-art.png';
    link.href = canvas.toDataURL();
    link.click();
}

// Event listeners
canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mouseup', endPosition);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseleave', endPosition);
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
    });
}); 
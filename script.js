const container = document.getElementById("container");
const resetBtn = document.getElementById("resetBtn");
const penBtn = document.getElementById("penBtn");
const eraserBtn = document.getElementById("eraserBtn");

let mode = "random"; // default mode: random RGB
let userColor = "#000000"; // stores user’s chosen pen color

// Default grid
createGrid(16);

function createGrid(size) {
  container.innerHTML = "";

  const squareSize = 960 / size;

  for (let i = 0; i < size * size; i++) {
    const square = document.createElement("div");
    square.classList.add("grid-square");
    square.style.width = `${squareSize}px`;
    square.style.height = `${squareSize}px`;

    // Track number of times square has been darkened
    square.dataset.shade = 0;

    square.addEventListener("mouseover", () => colorSquare(square));

    container.appendChild(square);
  }
}

// Handle coloring logic
function colorSquare(square) {
  if (mode === "eraser") {
    square.style.backgroundColor = "white";
    square.dataset.shade = 0;
    return;
  }

  let currentShade = parseInt(square.dataset.shade);

  if (currentShade === 0) {
    // First time → assign a base color
    if (mode === "random") {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      square.dataset.baseColor = `${r},${g},${b}`;
    } else if (mode === "pen") {
      // Convert hex to RGB
      const rgb = hexToRgb(userColor);
      square.dataset.baseColor = `${rgb.r},${rgb.g},${rgb.b}`;
    }
  }

  // Progressive darkening (10 steps max)
  if (currentShade < 10) {
    currentShade++;
    square.dataset.shade = currentShade;

    const [r, g, b] = square.dataset.baseColor.split(",").map(Number);
    const factor = (10 - currentShade) / 10; // 0.9 → 0 after 10 passes
    square.style.backgroundColor = `rgb(${r * factor}, ${g * factor}, ${b * factor})`;
  }
}

// Hex to RGB helper
function hexToRgb(hex) {
  const bigint = parseInt(hex.slice(1), 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  };
}

// Reset button → ask for new grid size
resetBtn.addEventListener("click", () => {
  let newSize = prompt("Enter new grid size (max 100):");
  newSize = parseInt(newSize);

  if (newSize && newSize > 0 && newSize <= 100) {
    createGrid(newSize);
  } else {
    alert("Invalid input! Please enter a number between 1 and 100.");
  }
});

// Pen button → pick custom color
penBtn.addEventListener("click", () => {
  const pickedColor = prompt("Enter pen color in HEX (e.g. #ff0000 for red):");
  if (/^#[0-9A-F]{6}$/i.test(pickedColor)) {
    userColor = pickedColor;
    mode = "pen";
  } else {
    alert("Invalid HEX color format!");
  }
});

// Eraser button
eraserBtn.addEventListener("click", () => {
  mode = "eraser";
});
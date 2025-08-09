const fs = require('fs');

// Load JSON
const data = JSON.parse(fs.readFileSync('./data.json', 'utf-8'));

// Extract number of total points and how many to use (first k)
const { n, k } = data.keys;

// Decode first k points
const decodedPoints = [];

for (let i = 1; i <= k; i++) {
  const entry = data[i.toString()];
  const base = parseInt(entry.base);
  const value = entry.value;
  const decodedY = parseInt(value, base);
  decodedPoints.push({ x: i, y: decodedY });
}

// Build system of equations for ax^2 + bx + c = y
const [p1, p2, p3] = decodedPoints;

const eq1 = [p1.x ** 2, p1.x, 1, p1.y];
const eq2 = [p2.x ** 2, p2.x, 1, p2.y];
const eq3 = [p3.x ** 2, p3.x, 1, p3.y];

function det3x3(m) {
  return (
    m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
    m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
    m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0])
  );
}

function replaceColumn(mat, colIndex, newCol) {
  return mat.map((row, i) => {
    const newRow = [...row];
    newRow[colIndex] = newCol[i];
    return newRow;
  });
}

// Coefficient matrix A and Y vector
const A = [
  [eq1[0], eq1[1], eq1[2]],
  [eq2[0], eq2[1], eq2[2]],
  [eq3[0], eq3[1], eq3[2]]
];
const Y = [eq1[3], eq2[3], eq3[3]];

// Solve using Cramer's rule
const D = det3x3(A);
const Dc = det3x3(replaceColumn(A, 2, Y));

// Solve for c
const c = Dc / D;

console.log(c);

import { beyblades } from "./globals.js";

// stats.js
export function updateStats() {
  const statsTable = document.getElementById('statsTable');
  statsTable.innerHTML = `
    <tr>
      <th>Beyblade</th>
      <th>Position (x, y)</th>
      <th>Velocity (vx, vy)</th>
      <th>Rotation</th>
      <th>Angular Velocity</th>
    </tr>
  `;

  beyblades.forEach((beyblade) => {
    const row = document.createElement('tr');

    // Use the Beyblade's actual name
    const nameCell = document.createElement('td');
    nameCell.textContent = beyblade.name; // Set to the actual Beyblade name

    // Set the color of the name based on the angular velocity
    nameCell.style.color = beyblade.angularVelocity === 0 ? 'grey' : beyblade.color;
    nameCell.style.fontWeight = 'bold'; // Make the name bold
    row.appendChild(nameCell);

    // Position
    const positionCell = document.createElement('td');
    positionCell.textContent = `(${beyblade.x.toFixed(2)}, ${beyblade.y.toFixed(2)})`;
    row.appendChild(positionCell);

    // Velocity
    const velocityCell = document.createElement('td');
    velocityCell.textContent = `(${beyblade.velocityX.toFixed(2)}, ${beyblade.velocityY.toFixed(2)})`;
    row.appendChild(velocityCell);

    // Rotation
    const rotationCell = document.createElement('td');
    rotationCell.textContent = beyblade.rotation.toFixed(2);
    row.appendChild(rotationCell);

    // Angular Velocity
    const angularVelocityCell = document.createElement('td');
    angularVelocityCell.textContent = beyblade.angularVelocity.toFixed(2);
    row.appendChild(angularVelocityCell);

    statsTable.appendChild(row);
  });
}

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
  
    beyblades.forEach((beyblade, index) => {
      const row = document.createElement('tr');
  
      const nameCell = document.createElement('td');
      nameCell.textContent = `Beyblade ${index + 1}`;
      row.appendChild(nameCell);
  
      const positionCell = document.createElement('td');
      positionCell.textContent = `(${beyblade.x.toFixed(2)}, ${beyblade.y.toFixed(2)})`;
      row.appendChild(positionCell);
  
      const velocityCell = document.createElement('td');
      velocityCell.textContent = `(${beyblade.velocityX.toFixed(2)}, ${beyblade.velocityY.toFixed(2)})`;
      row.appendChild(velocityCell);
  
      const rotationCell = document.createElement('td');
      rotationCell.textContent = beyblade.rotation.toFixed(2);
      row.appendChild(rotationCell);
  
      const angularVelocityCell = document.createElement('td');
      angularVelocityCell.textContent = beyblade.angularVelocity.toFixed(2);
      row.appendChild(angularVelocityCell);
  
      statsTable.appendChild(row);
    });
  }
  
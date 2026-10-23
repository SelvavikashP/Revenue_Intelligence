const fs = require('fs');
const path = require('path');

const d1 = fs.readFileSync(path.join(__dirname, '../data/01_initial.json'), 'utf8');
const d2 = fs.readFileSync(path.join(__dirname, '../data/02_update.json'), 'utf8');

fs.writeFileSync(
  path.join(__dirname, '../src/data/rawInitial.ts'),
  `import { DeliveryEnvelope } from '../types/envelope';\n\nexport const INITIAL_DELIVERY: DeliveryEnvelope = ${d1};\n`
);

fs.writeFileSync(
  path.join(__dirname, '../src/data/rawUpdate.ts'),
  `import { DeliveryEnvelope } from '../types/envelope';\n\nexport const UPDATE_DELIVERY: DeliveryEnvelope = ${d2};\n`
);

console.log('Successfully bundled data into TS files.');

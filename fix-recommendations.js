const fs = require('fs');
const path = require('path');

// Read the file
const filePath = path.join(__dirname, 'src/app/internship/recommendations/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace the problematic line
const oldLine = '{Math.round((recommendations.recommendations.filter(r => r.scores.success_probability > 0.7).length / recommendations.recommendations.length) * 100)}%';
const newLine = '{Math.round(Math.max(...recommendations.recommendations.map(r => r.scores.success_probability)) * 100)}%';

content = content.replace(oldLine, newLine);

// Replace the labels
content = content.replace('High Success Rate', 'Highest Success Rate');
content = content.replace('70%+ probability', 'Best match probability');

// Write back to file
fs.writeFileSync(filePath, content);

console.log('Success rate calculation fixed!');

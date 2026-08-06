import sharp from 'sharp';

const inputPath = 'C:\\Users\\hiten\\.gemini\\antigravity\\brain\\64fda385-618d-4a43-a5c5-e1d97ca98233\\.user_uploaded\\media_1785911872720.jpg';
const outputPath = 'C:\\Users\\hiten\\.gemini\\antigravity\\scratch\\puja-expense-manager\\public\\bhavik-logo.png';

async function processLogo() {
  const size = 500;
  const circleShape = Buffer.from(
    `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#fff"/></svg>`
  );

  const resizedBuffer = await sharp(inputPath)
    .resize(size, size, { fit: 'fill' })
    .toBuffer();

  await sharp(resizedBuffer)
    .composite([{ input: circleShape, blend: 'dest-in' }])
    .png()
    .toFile(outputPath);

  console.log('Saved transparent HD circular Pothi logo from media_1785911872720.jpg!');
}

processLogo().catch(console.error);

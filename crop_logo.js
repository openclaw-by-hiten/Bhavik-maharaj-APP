import sharp from 'sharp';

const inputPath = 'C:\\Users\\hiten\\.gemini\\antigravity\\brain\\64fda385-618d-4a43-a5c5-e1d97ca98233\\.user_uploaded\\media_1785908805846.jpg';
const outputPath = 'C:\\Users\\hiten\\.gemini\\antigravity\\scratch\\puja-expense-manager\\public\\bhavik-logo.png';

async function cropImage() {
  const metadata = await sharp(inputPath).metadata();
  console.log('Original image dimensions:', metadata.width, metadata.height);

  // The outer orange and red circles take up ~25% padding on each side.
  // We crop tightly into the center area where the Pothi book and Morpankh are located.
  const cropWidth = Math.round(metadata.width * 0.54);
  const cropHeight = Math.round(metadata.height * 0.54);
  const cropLeft = Math.round((metadata.width - cropWidth) / 2);
  const cropTop = Math.round((metadata.height - cropHeight) / 2);

  await sharp(inputPath)
    .extract({ left: cropLeft, top: cropTop, width: cropWidth, height: cropHeight })
    .resize(300, 300)
    .toFile(outputPath);

  console.log('Successfully cropped and saved HD logo to:', outputPath);
}

cropImage().catch(console.error);

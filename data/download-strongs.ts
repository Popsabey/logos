import fs from 'fs';
import path from 'path';

async function downloadStrongs() {
  console.log("Downloading Strong's Dictionary...");
  
  const url = "https://raw.githubusercontent.com/mormon-documentation-project/strongs/master/strongs.json";
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`Downloaded dictionary with ${Object.keys(data).length} entries.`);
    
    const outputPath = path.join(process.cwd(), 'data', 'strongs_dictionary.json');
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
    
    console.log(`Saved dictionary to ${outputPath}`);
  } catch (error) {
    console.error("Error downloading dictionary:", error);
    process.exit(1);
  }
}

downloadStrongs();

// Script to capture screenshots of project websites using thum.io
const https = require('https');
const fs = require('fs');
const path = require('path');

const projects = [
  {
    name: 'toausib-consulting',
    url: 'https://toausibconsulting.com/',
  },
  {
    name: 'nigerian-facts-app',
    url: 'https://play.google.com/store/apps/details?id=com.israelbosun.factos&pcampaignid=web_share',
  },
  {
    name: 'word-impact-network',
    url: 'https://thewordimpactnetwork.com/',
  },
  {
    name: 'pearloria',
    url: 'https://pearloria.vercel.app',
  },
];

const outputDir = path.join(__dirname, '..', 'public', 'images', 'projects');

function downloadImage(screenshotUrl, outputPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath);
    https.get(screenshotUrl, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        fs.unlink(outputPath, () => {});
        https.get(response.headers.location, (redirectResponse) => {
          redirectResponse.pipe(file);
          file.on('finish', () => {
            file.close();
            resolve();
          });
        }).on('error', reject);
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(outputPath, () => {});
      reject(err);
    });
  });
}

async function captureScreenshots() {
  console.log('Capturing project screenshots...\n');

  for (const project of projects) {
    const outputPath = path.join(outputDir, `${project.name}.jpg`);
    // thum.io: width 1280px, crop at 720px height (16:9)
    const screenshotUrl = `https://image.thum.io/get/width/1280/crop/720/jpg/${project.url}`;

    console.log(`Capturing: ${project.name}`);
    console.log(`  URL: ${project.url}`);
    console.log(`  Screenshot service: ${screenshotUrl}`);

    try {
      await downloadImage(screenshotUrl, outputPath);
      const stats = fs.statSync(outputPath);
      console.log(`  Saved: ${outputPath} (${Math.round(stats.size / 1024)}KB)\n`);
    } catch (err) {
      console.error(`  Failed: ${err.message}\n`);
    }
  }

  console.log('Done! Screenshots saved to public/images/projects/');
}

captureScreenshots();

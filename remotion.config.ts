import {Config} from '@remotion/cli/config';
import fs from 'node:fs';

// Chromium fourni par l'environnement (évite tout téléchargement).
// Sur votre machine, laissez Remotion télécharger son propre navigateur : supprimez simplement cette section.
const candidates = [
  process.env.REMOTION_BROWSER_EXECUTABLE,
  '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell',
].filter(Boolean) as string[];
const browser = candidates.find((p) => fs.existsSync(p));
if (browser) {
  Config.setBrowserExecutable(browser);
}

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(96);
Config.setCodec('h264');
Config.setPixelFormat('yuv420p');
Config.setCrf(21);
Config.setX264Preset('slow');
Config.setColorSpace('bt709');
Config.setOverwriteOutput(true);
Config.setConcurrency(4);

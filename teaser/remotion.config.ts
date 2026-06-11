import { Config } from '@remotion/cli/config';

// Les assets (fonts, photos, logo vidéo) vivent dans le /public du site —
// pas de duplication dans ce package.
Config.setPublicDir('../public');
Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);

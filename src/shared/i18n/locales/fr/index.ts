import app from './app.json';
import nav from './nav.json';
import home from './home.json';
import settings from './settings.json';
import showcase from './showcase.json';
import common from './common.json';
import logs from './logs.json';
import aiSettings from './ai-settings.json';
import aiPresets from './ai-presets.json';

export default {
  ...app,
  ...nav,
  ...home,
  ...settings,
  ...showcase,
  ...common,
  ...logs,
  ...aiSettings,
  ...aiPresets,
};

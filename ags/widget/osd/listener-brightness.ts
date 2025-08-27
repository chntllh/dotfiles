import { GLib, monitorFile, readFileAsync } from "astal";

const BACKLIGHT_BASE_DIR = "/sys/class/backlight";

export const startBrightness = () => {
  const dir = GLib.Dir.open(BACKLIGHT_BASE_DIR, 0);
  const backlightDirName = dir.read_name();

  if (!backlightDirName) {
    console.log("no backlight, skipping");
    return;
  }

  const backlightCurrentPath =
    BACKLIGHT_BASE_DIR + "/" + backlightDirName + "/" + "brightness";
  const backlightMaxPath =
    BACKLIGHT_BASE_DIR + "/" + backlightDirName + "/" + "max_brightness";
  monitorFile(backlightCurrentPath, async (file) => {
    const [currentString, maxString] = await Promise.all([
      readFileAsync(backlightCurrentPath),
      readFileAsync(backlightMaxPath),
    ]);
    const value = parseInt(currentString) / parseInt(maxString);
  });
};

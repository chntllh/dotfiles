import { execAsync } from "astal";
import {
  brightnessExternal,
  brightnessLaptop,
  EXTERNAL_MONITOR_NUMBER,
} from "./variables";

export const initLaptopBrightness = async (): Promise<void> => {
  try {
    const [current, max] = await Promise.all([
      execAsync(["brightnessctl", "get"]).then(
        (res) => parseInt(res.trim(), 10) || 0,
      ),
      execAsync(["brightnessctl", "max"]).then(
        (res) => parseInt(res.trim(), 10) || 1,
      ),
    ]);

    brightnessLaptop.set(current / max);
  } catch (error) {
    print(`Failed to update brightness: ${error}`);
  }
};

export const initExternalBrightness = async (): Promise<void> => {
  try {
    const res = await execAsync([
      "ddcutil",
      "getvcp",
      "10",
      "-d",
      EXTERNAL_MONITOR_NUMBER,
      "--terse",
    ]);
    const parts = res.trim().split(/\s+/);

    if (parts.length === 5) {
      const currentValue = Number(parts[3]);
      const maxValue = Number(parts[4]);
      brightnessExternal.set(currentValue / maxValue);
    }
  } catch (error) {
    print(`Failed to get external brightness: ${error}`);
  }
};

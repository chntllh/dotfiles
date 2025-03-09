import { bind, execAsync, Variable } from "astal";
import { Gtk } from "astal/gtk4";
import AstalHyprland from "gi://AstalHyprland?version=0.1";

export const BrightnessSlider = () => {
  const hyprland = AstalHyprland.get_default();
  const brightness: Variable<number> = Variable<number>(0);

  const queryBrightness: (query: string) => Promise<number> = async (
    query: string,
  ): Promise<number> => {
    const res = await execAsync(["brightnessctl", query]);
    return parseInt(res.trim(), 10);
  };

  const initBrightness: () => Promise<void> = async (): Promise<void> => {
    const current = await queryBrightness("get");
    const max = await queryBrightness("max");
    brightness.set(current / max);
  };
  initBrightness();

  const setBrightness: (percent: number) => void = (percent: number) => {
    if (percent < 0) percent = 0;
    else if (percent > 1) percent = 1;

    execAsync([
      "brightnessctl",
      "set",
      `${Math.floor(percent * 100)}%`,
      "-q",
    ]).then(() => brightness.set(percent));
  };

  return (
    <box
      visible={bind(hyprland, "monitors").as((monitors) =>
        monitors.some((monitor) => monitor.name === "eDP-1"),
      )}
    >
      <image iconName={"video-display-symbolic"} />
      <slider
        hexpand
        value={bind(brightness)}
        onChangeValue={({ value }) => setBrightness(value)}
      />
    </box>
  );
};

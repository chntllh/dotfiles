import { bind, execAsync, Variable } from "astal";
import AstalHyprland from "gi://AstalHyprland?version=0.1";

export const BrightnessSlider = () => {
  const hyprland = AstalHyprland.get_default();

  const get = (val: string) => Number(execAsync(["brightnessctl", val]));

  const brightnessMax = get("max");
  const brightness = Variable(get("get") / (brightnessMax || 1));

  const setBrightness = (percent: number) => {
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

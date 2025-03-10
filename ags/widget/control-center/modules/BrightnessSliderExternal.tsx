import { bind, execAsync, GLib, Variable } from "astal";
import { Gtk } from "astal/gtk4";
import AstalHyprland from "gi://AstalHyprland?version=0.1";

export const BrightnessSliderExternal = (): Gtk.Box => {
  const hyprland = AstalHyprland.get_default();
  const brightness: Variable<number> = Variable<number>(0);

  const display = "1";
  const debounceTime = 200;
  let debounceTimer: GLib.Source;

  execAsync(["ddcutil", "getvcp", "10", "-d", display, "--terse"]).then(
    (res) => {
      const parts = res.trim().split(/\s+/);
      if (parts.length === 5) {
        const currentValue = Number(parts[3]);
        const maxValue = Number(parts[4]);
        brightness.set(currentValue / maxValue);
      }
    },
  );

  const setBrightness: (percent: number) => void = (percent: number): void => {
    if (percent < 0) percent = 0;
    else if (percent > 1) percent = 1;

    // const brightnessValue = Math.floor(percent * 100);
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      execAsync([
        "ddcutil",
        "setvcp",
        "10",
        Math.floor(percent * 100).toString(),
        "-d",
        display,
      ])
        .then(() => brightness.set(percent))
        .catch((error) => print(error));
    }, debounceTime);
  };

  return (
    <box
      visible={bind(hyprland, "monitors").as((monitors) =>
        monitors.some((monitor) => monitor.name === "HDMI-A-1"),
      )}
    >
      <button onClicked={() => setBrightness(0)}>
        <image iconName={"video-display-symbolic"} pixelSize={24} />
      </button>
      <slider
        hexpand
        step={0.1}
        value={bind(brightness)}
        onChangeValue={({ value }) => setBrightness(value)}
      />
    </box>
  ) as Gtk.Box;
};

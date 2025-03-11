import { bind, Binding, execAsync, GLib, Variable } from "astal";
import { Gtk } from "astal/gtk4";
import AstalHyprland from "gi://AstalHyprland?version=0.1";
import AstalWp from "gi://AstalWp?version=0.1";

type SliderProps = {
  icon: string | Binding<string>;
  value: Variable<number> | Binding<number>;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  onClick?: () => void;
  visible?: Binding<boolean>;
};

const Slider = ({
  icon,
  value,
  max = 1,
  step = 0.05,
  onChange,
  onClick,
  visible,
}: SliderProps): Gtk.Box => {
  return (
    <box visible={visible}>
      <button onClicked={onClick ? onClick : undefined}>
        <image iconName={icon} pixelSize={24} />
      </button>
      <slider
        max={max}
        step={step}
        value={bind(value)}
        onChangeValue={({ value }) => onChange(value)}
        hexpand
      />
    </box>
  ) as Gtk.Box;
};

const hyprland = AstalHyprland.get_default();
const BrightnessSlider = (): Gtk.Box => {
  const brightness: Variable<number> = Variable<number>(0);

  const queryBrightness: (query: string) => Promise<number> = async (
    query: string,
  ): Promise<number> => {
    const res = await execAsync(["brightnessctl", query]);
    return parseInt(res.trim(), 10);
  };

  const initBrightness: () => Promise<void> = async (): Promise<void> => {
    try {
      const current = await queryBrightness("get");
      const max = await queryBrightness("max");
      brightness.set(current / max);
    } catch (error) {
      print(`Failed to initialize brightness: ${error}`);
    }
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

  return Slider({
    icon: "video-display-symbolic",
    value: brightness,
    step: 0.05,
    onChange: (value) => setBrightness(value),
    onClick: () => setBrightness(0),
    visible: bind(hyprland, "monitors").as((monitors) =>
      monitors.some((monitor) => monitor.name === "eDP-1"),
    ),
  });
};

const BrightnessSliderExternal = (): Gtk.Box => {
  const brightness: Variable<number> = Variable<number>(0);

  const display = "1";
  const debounceTime = 200;
  // let debounceTimer: GLib.Source;
  let debounceTimer: number | null = null;

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

  // const setBrightness: (percent: number) => void = (percent: number): void => {
  //   if (percent < 0) percent = 0;
  //   else if (percent > 1) percent = 1;

  //   // const brightnessValue = Math.floor(percent * 100);
  //   clearTimeout(debounceTimer);
  //   debounceTimer = setTimeout(() => {
  //     execAsync([
  //       "ddcutil",
  //       "setvcp",
  //       "10",
  //       Math.floor(percent * 100).toString(),
  //       "-d",
  //       display,
  //     ])
  //       .then(() => brightness.set(percent))
  //       .catch((error) => print(error));
  //   }, debounceTime);
  // };

  const setBrightness: (percent: number) => void = (percent: number): void => {
    if (percent < 0) percent = 0;
    else if (percent > 1) percent = 1;

    if (debounceTimer !== null && GLib.Source.remove(debounceTimer)) {
      debounceTimer = null;
    }

    debounceTimer = GLib.timeout_add(
      GLib.PRIORITY_DEFAULT,
      debounceTime,
      () => {
        execAsync([
          "ddcutil",
          "setvcp",
          "10",
          Math.floor(percent * 100).toString(),
          "-d",
          display,
        ])
          .then(() => brightness.set(percent))
          .catch((error) => print(`Failed to set brightness: ${error}`));

        debounceTimer = null; // ✅ Clear after execution
        return GLib.SOURCE_REMOVE;
      },
    );
  };

  return Slider({
    icon: "video-display-symbolic",
    value: brightness,
    step: 0.05,
    onChange: (value) => setBrightness(value),
    onClick: () => setBrightness(0),
    visible: bind(hyprland, "monitors").as((monitors) =>
      monitors.some((monitor) => monitor.name === "HDMI-A-1"),
    ),
  });
};

const VolumeSlider = (): Gtk.Box => {
  const speaker = AstalWp.get_default()?.audio.defaultSpeaker!;
  let prev = speaker.volume > 0 ? speaker.volume : 0.5;

  return Slider({
    icon: bind(speaker, "volumeIcon"),
    value: bind(speaker, "volume"),
    max: 1.4,
    onClick: () => {
      if (speaker.mute) {
        speaker.mute = false;
        speaker.volume = prev > 0 ? prev : 0.05;
      } else {
        prev = speaker.volume > 0 ? speaker.volume : prev;
        speaker.mute = true;
        speaker.volume = 0;
      }
    },
    onChange: (value) => {
      if (value === 0) speaker.mute = true;
      else {
        if (speaker.mute) speaker.mute = false;
        prev = value;
      }
      speaker.volume = value;
    },
  });
};

export const Sliders = (): Gtk.Box =>
  (
    <box vertical spacing={12} cssClasses={["page-content"]}>
      <BrightnessSlider />
      <BrightnessSliderExternal />
      <VolumeSlider />
    </box>
  ) as Gtk.Box;

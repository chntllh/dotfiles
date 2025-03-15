import { bind, execAsync, GLib } from "astal";
import { Gtk } from "astal/gtk4";
import AstalHyprland from "gi://AstalHyprland?version=0.1";
import AstalWp from "gi://AstalWp?version=0.1";
import { Slider } from "../../../components/Slider";
import {
  brightnessExternal,
  brightnessLaptop,
  EXTERNAL_MONITOR_NUMBER,
  EXTERNAL_MONITOR,
  LAPTOP_MONITOR,
} from "../../../global/variables";

const hyprland = AstalHyprland.get_default();
const BrightnessSlider = (): Gtk.Box => {
  const setBrightness = (percent: number): void => {
    if (percent < 0) percent = 0;
    else if (percent > 1) percent = 1;

    execAsync(["brightnessctl", "set", `${Math.floor(percent * 100)}%`, "-q"])
      .then(() => brightnessLaptop.set(percent))
      .catch((err) => console.log(`Failed to set brightness: ${err}`));
  };

  return Slider({
    icon: "video-display-symbolic",
    value: bind(brightnessLaptop),
    step: 0.05,
    onChange: (value) => setBrightness(value),
    onClick: () => setBrightness(0),
    visible: bind(hyprland, "monitors").as((monitors) =>
      monitors.some((monitor) => monitor.name === LAPTOP_MONITOR),
    ),
  });
};

const BrightnessSliderExternal = (): Gtk.Box => {
  let debounceTimer: GLib.Source;

  const setBrightness: (percent: number) => void = (percent: number): void => {
    if (percent < 0) percent = 0;
    else if (percent > 1) percent = 1;

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      execAsync([
        "ddcutil",
        "setvcp",
        "10",
        Math.floor(percent * 100).toString(),
        "-d",
        EXTERNAL_MONITOR_NUMBER,
      ])
        .then(() => brightnessExternal.set(percent))
        .catch((error) => print(error));
    }, 100);
  };

  return Slider({
    icon: "video-display-symbolic",
    value: bind(brightnessExternal),
    step: 0.05,
    onChange: (value) => setBrightness(value),
    onClick: () => setBrightness(0),
    visible: bind(hyprland, "monitors").as((monitors) =>
      monitors.some((monitor) => monitor.name === EXTERNAL_MONITOR),
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

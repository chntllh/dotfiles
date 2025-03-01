import { Gtk } from "astal/gtk4";
import { WifiButton } from "../modules/WifiButton";
import { BluetoothButton } from "../modules/BluetoothButton";
import { PowerProfileButton } from "../modules/PowerProfileButton";
import { MicrophoneButton } from "../modules/MicrophoneButton";
import { BrightnessSlider } from "../modules/BrightnessSlider";
import { BrightnessSliderExternal } from "../modules/BrightnessSliderExternal";
import { VolumeSlider } from "../modules/VolumeSlider";

export const MainPage = () => {
  const flowBox = new Gtk.FlowBox({
    max_children_per_line: 2,
    min_children_per_line: 2,
    rowSpacing: 6,
    columnSpacing: 6,
    selectionMode: Gtk.SelectionMode.NONE,
  });

  flowBox.append(WifiButton());
  flowBox.append(BluetoothButton());
  flowBox.append(PowerProfileButton());
  flowBox.append(MicrophoneButton());

  return (
    <box name="main" vertical spacing={0}>
      {flowBox}
      <box vertical spacing={8} cssClasses={["page-content"]}>
        <BrightnessSlider />
        <BrightnessSliderExternal />
        <VolumeSlider />
      </box>
    </box>
  );
};

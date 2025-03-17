import { bind } from "astal";
import { Gtk } from "astal/gtk4";
import { execAsync } from "astal";
import AstalBluetooth from "gi://AstalBluetooth?version=0.1";
import { controlCenterPage } from "../ControlCenter";
import AstalWp from "gi://AstalWp?version=0.1";
import AstalPowerProfiles from "gi://AstalPowerProfiles?version=0.1";
import AstalNetwork from "gi://AstalNetwork?version=0.1";
import { ToggleButton } from "../../../components/Toggle";

const BluetoothButton = (): Gtk.Box => {
  const bluetooth = AstalBluetooth.get_default();

  return ToggleButton({
    label: "Bluetooth",
    icon: bind(bluetooth, "isPowered").as((val) =>
      val ? "bluetooth-symbolic" : "bluetooth-none-symbolic",
    ),
    onToggle: () => bluetooth.toggle(),
    secondaryLabel: bind(bluetooth, "isConnected").as((connected) => {
      return connected ? "Connected" : "";
    }),
    hasSecondaryButton: true,
    onSecondaryClick: () => controlCenterPage.set("bluetooth"),
  });
};

const MicrophoneButton = (): Gtk.Box => {
  const microphone = AstalWp.get_default()?.audio.defaultMicrophone!;

  return ToggleButton({
    label: "Microphone",
    icon: bind(microphone, "volumeIcon"),
    onToggle: () => (microphone.mute = !microphone.mute),
    secondaryLabel: bind(microphone, "mute").as((muted) =>
      muted ? "Muted" : "",
    ),
  });
};

const PowerProfileButton = (): Gtk.Box => {
  const power = AstalPowerProfiles.get_default();

  const toggleProfile = () => {
    switch (power.activeProfile) {
      case "power-saver":
        power.set_active_profile("balanced");
        break;
      case "balanced":
        power.set_active_profile("performance");
        break;
      case "performance":
        power.set_active_profile("power-saver");
        break;
      default:
        power.set_active_profile("balanced");
    }
  };

  return ToggleButton({
    label: "Power",
    icon: bind(power, "iconName"),
    onToggle: toggleProfile,
    secondaryLabel: bind(power, "activeProfile"),
    hasSecondaryButton: true,
    onSecondaryClick: () => controlCenterPage.set("power-profile"),
  });
};

const WifiButton = (): Gtk.Box => {
  const wifi = AstalNetwork.get_default().wifi;

  return ToggleButton({
    label: "WiFi",
    icon: bind(wifi, "iconName"),
    onToggle: () => (wifi.enabled = !wifi.enabled),
    secondaryLabel: bind(wifi, "ssid"),
    hasSecondaryButton: true,
    onSecondaryClick: () => {
      controlCenterPage.set("wifi");
      wifi.scan();
    },
  });
};

const WiredButton = (): Gtk.Box => {
  const wired = AstalNetwork.get_default().wired;

  return ToggleButton({
    label: "Wired",
    icon: bind(wired, "iconName"),
    onToggle: () =>
      wired.state !== 100
        ? execAsync("nmcli dev connect enp4s0")
        : execAsync("nmcli dev disconnect enp4s0"),
    secondaryLabel: bind(wired, "state").as((val) => {
      // print(val);
      switch (val) {
        case 100:
          return "Connected";
        case 70:
          "IP Configuring";
        case 50:
          return "Configuring";
        case 40:
          return "Preparing";
        case 30:
          return "";
        case 20:
          return "Unavailable";
        default:
          return "";
      }
    }),
  });
};

export const Toggles = () => {
  const flowBox = new Gtk.FlowBox({
    max_children_per_line: 2,
    min_children_per_line: 2,
    rowSpacing: 6,
    columnSpacing: 6,
    selectionMode: Gtk.SelectionMode.NONE,
  });

  flowBox.append(WifiButton());
  flowBox.append(WiredButton());
  flowBox.append(BluetoothButton());
  flowBox.append(PowerProfileButton());
  flowBox.append(MicrophoneButton());

  return flowBox;
};

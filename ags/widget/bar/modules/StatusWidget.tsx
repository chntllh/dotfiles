import { bind, Variable } from "astal";
import { App } from "astal/gtk4";
import AstalBattery from "gi://AstalBattery?version=0.1";
import AstalNetwork from "gi://AstalNetwork?version=0.1";
import AstalWp from "gi://AstalWp?version=0.1";
import Gtk from "gi://Gtk?version=4.0";
import { controlCenterPage } from "../../control-center/ControlCenter";

const network: AstalNetwork.Network = AstalNetwork.get_default();
const battery: AstalBattery.Device = AstalBattery.get_default();
const speaker: AstalWp.Endpoint | undefined =
  AstalWp.get_default()?.audio.defaultSpeaker;
const microphone: AstalWp.Endpoint | undefined =
  AstalWp.get_default()?.audio.defaultMicrophone;

const NetworkIcon: () => Gtk.Widget = () => {
  const handleIcon: Variable<string> = Variable.derive(
    [
      bind(network, "primary"),
      bind(network.wired, "iconName"),
      bind(network.wifi, "iconName"),
    ],
    (
      primaryNetwork: AstalNetwork.Primary,
      wiredIcon: string,
      wifiIcon: string,
    ) => {
      if (primaryNetwork === AstalNetwork.Primary.WIRED) {
        return wiredIcon;
      } else if (primaryNetwork === AstalNetwork.Primary.WIFI) {
        return wifiIcon;
      }
      return "";
    },
  );

  const handleTooltip: Variable<string> = Variable.derive(
    [
      bind(network, "primary"),
      bind(network.wifi, "ssid"),
      bind(network.wifi, "strength"),
      bind(network.wifi, "frequency"),
    ],
    (
      primaryNetwork: AstalNetwork.Primary,
      ssid: string,
      strength: number,
      frequency: number,
    ): string => {
      if (primaryNetwork === AstalNetwork.Primary.WIFI) {
        return [
          `SSID: ${ssid}`,
          `Strength: ${strength}`,
          `Frequency: ${(frequency / 1000).toFixed(2)}MHz`,
        ].join("\n");
      } else if (primaryNetwork === AstalNetwork.Primary.WIRED) {
        return "";
      }
      return "";
    },
  );

  return (
    <image
      visible={bind(handleIcon).as((val: string): boolean => val !== "")}
      tooltipText={handleTooltip()}
      iconName={handleIcon()}
    />
  );
};

const SpeakerVolumeIcon: () => Gtk.Widget = () => {
  return (
    <image
      tooltipText={bind(speaker!, "volume").as(
        (vol: number) => `Volume: ${Math.ceil(vol * 100)}`,
      )}
      iconName={bind(speaker!, "volumeIcon")}
      onScroll={(_, __: number, y: number) => {
        speaker!.volume =
          y < 0
            ? speaker!.volume + 0.02 >= 1.4
              ? 1.4
              : speaker!.volume + 0.02
            : speaker!.volume - 0.02 <= 0
              ? 0
              : speaker!.volume - 0.02;
      }}
      // onButtonPressed={() =>
      //     execAsync(["pavucontrol", "-t", "3"]).catch((error) =>
      //         print(error),
      //     )
      // }
    />
  );
};

const MicrophoneVolumeIcon: () => Gtk.Widget = () => {
  return (
    <image
      tooltipText={bind(microphone!, "volume").as(
        (vol: number): string => `Volume: ${Math.ceil(vol * 100)}`,
      )}
      visible={bind(microphone!, "volumeIcon").as(
        (val: string): boolean =>
          val !== "microphone-sensitivity-muted-symbolic",
      )}
      iconName={bind(microphone!, "volumeIcon")}
      // onButtonPressed={() =>
      //     execAsync(["pavucontrol", "-t", "4"]).catch((error) =>
      //         print(error),
      //     )
      // }
    />
  );
};

const BatteryIcon: () => Gtk.Widget = () => {
  const formatTime: (seconds: number) => string = (seconds: number): string => {
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}min`;
  };

  const componentTooltip: Variable<string> = Variable.derive(
    [
      bind(battery, "charging"),
      bind(battery, "timeToFull"),
      bind(battery, "timeToEmpty"),
      bind(battery, "percentage"),
    ],
    (
      isCharging: boolean,
      timeToFull: number,
      timeToEmpty: number,
      percentage: number,
    ): string => {
      return [
        `${isCharging ? `Time to full: ${formatTime(timeToFull)}` : `Time to empty: ${formatTime(timeToEmpty)}`}`,
        `Percentage: ${percentage * 100}`,
      ].join("\n");
    },
  );

  return (
    <image
      visible={bind(battery, "isPresent")}
      iconName={bind(battery, "batteryIconName")}
      tooltipText={componentTooltip()}
    />
  );
};

export const StatusWidget: ({ monitor }: { monitor: number }) => Gtk.Widget = ({
  monitor,
}: {
  monitor: number;
}) => {
  const batteryStatus: Variable<string> = Variable.derive(
    [bind(battery, "percentage"), bind(battery, "state")],
    (percentage, state) => {
      if (state === AstalBattery.State.DISCHARGING) {
        if (percentage < 0.2) return "battery-critical";
        else if (percentage < 0.4) return "battery-low";
        else return "";
      } else if (state === AstalBattery.State.FULLY_CHARGED) {
        return "";
      } else if (state === AstalBattery.State.CHARGING) {
        return "battery-charging";
      }

      return "";
    },
  );
  return (
    <button
      cssClasses={bind(batteryStatus).as((val) => ["button-widget", val])}
      onButtonPressed={() => {
        controlCenterPage.set("main");
        App.toggle_window("control-center-" + monitor);
      }}
    >
      <box cssClasses={["status-box"]}>
        <NetworkIcon />
        <SpeakerVolumeIcon />
        <MicrophoneVolumeIcon />
        <BatteryIcon />
      </box>
    </button>
  );
};

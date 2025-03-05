import { bind } from "astal";
import { Gtk } from "astal/gtk4";
import AstalBluetooth from "gi://AstalBluetooth?version=0.1";
import { controlCenterPage } from "../ControlCenter";

export const BluetoothButton: () => Gtk.Widget = () => {
  const bluetooth = AstalBluetooth.get_default();

  return (
    <box>
      <button
        cssClasses={["qs-button-toggle"]}
        onClicked={() => {
          bluetooth.toggle();
        }}
      >
        <box spacing={8}>
          <image
            file={bind(bluetooth, "isPowered").as((val) =>
              val
                ? "./icons/bluetooth-symbolic.svg"
                : "./icons/bluetooth-none-symbolic.svg",
            )}
          />
          <box vertical valign={Gtk.Align.CENTER} halign={Gtk.Align.CENTER}>
            <label cssClasses={["qs-title"]} hexpand>
              Bluetooth
            </label>
            {/* <label
              cssClasses={["qs-subtitle"]}
              visible={bind(bluetooth, "isConnected")}
            >
              {bind(bluetooth, "get_devices")}
            </label> */}
          </box>
        </box>
      </button>
      <button
        cssClasses={["qs-button-menu"]}
        onClicked={() => controlCenterPage.set("bluetooth")}
      >
        <image iconName={"go-next-symbolic"} />
      </button>
    </box>
  );
};

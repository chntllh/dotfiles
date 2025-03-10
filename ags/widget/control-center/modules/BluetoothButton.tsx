import { bind } from "astal";
import { Gtk } from "astal/gtk4";
import AstalBluetooth from "gi://AstalBluetooth?version=0.1";
import { controlCenterPage } from "../ControlCenter";

const bluetooth = AstalBluetooth.get_default();

export const BluetoothButton = (): Gtk.Box =>
  (
    <box>
      <button
        cssClasses={["qs-button-toggle"]}
        onClicked={() => {
          bluetooth.toggle();
        }}
      >
        <box spacing={8}>
          <image
            iconName={bind(bluetooth, "isPowered").as((val) =>
              val ? "bluetooth-symbolic" : "bluetooth-none-symbolic",
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
  ) as Gtk.Box;

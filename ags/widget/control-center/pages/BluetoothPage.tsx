import { Gtk } from "astal/gtk4";
import { controlCenterPage } from "../ControlCenter";
import AstalBluetooth from "gi://AstalBluetooth?version=0.1";
import { bind, timeout } from "astal";

const bluetooth = AstalBluetooth.get_default();

export const BluetoothPage = (): Gtk.Box =>
  (
    <box name="bluetooth" vertical spacing={8}>
      <centerbox cssClasses={["page-header"]}>
        <button
          halign={Gtk.Align.START}
          onClicked={() => {
            controlCenterPage.set("main");
          }}
          iconName={"edit-undo-symbolic"}
        />
        <label label={"Bluetooth"} halign={Gtk.Align.CENTER} hexpand />
      </centerbox>
      <Gtk.ScrolledWindow cssClasses={["scrolled-window"]} vexpand>
        <box vertical spacing={8} cssClasses={["page-content"]}>
          {bind(bluetooth, "devices").as((device) =>
            device.map((device) => (
              <button
                onClicked={() => {
                  if (!bluetooth.isPowered) {
                    bluetooth.toggle();
                  }
                  timeout(100, () => {
                    if (!device.connected) {
                      print("Connecting");
                      device.connect_device(() => {});
                    } else {
                      print("Disconnecting");
                      device.disconnect_device(() => {});
                    }
                  });
                }}
              >
                <box spacing={12}>
                  <image iconName={device.icon} />
                  <label label={device.name} />
                  <image
                    visible={bind(device, "connected")}
                    halign={Gtk.Align.END}
                    hexpand
                    iconName={"object-select-symbolic"}
                  />
                </box>
              </button>
            )),
          )}
        </box>
      </Gtk.ScrolledWindow>
    </box>
  ) as Gtk.Box;

import { bind } from "astal";
import { Gtk } from "astal/gtk4";
import AstalNetwork from "gi://AstalNetwork?version=0.1";
import { controlCenterPage } from "../ControlCenter";

export const WifiButton = () => {
  const wifi = AstalNetwork.get_default().wifi;

  const toggleWifi = () => {
    if (wifi.enabled) {
      wifi.enabled = false;
    } else {
      wifi.enabled = true;
    }
  };

  return (
    <box>
      <button cssClasses={["qs-button-toggle"]} onClicked={() => toggleWifi()}>
        <box>
          <image iconName={bind(wifi, "iconName").as((val) => `${val}`)} />
          <box vertical valign={Gtk.Align.CENTER} halign={Gtk.Align.CENTER}>
            <label cssClasses={["qs-title"]} hexpand>
              Wifi
            </label>
            <label cssClasses={["qs-subtitle"]} visible={bind(wifi, "enabled")}>
              {bind(wifi, "ssid")}
            </label>
          </box>
        </box>
      </button>
      <button
        cssClasses={["qs-button-menu"]}
        onClicked={() => {
          controlCenterPage.set("wifi");
          wifi.scan();
        }}
      >
        <image iconName={"go-next-symbolic"} />
      </button>
    </box>
  );
};

import { Gtk } from "astal/gtk4";
import { controlCenterPage } from "../ControlCenter";
import AstalNetwork from "gi://AstalNetwork?version=0.1";
import { bind, execAsync } from "astal";

export const WifiPage = () => {
  const wifi = AstalNetwork.get_default().wifi;

  return (
    <box name="wifi" vertical spacing={8}>
      <centerbox cssClasses={["page-header"]}>
        <button
          halign={Gtk.Align.START}
          onClicked={() => {
            controlCenterPage.set("main");
          }}
          iconName={"edit-undo-symbolic"}
        />
        <label label={"Network"} halign={Gtk.Align.CENTER} hexpand />
        <button
          halign={Gtk.Align.START}
          iconName={"object-rotate-right-symbolic"}
          onClicked={() => wifi.scan()}
        />
      </centerbox>
      <Gtk.ScrolledWindow cssClasses={["scrolled-window"]} vexpand>
        <box vertical spacing={8} cssClasses={["page-content"]}>
          {bind(wifi, "accessPoints").as((accessPoints) =>
            accessPoints
              .sort((a, b) => b.strength - a.strength)
              .map((ap) => (
                <button
                  onClicked={() =>
                    execAsync([
                      "nmcli",
                      "device",
                      "wifi",
                      "connect",
                      ap.bssid,
                    ]).catch((err) => print(err))
                  }
                >
                  <box spacing={12}>
                    <image iconName={ap.iconName} />
                    <label label={ap.ssid} />
                    <image
                      visible={bind(wifi, "activeAccessPoint").as(
                        (aap) => aap === ap,
                      )}
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
  );
};

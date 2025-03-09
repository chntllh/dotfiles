import { bind, execAsync } from "astal";
import { Gtk } from "astal/gtk4";
import AstalNetwork from "gi://AstalNetwork?version=0.1";

export const WiredButton = () => {
  const wired = AstalNetwork.get_default().wired;

  const toggleWired = () => {
    if (wired.state === 100) {
      execAsync("nmcli dev disconnect enp4s0");
    } else {
      execAsync("nmcli dev connect enp4s0");
    }
  };

  return (
    <box>
      <button cssClasses={["qs-button"]} onClicked={() => toggleWired()}>
        <box>
          <image
            iconName={bind(wired, "iconName").as((val) => val.toString())}
          />
          <box vertical valign={Gtk.Align.CENTER} halign={Gtk.Align.CENTER}>
            <label cssClasses={["qs-title"]} hexpand>
              Wired
            </label>
            <label cssClasses={["qs-subtitle"]}>
              {bind(wired, "state").as((val) => {
                if (val === 100) return "Connected";
                else return "Disconnected";
              })}
            </label>
          </box>
        </box>
      </button>
    </box>
  );
};

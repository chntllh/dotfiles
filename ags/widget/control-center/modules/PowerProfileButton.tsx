import { bind } from "astal";
import { Gtk } from "astal/gtk4";
import AstalPowerProfiles from "gi://AstalPowerProfiles?version=0.1";
import { controlCenterPage } from "../ControlCenter";
import { profileNames } from "../pages/PowerProfilePage";

export const PowerProfileButton: () => Gtk.Widget = () => {
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

  return (
    <box>
      <button
        cssClasses={["qs-button-toggle"]}
        onClicked={() => toggleProfile()}
      >
        <box spacing={8}>
          <image iconName={bind(power, "iconName")} />
          <box vertical valign={Gtk.Align.CENTER} halign={Gtk.Align.CENTER}>
            <label cssClasses={["qs-title"]} hexpand>
              Power
            </label>
            <label
              cssClasses={["qs-subtitle"]}
              label={bind(power, "activeProfile").as(
                (profile) => profileNames[profile],
              )}
            />
          </box>
        </box>
      </button>
      <button
        cssClasses={["qs-button-menu"]}
        onClicked={() => controlCenterPage.set("power-profile")}
      >
        <image iconName={"go-next-symbolic"} />
      </button>
    </box>
  );
};

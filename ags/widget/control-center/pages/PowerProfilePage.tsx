import { Gtk } from "astal/gtk4";
import { controlCenterPage } from "../ControlCenter";
import AstalPowerProfiles from "gi://AstalPowerProfiles?version=0.1";
import { bind } from "astal";

export const profileNames: Record<string, string> = {
  "power-saver": "Dzire",
  balanced: "Virtus",
  performance: "Supra",
};

export const PowerProfilePage = () => {
  const power = AstalPowerProfiles.get_default();

  const profiles: AstalPowerProfiles.Profile[] = power.get_profiles();

  return (
    <box name="power-profile" vertical spacing={8}>
      <centerbox cssClasses={["page-header"]}>
        <button
          halign={Gtk.Align.START}
          onClicked={() => {
            controlCenterPage.set("main");
          }}
          iconName={"edit-undo-symbolic"}
        />
        <label label={"Network"} halign={Gtk.Align.CENTER} hexpand />
      </centerbox>
      <box vertical spacing={8} cssClasses={["page-content"]}>
        {profiles.map((profile) => (
          <button onClicked={() => power.set_active_profile(profile.profile)}>
            <box spacing={8}>
              <label label={profileNames[profile.profile]} />
              <image
                visible={bind(power, "activeProfile").as(
                  (ap) => ap === profile.profile,
                )}
                halign={Gtk.Align.END}
                hexpand
                iconName={"object-select-symbolic"}
              />
            </box>
          </button>
        ))}
      </box>
    </box>
  );
};

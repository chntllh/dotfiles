import { App, Astal, Gtk } from "astal/gtk4";
import { toggleQuickSettings } from "./quick-settings/QuickSettings";

export const Test = (): Gtk.Window => {
  return (
    <window
      application={App}
      name="test"
      cssName="control-center"
      namespace="test"
      layer={Astal.Layer.TOP}
      anchor={Astal.WindowAnchor.RIGHT}
      marginRight={16}
    >
      <box widthRequest={100} vertical>
        {/* <button
          onClicked={() => {
            const quickSettingsWindow = QuickSettings(); // Get the window instance
            quickSettingsWindow.set_visible(!quickSettingsWindow.get_visible());
          }}
        > */}
        <button
          onClicked={() => {
            // App.toggle_window("quick-settings");
            toggleQuickSettings();
          }}
        >
          Toggle Quick Settings
        </button>
      </box>
    </window>
  ) as Gtk.Window;
};

import { App, Gtk } from "astal/gtk4";
import AstalApps from "gi://AstalApps?version=0.1";

export const AppButton = (app: AstalApps.Application): Gtk.Widget => {
  return (
    <button
      onClicked={() => {
        App.get_window("app-launcher")!.hide();
        app.launch();
      }}
    >
      <box spacing={8}>
        <image
          {...(app.iconName.startsWith("/")
            ? { file: app.iconName }
            : { iconName: app.iconName })}
          pixelSize={32}
        />
        <box vertical valign={Gtk.Align.CENTER} spacing={4}>
          <label label={app.name} xalign={0} />
          {app.description && <label label={app.description} wrap xalign={0} />}
        </box>
      </box>
    </button>
  );
};

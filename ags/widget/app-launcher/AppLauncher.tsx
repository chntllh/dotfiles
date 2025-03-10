import { App, Astal, Gtk } from "astal/gtk4";
import AstalApps from "gi://AstalApps?version=0.1";
import { AppButton } from "./AppButton";
import { bind } from "astal";

// const appFilter = [
//   "lstopo",
//   "gnome-logs",
//   "godot-mono",
//   "gcm-viewer",
//   "firewall",
//   "fish",
// ];

const apps = new AstalApps.Apps();

let textBox: Gtk.Entry;
export const AppLauncher = (): Gtk.Window =>
  (
    <window
      application={App}
      name={"app-launcher"}
      cssName="app-launcher"
      namespace={"app-launcher"}
      keymode={Astal.Keymode.ON_DEMAND}
      onKeyPressed={(_self, keyval, keycode) => {
        if (keyval && keycode == 9) App.get_window("app-launcher")!.hide();
      }}
      onShow={() => (textBox.text = "")}
    >
      <box
        widthRequest={600}
        heightRequest={600}
        vertical
        cssClasses={["main-box"]}
      >
        <entry
          placeholderText={"Search"}
          setup={(self) => {
            textBox = self;
            App.connect(
              "window-toggled",
              () =>
                App.get_window("app-launcher")?.visible == true &&
                self.grab_focus(),
            );
          }}
          marginBottom={8}
          onActivate={() => {
            apps.fuzzy_query(textBox.text)?.[0].launch();
            App.get_window("app-launcher")!.hide();
          }}
        />
        <Gtk.ScrolledWindow
          vexpand
          cssClasses={["apps-box"]}
          overflow={Gtk.Overflow.HIDDEN}
        >
          <box vertical spacing={4}>
            {bind(textBox, "text").as((text) =>
              apps
                .fuzzy_query(text)
                // .filter((app) => !appFilter.includes(app.executable))
                .map((app: AstalApps.Application) => AppButton(app)),
            )}
          </box>
        </Gtk.ScrolledWindow>
      </box>
    </window>
  ) as Gtk.Window;

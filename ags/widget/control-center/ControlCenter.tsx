import { bind, Variable } from "astal";
import { App, Astal, Gdk, Gtk } from "astal/gtk4";
import { Toggles } from "./modules/Toggles";
import { Sliders } from "./modules/Sliders";
import { BluetoothPage, PowerProfilePage, WifiPage } from "./modules/Pages";

export const controlCenterPage = Variable<
  "main" | "wifi" | "power-profile" | "bluetooth"
>("main");

export const ControlCenter = (monitor: Gdk.Monitor): Gtk.Window =>
  (
    <window
      application={App}
      name={"control-center-" + monitor}
      cssName="control-center"
      namespace={"control-center"}
      gdkmonitor={monitor}
      anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
      valign={Gtk.Align.START}
      layer={Astal.Layer.TOP}
      margin={8}
      exclusivity={Astal.Exclusivity.NORMAL}
      keymode={Astal.Keymode.ON_DEMAND} // Comment out when developing the control-center
      onKeyPressed={(self, keyval, keycode) => {
        if (keyval && keycode == 9) {
          if (controlCenterPage.get() == "main") {
            App.toggle_window(self.name);
          } else {
            controlCenterPage.set("main");
          }
        }
      }}
    >
      <box
        cssClasses={["control-center-page"]}
        vertical
        spacing={8}
        valign={Gtk.Align.START}
        // widthRequest={400}
        heightRequest={400}
        marginTop={0.5 * 16}
        marginBottom={0.5 * 16}
        marginStart={0.5 * 16}
        marginEnd={0.5 * 16}
      >
        <stack
          transitionType={Gtk.StackTransitionType.SLIDE_LEFT_RIGHT}
          transitionDuration={100}
          visibleChildName={bind(controlCenterPage)}
        >
          <box name="main" vertical spacing={1 * 16}>
            <Toggles />
            <Sliders />
          </box>
          <WifiPage />
          <BluetoothPage />
          <PowerProfilePage />
        </stack>
      </box>
    </window>
  ) as Gtk.Window;

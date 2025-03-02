import { bind, Variable } from "astal";
import { App, Astal, Gtk } from "astal/gtk4";
import { MainPage } from "./pages/MainPage";
import { PowerProfilePage } from "./pages/PowerProfilePage";
import { BluetoothPage } from "./pages/BluetoothPage";
import { WifiPage } from "./pages/WifiPage";

export const controlCenterPage = Variable<
  "main" | "wifi" | "power-profile" | "bluetooth"
>("main");

export const ControlCenter = () => {
  return (
    <window
      valign={Gtk.Align.START}
      // visible //Only set when developing the control-center
      margin={8}
      namespace={"control-center"}
      name="control-center"
      layer={Astal.Layer.OVERLAY}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      keymode={Astal.Keymode.EXCLUSIVE}
      onKeyPressed={(self, keyval, keycode) => {
        if (keyval && keycode == 9) {
          if (controlCenterPage.get() == "main") {
            App.toggle_window(self.name);
          } else {
            controlCenterPage.set("main");
          }
        }
      }}
      anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
      application={App}
    >
      <box
        cssClasses={["control-center-page"]}
        vertical
        spacing={8}
        valign={Gtk.Align.START}
        // widthRequest={400}
        heightRequest={400}
      >
        <stack
          transitionType={Gtk.StackTransitionType.SLIDE_LEFT_RIGHT}
          transitionDuration={100}
          visibleChildName={bind(controlCenterPage)}
        >
          <MainPage />
          <WifiPage />
          <BluetoothPage />
          <PowerProfilePage />
        </stack>
      </box>
    </window>
  );
};

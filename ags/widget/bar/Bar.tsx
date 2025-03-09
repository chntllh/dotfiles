import { App, Astal, Gdk, Gtk } from "astal/gtk4";
import { CenterBox } from "astal/gtk4/widget";
import { TimeWidget } from "./modules/TimeWidget";
import { StatusWidget } from "./modules/StatusWidget";
import { StatsWidget } from "./modules/StatsWidget";
import { WorkspaceWidget } from "./modules/WorkspaceWidget";
import { TrayWidget } from "./modules/TrayWidget";

export const Bar = (monitor: Gdk.Monitor) => (
  <window
    name={"top-bar-" + monitor.connector}
    cssName="top-bar"
    namespace={"top-bar"}
    // monitor={monitor}
    gdkmonitor={monitor}
    exclusivity={Astal.Exclusivity.EXCLUSIVE}
    layer={Astal.Layer.TOP}
    anchor={
      Astal.WindowAnchor.TOP |
      Astal.WindowAnchor.LEFT |
      Astal.WindowAnchor.RIGHT
    }
    application={App}
    visible
  >
    <CenterBox>
      <box valign={Gtk.Align.CENTER}>
        <TimeWidget />
        <StatsWidget />
      </box>
      <box valign={Gtk.Align.CENTER}>
        <WorkspaceWidget />
      </box>
      <box valign={Gtk.Align.CENTER}>
        <TrayWidget />
        <StatusWidget monitor={monitor} />
      </box>
    </CenterBox>
  </window>
);

import { App, Astal, Gtk } from "astal/gtk4";
import { CenterBox } from "astal/gtk4/widget";
import { TimeWidget } from "./modules/TimeWidget";
import { StatusWidget } from "./modules/StatusWidget";
import { StatsWidget } from "./modules/StatsWidget";
import { WorkspaceWidget } from "./modules/WorkspaceWidget";

export const Bar = (monitor: number) => (
  <window
    name="top-bar"
    namespace={"top-bar"}
    monitor={monitor}
    exclusivity={Astal.Exclusivity.EXCLUSIVE}
    layer={Astal.Layer.OVERLAY}
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
        <StatusWidget />
      </box>
    </CenterBox>
  </window>
);

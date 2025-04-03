import { App, Astal, Gdk, Gtk } from "astal/gtk4";
import { CenterBox } from "astal/gtk4/widget";
import { TimeWidget } from "./modules/TimeWidget";
import { StatusWidget } from "./modules/StatusWidget";
import { StatsWidget } from "./modules/StatsWidget";
import { WorkspaceWidget } from "./modules/WorkspaceWidget";
import { TrayWidget } from "./modules/TrayWidget";

export const Bar = (monitor: Gdk.Monitor): Gtk.Window =>
  (
    <window
      name={"top-bar-" + monitor.connector}
      cssName="top-bar"
      namespace={"top-bar"}
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
      heightRequest={2 * 16}
    >
      <CenterBox
        marginStart={0.5 * 16}
        marginEnd={1 * 16}
        // marginTop={0.5 * 16}
        // marginBottom={0.5 * 16}
      >
        <box valign={Gtk.Align.CENTER} spacing={0.5 * 16}>
          <TimeWidget />
          <StatsWidget />
        </box>
        <box valign={Gtk.Align.CENTER}>
          <WorkspaceWidget />
        </box>
        <box valign={Gtk.Align.CENTER} spacing={0.5 * 16}>
          <TrayWidget />
          <StatusWidget monitor={monitor} />
        </box>
      </CenterBox>
    </window>
  ) as Gtk.Window;

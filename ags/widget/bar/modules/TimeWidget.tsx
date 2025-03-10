import { GLib, Variable } from "astal";
import { Gtk } from "astal/gtk4";

const curr: GLib.DateTime = GLib.DateTime.new_now_local();
const date: string = curr.format("%d/%m")!;
const day: string = curr.format("%a")!;
const time: Variable<string> = Variable<string>("").poll(
  1000,
  () => GLib.DateTime.new_now_local().format("%H:%M:%S")!,
);

export const TimeWidget = (): Gtk.Button =>
  (
    <button cssClasses={["button-widget"]}>
      <box cssClasses={["time-box"]} spacing={4}>
        <label label={day} />
        <label label={date} />
        <label label={time()} />
      </box>
    </button>
  ) as Gtk.Button;

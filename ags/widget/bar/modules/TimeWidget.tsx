import { GLib, Variable } from "astal";
import { Gtk } from "astal/gtk4";

const curr: GLib.DateTime = GLib.DateTime.new_now_local();
const date: string = curr.format("%d/%m")!;
const day: string = curr.format("%a")!;
const time: Variable<string> = Variable<string>("").poll(
  1000,
  () => GLib.DateTime.new_now_local().format("%H:%M:%S")!,
);

export const TimeWidget = () => (
  <button cssClasses={["button-widget"]}>
    <box cssClasses={["time-box"]}>
      <label label={day} />
      <label label={date} />
      <label label={time()} />
    </box>
  </button>
);

import { GLib, Variable } from "astal";

const curr = GLib.DateTime.new_now_local();
const date = curr.format("%d/%m")!;
const day = curr.format("%a")!;
const time = Variable<string>("").poll(
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

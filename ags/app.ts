import { App, Astal, Gdk } from "astal/gtk4";
import { Bar } from "./widget/bar/Bar";
import { ControlCenter } from "./widget/control-center/ControlCenter";
import { AppLauncher } from "./widget/app-launcher/AppLauncher";
import { execAsync, Gio, monitorFile, timeout } from "astal";

async function monitorStyle() {
  const pathsToMonitor = [`${SRC}/style`];

  const mainScss = `${SRC}/style/style.scss`;
  const css = `${SRC}/tmp/style.css`;

  let isApplying = false;

  async function transpileAndApply() {
    if (isApplying) return;
    isApplying = true;

    try {
      await execAsync(`sass ${mainScss} ${css}`);
      App.reset_css();
      App.apply_css(css, true);
      console.log("CSS applied successfully!");
    } catch (error) {
      console.log("Error transpiling SCSS:", error);
      execAsync(`notify-send -u critical "Error transpiling SCSS" "${error}"`);
    } finally {
      isApplying = false;
    }
  }

  pathsToMonitor.forEach((path) => monitorFile(path, transpileAndApply));

  return transpileAndApply();
}

monitorStyle();

const logSetChanges = (label: string, set: Set<Gdk.Monitor>): void => {
  console.log(
    label,
    Array.from(set, (mon) => mon.description.toString()),
  ); // Replace `.toString()` if needed
};

const setWindows = (monitor: Gdk.Monitor): Astal.Window[] =>
  [Bar(monitor), ControlCenter(monitor)] as Astal.Window[];

const setDifference = <T>(a: Set<T>, b: Set<T>): Set<T> => {
  return new Set([...a].filter((item) => !b.has(item)));
};

const main = (): void => {
  const windows = new Map<Gdk.Monitor, Astal.Window[]>();

  AppLauncher();

  for (const monitor of App.get_monitors()) {
    windows.set(monitor, setWindows(monitor));
    // timeout(100, () => {
    //   App.toggle_window("control-center-" + monitor);
    // });
  }

  const display: Gdk.Display | null = Gdk.Display.get_default();

  const monitors = display?.get_monitors() as Gio.ListModel<Gdk.Monitor>;
  monitors.connect(
    "items-changed",
    (
      monitorModel: Gio.ListStore,
      position: number,
      idxRemoved: number,
      idxAdded: number,
    ) => {
      console.log("monitors changed!", position, idxRemoved, idxAdded);

      const prevSet = new Set(windows.keys());
      const currSet = new Set<Gdk.Monitor>();
      let i = 0;
      while (true) {
        const monitor = monitorModel.get_item(i) as Gdk.Monitor | null;
        i++;
        if (monitor) currSet.add(monitor);
        else break;
      }

      const removed = setDifference(prevSet, currSet);
      const added = setDifference(currSet, prevSet);

      for (const monitor of removed) {
        const windowsToRemove = windows.get(monitor) ?? [];
        for (const window of windowsToRemove) window.destroy();
        windows.delete(monitor);
      }

      display?.sync();

      logSetChanges("prevSet:", prevSet);
      logSetChanges("currSet:", currSet);
      logSetChanges("removed:", removed);
      logSetChanges("added:", added);

      for (const monitor of added) {
        windows.set(monitor, setWindows(monitor));
      }
    },
  );
};

App.start({
  main,
  icons: `${SRC}/icons`,
});

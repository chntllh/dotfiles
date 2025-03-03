import { App, Gtk } from "astal/gtk4";
import style from "./style.scss";
import AstalHyprland from "gi://AstalHyprland?version=0.1";
import { Bar } from "./widget/bar/Bar";
import { ControlCenter } from "./widget/control-center/ControlCenter";

const widgetMap: Map<number, Gtk.Widget[]> = new Map();

const widgets = (monitor: number) => [Bar(monitor)];

const hypr = AstalHyprland.get_default();

App.start({
  css: style,
  main() {
    hypr
      .get_monitors()
      .map((monitor) => widgetMap.set(monitor.id, widgets(monitor.id)));

    ControlCenter();
    setTimeout(() => {
      // App.toggle_window("control-center");
    }, 100);

    // hypr.connect('monitor-added', (_, monitor) => widgetMap.set(monitor.id, widgets(monitor.id)))

    // hypr.connect('monitor-removed', (_, id) => {
    //     widgetMap.get(id)?.forEach((w) => w.disconnect)
    //     widgetMap.delete(id)
    // })
  },
});

import { GLib } from "astal";
import { Astal, Gtk } from "astal/gtk4";

let timeoutSource: GLib.Source | null = null;
let osdWindow: Gtk.Window | null = null;

export const setOSD = (icon: string, value: number | string) => {
  if (!osdWindow)
    osdWindow = new Astal.Window({ cssClasses: ["osd-window"], name: "osd" });
};

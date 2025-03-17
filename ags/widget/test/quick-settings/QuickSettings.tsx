import { App, Astal, Gtk } from "astal/gtk4";

let revealer: Gtk.Revealer | null = null;

export const QuickSettings = (): Gtk.Window => {
  return (
    <window
      application={App}
      name="quick-settings"
      cssName="quick-settings"
      namespace="quick-settings"
      anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
      layer={Astal.Layer.TOP}
      widthRequest={220}
      heightRequest={250}
      visible // Keep the window always visible
      keymode={Astal.Keymode.NONE}
    >
      <box vertical>
        <revealer
          setup={(self) => (revealer = self as Gtk.Revealer)}
          transitionDuration={300}
          transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
        >
          <box vertical>
            <label label="Lmao 1" />
            <label label="Lmao 2" />
            <label label="Lmao 3" />
          </box>
        </revealer>
      </box>
    </window>
  ) as Gtk.Window;
};

// Toggle function only affects the Revealer, not the window
export const toggleQuickSettings = () => {
  if (revealer) {
    revealer.set_reveal_child(!revealer.get_reveal_child());
  }
};

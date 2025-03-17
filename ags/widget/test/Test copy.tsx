import { App, Astal, Gtk } from "astal/gtk4";
import { QuickSettings } from "./quick-settings/QuickSettings";

// let visible: boolean = true;

export const Test = (): Gtk.Window => {
  // let popoverRef: Gtk.Popover | null = null;

  return (
    <window
      application={App}
      name="test"
      cssName="control-center"
      namespace="test"
      layer={Astal.Layer.TOP}
      anchor={Astal.WindowAnchor.RIGHT}
      // widthRequest={200}
      // heightRequest={200}
      marginRight={16}
    >
      {/* <box vertical widthRequest={200}>
        <button
          onClicked={(self) => {
            if (popoverRef) {
              if (popoverRef.get_parent()) {
                popoverRef.unparent(); // Ensure it's not attached anywhere else
              }
              popoverRef.set_parent(self); // Attach popover to button
              popoverRef.show(); // Show popover
            }
          }}
        >
          Lmao
        </button>

        <popover
          setup={(self) => {
            popoverRef = self as Gtk.Popover;
          }}
          heightRequest={200}
          widthRequest={200}
          autohide
          // hasArrow={false}
          // cascadePopdown={false}
          position={Gtk.PositionType.RIGHT}
        >
          <box vertical spacing={16}>
            <button onClicked={() => print("Yeezy")}>Yeezy</button>
            <button onClicked={() => print("Ad")}>Ad</button>
            <button onClicked={() => print("Bruh")}>Bruh</button>
          </box>
        </popover>

        <box vertical spacing={16}>
          <label hexpand>Hello world</label>
          <button onClicked={() => print("Hello")}>Hello</button>
          <button onClicked={() => print("World")}>World</button>
          <button onClicked={() => print("Yee")}>Yee</button>
        </box>
      </box> */}

      {/* <box vertical>
        <button
          onClicked={(self) => {
            if (popoverRef) {
              if (popoverRef.get_parent()) {
                popoverRef.unparent(); // Ensure it's not attached anywhere else
              }
              popoverRef.set_parent(self); // Attach popover to button
              popoverRef.show(); // Show popover
            }
          }}
        >
          Test
        </button>

        <popover
          setup={(self) => {
            popoverRef = self as Gtk.Popover;
          }}
          heightRequest={200}
          widthRequest={200}
          autohide
          // hasArrow={false}
          // cascadePopdown={false}
          // position={Gtk.PositionType.RIGHT}
        >
          <box vertical spacing={16}>
            <button onClicked={() => print("Yeezy")}>Yeezy</button>
            <button onClicked={() => print("Ad")}>Ad</button>
            <button onClicked={() => print("Bruh")}>Bruh</button>
          </box>
        </popover>
      </box> */}

      <box widthRequest={100} vertical>
        {/* <button onClicked={() => App.toggle_window("quick-settings")}> */}
        <button onClicked={() => QuickSettings()}>Lmao</button>
      </box>
    </window>
  ) as Gtk.Window;
};

import { bind } from "astal";
import { Gdk, Gtk, hook } from "astal/gtk4";
import AstalTray from "gi://AstalTray";

const tray = AstalTray.get_default();

const TrayItem = ({ item }: { item: AstalTray.TrayItem }): Gtk.Button =>
  (
    <button
      cssClasses={["tray-item"]}
      tooltipText={bind(item, "tooltipMarkup")}
      setup={(self) => {
        console.log("Tray item added:", item.tooltipMarkup);

        if (item.actionGroup)
          self.insert_action_group("dbusmenu", item.actionGroup);

        let popoverMenu: Gtk.PopoverMenu | null = null;
        if (item.menuModel) {
          popoverMenu = Gtk.PopoverMenu.new_from_model_full(
            item.menuModel,
            Gtk.PopoverMenuFlags.NESTED,
          );
          popoverMenu.set_parent(self);
        }

        const controller = new Gtk.EventControllerLegacy({
          propagationPhase: Gtk.PropagationPhase.CAPTURE,
        });

        controller.connect(
          "event",
          (_c: Gtk.EventControllerLegacy, event: Gdk.Event) => {
            const type = event.get_event_type();

            if (
              type === Gdk.EventType.BUTTON_PRESS ||
              type === Gdk.EventType.BUTTON_RELEASE
            ) {
              const pressEvent = event as Gdk.Event & {
                get_button?: () => number;
              };

              if (typeof pressEvent.get_button !== "function") return false;

              const mouseButton = pressEvent.get_button();

              if (type === Gdk.EventType.BUTTON_PRESS)
                if (
                  mouseButton == Gdk.BUTTON_SECONDARY ||
                  (item.isMenu && mouseButton == Gdk.BUTTON_PRIMARY)
                )
                  item.about_to_show();

              if (type === Gdk.EventType.BUTTON_RELEASE) {
                if (
                  pressEvent.get_surface() !== self.get_native()?.get_surface()
                )
                  return false;

                if (mouseButton == Gdk.BUTTON_PRIMARY) {
                  if (item.isMenu && popoverMenu) popoverMenu.popup();
                  else item.activate(0, 0);
                } else if (mouseButton == Gdk.BUTTON_MIDDLE) {
                  item.secondary_activate(0, 0);
                } else if (popoverMenu) {
                  popoverMenu.popup();
                }
              }
            }
            return true;
          },
        );

        self.add_controller(controller);

        hook(self, item, "notify::menu-model", () => {
          if (popoverMenu) popoverMenu.set_menu_model(item.menuModel);
        });

        hook(self, item, "notify::action-group", (btn) => {
          if (item.actionGroup)
            btn.insert_action_group("dbusmenu", item.actionGroup);
        });
      }}
      child={<image gicon={bind(item, "gicon")} pixelSize={1 * 16} />}
    />
  ) as Gtk.Button;

export const TrayWidget = (): Gtk.Box =>
  (
    <box
      spacing={0.25 * 16}
      cssClasses={["button-widget"]}
      visible={bind(tray, "items").as((items) => items.length > 0)}
    >
      {bind(tray, "items").as((items) =>
        items.map((item) => <TrayItem item={item} />),
      )}
    </box>
  ) as Gtk.Box;

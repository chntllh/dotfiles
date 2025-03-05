import { bind, Variable } from "astal";
import { Gdk, Gtk } from "astal/gtk4";
import AstalTray from "gi://AstalTray?version=0.1";

const TrayItem = (id: string, item: AstalTray.TrayItem): Gtk.Widget => {
  return (
    <button
      cssClasses={["button-widget"]}
      name={id}
      child={
        <image
          // Future: paintable cannot have a null value
          paintable={bind(item, "iconPixbuf").as((pixbuf) =>
            Gdk.Texture.new_for_pixbuf(pixbuf),
          )}
          pixelSize={20}
        />
      }
      onClicked={() => item.activate(0, 0)}
    />
  );
};

export const TrayWidget = () => {
  const tray = AstalTray.get_default();
  const trayVisible = Variable(true);

  let itemAddedId: number | null = null;
  let itemRemovedId: number | null = null;

  const setup = (self: Gtk.Box) => {
    let child = self.get_first_child();
    while (child) {
      const next = child.get_next_sibling();
      self.remove(child);
      child = next;
    }

    tray
      .get_items()
      .forEach((item) => self.append(TrayItem(item.itemId, item)));
    trayVisible.set(self.get_first_child() !== null);

    itemAddedId = tray.connect("item-added", (_, itemId) => {
      const item = tray.get_item(itemId);
      if (!item) return;

      self.append(TrayItem(itemId, item));
      trayVisible.set(true);
    });

    itemRemovedId = tray.connect("item-removed", (_, itemId) => {
      let widget = self.get_first_child();
      while (widget) {
        if (widget instanceof Gtk.Button && widget.name === itemId) {
          self.remove(widget);
          break;
        }
        widget = widget.get_next_sibling();
      }
      trayVisible.set(self.get_first_child() !== null);
    });
  };

  const onDestroy = () => {
    if (itemAddedId) {
      tray.disconnect(itemAddedId);
    }
    if (itemRemovedId) {
      tray.disconnect(itemRemovedId);
    }
  };

  return (
    <box
      spacing={4}
      cssClasses={["tray-box"]}
      visible={bind(trayVisible)}
      setup={setup}
      onDestroy={onDestroy}
    />
  );
};

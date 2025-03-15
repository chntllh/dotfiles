import { Binding } from "astal";
import { Gtk } from "astal/gtk4";
import { controlCenterPage } from "../widget/control-center/ControlCenter";

interface PageProps {
  pageName: string;
  headerTitle: string;
  headerBtnAction?: () => void;
  children: Binding<Gtk.Widget[]> | Gtk.Widget[];
}

export const Page = ({
  pageName,
  headerTitle,
  headerBtnAction = undefined,
  children,
}: PageProps): Gtk.Box =>
  (
    <box name={pageName} vertical spacing={8}>
      <centerbox cssClasses={["page-header"]}>
        <button
          halign={Gtk.Align.START}
          onClicked={() => {
            controlCenterPage.set("main");
          }}
          iconName={"edit-undo-symbolic"}
        />
        <label label={headerTitle} halign={Gtk.Align.CENTER} hexpand />
        {headerBtnAction && (
          <button
            halign={Gtk.Align.END}
            iconName={"object-rotate-right-symbolic"}
            onClicked={headerBtnAction}
          />
        )}
      </centerbox>
      <Gtk.ScrolledWindow cssClasses={["scrolled-window"]} vexpand>
        <box vertical spacing={8} cssClasses={["page-content"]}>
          {children}
        </box>
      </Gtk.ScrolledWindow>
    </box>
  ) as Gtk.Box;

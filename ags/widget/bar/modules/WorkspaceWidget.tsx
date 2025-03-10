import { bind, Variable } from "astal";
import { Gtk } from "astal/gtk4";
import AstalHyprland from "gi://AstalHyprland?version=0.1";

const hyprland = AstalHyprland.get_default();

const range = (max: number): number[] =>
  Array.from({ length: max + 1 }, (_, i) => i);

const WorkspaceButton = ({
  ws,
}: {
  ws: AstalHyprland.Workspace;
}): Gtk.Button => {
  const classNames = Variable.derive(
    [bind(hyprland, "focusedWorkspace"), bind(hyprland, "clients")],
    (fws, _) => {
      const classes = ["workspace-button"];
      if (!fws) return classes;
      if (fws.id == ws.id) classes.push("focused");
      if (hyprland.get_workspace(ws.id)?.get_clients().length > 0)
        classes.push("occupied");
      return classes;
    },
  );

  return (
    <button
      cssClasses={classNames()}
      onDestroy={() => classNames.drop()}
      onClicked={() => ws.focus()}
    />
  ) as Gtk.Button;
};

export const WorkspaceWidget = (): Gtk.Box =>
  (
    <box cssClasses={["workspaces-box"]}>
      {range(9).map((i) => (
        <WorkspaceButton ws={AstalHyprland.Workspace.dummy(i + 1, null)} />
      ))}
    </box>
  ) as Gtk.Box;

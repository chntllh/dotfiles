import { bind, Variable } from "astal";
import { Gtk } from "astal/gtk4";
import AstalHyprland from "gi://AstalHyprland?version=0.1";

function range(max: number): number[] {
  return Array.from({ length: max + 1 }, (_, i) => i);
}

const WorkspaceButton = ({ ws }: { ws: AstalHyprland.Workspace }) => {
  const hyprland = AstalHyprland.get_default();
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
  );
};

export const WorkspaceWidget = () => {
  return (
    <box cssClasses={["workspaces-box"]}>
      {range(9).map((i) => (
        <WorkspaceButton ws={AstalHyprland.Workspace.dummy(i + 1, null)} />
      ))}
    </box>
  );
};

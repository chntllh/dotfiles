import { bind, Binding } from "astal";
import { Gtk } from "astal/gtk4";

interface ToggleButtonProps {
  label: string;
  icon: string | Binding<string>;
  onToggle: () => void;
  secondaryLabel: Binding<string>;
  hasSecondaryButton?: boolean;
  onSecondaryClick?: () => void;
}

export const ToggleButton = ({
  label,
  icon,
  onToggle,
  secondaryLabel,
  hasSecondaryButton = false,
  onSecondaryClick,
}: ToggleButtonProps): Gtk.Box => {
  return (
    <box heightRequest={3 * 16}>
      <button
        cssClasses={[
          hasSecondaryButton ? "qs-button-left-rounded" : "qs-button-rounded",
        ]}
        onClicked={onToggle}
        widthRequest={hasSecondaryButton ? 8 * 16 : 10 * 16}
      >
        <box spacing={8}>
          <image iconName={icon} pixelSize={1.2 * 16} marginStart={0.25 * 16} />
          <box
            vertical
            valign={Gtk.Align.CENTER}
            halign={Gtk.Align.CENTER}
            marginEnd={hasSecondaryButton ? 0 : 1.5 * 16}
          >
            <label cssClasses={["qs-title"]} hexpand>
              {label}
            </label>
            <label
              cssClasses={["qs-subtitle"]}
              hexpand
              visible={bind(
                secondaryLabel!.as((val) => val != null && val != ""),
              )}
              label={bind(
                secondaryLabel.as((val) => {
                  return val ? val : "";
                }),
              )}
            />
          </box>
        </box>
      </button>
      {hasSecondaryButton && onSecondaryClick && (
        <button
          cssClasses={["qs-button-right-rounded"]}
          onClicked={onSecondaryClick}
          // widthRequest={2.5 * 16}
        >
          <image iconName={"go-next-symbolic"} />
        </button>
      )}
    </box>
  ) as Gtk.Box;
};

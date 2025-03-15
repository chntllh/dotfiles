import { Binding } from "astal";
import { Gtk } from "astal/gtk4";

interface ToggleButtonProps {
  label: string;
  icon: string | Binding<string>;
  onToggle: () => void;
  secondaryLabel: Binding<string | null>;
  hasSecondaryButton?: boolean;
  secondaryIcon?: string | Binding<string>;
  onSecondaryClick?: () => void;
}

export const ToggleButton = ({
  label,
  icon,
  onToggle,
  secondaryLabel,
  hasSecondaryButton = false,
  secondaryIcon = "go-next-symbolic",
  onSecondaryClick,
}: ToggleButtonProps): Gtk.Box => {
  return (
    <box heightRequest={3 * 16}>
      <button
        cssClasses={[
          hasSecondaryButton ? "qs-button-left-rounded" : "qs-button-rounded",
        ]}
        onClicked={onToggle}
        widthRequest={hasSecondaryButton ? 9 * 16 : 11 * 16}
      >
        <box spacing={8}>
          <image iconName={icon} pixelSize={24} marginStart={0.5 * 16} />
          <box vertical valign={Gtk.Align.CENTER} halign={Gtk.Align.CENTER}>
            <label cssClasses={["qs-title"]} hexpand>
              {label}
            </label>
            {secondaryLabel.as((val) =>
              val ? <label cssClasses={["qs-subtitle"]}>{val}</label> : <></>,
            )}
          </box>
        </box>
      </button>
      {hasSecondaryButton && onSecondaryClick && (
        <button
          cssClasses={["qs-button-right-rounded"]}
          onClicked={onSecondaryClick}
          widthRequest={2 * 16}
        >
          <image iconName={secondaryIcon} />
        </button>
      )}
    </box>
  ) as Gtk.Box;
};

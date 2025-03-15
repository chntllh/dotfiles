import { Binding } from "astal";
import { Gtk } from "astal/gtk4";

type SliderProps = {
  icon: string | Binding<string>;
  value: Binding<number>;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  onClick?: () => void;
  visible?: Binding<boolean>;
};

export const Slider = ({
  icon,
  value,
  max = 1,
  step = 0.05,
  onChange,
  onClick,
  visible,
}: SliderProps): Gtk.Box => {
  return (
    <box visible={visible}>
      <button onClicked={onClick ? onClick : undefined}>
        <image iconName={icon} pixelSize={24} />
      </button>
      <slider
        max={max}
        step={step}
        value={value}
        onChangeValue={({ value }) => onChange(value)}
        hexpand
      />
    </box>
  ) as Gtk.Box;
};

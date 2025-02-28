import { bind } from "astal";
import AstalWp from "gi://AstalWp?version=0.1";

export const VolumeSlider = () => {
  const speaker = AstalWp.get_default()?.audio.defaultSpeaker!;

  return (
    <box>
      <image iconName={bind(speaker, "volumeIcon")} />
      <slider
        max={1.4}
        value={bind(speaker, "volume")}
        onChangeValue={({ value }) => {
          speaker.volume = value;
        }}
        hexpand
      />
    </box>
  );
};

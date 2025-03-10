import { bind } from "astal";
import { Gtk } from "astal/gtk4";
import AstalWp from "gi://AstalWp?version=0.1";

const speaker = AstalWp.get_default()?.audio.defaultSpeaker!;

let prev = speaker.volume > 0 ? speaker.volume : 0.5;

export const VolumeSlider = (): Gtk.Box =>
  (
    <box>
      <button
        onClicked={() => {
          if (speaker.mute) {
            speaker.mute = false;
            speaker.volume = prev;
          } else {
            prev = speaker.volume > 0 ? speaker.volume : prev;
            speaker.mute = true;
            speaker.volume = 0;
          }
        }}
      >
        <image iconName={bind(speaker, "volumeIcon")} pixelSize={24} />
      </button>
      <slider
        max={1.4}
        step={0.05}
        value={bind(speaker, "volume")}
        onChangeValue={({ value }) => {
          if (value === 0) speaker.mute = true;
          else {
            if (speaker.mute) speaker.mute = false;
            prev = value;
          }
          speaker.volume = value;
        }}
        hexpand
      />
    </box>
  ) as Gtk.Box;

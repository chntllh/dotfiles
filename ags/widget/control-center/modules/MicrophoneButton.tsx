import { bind } from "astal";
import { Gtk } from "astal/gtk4";
import AstalWp from "gi://AstalWp?version=0.1";

const microphone = AstalWp.get_default()?.audio.defaultMicrophone!;

export const MicrophoneButton = (): Gtk.Box =>
  (
    <box>
      <button
        cssClasses={["qs-button"]}
        onClicked={() => (microphone.mute = !microphone.mute)}
      >
        <box spacing={8}>
          <image iconName={bind(microphone, "volumeIcon")} />
          <box vertical valign={Gtk.Align.CENTER} halign={Gtk.Align.CENTER}>
            <label cssClasses={["qs-title"]} label={"Microphone"} hexpand />
            <label
              cssClasses={["qs-subtitle"]}
              label={bind(microphone, "mute").as((muted) =>
                muted ? "Muted" : "Un-Muted",
              )}
            />
          </box>
        </box>
      </button>
    </box>
  ) as Gtk.Box;

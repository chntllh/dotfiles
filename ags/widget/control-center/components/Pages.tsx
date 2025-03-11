import { Gtk } from "astal/gtk4";
import { controlCenterPage } from "../ControlCenter";
import AstalNetwork from "gi://AstalNetwork?version=0.1";
import { bind, Binding, execAsync, timeout } from "astal";
import AstalBluetooth from "gi://AstalBluetooth?version=0.1";
import AstalPowerProfiles from "gi://AstalPowerProfiles?version=0.1";

interface PageProps {
  pageName: string;
  headerTitle: string;
  headerBtnAction?: () => void;
  children: Binding<Gtk.Widget[]> | Gtk.Widget[];
}

const Page = ({
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

export const WifiPage = () => {
  const wifi = AstalNetwork.get_default().wifi;

  return Page({
    pageName: "wifi",
    headerTitle: "Network",
    headerBtnAction: () => wifi.scan(),
    children: bind(wifi, "accessPoints").as((accessPoints) =>
      accessPoints
        .sort((a, b) => b.strength - a.strength)
        .map((ap) => (
          <button
            onClicked={() =>
              execAsync(["nmcli", "device", "wifi", "connect", ap.bssid]).catch(
                (err) => print(err),
              )
            }
          >
            <box spacing={12}>
              <image iconName={ap.iconName} />
              <label label={ap.ssid} />
              <image
                visible={bind(wifi, "activeAccessPoint").as(
                  (aap) => aap === ap,
                )}
                halign={Gtk.Align.END}
                hexpand
                iconName={"object-select-symbolic"}
              />
            </box>
          </button>
        )),
    ),
  });
};

export const BluetoothPage = () => {
  const bluetooth = AstalBluetooth.get_default();

  return Page({
    pageName: "bluetooth",
    headerTitle: "Bluetooth",
    children: bind(bluetooth, "devices").as((device) =>
      device.map((device) => (
        <button
          onClicked={() => {
            if (!bluetooth.isPowered) {
              bluetooth.toggle();
            }
            timeout(100, () => {
              if (!device.connected) {
                print("Connecting");
                device.connect_device(() => {});
              } else {
                print("Disconnecting");
                device.disconnect_device(() => {});
              }
            });
          }}
        >
          <box spacing={12}>
            <image iconName={device.icon} />
            <label label={device.name} />
            <image
              visible={bind(device, "connected")}
              halign={Gtk.Align.END}
              hexpand
              iconName={"object-select-symbolic"}
            />
          </box>
        </button>
      )),
    ),
  });
};

export const PowerProfilePage = () => {
  const power = AstalPowerProfiles.get_default();
  const profiles: AstalPowerProfiles.Profile[] = power.get_profiles();

  const profileNames: Record<string, string> = {
    "power-saver": "Dzire",
    balanced: "Virtus",
    performance: "Supra",
  };

  return Page({
    pageName: "power-profile",
    headerTitle: "Power Profile",
    children: profiles.map((profile) => (
      <button onClicked={() => power.set_active_profile(profile.profile)}>
        <box spacing={8}>
          <label label={profileNames[profile.profile]} />
          <image
            visible={bind(power, "activeProfile").as(
              (ap) => ap === profile.profile,
            )}
            halign={Gtk.Align.END}
            hexpand
            iconName={"object-select-symbolic"}
          />
        </box>
      </button>
    )),
  });
};

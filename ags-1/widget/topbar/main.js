import { Clock } from "./clock.js"
import { BatteryLabel, PowerRate } from "./battery.js"
import { Workspaces, ClientTitle } from "./hyprland.js"
import { Media } from "./mpris.js"
import { SysTray } from "./systray.js"
import { Volume } from "./volume.js"
import { NetworkIndicator } from "./network.js"

// Layout of Bar
function Left() {
    return Widget.Box({
        spacing: 8,
        children: [
            // ClientTitle(),
            Workspaces(),
        ],
    })
}

function Center() {
    return Widget.Box({
        spacing: 8,
        children: [
            // Media(),
            Clock(),
        ],
    })
}

function Right() {
    return Widget.Box({
        hpack: "end",
        spacing: 4,
        children: [
            SysTray(),
            Volume(),
            BatteryLabel(),
            PowerRate(),
            NetworkIndicator(),
        ],
    })
}

// Main Bar
export function Bar(monitor = 0) {
    return Widget.Window({
        name: `bar-${monitor}`, // name has to be unique
        class_name: "bar",
        monitor,
        anchor: ["top", "left", "right"],
        exclusivity: "exclusive",
        child: Widget.CenterBox({
            start_widget: Left(),
            center_widget: Center(),
            end_widget: Right(),
        }),
    })
}
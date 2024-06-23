import { NotificationPopups } from "./widget/notificationPopups.js" 
import { Clock } from "./widget/clock.js"
import { BatteryLabel } from "./widget/battery.js"
import { Workspaces, ClientTitle } from "./widget/hyprland.js"
import { Media } from "./widget/mpris.js"
import { Volume } from "./volume.js"
import { PowerRate } from "./widget/powerrate.js"
import { SysTray } from "./widget/systray.js"

// Layout of Bar
function Left() {
    return Widget.Box({
        spacing: 8,
        children: [
            ClientTitle(),
        ],
    })
}

function Center() {
    return Widget.Box({
        spacing: 8,
        children: [
            Workspaces(),
            Media(),
        ],
    })
}

function Right() {
    return Widget.Box({
        hpack: "end",
        spacing: 4,
        children: [
            Volume(),
            BatteryLabel(),
            PowerRate(),
            SysTray(),
            Clock(),
        ],
    })
}

// Main Bar
function Bar(monitor = 0) {
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


// main scss file
const scss = `${App.configDir}/scss/style.scss`

// target css file
const css = `${App.configDir}/style.css`

Utils.monitorFile(
    // directory that contains the scss files
    `${App.configDir}/style`,

    // reload function
    function() {
        // compile, reset, apply
        Utils.exec(`sassc ${scss} ${css}`)
        App.resetCss()
        App.applyCss(css)
    },
)

App.config({
    style: css,
    windows: [
        Bar(),
        NotificationPopups(),
    ],
})

export { }
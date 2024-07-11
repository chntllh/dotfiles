import { Bar } from "./widget/topbar/main.js"
import { NotificationPopups } from "./widget/notification/notificationPopups.js"


function QuickSetting() {
    return Widget.Window({
        name: "quicksetting",
        class_name: "quicksetting",
        anchor: ["right", "top", "bottom"],
        // exclusivity: "exclusive",
        child: Widget.Box([
            Widget.Label({
                label: "Lmao"
            })
        ])
    })
}


// main scss file
const scss = `${App.configDir}/scss/index.scss`

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
        QuickSetting(),
    ],
})

export { }
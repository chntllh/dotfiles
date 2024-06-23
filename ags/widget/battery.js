const battery = await Service.import("battery")

export function BatteryLabel() {
    // const value = battery.bind("percent").as(p => p > 0 ? p / 100 : 0)
    const icon = Utils.merge([battery.bind("percent"), battery.bind("charging")], (p, c) => {
        const level = Math.floor(p / 10) * 10        
        const bat = `battery-level-${level}`
        const status = level == 100 ? 'charged' : 'charging'
        return c ? `${bat}-${status}-symbolic` : `${bat}-symbolic`
    })

    return Widget.Box({
        class_name: "battery",
        visible: battery.bind("available"),
        children: [
            Widget.Icon({ icon }),
            // Widget.LevelBar({
            //     widthRequest: 80,
            //     vpack: "center",
            //     value,
            // }),
        ],
    })
}
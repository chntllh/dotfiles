const battery = await Service.import("battery")

export function BatteryLabel() {
    const iconz = Utils.merge([battery.bind("percent"), battery.bind("charging")], (p, c) => {
        const level = Math.floor(p / 10) * 10        
        const bat = `battery-level-${level}`
        const status = level == 100 ? 'charged' : 'charging'
        return c ? `${bat}-${status}-symbolic` : `${bat}-symbolic`
    })

    return Widget.Box({
        class_name: "battery",
        visible: battery.bind("available"),
        children: [
            Widget.Icon({ 
                icon: iconz,
                size: 24,
             }),
        ],
    })
}

export function PowerRate() {
    const power = battery.bind("energy_rate").as(p => (Math.round(p*10)/10).toString() + "W")

    return Widget.Box({
        class_name: "power_rate",
        children: [
            Widget.Label({
                label: power,
                width_chars: 5,
            })
        ]
    })
}
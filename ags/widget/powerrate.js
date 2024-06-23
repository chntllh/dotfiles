const battery = await Service.import("battery")

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
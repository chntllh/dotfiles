const date = Variable("", {
    poll: [2000, 'date +"%a %b %e %H:%M %p"'],
})

export function Clock() {
    return Widget.Label({
        class_name: "clock",
        label: date.bind(),
    })
}
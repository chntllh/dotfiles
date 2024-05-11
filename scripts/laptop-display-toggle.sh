#!/bin/sh

TOGGLE=$HOME/.config/scripts/vars/.laptop-display-toggle

if [ ! -e $TOGGLE ]; then
    touch $TOGGLE
    hyprctl keyword monitor "eDP-1, disable"
    notify-send -u low "Laptop monitor disabled"
else
    rm $TOGGLE
    hyprctl keyword monitor "eDP-1, 1920x1080@120, 2560x900, 1"
    notify-send -u low "Laptop monitor enabled"
fi
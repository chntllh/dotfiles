#!/bin/bash

packages=(alacritty zsh hyprland xdg-desktop-portal-hyprland xdg-desktop-portal-gtk pipewire wireplumber qt5-wayland qt6-wayland polkit-gnome waybar wofi brightnessctl wl-clipboard hyprpaper blueman xwaylandvideobridge ttf-cascadia-code-nerd ttf-cascadia-mono-nerd github-cli)

sudo pacman -S "${packages[@]}"

aur_packages=(swaync apple-fonts asusctl supergfxctl)

yay -S "${aur_packages[@]}"
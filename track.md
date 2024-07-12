# Enable wayland in gnome

```bash
ln -s /dev/null /etc/udev/rules.d/61-gdm.rules
```

Edit `/etc/gdm/custom.conf` file and set `WaylandEnable=true`

---

# Timeshift (with grub snapshot support)

```bash
# Installing necessary packages
yay -S timeshift timeshift-autosnap grub-btrfs

# Enable cronie service for timeshift
sudo systemctl enable --now cronie.service

# Edit boot options
sudo systemctl edit --full grub-btrfsd

# Set the following
ExecStart=/usr/bin/grub-btrfsd --syslog --timeshift-auto

# Generate grub
sudo grub-mkconfig -o /boot/grub/grub.cfg

# Enable service
sudo systemctl enable --now grub-btrfsd
```

---

# Nvidia

```bash
# Add kernel parameters to /etc/default/grub file, needed for nvidia-555 driver
NVreg_EnableGpuFirmware=0

# Install supergfxctl
yay -S supergfxctl
systemctl enable supergfxd.service

```

---

# Sudoers file

```bash
sudo visudo

# Add line to end of file
<USERNAME> ALL=(ALL) NOPASSWD:ALL
```

---

# Auto-CPUFreq

```bash
yay -S auto-cpufreq
systemctl enable --now auto-cpufreq
# IF, installed by aur
sudo systemctl mask power-profiles-daemon.service
```

---

# Linux Zen Kernel

```
sudo pacman -S linux-zen linux-zen-headers
```

---

# Terminal

```bash
# Terminal and Shell
sudo pacman -S alacritty zsh

# Font
sudo pacman -S ttf-cascadia-code-nerd ttf-cascadia-mono-nerd
```

---

# Syncthing

```bash
systemctl --user enable syncthing.service
systemctl --user start syncthing.service
```

---

# Flatpak

```bash
sudo pacman -S flatpak

# Adding repo
flatpak remote-add --if-not-exists flathub https://dl.flathub.org/repo/flathub.flatpakrepo
```

---

# Extension

```bash
sudo pacman -S gnome-browser-connector 
yay -S gnome-shell-extension-pop-shell-git
```

---

# Bun

```bash
curl -fsSL https://bun.sh/install | bash
```

---

## For CUDA

---

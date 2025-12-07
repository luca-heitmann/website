---
title: 'Setting Up the Home Lab'
weight: 2
---

## Setup the Raspberry Pi

Flash Ubuntu to an SD card using Raspberry Pi Disk Imager and adapt these files on the SD card afterwards:

```{linenos=table,linenostart=1,filename="config.txt"}
# ... original content ...


# Turn off Power LED
dtparam=pwr_led_trigger=default-on
dtparam=pwr_led_activelow=off

# Turn off Activity LED
dtparam=act_led_trigger=none
dtparam=act_led_activelow=off

# Turn off Ethernet ACT LED
dtparam=eth_led0=4

# Turn off Ethernet LNK LED
dtparam=eth_led1=4
```

```yaml{linenos=table,hl_lines=[4,5,14,15,21],linenostart=1,filename="user-data"}
#cloud-config

# Global host configuration
hostname: rpi-0 # TODO: adapt host name
timezone: Europe/Berlin # TODO: adapt timezone
locale: en_US.UTF-8
ssh_pwauth: false

ntp:
  enabled: true

# User configuration
users:
- name: your_name # TODO: adapt user name
  gecos: your_name # TODO: same name here
  sudo: ALL=(ALL) NOPASSWD:ALL
  groups: sudo
  lock_passwd: true
  shell: /bin/bash
  ssh_authorized_keys:
  - ssh-rsa AAAAB3Nza... # TODO: YOUR SSH KEY

# Package configuration
package_update: true
package_upgrade: true
package_reboot_if_required: true

packages:
- linux-modules-extra-raspi
- podman

# Reboot host
power_state:
  mode: reboot
```

Connect the raspberry pi to network and power and wait until cloud-init is done:

```
ssh rpi-0 cloud-init status
```

This might take a while...

When the RaspberryPi is running, you might need to mount an external storage. Have a look at this guide: [Set up automatic mounting](https://raspberrypi-guide.github.io/filesharing/mounting-external-drive#set-up-automatic-mounting)

## Deploying Prod Instance

Create a new domain and a new tunnel:

```bash
cloudflared login
cloudflared tunnel create prod-homelab
cloudflared tunnel route dns prod-homelab *.YOUR_PROD_DOMAIN.dpdns.org
```

Create an .env file similar to the .env.dev file and adapt the variables: Cluster Domain, paths for the secrets etc.

and a `prod.compose.yml`:

```yaml{linenos=table,filename="prod.compose.yml"}
#!/usr/bin/env -S podman-compose --env-file .env.prod -f 
name: prod-homelab

include:
  - src/compose.yml
```

Make it executable by running `chmod +x prod.compose.yml`.

Push everything to the Git repository.

Connect to the Raspberry Pi via SSH, navigate to the mount point of the external storage, e.g. /mnt/storage and clone your Git repository. Copy the secrets to the paths that are configured in the `.env.prod` file. Start the stack by running `./prod.compose.yml up -d` and see if the services are accessible via https://pdf.YOUR_PROD_DOMAIN.dpdns.org.

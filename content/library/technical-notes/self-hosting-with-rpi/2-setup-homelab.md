---
title: 'Setting Up the Home Lab'
weight: 2
---

## Setup the Raspberry Pi

Flash Ubuntu to SD Card and adapt these files afterwards:

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

## Access from the Internet

To access the HTTPS port on the RaspberryPi from the Internet, a dyndns is needed. This can be configured in the Router settings or alternatively with a small app on the RaspberryPi: [Configuring your dynDNS Client](https://desec.readthedocs.io/en/latest/dyndns/configure.html) If you run ddclient on the RaspberryPi, consider using compose for this as well: https://hub.docker.com/r/linuxserver/ddclient

Add a port forwarding rule to your router to route port 443 to 8443 and 80 to 8080 on the RaspberryPi. Make sure to create TCP and UDP rule for port 443. It is sufficient to only have a TCP rule for port 80. Have a look at the docs of the router: [Configuring static port sharing in the FRITZ!Box](https://fritz.com/en/apps/knowledge-base/FRITZ-Box-7590/893_Configuring-static-port-sharing-in-the-FRITZ-Box)

An alternative to dyndns is using a [Cloudflare tunnel](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/get-started/create-remote-tunnel/). A domain can be created using [eu.org](https://nic.eu.org/) or by registering a custom domain name at any domain hosting service.

Another option would be to use an VPN like [Tailscale](https://tailscale.com/).

## Deploying Prod Instance

Create an .env file similar to the .env.dev file:

```bash{linenos=table,hl_lines=[2,3,6],filename=".env.prod"}
########### GENERAL ###########
CLUSTER_DOMAIN=example.com # TODO: your domain
TZ=Europe/Berlin # TODO: your timezone
# Find socket path with the following command:
# podman info --format '{{.Host.RemoteSocket.Path}}' | sed 's/unix:\/\///'
DOCKER_SOCKET= # TODO: Add your socket here!


########### CADDY ###########
HTTP_PORT=8080
HTTPS_PORT=8443
ADMIN_EMAIL=admin@homelab.internal


########### IMAGE VERSIONS ###########
CADDY_IMAGE=lucaslorentz/caddy-docker-proxy:2.10-alpine # https://hub.docker.com/r/lucaslorentz/caddy-docker-proxy/tags?name=alpine
BENTOPDF_IMAGE=bentopdf/bentopdf-simple:v1.9.0 # https://hub.docker.com/r/bentopdf/bentopdf-simple/tags
```

and a `prod.compose.yml`:

```yaml{linenos=table,filename="prod.compose.yml"}
#!/usr/bin/env -S podman-compose --env-file .env.prod -f 
name: prod-homelab

include:
  - src/compose.yml
```

Make it executable by running `chmod +x prod.compose.yml`.

Push everything to the Git repository.

Connect to the Raspberry Pi via SSH, navigate to the mount point of the external storage, e.g. /mnt/storage and clone your Git repository.

Start the stack by running `./prod.compose.yml up -d` and see if the services are accessible via https://pdf.example.com respectively your domain.

---
title: "Deploying File Server and Password Manager"
weight: 3
---

## OCIS Deployment

```yaml{linenos=table,linenostart=1,filename="src/ocis/compose.yml"}
services:
  ocis:
    image: ${OCIS_IMAGE}
    restart: unless-stopped
    # run ocis init to initialize a configuration file with random secrets
    # it will fail on subsequent runs, because the config file already exists
    # therefore we ignore the error and then start the ocis server
    entrypoint:
      - /bin/sh
    command: ["-c", "IDM_ADMIN_PASSWORD=$(cat /run/secrets/ocis_admin_password) ocis init || true; exec ocis server"]
    environment:
      TZ: ${TZ}
      PROXY_TLS: false
      OCIS_URL: https://files.${CLUSTER_DOMAIN}:${HTTPS_PORT}
      OCIS_LOG_LEVEL: warn
      OCIS_LOG_PRETTY: true
    volumes:
      - ${OCIS_CONFIG}:/etc/ocis
      - ${OCIS_DATA}:/var/lib/ocis
    labels:
      caddy: files.${CLUSTER_DOMAIN}
      caddy.reverse_proxy: "{{upstreams 9200}}"
    secrets:
      - ocis_admin_password

secrets:
  ocis_admin_password:
    file: ${OCIS_ADMIN_PASSWORD_FILE}
```

```{linenos=table,linenostart=1,filename=".gitignore"}
.DS_Store

secrets.*
!secrets.dev
data.dev
backup.dev

.env.testing
testing.compose.yml
```

```{linenos=table,linenostart=1,filename="secrets.dev/OCIS_ADMIN_PASSWORD"}
YOUR_SECRET_ADMIN_PASSWORD
```

```bash{linenos=table,filename=".env.dev"}
# ... original content ...

########### OCIS ###########
OCIS_CONFIG=./data.dev/ocis/config
OCIS_DATA=./data.dev/ocis/data
OCIS_ADMIN_PASSWORD_FILE=./secrets.dev/OCIS_ADMIN_PASSWORD


########### IMAGE VERSIONS ###########
OCIS_IMAGE=owncloud/ocis:7.3.1 # https://hub.docker.com/r/owncloud/ocis/tags

# ... original content ...
```

```yaml{linenos=table,filename="src/compose.yml"}
include:
  # ... original content ...
  - ocis/compose.yml
```

```yaml{linenos=table,hl_lines=[11,12,13],filename="dev.compose.yml"}
#!/usr/bin/env -S podman-compose --env-file .env.dev -f 
name: dev-homelab

include:
  - src/compose.yml

services:
  caddy:
    labels:
      caddy.local_certs: true
  ocis:
    environment:
      OCIS_INSECURE: true
```

## Vaultwarden Deployment

Your task: Create a deployment for Vaultwarden
- This is the documentation for deployments with compose: https://github.com/dani-garcia/vaultwarden/wiki/Using-Docker-Compose
- This is the documentation for the environment variables: https://github.com/dani-garcia/vaultwarden/blob/main/.env.template
- Use the same labels for configuring Caddy as with OCIS. A custom Caddyfile is not needed and no adaptions on the Caddy service should be neccessary.
- Mount the data directory similar to OCIS
- Configure the `DOMAIN` environment variable and the `ADMIN_TOKEN`. When the admin token is encrypted with argon2, a secret file is not neccessary.
- Find the environment variables to disable sign ups, verifying invitations, invitations and password hints

## Automated Backups

```yaml{linenos=table,linenostart=1,filename="src/stack-back/compose.yml"}
services:
  stack-back:
    image: ${STACK_BACK_IMAGE}
    restart: unless-stopped
    privileged: true
    environment:
      TZ: ${TZ}
      RESTIC_REPOSITORY: /srv/restic-repo
      RESTIC_PASSWORD_FILE: /run/secrets/restic_password
      DOCKER_HOST: unix://var/run/docker.sock
    volumes:
      - ${DOCKER_SOCKET}:/var/run/docker.sock
      - ${RESTIC_REPOSITORY_DIR}:/srv/restic-repo
    secrets:
      - restic_password

secrets:
  restic_password:
    file: ${RESTIC_PASSWORD_FILE}
```

```{linenos=table,linenostart=1,filename="secrets.dev/RESTIC_REPOSITORY_PASSWORD"}
YOUR_SECRET_RESTIC_PASSWORD
```

```bash{linenos=table,filename=".env.dev"}
# ... original content ...

########### STACK BACK ###########
RESTIC_REPOSITORY_DIR=./backup.dev
RESTIC_PASSWORD_FILE=./secrets.dev/RESTIC_REPOSITORY_PASSWORD


########### IMAGE VERSIONS ###########
STACK_BACK_IMAGE=ghcr.io/lawndoc/stack-back:v1.5.3 # https://github.com/lawndoc/stack-back/releases

# ... original content ...
```

```yaml{linenos=table,filename="src/compose.yml"}
include:
  # ... original content ...
  - stack-back/compose.yml
```

```yaml{linenos=table,hl_lines=[7,8],linenostart=1,filename="src/ocis/compose.yml"}
services:
  ocis:
    # ... original content ...
    labels:
      caddy: files.${CLUSTER_DOMAIN}
      caddy.reverse_proxy: "{{upstreams 9200}}"
      stack-back.volumes: true
      stack-back.volumes.stop-during-backup: true
```

Your task:
1. Add the same labels to the vaultwarden container
2. Create some testing data in OCIS and vaultwarden
3. Create a manual backup by running:

    ```bash
    ./dev.compose.yml exec stack-back rcb backup
    ```

4. Delete the testing data in OCIS and vaultwarden
5. Shutdown the services using `./dev.compose.yml stop ocis vaultwarden`
6. Restore the backup by running:

    ```bash
    ./dev.compose.yml exec stack-back restic snapshots
    # find the latest snapshot ID and replace <LATEST_SNAPSHOT_ID> in the next command
    ./dev.compose.yml exec stack-back restic restore -t /srv/restic-repo/restored-files <LATEST_SNAPSHOT_ID>
    ```

7. Find the restored directories in `restored-files` in the backup dir
8. Move the OCIS and Vaultwarden files from the `restored-files` to the data dir. Make sure to delete the data dirs before coping the restored files to prevent mixing them. Also make sure the paths are exactly the same and only the content changed.
9. Restart the services using `./dev.compose.yml start ocis vaultwarden`
10. Verify that the data was restored

Create a README file:

```md{linenos=table,linenostart=1,filename="README.md"}
# HomeLab IaC

## Initial Setup

1. Duplicate configuration files from dev environment and rename them
    - secrets.\<NAME>/*
    - .env.\<NAME>
    - \<NAME>.compose.yml
2. Adapt the configuration and make \<NAME>.compose.yml executable: `chmod +x <NAME>.compose.yml`
3. Run `<NAME>.compose.yml up -d`

Autostart with systemd:

    ```
    podman-compose systemd -a create-unit
    podman-compose systemd -a register
    loginctl enable-linger $USER
    systemctl --user daemon-reload
    systemctl --user enable --now podman-compose@<STACK_NAME>.service
    ```

To create a user for vaultwarden:

1. Open https://vault.\<CLUSTER_DOMAIN>:\<HTTPS_PORT>/admin
2. Login with admin password from configuration and invite a user using an email address
3. Open https://vault.\<CLUSTER_DOMAIN>:\<HTTPS_PORT>/#/register
4. Complete the registration with the same email address

Access the services using the following URLs:

- PDF Tools: https://pdf.\<CLUSTER_DOMAIN>:\<HTTPS_PORT>
- OCIS: https://files.\<CLUSTER_DOMAIN>:\<HTTPS_PORT>
- Vaultwarden: https://vault.\<CLUSTER_DOMAIN>:\<HTTPS_PORT>

## Trigger Manual Backup

1. Run `<NAME>.compose.yml exec stack-back sh`
2. Run `rcb backup`

## Restore a Backup

1. Run `<NAME>.compose.yml down <SERVICE_NAME>`
2. Run `<NAME>.compose.yml exec stack-back sh`
    - `restic snapshots`
    - `restic restore -t /srv/restic-repo/restored-files <SNAPSHOT_ID>`
3. Manually replace the files from \<BACKUP_DIR>/restored-files to \<DATA_DIR>
4. Run `<NAME>.compose.yml up -d <SERVICE_NAME>`

## Development

For development it is neccessary to add these domains to /etc/hosts:

    ```
    127.0.0.1 pdf.<CLUSTER_DOMAIN>
    127.0.0.1 files.<CLUSTER_DOMAIN>
    127.0.0.1 vault.<CLUSTER_DOMAIN>
    ```
```

## Deploy to Production

Adapt the env files for prod and push everything to the Git repository. On the Raspberry Pi execute:

```
./prod.compose.yml down
git pull
./prod.compose.yml up -d
```

Verify that OCIS and Vaultwarden are working as expected.

The final repository should look like this: https://codeberg.org/luca-heitmann/homelab-playground

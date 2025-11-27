---
title: 'IaC Basics'
weight: 1
---

In the first chapter, we explore how to deploy a static web application locally on your laptop. The deployment process is fully defined in code and synchronized with a Git repository. This approach is known as Infrastructure as Code (IaC).

Instead of manually installing and configuring applications, we declare the entire deployment in YAML files and use Podman Compose to handle the setup automatically. IaC offers significant advantages, including:

- Consistency: The environment is fully reproducible. You can develop and test the deployment on your laptop and later deploy it to any other machine without discrepancies.
- Automation: If something breaks, you can quickly recreate the environment with minimal effort.
- Version Control: Rollbacks are straightforward because the complete configuration history is stored in Git, allowing you to revert to any previous state if needed.

## Repository for Configuration

1. Install [Podman](https://podman.io/) on your development machine (initialize the podman machine if you are on MacOS or Windows: [Installation Docs](https://podman.io/docs/installation))
2. Install [Git](https://git-scm.com/)
3. Create an account for hosting a repository at [Codeberg](https://codeberg.org/) and configure SSH login
4. Create and clone a repository to store the homelab configuration

## BentoPDF Deployment

We are going to deploy our first tool: [BentoPDF](https://github.com/alam00000/bentopdf)

Create the following file in your Git repository:

```yaml{linenos=table,filename="bentopdf/compose.yml"}
services:
  bentopdf:
    image: bentopdf/bentopdf-simple
    restart: unless-stopped
    ports:
      - 3100:8080
```

Start the application with this command:

```bash
podman-compose up -d
```

Open your browser at [http://localhost:3100](http://localhost:3100)

Your task: Choose one of the following apps, create a `compose.yml` file like the one for BentoPDF, and deploy it!

- Tools for Everyday Tasks: [Omni Tools](https://github.com/iib0011/omni-tools)
- Tools for Devs: [it-tools](https://it-tools.tech/)
- Whiteboard: [Excalidraw](https://github.com/excalidraw/excalidraw)
- File Converter: [vert](https://github.com/VERT-sh/VERT)
- Scribble Game: [scribble-rs](https://github.com/scribble-rs/scribble.rs)

> [!TIP]
> You need to change:
> - The service name in the second line,
> - The image in the third line,
> - The port in the sixth line.
>
> For the port mapping (`ports:`), you can choose any free port on the left (e.g., the next available one, like 3101). The right port must match the application's default port, which you can find in the GitHub documentation.
>
> Only the values need to be changed; the structure remains the same.

## Reverse Proxy with Caddy

Now we need a reverse proxy to encrypt the network connection with HTTPS and handle domain resolution, allowing you to access the application via https://bentopdf.example.com. This can be achieved using [Caddy](https://caddyserver.com/).

The configuration for domain routing is stored in the `compose.yml` file as labels. For Caddy to route network traffic, it needs access to Podman to read these labels. To grant this access, you need the path to the Podman socket. Use this command to find it:

```bash
podman info --format '{{.Host.RemoteSocket.Path}}' | sed 's/unix:\/\///'
```

You may need to enable the socket service first: [Socket Activation Guide](https://github.com/containers/podman/blob/main/docs/tutorials/socket_activation.md#socket-activation-of-the-api-service)

Now, create the compose.yml file for Caddy. Replace `YOUR_SOCKET_HERE` with the path from the previous command:

```yaml{linenos=table,hl_lines=[14],linenostart=1,filename="caddy/compose.yml"}
services:
  caddy:
    image: lucaslorentz/caddy-docker-proxy:ci-alpine
    ports:
      - 8443:443/tcp
      - 8443:443/udp
    environment:
      - CADDY_INGRESS_NETWORKS=caddy_caddy
      - TZ=Europe/Berlin
    networks:
      - caddy
    privileged: true
    volumes: 
      - YOUR_SOCKET_HERE:/var/run/docker.sock
      - caddy_data:/data
    restart: unless-stopped

networks:
  caddy:

volumes:
  caddy_data: {}
```

Start Caddy with `podman-compose up -d` and check the logs with `podman-compose logs caddy`. There should be something like this: `{"level":"info","ts":1763936372.8130567,"logger":"docker-proxy","msg":"Successfully configured","server":"localhost"}`

Next, update the `bentopdf/compose.yml` file to specify the routing configuration:

```yaml{linenos=table,hl_lines=[5,6,7,8,9,10,11,12,13,14],filename="bentopdf/compose.yml"}
services:
  bentopdf:
    image: bentopdf/bentopdf-simple
    restart: unless-stopped
    networks:
      - caddy_caddy
    labels:
      caddy: pdf.example.com
      caddy.reverse_proxy: "{{upstreams 8080}}"
      caddy.tls: internal

networks:
  caddy_caddy:
    external: true
```

For testing, you can use the `example.com` domain by adding the following entry to `/etc/hosts`:

```{filename="/etc/hosts"}
# ... the rest of the file ...
127.0.0.1 pdf.example.com
```

Since Podman runs rootless, it cannot bind to port 443. Instead, we use 8443. Your application will now be available at: https://pdf.example.com:8443.

Caddy generates a self-signed certificate, which you will need to accept in your browser.

Your task: Update the `compose.yml` files for all your applications and verify that everything works.

> [!TIP]
> You need to change the subdomain name and the port in the labels.


## Refactoring

The final codebase should look like this: https://codeberg.org/luca-heitmann/homelab-playground

Once everything is working, push your changes to the Git repository:

```
git add .
git commit -m "Add Caddy reverse proxy and update compose files for HTTPS support"
git push
```

## Key Take-Aways

- IaC & Version Control: All deployment configuration is managed as Code within Git.
- Container Deployment: Successful deployment of static web applications (like BentoPDF) using Podman Compose.
- Secure Connectivity (Caddy): Implementation of the Caddy Reverse Proxy to automatically handle HTTPS encryption and domain routing for all deployed services.

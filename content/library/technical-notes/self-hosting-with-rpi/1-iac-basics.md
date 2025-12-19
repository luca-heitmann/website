---
title: 'IaC Basics'
weight: 1
---

In the first chapter, we explore how to deploy a static web application locally on your laptop. The deployment process is fully defined in code and synchronized with a Git repository. This approach is known as Infrastructure as Code (IaC).

Instead of manually installing and configuring applications, we declare the entire deployment in YAML files and use Podman Compose to handle the setup automatically. IaC offers significant advantages, including:

- Consistency: The environment is fully reproducible. You can develop and test the deployment on your laptop and later deploy it to any other machine without discrepancies.
- Automation: If something breaks, you can quickly recreate the environment with minimal effort.
- Version Control: Rollbacks are straightforward because the complete configuration history is stored in Git, allowing you to revert to any previous state if needed.

## Preparation: Repository for Configuration and Domain

1. Register a domain and point the nameservers (`NS` record) to [Cloudflare](https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/). A free subdomain can be configured using [DigitalPlat](https://domain.digitalplat.org/)
2. Install the following tools on your development machine:
    - [Podman](https://podman.io/) (initialize the podman machine if you are on MacOS or Windows: [Installation Docs](https://podman.io/docs/installation))
    - [Git](https://git-scm.com/)
    - [Cloudflared](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/downloads/)
3. Create an account at [Codeberg](https://codeberg.org/) (or GitHub), configure SSH login, create a repository to store the homelab configuration and clone this repository on your development machine

## Local Deployment of Static Web Apps

We are going to deploy our first tool: [BentoPDF](https://github.com/alam00000/bentopdf)

Create the following file in your Git repository:

```yaml{linenos=table,filename="src/bentopdf/compose.yml"}
services:
  bentopdf:
    image: bentopdf/bentopdf-simple
    restart: unless-stopped
    ports:
      - 3100:8080
```

Open a terminal, navigate to the bentopdf directory and start the application with this command:

```bash
podman-compose up -d
```

Open your browser at [http://localhost:3100](http://localhost:3100)

Your task: Choose one of the following apps, create a `compose.yml` file like the one for BentoPDF, and deploy it!

| Name/Link                                           | Description              | Git Repository                                                                              |
| :-------------------------------------------------- | :----------------------- |:------------------------------------------------------------------------------------------- |
| [Omni Tools](https://omnitools.app/)                | Tools for Everyday Tasks | {{< icon "github" >}} [iib0011/omni-tools](https://github.com/iib0011/omni-tools)           |
| [it-tools](https://it-tools.tech/)                  | Tools for Devs           | {{< icon "github" >}} [CorentinTh/it-tools](https://github.com/CorentinTh/it-tools)         |
| [Excalidraw](https://excalidraw.com/)               | Whiteboard               | {{< icon "github" >}} [excalidraw/excalidraw](https://github.com/excalidraw/excalidraw)     |
| [vert](https://vert.sh/)                            | File Converter           | {{< icon "github" >}} [VERT-sh/VERT](https://github.com/VERT-sh/VERT)                       |
| [scribble-rs](https://scribblers.bios-marcel.link/) | Scribble Game            | {{< icon "github" >}} [scribble-rs/scribble.rs](https://github.com/scribble-rs/scribble.rs) |

> [!TIP]
> You need to change:
> - The service name in the second line (any value),
> - The image in the third line (according to the GitHub repository),
> - The port in the sixth line.
>
> For the port mapping (`ports:`), you can choose any free port on the left (e.g., the next available one, like 3101). The right port must match the application's default port, which you can find in the GitHub documentation.
>
> Only the values need to be changed; the structure remains the same.

## Making the Services Accessible

Die selbst gehosteten Services sollen natürlich nicht nur lokal laufen, sondern aus dem Internet zugreifbar sein. Dazu gibt es verschiedene Möglichkeiten:

1. DynDNS mit Portforwarding: Dies ist die klassische Variante, um eine eingehende Verbindung zu einem Server herzustellen. In den Domain-Einstellungen, die wir in unserem Fall in Cloudflare verwalten, wird ein `A`-Record für IPv4 und ein `AAAA`-Record für IPv6 angelegt, die auf die öffentliche IP-Adressen des Routers zu verweisen. In den Router-Einstellungen wird eine Port-Weiterleitung auf Port 443 für HTTPS und falls notwendig 80 für HTTP angelegt (siehe [Configuring static port sharing in the FRITZ!Box](https://fritz.com/en/apps/knowledge-base/FRITZ-Box-7590/893_Configuring-static-port-sharing-in-the-FRITZ-Box)). Dabei werden diese beiden Ports auf die jeweiligen HTTPS- bzw. HTTP-Port des Servers weitergeleitet. Üblicherweise erhält der Router jeden Tag eine neue öffentliche IPv4-Adresse, wodurch es notwendig ist, die Records in den Domain-Einstellungen zu aktualisieren. Einige Router unterstützen das automatisch, ansonsten kann ein kleines Programm wie ddclient auf dem Server genutzt werden (siehe [Configuring your dynDNS Client](https://desec.readthedocs.io/en/latest/dyndns/configure.html) oder als Container [linuxserver/ddclient](https://hub.docker.com/r/linuxserver/ddclient)). Der Vorteil dieser Variante ist, dass keine externe Dienste involviert sind, die potenziell die Daten mitlesen könnten. Allerdings ist die Konfiguration etwas aufwendiger.
2. Cloudflare Tunnel: Hierbei wird ein leichtgewichtiges Programm auf dem Server installiert, welches eine externe Verbindung zu Cloudflare aufbaut. Da der Tunnel auf dem Server läuft, kann er sich zu anderen Programmen innerhalb des Netzwerks verbinden. Ein Client, der auf den Server zugreifen möchte, verbindet sich ebenfalls zu Cloudflare. Dort werden die Pakete über den Tunnel weitergeleitet. Der Vorteil hierbei ist, dass nur eine ausgehende Verbindung benötigt wird und somit keine Router-Konfiguration notwendig ist. Allerdings hat es den Nachteil, dass der Server nicht mehr erreichbar ist, wenn Cloudflare down ist und dass der gesamte Traffic über einen externen Anbieter geht. Technisch wäre es daher möglich, dass Cloudflare die Daten mitliest.
3. VPN: Bei einem VPN wird eine verschlüsselte Verbindung von dem Client in das lokalte Netzwerk aufgebaut, in dem der Server steht. Dies kann entweder selbst konfiguriert werden über Wireguard und DynDNS (an der Stelle wird keine Portweiterleitung benötigt) oder über einen externen Dienst wie Tailscale. Der Vorteil ist, dass der Server nur über eine vorhab konfigurierte gesicherte Verbindung erreichbar ist, was die Sicherheit erhöht. Allerdings ist eine Konfiguration des Clients notwendig, wordurch eine spontane Verbindung nicht möglich ist.

Ein weiterer Aspekt ist die Konfiguration von TLS, um Verbindung mit dem verschlüsselten HTTPS-Protokoll zu ermöglichen. Hierbei gibt es ebenfalls verschiedene Möglichkeiten:

1. Let's Encrypt: Falls DynDNS mit Portforwarding genutzt wird, können die für HTTPS benötigten Zertifikate über Let's Encrypt erstellt werden. Let's Encrypt prüft dabei, ob die Domain tatsächlich dir gehört. Für diese Prüfung generiert Let's Encrypt ein Passwort, der über die Domain abrufbar sein muss. Dies kann entweder über einen HTTP-Server geschehen ohne über einen `TXT`-Eintrag an der Domain. In beiden Fällen sollte der Prozess automatisiert erfolgen, damit keine Zertifikate manuell erneuert werden müssen. Dazu eignet sich beispielsweise ein Reverse Proxy wie [Caddy](https://caddyserver.com).
2. Cloudflare: Falls ein Cloudflare Tunnel genutzt wird, erstellt Cloudflare automatisch Zertifikate.
3. Selbst signierte Zertifikate: Es ist möglich selbst-signierte Zertifikate zu nutzen und diese manuell im Client zu bestätigen.

In diesem Tutorial nutzen wir Cloudflare Tunnel, da dabei keine Router-, HTTPS oder Client-Konfigurationen notwendig sind, was das Setup erleichtert. Zusätzlich wird Caddy als Reverse Proxy eingesetzt. Die Aufgabe von Caddy ist die Weiterleitung des Traffics vom Tunnel an den entsprechenden Service. Diese Aufgabe könnte zwar auch Cloudflare Tunnel selbst übernehmen, allerdings ermöglicht Caddy eine Konfiguration über Labels in der Compose-Datei, was sehr hilfreich ist.

### Einrichten von Cloudflare Tunnel

Die Konfiguration von Cloudflare Tunnel kann über die Web-Oberfläche oder über das CLI-Tool erfolgen. In unseren Fall ist das CLI-Tool von Vorteil, da so die Konfiguration im Git hinterlegt werden kann.

Zunächst wird der Tunnel über das CLI-Tool angelegt. Füre dazu folgende Befehle im Terminal aus:

```bash
cloudflared login
cloudflared tunnel create dev-homelab
cloudflared tunnel route dns dev-homelab *.YOUR_SUBDOMAIN_NAME.dpdns.org
```

Das Anlegen des Tunnels kann ebenfalls über IaC-Tools wie Ansible automatisiert werden. Da das allerdings nur einmalig notwendig ist und die Konfiguration komplizierter machen würde, verzichten wir an dieser Stelle darauf.

Nun kann der Tunnel als Service über Compose erstellt werden. Hierzu ist 

```yaml{linenos=table,linenostart=1,filename="src/cf-tunnel/compose.yml"}
services:
  cf-tunnel:
    image: cloudflare/cloudflared:latest
    restart: unless-stopped
    command: "tunnel --config /etc/cloudflared/config.yml run <YOUR TUNNEL ID>"
    volumes:
      - ~/.cloudflared/cert.pem:/etc/cloudflared/cert.pem
      - ~/.cloudflared/<YOUR TUNNEL ID>.json:/etc/cloudflared/tunnel_credentials.json
      - ./config.yml:/etc/cloudflared/config.yml

  bentopdf:
    image: bentopdf/bentopdf-simple
    restart: unless-stopped
```

```yaml{linenos=table,linenostart=1,filename="src/cf-tunnel/config.yml"}
tunnel: <YOUR TUNNEL ID>
credentials-file: /etc/cloudflared/tunnel_credentials.json

ingress:
  - hostname: "pdf.YOUR_SUBDOMAIN_NAME.dpdns.org"
    service: http://bentopdf:8080
  - service: http_status:404
```

Try to start the Tunnel with:

```bash
podman-compose up -d
```

And open your browser at https://pdf.YOUR_SUBDOMAIN_NAME.dpdns.org

Your task: Create a tunnel for accessing BentoPDF and the static web apps you deployed.

<!--

### Restructuring the Compose files

Die aktuelle Struktur der Konfiguration hat einige Nachteile:

- Wenn eine weitere Umgebung mit anderer Domain erstellt werden soll, müssen Änderungen direkt in den Compose-File vorgenommen werden. Dies erfordert wiederum eine Duplikation der Compose-Dateien für jede Umgebung, was sehr kompliziert zu verwalten ist. Daher sollte die gesamte Konfiguration aus den Compose-Dateien herausgenommen und ausgelagert werden.
- Die Services, die von Tunnel erreicht werden sollen, sind in einer Compose-Datei verwaltet, damit sie im selben Netzwerk laufen. Die Datei wird allerdings mit einer zunehmenden Anzahl von Services unübersichtlich und sollte daher so aufgeteilt werden, dass alle Services im selben Netzwerk laufen.
- Neue Services erfordern eine Anpassung der Tunnel-Konfiguration. Besser ist es, wenn ein Service in einer Compose-Datei spezifiziert wird und darüber hinaus keine Konfigurationen an anderen Services geändert werden muss.
- Die Konfiguration greift auf lokale Dateien im Ordner ~/.cloudflared zu. Besser wäre, wenn alle benötigten Dateien im Arbeitsverzeichnis von der Repository sind. Dabei ist es allerdings nicht notwendig, dass auch alle Dateien eingecheckt werden. Geheime Dateien wie die `cert.pem` Datei verwalten wir nicht im Git. Es wäre allerdings möglich die mit sops zu verschlüsseln und dann in Git einzuchecken.

Um die Compose files neu anzulegen, müssen zunächst die bestehenden Container entfernt werden. Führe diesen Befehl für alle Compose files, die aktuell gestartet sind:

```bash
podman-compose down
```

Zunächst legen wir eine Konfigurationsdatei an, die die Konfiguration für die Dev-Umgebung enthält:

```bash{linenos=table,hl_lines=[2,3,6,10],filename=".env.dev"}
########### GENERAL ###########
CLUSTER_DOMAIN=YOUR_SUBDOMAIN_NAME.dpdns.org
TZ=Europe/Berlin
# Find socket path with the following command:
# podman info --format '{{.Host.RemoteSocket.Path}}' | sed 's/unix:\/\///'
DOCKER_SOCKET=/run/user/501/podman/podman.sock


########### CLOUDFLARED ###########
CF_TUNNEL_UUID=YOUR_TUNNEL_ID
CF_TUNNEL_CERT_FILE=./secrets.dev/cloudflare_cert.pem
CF_TUNNEL_CREDENTIALS_FILE=./secrets.dev/tunnel_credentials.json


########### IMAGE VERSIONS ###########
CADDY_IMAGE=lucaslorentz/caddy-docker-proxy:2.10-alpine # https://hub.docker.com/r/lucaslorentz/caddy-docker-proxy/tags?name=alpine
CF_TUNNEL_IMAGE=cloudflare/cloudflared:latest # https://hub.docker.com/r/cloudflare/cloudflared/tags
CF_TUNNEL_INIT_IMAGE=alpine:latest # https://hub.docker.com/_/alpine/tags
BENTOPDF_IMAGE=bentopdf/bentopdf-simple:v1.9.0 # https://hub.docker.com/r/bentopdf/bentopdf-simple/tags
```

In dieser Datei müssen die markierten Zeilen angepasst werden. Der Docker Socket wird später für Caddy benötigt. Mit dem Befehl folgenden Befehl, kann er abgerufen werden.

```bash
podman info --format '{{.Host.RemoteSocket.Path}}' | sed 's/unix:\/\///'
```

You may need to enable the socket service first: [Socket Activation Guide](https://github.com/containers/podman/blob/main/docs/tutorials/socket_activation.md#socket-activation-of-the-api-service)

In der .gitignore Datei legen wir fest, welche Dateien nicht in Git verwaltet werden:

```{filename=".gitignore"}
.DS_Store

secrets.*
data.*
backup.*

.env.testing
testing.compose.yml
```

Die env-Datei enthält Pfade zu den Secrets, die vor dem Start der Services dort existieren müssen. Diese Befehle können genutzt werden, um die Dateien anzulegen:

```bash
# make sure to execute these commands in the root of the repository (applies to all of the following commands)
mkdir secrets.dev
cp ~/.cloudflared/cert.pem secrets.dev/cloudflare_cert.pem
cp ~/.cloudflared/YOUR_TUNNEL_ID.json secrets.dev/tunnel_credentials.json
```

Um die verschiedenen Services zusammenzufassen, wird eine Compose-Datei angelegt, die nur includes auf die Service-Compose-Files beinhaltet:

```yaml{linenos=table,filename="src/compose.yml"}
include:
  - cf-tunnel/compose.yml
  - bentopdf/compose.yml
```

Als nächstes wird eine Haupt-Compose-File für jede Umgebung erstellt - bzw. in unserem Fall für die dev-Umgebung:

```yaml{linenos=table,linenostart=1,filename="dev.compose.yml"}
#!/usr/bin/env -S podman-compose --env-file .env.dev -f 
name: dev-homelab

include:
  - src/compose.yml
```

Diese Compose-File definiert zunächst den Namen des Clusters. Das ist sinnvoll, da standardmäßig der Ordnername verwendet wird, wodurch Konflikte entstehen, wenn mehrere Umgebungen auf einem Rechner laufen. Danach wird die Compose-Datei inkludiert, die wiederum alle Service-Compose-Files referenziert. In der ersten Zeile ist dazu ein sogenannter Hash-Bang. Dadurch wird ermöglicht, dass die Compose-File wie ein Skript ausgeführt werden kann. Der Vorteil ist, dass die Parameter für `podman-compose` ebenfalls in die Compose-File geschrieben werden können, damit sie nicht immer wieder neu geschrieben werden müssen.

```bash
chmod +x dev.compose.yml
./dev.compose.yml config
```

Der `config` Befehl gibt die effektive Compose-Struktur aus.

Zuletzt muss noch die Compose von Cloudflare Tunnel angepasst werden, sodass die Konfiguration aus den env-Dateien genutzt wird. Innerhalb der Compose-Files können Platzhalter wie in bash genutzt werden, z.B. wird ${CLUSTER_DOMAIN} zu dem Wert aus der env-Datei ersetzt. Allerdings benötigt der Tunnel noch die `config.yml`-Datei, in der diese Syntax nicht unterstützt wird. Die `config.yml` manuell zu pflegen wäre keine gute Option, da die Konfigurationswerte wie die Domain ansonsten an unterschiedlichen Stellen gepflegt werden müssen. Um die `config.yml` beim Start einmalig mit den Werten aus der env-Datei zu erstellen, kann ein init-Container eingesetzt werden. Nachdem der Container die Konfigurationsdatei geschrieben hat, wird er wieder beendet.

Zunächst das init-Skript, welches die `config.yml` erzeugt:

```bash{linenos=table,linenostart=1,filename="src/cf-tunnel/init.sh"}
#!/usr/bin/env sh
CONFIG_PATH=/etc/cloudflared/config.yml

echo "Generating cloudflared config to $CONFIG_PATH..."

cat <<EOF > $CONFIG_PATH
tunnel: ${CF_TUNNEL_UUID}
credentials-file: /etc/cloudflared/tunnel_credentials.json

ingress:
  - hostname: "pdf.YOUR_SUBDOMAIN_NAME.dpdns.org"
    service: http://bentopdf:8080
  - service: http_status:404
EOF

echo "Config file created:"
cat $CONFIG_PATH
```

Die Compose-File für Cloudflare Tunnel könnte nun so aussehen:

```yaml{linenos=table,linenostart=1,filename="src/cf-tunnel/compose.yml"}
services:
  cf-tunnel:
    image: ${CF_TUNNEL_IMAGE}
    restart: unless-stopped
    command: "tunnel --config /etc/cloudflared/config.yml run ${CF_TUNNEL_UUID}"
    volumes:
      - ${CF_TUNNEL_CERT_FILE}:/etc/cloudflared/cert.pem
      - ${CF_TUNNEL_CREDENTIALS_FILE}:/etc/cloudflared/tunnel_credentials.json
      - cf-tunnel-config-volume:/etc/cloudflared
    depends_on:
      cf-tunnel-config-init:
        condition: service_completed_successfully
  
  cf-tunnel-config-init:
    image: ${CF_TUNNEL_INIT_IMAGE}
    command: "/bin/sh -c /app/init.sh"
    environment:
      CF_TUNNEL_UUID: ${CF_TUNNEL_UUID}
      CLUSTER_DOMAIN: ${CLUSTER_DOMAIN}
    volumes:
      - ./src/cf-tunnel/init.sh:/app/init.sh
      - cf-tunnel-config-volume:/etc/cloudflared

volumes:
  cf-tunnel-config-volume: {}
```

Die alte `config.yml` kann entfernt werden.

In diesem Fall kann der Tunnel auf die Static Web Apps zugreifen, da alle zusammen in der `dev.compose.yml` inkludiert werden. Durch das `depends_on` in Zeile 10 wartet der Tunnel-Container auf den init-Container bis die `config.yml` zur Verfügung steht.

Durch das Refactoring wurden nun fast alle Nachteile der alten Struktur behoben. Nur die Tunnel-Konfiguration muss weiterhin angepasst werden für neue Services. Das wird im nächsten Abschnitt gelöst.

Deine Aufgabe: Führe die Anpassungen durch und prüfe mit folgendem Befehl, ob alles noch funktioniert wie vorher:

```bash
./dev.compose.yml up -d
```

### Routing with Caddy

Mithilfe von Caddy lassen sich die Routing-Regeln als Labels an den jeweiligen Services definieren. Das hat den Vorteil, dass nicht mehr die Konfiguration von Tunnel angepasst werden muss. Dazu legen wir zunächst eine Compose für Caddy an:

```yaml{linenos=table,linenostart=1,filename="src/caddy/compose.yml"}
services:
  caddy:
    image: ${CADDY_IMAGE}
    restart: unless-stopped
    privileged: true
    environment:
      TZ: ${TZ}
      CADDY_DOCKER_NO_SCOPE: true
    volumes:
      - ${DOCKER_SOCKET}:/var/run/docker.sock
      - caddy_data:/data
    labels:
      caddy.auto_https: "off"
      caddy.local_certs: true

volumes:
  caddy_data: {}
```

Der Standard für Caddy ist HTTPS und somit werden auch Zertifikate automatisch erstellt. Das ist allerdings in unserem Fall nicht notwendig, da wir HTTPS über Cloudflare nutzen. Daher ist das in Caddy deaktiviert. Caddy muss in das `include` aufgenommen werden, damit es in der Dev-Umgebung deployt wird.

```yaml{linenos=table,filename="src/compose.yml"}
include:
  - cf-tunnel/compose.yml
  - caddy/compose.yml
  - bentopdf/compose.yml
```

Nun muss die Tunnel-Konfiguration angepasst werden, sodass der gesamte Traffic an Caddy weitergeleitet wird:

```bash{linenos=table,linenostart=1,filename="src/cf-tunnel/init.sh"}
#!/usr/bin/env sh
CONFIG_PATH=/etc/cloudflared/config.yml

echo "Generating cloudflared config to $CONFIG_PATH..."

cat <<EOF > $CONFIG_PATH
tunnel: ${CF_TUNNEL_UUID}
credentials-file: /etc/cloudflared/tunnel_credentials.json

ingress:
  - hostname: "*.${CLUSTER_DOMAIN}"
    service: http://caddy
  - hostname: ${CLUSTER_DOMAIN}
    service: http://caddy
  - service: http_status:404
EOF

echo "Config file created:"
cat $CONFIG_PATH
```

In der Compose der Static Web Apps kann nun die Subdomain über Labels konfiguriert werden:

```yaml{linenos=table,filename="src/bentopdf/compose.yml"}
services:
  bentopdf:
    image: ${BENTOPDF_IMAGE}
    restart: unless-stopped
    labels:
      caddy: http://pdf.${CLUSTER_DOMAIN}
      caddy.reverse_proxy: "{{upstreams 8080}}"
```

In dem ersten Label `caddy` wird die Domain angegeben und in `caddy.reverse_proxy` der Port unter dem der Service erreichbar ist.

Deine Aufgabe: Passe die Konfiguration deiner Static Web Apps entsprechend an.

Try to start the stack again by running `./dev.compose.yml up -d` and see if everything is working.

Push your changes to the Git repository:

```bash
git add .
git commit -m "BentoPDF and Caddy Deployment"
git push
```

## Key Take-Aways

- IaC & Version Control: All deployment configuration is managed as Code within Git.
- Container Deployment: Successful deployment of static web applications (like BentoPDF) using Podman Compose.
- Secure Connectivity: Implementation of the Cloudflare Tunnel and Caddy Reverse Proxy to automatically handle HTTPS encryption and domain routing for all deployed services.

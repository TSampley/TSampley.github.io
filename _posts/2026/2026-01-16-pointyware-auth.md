---
layout: post

title: Pointyware Auth
subtitle: 
date: 2026-01-16 21:52 -0600
---

I'm finally getting an auth server setup to enable comments on some educational content.

I'm on a tight budget, so I've been worrying about server costs, but for the time-being, my needs fit within GCloud's free tier. It was surprisingly easy to get setup and running once I found the right option. I had a little difficulty finding the f1-micro machine, but it turned out to be one of the options within the N1 series – confusingly, there were no f's of any kind visible in the main virtual machine list.

After spinning up the instance and shelling in to confirm it was alive, I went over to my DNS settings and added A records for both `auth` and `api` subdomains to point at the virtual machines ephemeral IP. Using an ephemeral IP is definitely not an ideal solution long-term; however, engineering is all about cutting fat where you can to fit the constraints of the problem, and my budgetary constraints are quite tight, while my tolerance for downtime is very high, considering I have no reliable traffic whatsoever yet. At one point I had a static IP allocated on AWS, which ended up just pointing at a bucket for a static site; since I didn't keep that service running, I moved the static site to GitHub Pages for easy, free, secure hosting. Anyway– I can stand to manually update the A records if the instance gets restarted with a new IP.

The system specs are tight for the f1-micro. The configuration screen showed the processor as 0.5-1 processors, because apparently it can be shared with other virtual machines, and it shows in the final config as "1vCPU". I don't know what kind of security Google has implemented for the resources that end up getting swapped between other clients' virtual machines, and the risk of a targeted attack seems low since I can't imagine a way to reliably influence which client virtual machines the host places together, but even a risk of random leakage seems like this setup is disqualified from any real high-security applications.

After I updated my records – probably a little premature since nothing was running yet – I used the [nodesource project](https://deb.nodesource.com/) to get Node setup, specifically the LTS version: `curl -fsSL https://deb.nodesource.com/setup_lts.x`. Then I used `apt` to install Nginx, SQLite-3, and certbot, including the nginx plugin. In order to manage the service, I installed the PM2 node module globally

The project is written in TypeScript and the services run using Express
I setup basic ESLint rules with the TypScript plugin: https://typescript-eslint.io/getting-started/


- Instance:
  name: e2-micro instance
  cpu: 1vCPU
  memory: 614MB
  disk: 30GB persistent
- Installed Tech Stack:
  - Server: Node LTS: v24.13.0, TypeScript, Express
  - Proxy: Nginx
  - DB: SQLite-3



```
server {
    server_name auth.pointyware.org;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/auth.pointyware.org/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/auth.pointyware.org/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

}

server {
    if ($host = auth.pointyware.org) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    listen 80;
    server_name auth.pointyware.org;
    return 404; # managed by Certbot


}
```


I still need to:
- do a design study
  - basic components and design language
    - theme: colors, geom, motion, fonts
    - components: text, buttons


Project setup essentials: linting


Complete Setup Script

```shell
# Update System
sudo apt update && sudo apt upgrade -y
# Install Node
curl -fsSL https://deb.nodesource.com/setup_lts.x
# Install Nginx
sudo apt install -y nginx
# Install SQLite
sudo apt install -y sqlite3
# Install Cerbot
sudo apt install -y certbot python3-certbox-nginx
# Install PM2
sudo npm install -g pm2
```

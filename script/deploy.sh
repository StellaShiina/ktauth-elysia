#!/usr/bin/env bash

set -e

systemctl --now disable ktauth.service || true

bun install

bun build --compile --target bun --outfile ktauth src/index.ts

chmod +x ktauth

mv ktauth /usr/local/bin/ktauth

mkdir -p /etc/ktauth

touch /etc/ktauth/env

cat > /etc/systemd/system/ktauth.service << EOF
[Unit]
Description=ktauth Elysia Service
After=network-online.target
Wants=network-online.target
[Service]
Type=simple
ExecStart=/usr/local/bin/ktauth
EnvironmentFile=-/etc/ktauth/env
Restart=always
User=root
[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable ktauth
systemctl start ktauth
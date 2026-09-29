#!/bin/sh
# Runs before the image's envsubst step (20-*). nginx needs an explicit resolver when proxy_pass
# uses a variable; take the container's DNS server (Railway private DNS is IPv6 → needs brackets).
set -e

if [ -z "$API_UPSTREAM" ]; then
  echo "API_UPSTREAM is not set (e.g. http://ovrload-api.railway.internal:4000)" >&2
  exit 1
fi

ns=$(awk '/^nameserver/ { print $2; exit }' /etc/resolv.conf)
case "$ns" in *:*) ns="[$ns]" ;; esac
echo "resolver ${ns:-127.0.0.11} valid=10s;" > /etc/nginx/conf.d/00-resolver.conf

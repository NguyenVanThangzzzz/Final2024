#!/bin/sh

# Replace environment variables in nginx config
envsubst '$PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# Start nginx with daemon off
exec nginx -g 'daemon off;' 
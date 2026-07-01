#!/bin/sh
set -e

echo "Running Prisma migrations..."

until ./node_modules/.bin/prisma migrate deploy; do
  echo "Database not ready yet, retrying in 3s..."
  sleep 3
done

echo "Starting application..."
exec node dist/src/main

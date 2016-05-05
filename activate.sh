#!/usr/bin/env bash
pm2 stop all
pm2 start server/app.js
pm2 start server/cronjobs/index.js

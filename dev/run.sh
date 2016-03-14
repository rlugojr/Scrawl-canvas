#!/bin/bash
docker stop scrawl-nginx  
docker rm scrawl-nginx  
docker run --name scrawl-nginx -v "$PWD":/usr/share/nginx/html -v "$PWD"/dev/nginx.conf:/etc/nginx/nginx.conf:ro -d -p 80:80 nginx
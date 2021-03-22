# Start from a base image which includes Deno (https://github.com/hayd/deno-docker)
FROM hayd/deno:latest

# Create and move into /bot directory
WORKDIR /bot

# Create a volume to store the database
VOLUME /bot/db

# Copy the source code
COPY . .

# Chown the directory and its content so that it belong to Deno user
RUN chown -R deno:deno /bot

# Use user deno so the bot isn't running as root
USER root

RUN apk update && apk add --no-cache nmap && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/main >> /etc/apk/repositories && \
    apk update && \
    apk add --no-cache \
      chromium \
      harfbuzz \
      "freetype>2.8" \
      ttf-freefont \
      nss \
      tzdata

ENV TZ=Europe/Prague
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

ENV BOT_TOKEN=
ENV DEV_ID=
# Cache all of the dependencies so they don't need to be downloaded every run
RUN deno cache --import-map=./import-map.json mod.ts

RUN PUPPETEER_PRODUCT=chrome

# Finally run the bot
CMD ["run", "--allow-net", "--allow-read", "--allow-write", "--unstable", "--allow-run", "--import-map=./import-map.json", "--allow-env",  "./mod.ts"]
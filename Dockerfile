FROM node:18

ENV DEBIAN_FRONTEND noninteractive

RUN apt update -qq \
    && apt install -qq -y --no-install-recommends \
      curl \
      git \
      gnupg \
      libgconf-2-4 \
      libxss1 \
      libxtst6 \
      g++ \
      build-essential \
      chromium \
      chromium-sandbox \
      dumb-init \
      fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst \
    && rm -rf /var/lib/apt/lists/* \
    && rm -rf /src/*.deb

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV CHROME_PATH=/usr/bin/chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /home/pptruser

RUN groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
      && mkdir -p /home/pptruser/Downloads \
      && chown -R pptruser:pptruser /home/pptruser

COPY package*.json /home/pptruser/

COPY . .

RUN chown -R pptruser:pptruser /home/pptruser;

USER pptruser

RUN for i in 1 2 3; \
    do \
      npm install --no-optional;\
      sleep 10; \
      ([ $i -eq 3 ] && exit 1) || true; \
    done;

ENV PORT=8080

EXPOSE 8080

CMD [ "npm", "start" ]
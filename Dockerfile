FROM mcr.microsoft.com/playwright:v1.44.0-jammy

RUN apt-get update && apt-get install -y \
    default-jre \
    build-essential \
    libcairo2-dev \
    libgif-dev \
    libjpeg-dev \
    libpango1.0-dev \
    librsvg2-dev \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/local

COPY package.json package-lock.json* .npmrc .

RUN npm install && npm cache clean --force
ENV PATH=/usr/local/node_modules/.bin:$PATH

WORKDIR /usr/local/app

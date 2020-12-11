FROM node:12-alpine

WORKDIR /app

COPY . /app

RUN yarn install \
    && yarn run build \
    && yarn run setup-db \
    && yarn install --production \
    && rm -rf {src,yarn.lock}

CMD ["yarn", "start"]

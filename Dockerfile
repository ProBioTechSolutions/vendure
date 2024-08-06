FROM node:20

# Create app directory
WORKDIR /usr/src/app

EXPOSE 3000

COPY . .
COPY package.json ./
COPY package-lock.json ./
RUN npm install
RUN npm run build

# PhantomJS fix https://github.com/bazelbuild/rules_closure/issues/351
ENV OPENSSL_CONF=/dev/null

CMD npm run start

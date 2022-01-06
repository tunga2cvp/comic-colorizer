FROM launcher.gcr.io/google/nodejs
WORKDIR /app
COPY package.json /app/package.json
RUN npm --unsafe-perm install
COPY . /app/
FROM launcher.gcr.io/google/nodejs
WORKDIR /app
COPY package.json /app/
RUN npm --unsafe-perm install
COPY . /app/
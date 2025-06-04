# docker build -t pareto-ui:latest .
# docker exec -it <container_name_or_id> bash

FROM node:20-alpine3.20

WORKDIR /app

COPY package*.json ./
COPY . .

RUN yarn install --frozen-lockfile
RUN yarn build:dev

RUN yarn global add http-server

EXPOSE 80

CMD ["http-server", "dist/pareto-ui/browser", "-p", "80"]
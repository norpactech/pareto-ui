# docker build -t pareto-ui:latest .
# docker exec -it <container_name_or_id> bash

FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY . .

RUN yarn install --frozen-lockfile
RUN yarn build

# Production stage
FROM nginx:alpine

# Copy built Angular app to Nginx html directory
COPY --from=builder /app/dist/pareto-factory /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
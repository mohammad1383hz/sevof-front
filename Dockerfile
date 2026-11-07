FROM node:20.19-alpine AS build

WORKDIR /app

COPY package.json ./
RUN npm config set registry https://repo.zhikan.io/repository/npm/
RUN npm install --prefer-offline --no-audit --no-fund

COPY . .
RUN npm run build

FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY docker/nginx/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

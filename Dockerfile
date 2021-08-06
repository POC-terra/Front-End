# Stage 1 - the build process
FROM node:14 as build-deps




ENV API_BASE_URL http://localhost:8084
ENV API_PYTHON_BASE_URL localhost

WORKDIR /usr/src/app
COPY package.json package-lock.json ./

RUN npm install
RUN npm generate-env
COPY . ./

RUN npm run build

# Stage 2 - the production environment
FROM nginx:1.12-alpine
COPY --from=build-deps /usr/src/app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


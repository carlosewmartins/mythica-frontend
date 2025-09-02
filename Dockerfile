# ---------- STAGE 1: Build ----------
FROM node:20-alpine AS build
WORKDIR /app

# Instala deps primeiro para aproveitar cache
COPY package*.json ./
RUN npm ci

# Copia o código e builda produção
COPY . .
RUN npm run build

# ---------- STAGE 2: Runtime ----------
FROM node:20-alpine
WORKDIR /app

# Instala um servidor estático leve
RUN npm i -g serve

# Copia somente os artefatos do build.
# Angular >=17 gera em dist/<app>/browser
COPY --from=build /app/dist/*/browser/ /app/

EXPOSE 8080
CMD ["serve", "-s", ".", "-l", "8080"]

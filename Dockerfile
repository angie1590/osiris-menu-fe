FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

COPY . .

ENV VITE_API_PROXY_TARGET=http://api:8000

EXPOSE 5173

# Servidor de desarrollo Vite accesible desde el host (host: true en vite.config.ts).
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]

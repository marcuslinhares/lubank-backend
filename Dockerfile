# Etapa 1: Instalação das Dependências e Build
FROM node:18 AS build

WORKDIR /app

# Copia os arquivos package.json e yarn.lock
COPY package*.json yarn.lock ./

# Instala as dependências
RUN yarn install

# Copia o restante dos arquivos
COPY . .

# Compila o TypeScript
RUN yarn build

# Etapa 2: Execução
FROM node:18-alpine

WORKDIR /app

# Copia os arquivos compilados para o container
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json /app/yarn.lock ./

# Instala somente as dependências de produção
RUN yarn install --production

# Copia o arquivo de banco de dados SQLite (caso ele já exista)
COPY --from=build /app/database.sqlite ./database.sqlite

# Porta de exposição
EXPOSE 3000

# Comando para executar as migrações e iniciar a aplicação
CMD ["yarn", "knex:migrate:latest", "&&", "yarn", "start"]

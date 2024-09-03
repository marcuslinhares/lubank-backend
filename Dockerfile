# Etapa 1: Instalação das Dependências e Build
FROM node:18 AS build

WORKDIR /app

# Copia os arquivos package.json e yarn.lock para instalar as dependências
COPY package*.json yarn.lock ./

# Instala as dependências
RUN yarn install

# Copia todo o código fonte
COPY . .

# Gera os arquivos compilados (opcional, depende da estrutura do projeto)
RUN yarn tsc

# Etapa 2: Execução
FROM node:18-alpine

WORKDIR /app

# Copia os arquivos necessários da fase de build
COPY --from=build /app ./

# Instala apenas as dependências de produção
RUN yarn install --production

# Expõe a porta em que a aplicação será executada
EXPOSE 3000

# Comando para rodar as migrações e iniciar o servidor
CMD ["yarn", "knex:migrate", "&&", "yarn", "start"]

# Use uma imagem base adequada
FROM node:18

# Define o diretório de trabalho
WORKDIR /app

# Copia o arquivo package.json e yarn.lock
COPY package.json yarn.lock ./

# Instala as dependências
RUN yarn install

# Copia todo o código fonte
COPY . .

# Compila o código TypeScript
RUN yarn build

# Define o comando padrão
CMD ["yarn", "start:prod"]

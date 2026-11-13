# ♠ Jogo 21 ♥

Projeto Diamante de Programação Orientada a Objetos: o jogo 21, jogado contra a mesa numa tela 3D.

O enunciado completo, com o diagrama de classes e a pontuação, está nos slides da aula.

## O que já vem pronto

- A mesa 3D (`src/main/resources/templates` e `src/main/resources/static`).
- O pacote `controller`, que liga a mesa ao seu modelo.

Não mexa nesses arquivos.

## O que você faz

Todas as classes do pacote `model`, seguindo o diagrama: `Naipe`, `Carta`, `Monte`, `Mao`, `Participante`, `Jogador`, `Mesa`, `EstiloDeJogo`, `Cautelosa`, `Padrao`, `Arriscada` e `Jogo`.

O controller usa essas classes pelo nome, então **o projeto só compila quando todas elas existirem**. Comece criando as classes e os métodos vazios (devolvendo `0`, `false` ou `null`) e vá preenchendo.

## Como rodar

1. Rode a classe `VinteumApplication` (ou `./mvnw spring-boot:run`).
2. Acesse http://localhost:8080.

A tela carrega o three.js da internet, então precisa de conexão.

# P2 Engenharia e Avaliações

Web app Node.js/Express preparado para implantação na Hostinger pelo GitHub.

## Executar localmente

```bash
npm install
npm start
```

Abra `http://localhost:3000`.

## Configuração na Hostinger

1. Crie ou conecte um repositório GitHub contendo estes arquivos.
2. No hPanel, abra **Sites > Adicionar site > Aplicativo Node.js**.
3. Conecte o repositório e selecione a branch `main`.
4. Configure:
   - Versão do Node.js: 20 ou superior
   - Comando de instalação: `npm ci`
   - Comando de inicialização: `npm start`
   - Arquivo de entrada, se solicitado: `server.js`
5. Adicione as variáveis:
   - `NODE_ENV=production`
   - `CANONICAL_HOST=p2engenhariaeavaliacoes.com.br`
6. Vincule o domínio `p2engenhariaeavaliacoes.com.br` ao aplicativo e ative o SSL.
7. Faça uma implantação e teste `/health`, o formulário, os vídeos e o WhatsApp.

O servidor utiliza automaticamente a variável `PORT` fornecida pela Hostinger.

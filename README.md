<h1>Template de Quiz - Educação tecnológica e midiática</h1>

-------

<h1>Como rodar?</h1>
<p>Primeiro certifique-se de ter o git instalado na máquina se for windows e rode o comando abaixo na pasta desejada<br> pórem se for linux apenas rode o comando abaixo:</p>
<code>git clone https://github.com/PaulooDev12/site_quiz_educacao_digital</code>

-------
<p>após ter o repositório na sua máquina abra-o com uma extensão de servidor como live-server ou live-preview</p>

<h1>Como funciona o template?</h1>
<p>O template funciona carregando arquivos JSON de cada estação e os padronizando para interfaces typescript e os rendrizando na página através do DOM </p>

--------
<pre> const STATIONS: StationConf[] = [
    { id: "estacao1", title: "Estação 1: Fundamentos", file: "models/estacao1.json" },
    { id: "estacao2", title: "Estação 2: Imagens e Identificação", file: "models/estacao2.json" }
]; 
</pre>
-------
<h1>A estrutura de pastas mostra melhor esse funcionamento</h1>
---
<pre>
    ├── dist/
│   ├── models/
│   │   ├── interfaces.d.ts
│   │   ├── interfaces.d.ts.map
│   │   ├── interfaces.js
│   │   └── interfaces.js.map
│   ├── script.d.ts
│   ├── script.d.ts.map
│   ├── script.js
│   └── script.js.map
├── src/
│   ├── models/
│   │   ├── estacao1.json
│   │   ├── estacao2.json
│   │   └── interfaces.ts
│   ├── quiz.html
│   ├── script.ts
│   └── theme.css
├── .gitignore
├── package-lock.json
├── package.json
├── README.md
└── tsconfig.json
</pre>

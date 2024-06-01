<h1 align="center">
  Running Game Sui
  <br>
</h1>

<h4 align="center"> Welcome to 3D-running-game! This is a fast-paced, endless running game where your goal is to dodge obstacles and collect coins as you sprint through an ever-changing landscape.</h4>

<p align="center">
 <!-- <a href="https://nextjs.org/">
      <img src="https://strapi.dhiwise.com/uploads/Next_JS_Forms_and_Mutations_with_App_Router_OG_Image_e2f9eb6a40.webp" height=28 alt='Next.js' >
  </a> -->
  <a href="https://nextjs.org/">
      <img src="https://repository-images.githubusercontent.com/705845437/fb3d7529-2e80-4f03-b7a3-37488e5bf049" height=28 alt='Next.js' >
  </a>
  <a href="https://www.typescriptlang.org/">
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white"
         alt="Typescript" height=28>
  </a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt='TailwindCSS' height=28></a>
  <a href="https://unity.com/"><img src="https://th.bing.com/th/id/OIP._6EV9fyc_GygaQ3gH5cUNAHaD4?rs=1&pid=ImgDetMain" alt='Unity' height=28></a>
</p>

<!-- <p align="center">
  <a href="#🚀-getting-started">Getting started</a> •
  <a href="#🔑-key-features">Key Features</a> •
  <a href="#🛠️-tech-stack">TechStack</a> •
  <a href="#📁-structure">Structure</a> •
  <a href="#🌐-environment">Environment</a> •
  <a href="#📝-version">Version</a> •
  <a href="#👤-author">Author</a>
</p> -->

[Getting Started](#-getting-started) • [Key Features](#-key-features) • [Tech Stack](#%EF%B8%8F-tech-stack) • [Structure](#-structure) • [Environment](#-environment) • [Version](#-version) • [Author](#-author)

## <div id='getting-started'>🚀 Getting Started</div>

#### ⚙️ Prepare the environment

1. Make sure you have [Node.js](https://nodejs.org/) installed, preferably with [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/). Ensure that your Node.js version is **20.0.0 or higher**.

2. Clone this repository.

3. Install the dependencies

```bash
   yarn install
```

or

```bash
   npm install
```

#### 🏁 Run app in your browser

Run the following command at the root path of the project

```bash
yarn start:${env} or npm run start:${env}
```

- **dev**: Development environment used during application development and testing.
- **stag**: Staging environment serves as an intermediate environment between development and production.
- **prod**: Production environment where the application runs in real-world scenarios serving end-users.

## <div id='key-features'>🔑 Key Features</div>
- Game run on sui testnet (not support address wallets of zklogin(login by google or twitch))
- Connect Wallet
- Mint NFT
- Mutatble level properties of NFT
- Blockchain-Based NFT storage and Scoreboard
  - Decentralized Data Storage: The DApp stores all NFT mint by address and game scoreboards on the SUI blockchain. This ensures that the data is immutable (NFT can mutable level attribute by it owner), transparent, and secure, preventing any tampering or unauthorized changes.
  - Enhanced Security: The DApp ensures secure and private user authentication, protecting user data and quiz results with advanced cryptographic methods.

## <div id='tech-stack'>🛠️ Tech Stack</div>

#### 💻 Languages

- HTML
- CSS
- TypeScript
- JavaScript (Unity Webgl Build)

#### 📚 Frameworks/Libraries

- **React.js:** Used for building user interfaces with a component-based architecture.
- **Next.js:** A React framework that provides server-side rendering, static site generation, and other features to enhance performance and SEO.
- **Tailwind CSS:** A utility-first CSS framework for rapidly building custom user interfaces.
- **React-Unity-Webgl:** Used for add unity webgl build to this nextjs source.

## <div id='structure'>📁 Structure</div>

```plaintext
RUNNING-GAME-SUI/
├── .env/
├── .next/
├── .node_modules/
├── public/
│   ├── Build/
│   │   ├── Running.data
│   │   ├── Running.framework.js
│   │   ├── Running.loader.js
│   │   └── Running.wasm
│   ├── images/connect-wallet-modal
│   │   ├── google.png/
│   │   └── twitch.png/
│   └── TemplateData
│
├── src/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── pages/
│   ├── services/
│   ├── types/
│   └── utils/
├── ...
```

## <div id='environment'>🌐 Environment</div>

- This contain some value for the zklogin feature for next version.

## <div id='version'>📝 Version</div>

1.0.0

## <div id='author'>👤 Author</div>

<a href="https://esollabs.com/">
    <img src="https://esollabs.com/_next/static/media/ic_logo.0517ae22.svg" height=30 alt='Esollabs' >
</a>

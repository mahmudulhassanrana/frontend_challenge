# 🔗 Energiswap Token Wallet dApp

A decentralized application (dApp) built using **Vue 3**, **TailwindCSS**, and **ethers.js**. It displays token prices from Energiswap and connects to MetaMask to show wallet balances in ETH and all held tokens with real-time USD values — account-specific.

---

## 📦 Tech Stack

- **Vue 3 (Composition API)**
- **Vite** – for fast bundling
- **TailwindCSS** – for styling and light/dark theme support
- **ethers.js** – for Web3 wallet integration
- **MetaMask** – wallet provider
- **Energiswap API** – for token prices and metadata

---

## 🚀 Features

- 🧾 Token price table (live from Energiswap API)
- 💼 MetaMask wallet connection
- 📊 Token balances (account-based) with USD conversion
- 🌓 Light/Dark mode toggle via TailwindCSS
- 🔄 MetaMask account switching detection
- 🔎 Column sorting (Name, Symbol, Price)

---

## ⚙️ Setup Instructions

### 1. **Clone the Repository**

```bash
git clone https://github.com/your-username/energiswap-widget.git
cd energiswap-widget
```

### 2. **Install Dependencies**

```bash
yarn
```

> ⚠️ Requires **Node.js v20+**.

### 3. **Run the Development Server**

```bash
yarn dev
```

Open in browser:
```
http://localhost:5173
```

---

## 🔌 Connect MetaMask

1. Install [MetaMask](https://metamask.io)
2. Unlock wallet and select a network (e.g., Ethereum Mainnet)
3. Click **“Connect Wallet”** in the app interface

---

## 🌐 API Used

- [Energiswap Asset API](https://api.energiswap.exchange/v1/assets)  
  Provides token name, symbol, and real-time `last_price` (in USD)

---

## 📁 Project Structure

```
energiswap-widget/
├── public/               # Static files (icons, etc.)
├── src/
│   ├── assets/           # App assets
│   ├── components/       # UI components
│   ├── pages/            # Home.vue, Wallet.vue
│   ├── router/           # Routing setup
│   ├── utils/            # ERC20 ABI, helpers
│   └── App.vue
├── tailwind.config.js    # Tailwind configuration
├── vite.config.js        # Vite configuration
└── README.md
```

---

## 🙋‍♂️ Author

**Md. Mahmudul Hassan**  
📧 Email: mahmud_rana@outlook.com  
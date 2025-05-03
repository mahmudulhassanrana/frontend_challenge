<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { ethers } from 'ethers';

const isDark = ref(localStorage.getItem('theme') === 'dark');
const route = useRoute();
const isActiveRoute = (path) => route.path === path;

// Theme toggle
const toggleTheme = () => {
  isDark.value = !isDark.value;
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
}

const account = ref(null);
const balance = ref(null);
const USDbalance = ref(null);
const tokenPrices  = ref({});

const fetchTokenPrices = async () => {
  try {
    const res = await fetch('https://api.energiswap.exchange/v1/assets')
    const data = await res.json()

    const prices = {}
    for (const address in data) {
      const token = data[address]
      prices[token.symbol] = {
        price: token.last_price,
        name: token.name,
        address
      }
    }

    tokenPrices.value = prices
  } catch (err) {
    console.error('Error fetching token prices:', err)
  }
}
// Formatters
const formatEth = (val) =>
  new Intl.NumberFormat('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 }).format(val);

const formatUsd = (val) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

// Connect to Metamask
const connectWallet = async () => {
  if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      account.value = address;

      const balance = await provider.getBalance(address);
      balance.value = Number(ethers.formatEther(balance));
    } catch (err) {
      console.error('Wallet connection failed:', err);
    }
  } else {
    alert('🦊 MetaMask is not detected. Please install MetaMask to use this wallet feature.');
  }
}

// Get ETH balance
const getBalance = async () => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const balance = await provider.getBalance(account.value);
  balanceEth.value = Number(ethers.formatEther(balance));
}

// Handle account change
const watchAccountChange = () => {
  if (window.ethereum) {
    window.ethereum.on('accountsChanged', (accounts) => {
      account.value = accounts[0];
      getBalance();
    })
  }
}

// Initialize on load
onMounted(() => {
  if (window.ethereum?.selectedAddress) {
    account.value = window.ethereum.selectedAddress;
    getBalance();
  }
  watchAccountChange();
  fetchTokenPrices()
})

</script>

<template>
    <div :class="{ dark: isDark }" class="w-screen min-h-screen bg-white dark:bg-gray-900 dark:text-white flex flex-col">
      <!-- Navbar -->
      <header class="flex justify-between items-center px-6 py-4 bg-gray-100 dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <!-- Left: App Title -->
          <div class="text-xl font-bold text-gray-800 dark:text-white">Energiswap</div>

          <!-- Center: Navigation -->
          <nav class="flex items-center gap-6 text-sm font-medium text-gray-700 dark:text-gray-200">
              <RouterLink
              to="/"
              class="flex items-center gap-1 pb-1 border-b-2 transition"
              :class="isActiveRoute('/') ? 'border-green-500 text-green-600' : 'border-transparent hover:border-green-300 hover:text-green-600'"
              >
              <i class="fas fa-home"></i>
              Home
              </RouterLink>

              <RouterLink
              to="/wallet"
              class="flex items-center gap-1 pb-1 border-b-2 transition"
              :class="isActiveRoute('/wallet') ? 'border-green-500 text-green-600' : 'border-transparent hover:border-green-300 hover:text-green-600'"
              >
              <i class="fas fa-wallet"></i>
              Wallet
              </RouterLink>
          </nav>

          <!-- Right: Theme Toggle -->
          <button
              @click="toggleTheme"
              class="text-xl px-2 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
          >
              {{ isDark ? '☀️' : '🌙' }}
          </button>
      </header>

      <div class="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white p-6">
        <div class="max-w-xl mx-auto shadow-md rounded-lg p-6 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <h2 class="text-2xl font-bold mb-6 text-center">Wallet</h2>

          <!-- Connect Wallet Button -->
          <div v-if="!account" class="flex justify-center">
            <button
              @click="connectWallet"
              class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded transition"
            >
              Connect Wallet
            </button>
          </div>

          <!-- Wallet Info -->
          <div v-else>
            <div class="mb-4">
              <p class="text-sm text-gray-500 dark:text-gray-300">Connected Account:</p>
              <p class="font-mono break-all text-green-600">{{ account }}</p>
            </div>

            <div class="mb-4">
              <p class="text-sm text-gray-500 dark:text-gray-300">Balance (ETH):</p>
              <p class="text-lg font-semibold">{{ formatEth(balance) }}</p>
            </div>

            <div>
              <p class="text-sm text-gray-500 dark:text-gray-300">Estimated Value (USD):</p>
              <p class="text-lg font-semibold">${{ formatUsd(balance * (tokenPrices.signer?.price || 0)) }}</p>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  </template>
  
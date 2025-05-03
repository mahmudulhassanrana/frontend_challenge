<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const tokens = ref([]);
const sortKey = ref('price_usd');
const sortAsc = ref(false);
const isDark = ref(localStorage.getItem('theme') === 'dark');
const route = useRoute();
const isActiveRoute = (path) => route.path === path;
// Fetch data
const fetchTokens = async () => {
  try {
    const res = await fetch('https://api.energiswap.exchange/v1/assets');
    const data = await res.json();
    // Convert object into array with address included
    tokens.value = Object.entries(data).map(([address, token]) => ({
      ...token,
      address
    }));
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

// Sorting
const sortBy = (key) => {
  if (sortKey.value === key) {
    sortAsc.value = !sortAsc.value;
  } else {
    sortKey.value = key;
    sortAsc.value = true;
  }
}

const sortedTokens = computed(() => {
  return [...tokens.value].sort((a, b) => {
    const valA = a[sortKey.value];
    const valB = b[sortKey.value];
    if (typeof valA === 'string') {
      return sortAsc.value ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    return sortAsc.value ? valA - valB : valB - valA;
  })
})

// Formatting price
const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
}

// Icon path
const getIconUrl = (symbol) => `/icons/${symbol}.svg`;

// Theme toggle
const toggleTheme = () => {
  isDark.value = !isDark.value;
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
}

onMounted(() => {
  fetchTokens();
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

        <!-- Token Table -->
        <div class="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white p-6">
            <main class="flex-1 flex justify-center items-start py-10 px-4">
                <div class="w-full max-w-4xl">
                <h2 class="text-2xl font-bold mb-6 text-center">Token Prices</h2>
                <div class="overflow-x-auto rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <table class="min-w-full table-auto rounded-lg text-center">
                        <thead class="bg-gray-100 dark:bg-gray-700 text-sm uppercase text-gray-600 dark:text-gray-300">
                            <tr>
                            <th class="px-6 py-4 cursor-pointer" @click="sortBy('symbol')">
                                <span class="hover:text-green-600 transition">Symbol</span>
                                <span class="font-bold px-1" v-if="sortKey === 'symbol'">
                                {{ sortAsc ? '↑' : '↓' }}
                                </span>
                                <span v-else class="text-gray-400 px-1">↑↓</span>
                            </th>
                            <th class="px-6 py-4 cursor-pointer" @click="sortBy('name')">
                                <span class="hover:text-green-600 transition">Name</span>
                                <span class="font-bold px-1" v-if="sortKey === 'name'">
                                {{ sortAsc ? '↑' : '↓' }}
                                </span>
                                <span v-else class="text-gray-400 px-1">↑↓</span>
                            </th>
                            <th class="px-6 py-4 cursor-pointer text-right" @click="sortBy('last_price')">
                                <span class="hover:text-green-600 transition">Price (USD)</span>
                                <span class="font-bold px-1" v-if="sortKey === 'last_price'">
                                {{ sortAsc ? '↑' : '↓' }}
                                </span>
                                <span v-else class="text-gray-400 px-1">↑↓</span>
                            </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                            v-for="token in sortedTokens"
                            :key="token.id"
                            class="hover:bg-gray-50 dark:hover:bg-gray-700 transition text-sm border-t border-gray-200 dark:border-gray-600"
                            >
                            <td class="px-6 py-3 text-center font-medium text-gray-900 dark:text-white">
                                <div class="flex justify-center items-center gap-3">
                                <img :src="getIconUrl(token.symbol)" alt="icon" class="w-6 h-6" />
                                <span>{{ token.symbol }}</span>
                                </div>
                            </td>
                            <td class="px-6 py-3 text-center text-gray-700 dark:text-gray-300">{{ token.name }}</td>
                            <td class="px-6 py-3 text-right font-semibold dark:text-white">
                                {{ formatPrice(token.last_price) }}
                            </td>
                            </tr>
                        </tbody>
                    </table>

                </div>
                </div>
            </main>
        </div>
    </div>
  </template>
  
  
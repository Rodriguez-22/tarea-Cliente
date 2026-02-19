import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import './style.css'; // Si tienes estilos globales

const app = createApp(App);

app.use(createPinia()); // ¡Esto es vital para que el store funcione!
app.mount('#app');

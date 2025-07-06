<script setup lang="ts">
import { ref, onUnmounted } from "vue";
import resultSound from "~/assets/music/chime.mp3";

const currentTime = ref("00:00:00");
const isStarted = ref(false);

let audio: HTMLAudioElement | null = null;
let clockInterval: number | undefined;
let chimeInterval: number | undefined;

const setCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    currentTime.value = `${hours}:${minutes}:${seconds}`;
};

const playChime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    if (
        (minutes === 10 || minutes === 45) &&
        hours >= 10 &&
        hours <= 16 &&
        seconds === 0
    ) {
        if (audio) {
            audio.play();
        }
    }
};

const handleStart = () => {
    if (isStarted.value) return;

    audio = new Audio(resultSound);
    audio.volume = 0;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
        playPromise.then(() => {
            audio?.pause();
        });
    }

    isStarted.value = true;

    setCurrentTime();
    clockInterval = window.setInterval(setCurrentTime, 100);
    chimeInterval = window.setInterval(playChime, 100);
};

onUnmounted(() => {
    clearInterval(clockInterval);
    clearInterval(chimeInterval);
});
</script>

<template>
    <div
        class="flex items-center justify-center min-h-screen bg-blue-500 cursor-pointer"
        @click="handleStart"
    >
        <div
            v-if="!isStarted"
            class="text-center text-white p-5"
        >
            <h1 class="text-2xl md:text-5xl font-bold mb-6 animate-pulse">
                画面をクリック・タップしてください
            </h1>
            <p class="text-xl md:text-3xl">
                時刻表示とチャイム再生を開始します
            </p>
        </div>

        <div
            v-else
            class="bg-white shadow-2xl rounded-2xl p-12 text-center"
        >
            <p class="text-2xl md:text-4xl font-semibold text-gray-800 mb-8">
                現在の時刻
            </p>
            <p
                class="text-4xl md:text-8xl font-extrabold text-gray-900 tracking-wide"
            >
                {{ currentTime }}
            </p>
            <p class="text-base md:text-lg text-gray-500 mt-6 animate-pulse">
                毎時10分と45分にチャイムが鳴ります
            </p>
        </div>
    </div>
</template>

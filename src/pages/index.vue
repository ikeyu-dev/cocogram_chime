<script setup lang="ts">
import { ref, onUnmounted } from "vue";
import resultSound from "~/assets/music/chime.mp3";

const currentTime = ref("00:00:00");
const currentTask = ref("");
const nextTask = ref("");
const timeToNextTask = ref("");
const showColon = ref<boolean>(true);
const isStarted = ref(false);

let audio: HTMLAudioElement | null = null;
let clockInterval: number | undefined;
let taskInterval: number | undefined;
let timeToNextTaskInterval: number | undefined;
let chimeInterval: number | undefined;

const setCurrentTime = () => {
    if (showColon.value) {
        showColon.value = false;
    } else {
        showColon.value = true;
    }
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    if (showColon.value) {
        currentTime.value = `${hours}:${minutes}`;
    } else {
        currentTime.value = `${hours} ${minutes}`;
    }
};

const playChime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    if (
        (minutes === 10 || minutes === 45 || minutes === 50 || minutes === 0) &&
        hours >= 10 &&
        hours <= 16 &&
        seconds === 0
    ) {
        if (audio) {
            audio.play();
        }
    }
};

const minuteShedule = [
    { minute: "00-09", do: "タイピング" },
    { minute: "10-44", do: "プログラミング" },
    { minute: "45-49", do: "かたづけ" },
    { minute: "50-50", do: "あいさつ" },
    { minute: "51-59", do: "授業準備" },
];

const getCurrentTask = () => {
    const currentMinute = Number(
        currentTime.value.split(":")[1] || currentTime.value.split(" ")[1]
    );
    const task = minuteShedule.find((schedule) => {
        const [start, end] = schedule.minute.split("-").map(Number);
        return currentMinute >= start && currentMinute <= end;
    })?.do;
    currentTask.value = task || "";
};

const setTimeToNextTask = () => {
    const currentMinute = Number(
        currentTime.value.split(":")[1] || currentTime.value.split(" ")[1]
    );
    const currentIndex = minuteShedule.findIndex((schedule) => {
        const [start, end] = schedule.minute.split("-").map(Number);
        return currentMinute >= start && currentMinute <= end;
    });
    const nextIndex =
        currentIndex === minuteShedule.length - 1 ? 0 : currentIndex + 1;
    const nextStartMinute = Number(
        minuteShedule[nextIndex].minute.split("-")[0]
    );

    let minutesToNextTask = nextStartMinute - currentMinute;
    if (minutesToNextTask < 0) {
        minutesToNextTask += 60;
    }
    timeToNextTask.value = `あと ${minutesToNextTask} 分`;
};

const handleStart = () => {
    if (isStarted.value) return;

    audio = new Audio(resultSound);
    audio.volume = 1;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
        playPromise.then(() => {
            audio?.pause();
        });
    }

    isStarted.value = true;

    setCurrentTime();
    getCurrentTask();
    setTimeToNextTask();
    clockInterval = window.setInterval(setCurrentTime, 1000);
    taskInterval = window.setInterval(getCurrentTask, 1000);
    timeToNextTaskInterval = window.setInterval(setTimeToNextTask, 1000);
    chimeInterval = window.setInterval(playChime, 100);
};

onUnmounted(() => {
    clearInterval(clockInterval);
    clearInterval(chimeInterval);
});
</script>

<template>
    <div
        class="flex items-center justify-center min-h-screen bg-yellow-300 cursor-pointer"
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

        <section
            v-else
            class="grid grid-cols-1 md:grid-cols-2 gap-2 w-full p-6 bg-white shadow-lg rounded-2xl m-1"
        >
            <div class="col-span-1 p-12 text-center">
                <p
                    class="text-2xl md:text-7xl font-semibold text-gray-800 mb-12"
                >
                    現在の時刻
                </p>
                <p
                    class="text-4xl md:text-9xl font-extrabold text-gray-900 tracking-wide mb-12"
                >
                    {{ currentTime }}
                </p>
                <p
                    class="text-base md:text-3xl text-gray-500 mt-6 animate-pulse"
                >
                    毎時0/10/45/50分にチャイムが鳴ります
                </p>
            </div>
            <div class="col-span-1 p-12 text-center">
                <p
                    class="text-2xl md:text-7xl font-semibold text-gray-800 mb-14"
                >
                    やること
                </p>
                <p
                    class="text-4xl font-extrabold text-gray-900 tracking-wide mb-12 whitespace-nowrap"
                    :style="
                        currentTask.length > 5
                            ? 'font-size: 5.5rem'
                            : 'font-size: 6rem'
                    "
                >
                    {{ currentTask }}
                </p>
                <p class="text-base md:text-5xl mt-6 animate-pulse">
                    {{ timeToNextTask }}
                </p>
            </div>
        </section>
    </div>
</template>

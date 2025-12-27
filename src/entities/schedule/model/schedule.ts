import type { Schedule } from "./types";

export const minuteSchedule: Schedule[] = [
    { minute: "00-09", do: "タイピング" },
    { minute: "10-44", do: "プログラミング" },
    { minute: "45-48", do: "かたづけ" },
    { minute: "49-49", do: "あいさつ" },
    { minute: "50-59", do: "授業準備" },
];

export const getCurrentTask = (currentMinute: number): string => {
    const task = minuteSchedule.find((schedule) => {
        const [start, end] = schedule.minute.split("-").map(Number);
        return currentMinute >= start && currentMinute <= end;
    })?.do;
    return task || "";
};

export const getTimeToNextTask = (currentMinute: number): string => {
    const currentIndex = minuteSchedule.findIndex((schedule) => {
        const [start, end] = schedule.minute.split("-").map(Number);
        return currentMinute >= start && currentMinute <= end;
    });
    const nextIndex =
        currentIndex === minuteSchedule.length - 1 ? 0 : currentIndex + 1;
    const nextStartMinute = Number(
        minuteSchedule[nextIndex].minute.split("-")[0]
    );

    let minutesToNextTask = nextStartMinute - currentMinute;
    if (minutesToNextTask < 0) {
        minutesToNextTask += 60;
    }
    return `あと ${minutesToNextTask} 分`;
};

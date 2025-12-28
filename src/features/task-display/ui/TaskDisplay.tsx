"use client";

import type { Schedule } from "@entities/schedule";

type TaskDisplayProps = {
    currentTask: string;
    timeToNextTask: string;
    currentMinute: number;
    currentHour: number;
    schedule: Schedule[];
    taskFontSize: number;
    remainingFontSize: number;
    labelFontSize: number;
};

/**
 * 時刻を HH:MM 形式でフォーマットする
 */
const formatTimeDisplay = (hour: number, minute: string): string => {
    const h = String(hour).padStart(2, "0");
    const m = minute.padStart(2, "0");
    return `${h}:${m}`;
};

/**
 * 現在の分がスケジュールの範囲内かどうかを判定する
 */
const isCurrentSchedule = (minute: string, currentMinute: number): boolean => {
    const [start, end] = minute.split("-").map(Number);
    return currentMinute >= start && currentMinute <= end;
};

/**
 * スケジュールの順序に基づいて透明度を計算する
 * 現在のタスクが最も濃く、以降のタスクは薄くなる
 */
const getOpacity = (
    index: number,
    currentIndex: number,
    totalItems: number
): number => {
    if (index === currentIndex) return 1;

    const distance =
        index > currentIndex
            ? index - currentIndex
            : totalItems - currentIndex + index;

    const opacityStep = 0.7 / (totalItems - 1);
    return Math.max(0.25, 1 - distance * opacityStep);
};

export const TaskDisplay = ({
    currentMinute,
    currentHour,
    schedule,
    labelFontSize,
}: TaskDisplayProps) => {
    const currentIndex = schedule.findIndex((s) =>
        isCurrentSchedule(s.minute, currentMinute)
    );

    return (
        <div className="flex flex-col items-center w-full px-4">
            <p
                className="font-bold text-amber-600 mb-8"
                style={{ fontSize: `${labelFontSize * 1.2}px` }}
            >
                スケジュール
            </p>
            <div className="w-full max-w-3xl space-y-2">
                {schedule.map((item, index) => {
                    const isCurrent = isCurrentSchedule(
                        item.minute,
                        currentMinute
                    );
                    const opacity = getOpacity(
                        index,
                        currentIndex,
                        schedule.length
                    );

                    return (
                        <div
                            key={item.minute}
                            className={`
                                relative flex items-center h-24 rounded-xl transition-all duration-300
                                ${isCurrent ? "bg-amber-100 shadow-lg scale-105" : "bg-white/60"}
                            `}
                            style={{ opacity }}
                        >
                            {/* タイムラインの縦線 */}
                            <div
                                className={`
                                    absolute left-32 top-0 bottom-0 w-1
                                    ${isCurrent ? "bg-amber-400" : "bg-gray-200"}
                                `}
                            />
                            {/* タイムラインのドット */}
                            <div
                                className={`
                                    absolute left-30 top-1/2 -translate-y-1/2 rounded-full z-10
                                    ${isCurrent ? "w-6 h-6 bg-amber-500 shadow-md" : "w-3 h-3 bg-gray-300"}
                                `}
                            />

                            {/* 時間表示 */}
                            <div className="w-32 pl-4 shrink-0">
                                <span
                                    className={`
                                        font-mono tabular-nums text-2xl
                                        ${isCurrent ? "text-amber-700 font-bold" : "text-gray-400"}
                                    `}
                                >
                                    {formatTimeDisplay(
                                        currentHour,
                                        item.minute.split("-")[0]
                                    )}
                                </span>
                            </div>

                            {/* タスク名 */}
                            <div className="flex-1 pl-12">
                                <span
                                    className={`
                                        font-bold text-4xl
                                        ${isCurrent ? "text-gray-900" : "text-gray-500"}
                                    `}
                                >
                                    {item.do}
                                </span>
                            </div>

                            {/* 終了時間 */}
                            <div className="pr-8">
                                <span
                                    className={`
                                        font-mono tabular-nums text-2xl
                                        ${isCurrent ? "text-amber-600" : "text-gray-300"}
                                    `}
                                >
                                    ~{" "}
                                    {formatTimeDisplay(
                                        currentHour,
                                        item.minute.split("-")[1]
                                    )}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

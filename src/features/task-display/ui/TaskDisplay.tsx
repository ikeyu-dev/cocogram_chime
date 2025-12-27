"use client";

import type { Schedule } from "@entities/schedule";

type TaskDisplayProps = {
    currentTask: string;
    timeToNextTask: string;
    currentMinute: number;
    schedule: Schedule[];
    taskFontSize: number;
    remainingFontSize: number;
    labelFontSize: number;
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

    const opacityStep = 0.6 / (totalItems - 1);
    return Math.max(0.3, 1 - distance * opacityStep);
};

export const TaskDisplay = ({
    currentMinute,
    schedule,
    taskFontSize,
    remainingFontSize,
    labelFontSize,
}: TaskDisplayProps) => {
    const currentIndex = schedule.findIndex((s) =>
        isCurrentSchedule(s.minute, currentMinute)
    );

    return (
        <div className="flex flex-col items-center w-full">
            <p
                className="font-bold bg-linear-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-4"
                style={{ fontSize: `${labelFontSize}px` }}
            >
                スケジュール
            </p>
            <div className="w-full max-w-2xl">
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
                    const itemFontSize = isCurrent
                        ? taskFontSize
                        : taskFontSize * 0.6;
                    const timeFontSize = isCurrent
                        ? remainingFontSize
                        : remainingFontSize * 0.7;

                    return (
                        <div
                            key={item.minute}
                            className={`
                                flex items-center justify-between py-3 px-4
                                border-l-4 mb-2 rounded-r-xl transition-all duration-300
                                ${
                                    isCurrent
                                        ? "border-amber-500 bg-amber-50 shadow-md"
                                        : "border-gray-200 bg-white/50"
                                }
                            `}
                            style={{ opacity }}
                        >
                            <div className="flex items-center gap-4">
                                <span
                                    className={`
                                        font-mono tabular-nums
                                        ${isCurrent ? "text-amber-600 font-bold" : "text-gray-400"}
                                    `}
                                    style={{ fontSize: `${timeFontSize}px` }}
                                >
                                    :{item.minute.split("-")[0]} - :
                                    {item.minute.split("-")[1]}
                                </span>
                            </div>
                            <span
                                className={`
                                    font-bold
                                    ${isCurrent ? "text-gray-900" : "text-gray-500"}
                                `}
                                style={{ fontSize: `${itemFontSize}px` }}
                            >
                                {item.do}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

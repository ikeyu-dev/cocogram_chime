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
 * 循環配列を生成する
 * 現在のタスクを中心に、前後のタスクを含めた配列を返す
 */
const getCircularSchedule = (
    schedule: Schedule[],
    currentIndex: number
): { item: Schedule; relativeIndex: number }[] => {
    const len = schedule.length;
    const result: { item: Schedule; relativeIndex: number }[] = [];

    // 現在のタスクを中心に、全てのタスクを循環的に配置
    for (let i = 0; i < len; i++) {
        const actualIndex = (currentIndex + i) % len;
        result.push({
            item: schedule[actualIndex],
            relativeIndex: i,
        });
    }

    return result;
};

/**
 * 相対位置に基づいて透明度を計算する
 * 現在のタスク（relativeIndex=0）が最も濃く、離れるほど薄くなる
 */
const getOpacityByRelative = (
    relativeIndex: number,
    totalItems: number
): number => {
    if (relativeIndex === 0) return 1;
    const opacityStep = 0.6 / (totalItems - 1);
    return Math.max(0.2, 1 - relativeIndex * opacityStep);
};

/**
 * 相対位置に基づいてスケールを計算する
 */
const getScaleByRelative = (relativeIndex: number): number => {
    if (relativeIndex === 0) return 1.05;
    if (relativeIndex === 1) return 0.95;
    return 0.9;
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

    const circularSchedule = getCircularSchedule(schedule, currentIndex);

    return (
        <div className="flex flex-col items-center w-full px-4">
            <p
                className="font-bold text-amber-600 mb-6"
                style={{ fontSize: `${labelFontSize * 1.2}px` }}
            >
                スケジュール
            </p>
            <div className="w-full max-w-3xl space-y-3">
                {circularSchedule.map(({ item, relativeIndex }) => {
                    const isCurrent = relativeIndex === 0;
                    const opacity = getOpacityByRelative(
                        relativeIndex,
                        schedule.length
                    );
                    const scale = getScaleByRelative(relativeIndex);

                    return (
                        <div
                            key={item.minute}
                            className={`
                                relative flex items-center rounded-2xl transition-all duration-500 ease-out
                                ${isCurrent ? "bg-amber-100 shadow-xl h-28" : "bg-white/40 h-20"}
                            `}
                            style={{
                                opacity,
                                transform: `scale(${scale})`,
                            }}
                        >
                            {/* 左側のアクセントバー */}
                            <div
                                className={`
                                    absolute left-0 top-2 bottom-2 w-1.5 rounded-full
                                    ${isCurrent ? "bg-amber-500" : "bg-gray-200"}
                                `}
                            />

                            {/* 時間表示 */}
                            <div className="w-36 pl-6 shrink-0">
                                <span
                                    className={`
                                        font-mono tabular-nums
                                        ${isCurrent ? "text-amber-700 font-bold text-3xl" : "text-gray-400 text-xl"}
                                    `}
                                >
                                    {formatTimeDisplay(
                                        currentHour,
                                        item.minute.split("-")[0]
                                    )}
                                </span>
                            </div>

                            {/* タスク名 */}
                            <div className="flex-1 px-4">
                                <span
                                    className={`
                                        font-bold
                                        ${isCurrent ? "text-gray-900 text-5xl" : "text-gray-500 text-2xl"}
                                    `}
                                >
                                    {item.do}
                                </span>
                            </div>

                            {/* 終了時間 */}
                            <div className="pr-6">
                                <span
                                    className={`
                                        font-mono tabular-nums
                                        ${isCurrent ? "text-amber-600 text-2xl" : "text-gray-300 text-lg"}
                                    `}
                                >
                                    ~{" "}
                                    {formatTimeDisplay(
                                        currentHour,
                                        item.minute.split("-")[1]
                                    )}
                                </span>
                            </div>

                            {/* 循環を示す矢印（最後のアイテム） */}
                            {relativeIndex === schedule.length - 1 && (
                                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-gray-300 text-sm">
                                    ↻
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

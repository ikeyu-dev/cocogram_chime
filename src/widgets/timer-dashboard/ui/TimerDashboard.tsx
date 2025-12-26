"use client";

import { useState } from "react";
import { ClockDisplay, useClock } from "@features/clock";
import { TaskDisplay, useTask } from "@features/task-display";
import { useChime, useChimeSettings, SettingsModal } from "@features/chime";
import { useWindowSize } from "@shared/lib";

export const TimerDashboard = () => {
    const [isStarted, setIsStarted] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const { currentTime } = useClock();
    const { currentTask, timeToNextTask } = useTask(currentTime);
    const { width, height } = useWindowSize();
    const {
        settings,
        addMinute,
        removeMinute,
        setStartHour,
        setEndHour,
        resetToDefault,
    } = useChimeSettings();
    useChime(isStarted, settings);

    const handleStart = () => {
        if (isStarted) return;
        setIsStarted(true);
    };

    const handleSettingsClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsSettingsOpen(true);
    };

    // 画面サイズに基づいてフォントサイズを計算
    // 時計: 画面高さの20%、タスク: 画面高さの12%、残り時間: 画面高さの6%
    const clockFontSize = Math.min(width * 0.25, height * 0.2);
    const taskFontSize = Math.min(width * 0.18, height * 0.12);
    const remainingFontSize = Math.min(width * 0.08, height * 0.06);
    const labelFontSize = Math.min(width * 0.05, height * 0.04);

    return (
        <div
            className="h-screen flex items-center justify-center p-4 cursor-pointer overflow-hidden relative"
            onClick={handleStart}
        >
            <button
                className="btn btn-ghost btn-circle btn-lg absolute top-4 right-4 z-10"
                onClick={handleSettingsClick}
                aria-label="設定"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                </svg>
            </button>

            {!isStarted ? (
                <div className="text-center">
                    <h1 className="text-2xl md:text-5xl font-bold mb-6 text-primary animate-pulse">
                        画面をクリック・タップしてください
                    </h1>
                    <p className="text-xl md:text-3xl text-base-content/70">
                        時刻表示とチャイム再生を開始します
                    </p>
                </div>
            ) : (
                <div className="w-full flex flex-col items-center justify-center gap-4">
                    <ClockDisplay
                        currentTime={currentTime}
                        fontSize={clockFontSize}
                        labelFontSize={labelFontSize}
                    />
                    <hr className="w-full border-base-300 border-t-2" />
                    <TaskDisplay
                        currentTask={currentTask}
                        timeToNextTask={timeToNextTask}
                        taskFontSize={taskFontSize}
                        remainingFontSize={remainingFontSize}
                        labelFontSize={labelFontSize}
                    />
                </div>
            )}

            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                settings={settings}
                onAddMinute={addMinute}
                onRemoveMinute={removeMinute}
                onSetStartHour={setStartHour}
                onSetEndHour={setEndHour}
                onReset={resetToDefault}
            />
        </div>
    );
};

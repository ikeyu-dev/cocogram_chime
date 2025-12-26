"use client";

import { useState } from "react";

type ChimeSettings = {
    minutes: number[];
    startHour: number;
    endHour: number;
};

type SettingsModalProps = {
    isOpen: boolean;
    onClose: () => void;
    settings: ChimeSettings;
    onAddMinute: (minute: number) => void;
    onRemoveMinute: (minute: number) => void;
    onSetStartHour: (hour: number) => void;
    onSetEndHour: (hour: number) => void;
    onReset: () => void;
};

export const SettingsModal = ({
    isOpen,
    onClose,
    settings,
    onAddMinute,
    onRemoveMinute,
    onSetStartHour,
    onSetEndHour,
    onReset,
}: SettingsModalProps) => {
    const [newMinute, setNewMinute] = useState("");

    if (!isOpen) return null;

    const handleAddMinute = () => {
        const minute = parseInt(newMinute, 10);
        if (!isNaN(minute) && minute >= 0 && minute <= 59) {
            onAddMinute(minute);
            setNewMinute("");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleAddMinute();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-3xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold mb-8 text-gray-800">
                    チャイム設定
                </h2>

                <div className="mb-8">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
                        チャイムを鳴らす分
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {settings.minutes.map((minute) => (
                            <button
                                key={minute}
                                className="px-4 py-2 bg-amber-100 text-amber-800 rounded-xl text-sm font-medium hover:bg-amber-200 transition-colors flex items-center gap-1"
                                onClick={() => onRemoveMinute(minute)}
                            >
                                {minute}分
                                <span className="text-amber-600">×</span>
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-3">
                        <input
                            type="number"
                            min="0"
                            max="59"
                            value={newMinute}
                            onChange={(e) => setNewMinute(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="0-59"
                            className="w-24 px-4 py-2 border border-gray-200 rounded-xl text-center focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                        />
                        <button
                            className="px-6 py-2 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 active:scale-95 transition-all"
                            onClick={handleAddMinute}
                        >
                            追加
                        </button>
                    </div>
                </div>

                <div className="mb-8">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
                        チャイムを鳴らす時間帯
                    </h3>
                    <div className="flex items-center gap-3">
                        <select
                            value={settings.startHour}
                            onChange={(e) =>
                                onSetStartHour(parseInt(e.target.value, 10))
                            }
                            className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all appearance-none bg-white cursor-pointer"
                        >
                            {Array.from({ length: 24 }, (_, i) => (
                                <option
                                    key={i}
                                    value={i}
                                >
                                    {i}時
                                </option>
                            ))}
                        </select>
                        <span className="text-gray-400">→</span>
                        <select
                            value={settings.endHour}
                            onChange={(e) =>
                                onSetEndHour(parseInt(e.target.value, 10))
                            }
                            className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all appearance-none bg-white cursor-pointer"
                        >
                            {Array.from({ length: 24 }, (_, i) => (
                                <option
                                    key={i}
                                    value={i}
                                >
                                    {i}時
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                    <button
                        className="px-5 py-2.5 text-gray-600 rounded-xl font-medium hover:bg-gray-100 transition-colors"
                        onClick={onReset}
                    >
                        初期値に戻す
                    </button>
                    <button
                        className="px-6 py-2.5 bg-amber-500 text-white rounded-xl font-medium hover:bg-amber-600 active:scale-95 transition-all shadow-lg shadow-amber-500/25"
                        onClick={onClose}
                    >
                        閉じる
                    </button>
                </div>
            </div>
        </div>
    );
};

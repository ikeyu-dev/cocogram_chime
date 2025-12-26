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
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-base-100 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold mb-6">チャイム設定</h2>

                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">
                        チャイムを鳴らす分
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {settings.minutes.map((minute) => (
                            <button
                                key={minute}
                                className="btn btn-sm btn-primary"
                                onClick={() => onRemoveMinute(minute)}
                            >
                                {minute}分
                                <span className="ml-1">×</span>
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            min="0"
                            max="59"
                            value={newMinute}
                            onChange={(e) => setNewMinute(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="0-59"
                            className="input input-bordered w-24"
                        />
                        <button
                            className="btn btn-secondary"
                            onClick={handleAddMinute}
                        >
                            追加
                        </button>
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">
                        チャイムを鳴らす時間帯
                    </h3>
                    <div className="flex items-center gap-2">
                        <select
                            value={settings.startHour}
                            onChange={(e) =>
                                onSetStartHour(parseInt(e.target.value, 10))
                            }
                            className="select select-bordered w-24"
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
                        <span>〜</span>
                        <select
                            value={settings.endHour}
                            onChange={(e) =>
                                onSetEndHour(parseInt(e.target.value, 10))
                            }
                            className="select select-bordered w-24"
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

                <div className="flex gap-2 justify-end">
                    <button
                        className="btn btn-ghost"
                        onClick={onReset}
                    >
                        初期値に戻す
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={onClose}
                    >
                        閉じる
                    </button>
                </div>
            </div>
        </div>
    );
};

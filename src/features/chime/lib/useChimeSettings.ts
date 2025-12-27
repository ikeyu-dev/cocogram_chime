"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "cocogram-chime-settings";

type ChimeSettings = {
    minutes: number[];
    startHour: number;
    endHour: number;
};

const DEFAULT_SETTINGS: ChimeSettings = {
    minutes: [0, 10, 45, 50],
    startHour: 10,
    endHour: 16,
};

export const useChimeSettings = () => {
    const [settings, setSettings] = useState<ChimeSettings>(DEFAULT_SETTINGS);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setSettings(JSON.parse(stored));
            } catch {
                setSettings(DEFAULT_SETTINGS);
            }
        }
        setIsLoaded(true);
    }, []);

    const saveSettings = useCallback((newSettings: ChimeSettings) => {
        setSettings(newSettings);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
    }, []);

    const addMinute = useCallback(
        (minute: number) => {
            if (minute < 0 || minute > 59) return;
            if (settings.minutes.includes(minute)) return;
            const newMinutes = [...settings.minutes, minute].sort(
                (a, b) => a - b
            );
            saveSettings({ ...settings, minutes: newMinutes });
        },
        [settings, saveSettings]
    );

    const removeMinute = useCallback(
        (minute: number) => {
            const newMinutes = settings.minutes.filter((m) => m !== minute);
            saveSettings({ ...settings, minutes: newMinutes });
        },
        [settings, saveSettings]
    );

    const setStartHour = useCallback(
        (hour: number) => {
            if (hour < 0 || hour > 23) return;
            saveSettings({ ...settings, startHour: hour });
        },
        [settings, saveSettings]
    );

    const setEndHour = useCallback(
        (hour: number) => {
            if (hour < 0 || hour > 23) return;
            saveSettings({ ...settings, endHour: hour });
        },
        [settings, saveSettings]
    );

    const resetToDefault = useCallback(() => {
        saveSettings(DEFAULT_SETTINGS);
    }, [saveSettings]);

    return {
        settings,
        isLoaded,
        addMinute,
        removeMinute,
        setStartHour,
        setEndHour,
        resetToDefault,
    };
};

"use client";

import { useEffect, useRef, useCallback } from "react";

type ChimeSettings = {
    minutes: number[];
    startHour: number;
    endHour: number;
};

export const useChime = (isStarted: boolean, settings: ChimeSettings) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const settingsRef = useRef(settings);

    useEffect(() => {
        settingsRef.current = settings;
    }, [settings]);

    const initAudio = useCallback(() => {
        if (audioRef.current) return;
        audioRef.current = new Audio("/chime.mp3");
        audioRef.current.volume = 1;
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                audioRef.current?.pause();
            });
        }
    }, []);

    const playChime = useCallback(() => {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();

        const {
            minutes: chimeMinutes,
            startHour,
            endHour,
        } = settingsRef.current;

        if (
            chimeMinutes.includes(minutes) &&
            hours >= startHour &&
            hours <= endHour &&
            seconds === 0
        ) {
            audioRef.current?.play();
        }
    }, []);

    useEffect(() => {
        if (!isStarted) return;

        initAudio();
        const interval = setInterval(playChime, 100);
        return () => clearInterval(interval);
    }, [isStarted, initAudio, playChime]);
};

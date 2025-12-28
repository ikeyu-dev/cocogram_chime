"use client";

import { useState, useEffect } from "react";
import { getCurrentMinute, getCurrentHour } from "@shared/lib";
import {
    getCurrentTask,
    getTimeToNextTask,
    minuteSchedule,
} from "@entities/schedule";

export const useTask = (currentTime: string) => {
    const [currentTask, setCurrentTask] = useState("");
    const [timeToNextTask, setTimeToNextTask] = useState("");
    const [currentMinute, setCurrentMinute] = useState(0);
    const [currentHour, setCurrentHour] = useState(0);

    useEffect(() => {
        const minute = getCurrentMinute(currentTime);
        const hour = getCurrentHour(currentTime);
        setCurrentMinute(minute);
        setCurrentHour(hour);
        setCurrentTask(getCurrentTask(minute));
        setTimeToNextTask(getTimeToNextTask(minute));
    }, [currentTime]);

    return {
        currentTask,
        timeToNextTask,
        currentMinute,
        currentHour,
        schedule: minuteSchedule,
    };
};

"use client";

import { useState, useEffect } from "react";
import { getCurrentMinute } from "@shared/lib";
import {
    getCurrentTask,
    getTimeToNextTask,
    minuteSchedule,
} from "@entities/schedule";

export const useTask = (currentTime: string) => {
    const [currentTask, setCurrentTask] = useState("");
    const [timeToNextTask, setTimeToNextTask] = useState("");
    const [currentMinute, setCurrentMinute] = useState(0);

    useEffect(() => {
        const minute = getCurrentMinute(currentTime);
        setCurrentMinute(minute);
        setCurrentTask(getCurrentTask(minute));
        setTimeToNextTask(getTimeToNextTask(minute));
    }, [currentTime]);

    return {
        currentTask,
        timeToNextTask,
        currentMinute,
        schedule: minuteSchedule,
    };
};

"use client";

import { useState, useEffect } from "react";
import { getCurrentMinute } from "@shared/lib";
import { getCurrentTask, getTimeToNextTask } from "@entities/schedule";

export const useTask = (currentTime: string) => {
    const [currentTask, setCurrentTask] = useState("");
    const [timeToNextTask, setTimeToNextTask] = useState("");

    useEffect(() => {
        const minute = getCurrentMinute(currentTime);
        setCurrentTask(getCurrentTask(minute));
        setTimeToNextTask(getTimeToNextTask(minute));
    }, [currentTime]);

    return { currentTask, timeToNextTask };
};

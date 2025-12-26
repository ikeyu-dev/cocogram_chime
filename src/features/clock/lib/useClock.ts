"use client";

import { useState, useEffect, useRef } from "react";
import { formatTime } from "@shared/lib";

export const useClock = () => {
  const [currentTime, setCurrentTime] = useState("00:00");
  const showColonRef = useRef(true);

  useEffect(() => {
    const updateTime = () => {
      showColonRef.current = !showColonRef.current;
      const now = new Date();
      setCurrentTime(
        formatTime(now.getHours(), now.getMinutes(), showColonRef.current),
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return { currentTime };
};

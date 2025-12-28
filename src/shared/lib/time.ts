export const formatTime = (
    hours: number,
    minutes: number,
    showColon: boolean
): string => {
    const h = String(hours).padStart(2, "0");
    const m = String(minutes).padStart(2, "0");
    return showColon ? `${h}:${m}` : `${h} ${m}`;
};

export const getCurrentMinute = (timeString: string): number => {
    const separator = timeString.includes(":") ? ":" : " ";
    return Number(timeString.split(separator)[1]);
};

export const getCurrentHour = (timeString: string): number => {
    const separator = timeString.includes(":") ? ":" : " ";
    return Number(timeString.split(separator)[0]);
};

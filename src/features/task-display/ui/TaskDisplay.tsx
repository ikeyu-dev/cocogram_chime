"use client";

type TaskDisplayProps = {
    currentTask: string;
    timeToNextTask: string;
    taskFontSize: number;
    remainingFontSize: number;
    labelFontSize: number;
};

export const TaskDisplay = ({
    currentTask,
    timeToNextTask,
    taskFontSize,
    remainingFontSize,
    labelFontSize,
}: TaskDisplayProps) => {
    return (
        <div className="flex flex-col items-center w-full">
            <p
                className="font-bold text-secondary mb-2"
                style={{ fontSize: `${labelFontSize}px` }}
            >
                いまやること
            </p>
            <p
                className="font-black text-base-content mb-4 leading-none"
                style={{ fontSize: `${taskFontSize}px` }}
            >
                {currentTask}
            </p>
            <div className="flex items-center gap-3 bg-warning/20 rounded-full px-6 py-2">
                <span
                    className="font-bold text-warning-content"
                    style={{ fontSize: `${remainingFontSize * 0.7}px` }}
                >
                    のこり
                </span>
                <span
                    className="font-black text-warning-content"
                    style={{ fontSize: `${remainingFontSize}px` }}
                >
                    {timeToNextTask}
                </span>
            </div>
        </div>
    );
};

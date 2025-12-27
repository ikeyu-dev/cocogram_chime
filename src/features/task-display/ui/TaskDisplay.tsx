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
                className="font-bold bg-linear-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-4"
                style={{ fontSize: `${labelFontSize}px` }}
            >
                いまやること
            </p>
            <p
                className="font-black text-base-content mb-6 leading-none drop-shadow-sm"
                style={{ fontSize: `${taskFontSize}px` }}
            >
                {currentTask}
            </p>
            <div className="flex items-center gap-3 bg-linear-to-r from-amber-100 to-orange-100 rounded-full px-6 py-2 shadow-sm">
                <span
                    className="font-bold text-amber-700"
                    style={{ fontSize: `${remainingFontSize * 0.7}px` }}
                >
                    のこり
                </span>
                <span
                    className="font-black text-amber-800"
                    style={{ fontSize: `${remainingFontSize}px` }}
                >
                    {timeToNextTask}
                </span>
            </div>
        </div>
    );
};

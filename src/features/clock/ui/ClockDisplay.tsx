"use client";

type ClockDisplayProps = {
    currentTime: string;
    fontSize: number;
    labelFontSize: number;
};

export const ClockDisplay = ({
    currentTime,
    fontSize,
    labelFontSize,
}: ClockDisplayProps) => {
    return (
        <div className="flex flex-col items-center">
            <p
                className="font-bold text-primary mb-2"
                style={{ fontSize: `${labelFontSize}px` }}
            >
                いまのじかん
            </p>
            <p
                className="font-black text-base-content tabular-nums leading-none"
                style={{ fontSize: `${fontSize}px` }}
            >
                {currentTime}
            </p>
        </div>
    );
};

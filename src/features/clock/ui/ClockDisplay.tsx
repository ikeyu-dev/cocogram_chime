"use client";

type ClockDisplayProps = {
    currentTime: string;
    fontSize: number;
    labelFontSize: number;
};

export const ClockDisplay = ({ currentTime, fontSize }: ClockDisplayProps) => {
    return (
        <div className="flex flex-col items-center">
            <p
                className="font-black text-base-content tabular-nums leading-none drop-shadow-sm"
                style={{ fontSize: `${fontSize}px` }}
            >
                {currentTime}
            </p>
        </div>
    );
};

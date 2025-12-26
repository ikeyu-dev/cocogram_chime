import type { Metadata } from "next";
import "@shared/ui/styles/globals.css";

export const metadata: Metadata = {
    title: "Cocogram",
    description: "時刻表示とタスク管理アプリ",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang="ja"
            data-theme="light"
        >
            <body className="min-h-screen bg-base-200">{children}</body>
        </html>
    );
}

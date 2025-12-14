"use client";

import { useEffect, useState } from "react";
import { X, Share, PlusSquare } from "lucide-react";
import { cn } from "rizzui";

export function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        // Check if it's iOS
        const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        // Check if already in standalone mode
        const isStandalone = window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone;

        if (isIosDevice && !isStandalone) {
            setIsIOS(true);
            // Show prompt after a delay for iOS users
            const timer = setTimeout(() => {
                // Check if we've shown it recently to avoid annoyance
                const lastShown = localStorage.getItem("installPromptShown");
                const now = Date.now();
                if (!lastShown || now - parseInt(lastShown) > 7 * 24 * 60 * 60 * 1000) {
                    setShowPrompt(true);
                }
            }, 3000);
            return () => clearTimeout(timer);
        }

        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            // Check if we've shown it recently
            const lastShown = localStorage.getItem("installPromptShown");
            const now = Date.now();
            if (!lastShown || now - parseInt(lastShown) > 7 * 24 * 60 * 60 * 1000) {
                setShowPrompt(true);
            }
        };

        window.addEventListener("beforeinstallprompt", handler);

        return () => {
            window.removeEventListener("beforeinstallprompt", handler);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") {
            setShowPrompt(false);
        }
        setDeferredPrompt(null);
    };

    const dismissPrompt = () => {
        setShowPrompt(false);
        localStorage.setItem("installPromptShown", Date.now().toString());
    };

    if (!showPrompt) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96 animate-fade-in-up">
            <div className="bg-background/80 backdrop-blur-md border border-border rounded-xl shadow-lg p-4 relative">
                <button
                    onClick={dismissPrompt}
                    className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-foreground rounded-full"
                >
                    <X className="w-4 h-4" />
                </button>

                <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-lg">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/logo.png" alt="App Icon" className="w-10 h-10 object-contain" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-sm mb-1">Install Unstory</h3>
                        <p className="text-xs text-muted-foreground mb-3">
                            Install our app for a better, distraction-free reading experience.
                        </p>

                        {isIOS ? (
                            <div className="text-xs space-y-2 bg-muted/50 p-2 rounded-md">
                                <p className="flex items-center gap-2">
                                    1. Tap the <Share className="w-3 h-3" /> Share button
                                </p>
                                <p className="flex items-center gap-2">
                                    2. Select <PlusSquare className="w-3 h-3" /> Add to Home Screen
                                </p>
                            </div>
                        ) : (
                            <button
                                onClick={handleInstallClick}
                                className="w-full bg-primary text-primary-foreground text-xs font-medium py-2 rounded-md hover:bg-primary/90 transition-colors"
                            >
                                Install App
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

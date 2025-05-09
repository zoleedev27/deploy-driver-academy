import { useEffect, useState } from 'react';
import { getCookie, setCookie } from 'cookies-next';
import { COOKIE_CONSENT } from '@/constants/general';

type ConsentCategories = {
    necessary: boolean;
    analytics: boolean;
    marketing: boolean;
};

const defaultConsent: ConsentCategories = {
    necessary: true,
    analytics: false,
    marketing: false,
};

const CookieConsent = () => {
    const [showBanner, setShowBanner] = useState(false);
    const [showPreferences, setShowPreferences] = useState(false);
    const [consent, setConsent] = useState<ConsentCategories>(defaultConsent);
    const savedConsent = getCookie(COOKIE_CONSENT);

    useEffect(() => {
        if (!savedConsent) {
            setShowBanner(true);
        }
    }, [savedConsent]);

    const handleAcceptAll = () => {
        const updated = { necessary: true, analytics: true, marketing: true };
        setCookie(COOKIE_CONSENT, JSON.stringify(updated), { maxAge: 60 * 60 * 24 * 365 });
        setShowBanner(false);
        setShowPreferences(false);
    };

    const handleRejectAll = () => {
        const updated = { necessary: true, analytics: false, marketing: false };
        setCookie(COOKIE_CONSENT, JSON.stringify(updated), { maxAge: 60 * 60 * 24 * 365 });
        setShowBanner(false);
        setShowPreferences(false);
    };

    const handleSavePreferences = () => {
        setCookie(COOKIE_CONSENT, JSON.stringify(consent), { maxAge: 60 * 60 * 24 * 365 });
        setShowBanner(false);
        setShowPreferences(false);
    };

    const toggleCategory = (key: keyof ConsentCategories) => {
        if (key === 'necessary') return;
        setConsent((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    if (!showBanner && !showPreferences) return null;

    return (
        <>
            {showBanner && (
                <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[95%] max-w-3xl bg-gray-900 text-white rounded-xl p-6 shadow-2xl z-50">
                    <div className="flex flex-col gap-4">
                        <p className="text-base leading-relaxed">
                            <strong>We value your privacy.</strong> We use cookies to enhance your experience, deliver personalized content,
                            and analyze traffic. You can accept all, or manage your preferences by category.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <button
                                className="bg-white text-gray-900 font-medium py-2 px-4 rounded hover:bg-gray-200 hover:ring-2 hover:ring-gray-400 transition"
                                onClick={handleAcceptAll}
                            >
                                Accept All
                            </button>
                            <button
                                className="bg-gray-700 text-white font-medium py-2 px-4 rounded hover:bg-gray-600 hover:ring-2 hover:ring-gray-500 transition"
                                onClick={handleRejectAll}
                            >
                                Reject All
                            </button>
                            <button
                                className="text-gray-300 underline hover:text-white transition"
                                onClick={() => setShowPreferences(true)}
                            >
                                Manage Preferences
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showPreferences && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-lg rounded-xl p-6 shadow-xl">
                        <h2 className="text-xl font-semibold mb-2 text-gray-900">Manage Cookie Preferences</h2>
                        <p className="text-sm text-gray-600 mb-4">
                            Select which categories of cookies you&apos;re comfortable with. These settings can be updated at any time.
                        </p>

                        <div className="space-y-3 text-sm text-gray-800">
                            <label className="flex items-center gap-2">
                                <input type="checkbox" checked disabled className="accent-gray-800" />
                                <strong>Strictly Necessary</strong> — Always enabled.
                            </label>

                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={consent.analytics}
                                    onChange={() => toggleCategory('analytics')}
                                    className="accent-gray-800"
                                />
                                Analytics
                            </label>

                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={consent.marketing}
                                    onChange={() => toggleCategory('marketing')}
                                    className="accent-gray-800"
                                />
                                Marketing
                            </label>
                        </div>

                        <div className="mt-6 flex justify-end gap-2">
                            <button
                                className="bg-gray-900 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded transition"
                                onClick={handleSavePreferences}
                            >
                                Save Preferences
                            </button>
                            <button
                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition"
                                onClick={() => setShowPreferences(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CookieConsent;

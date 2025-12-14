"use client";

import { useUser } from "@stackframe/stack";
import { useState, useEffect } from "react";
import { Button, Input, Title, Text, Loader, Textarea, Switch } from "rizzui";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { Header } from "@/components/layout/header";
import { Container } from "@/components/ui/container";
import { updateUserSettings } from "@/app/actions/user";

export function DashboardSettingsView() {
    const user = useUser();
    const [dbUser, setDbUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Form state
    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");
    const [website, setWebsite] = useState("");
    const [showFollowersCount, setShowFollowersCount] = useState(false);

    useEffect(() => {
        if (user) {
            fetch('/api/me')
                .then(res => res.json())
                .then(data => {
                    const u = data as any; // Cast to any or User type
                    setDbUser(u);
                    setUsername(u.username || "");
                    setBio(u.bio || "");
                    setWebsite(u.website || "");
                    setShowFollowersCount(u.showFollowersCount || false);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [user]);

    const handlePrivacyToggle = async () => {
        const newValue = !showFollowersCount;
        setShowFollowersCount(newValue); // Optimistic
        try {
            await updateUserSettings({ showFollowersCount: newValue });
        } catch (e) {
            setShowFollowersCount(!newValue); // Revert
            // Optionally show toast
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);
        try {
            const res = await fetch('/api/user/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, bio, website })
            });
            const json = await res.json() as { error?: string };
            if (!res.ok) throw new Error(json.error || "Failed to update");
            setMessage({ type: 'success', text: "Profile updated successfully!" });
        } catch (e: any) {
            setMessage({ type: 'error', text: e.message });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex h-screen items-center justify-center"><Loader /></div>;

    return (
        <div className="min-h-screen bg-background font-sans">
            <Header />
            <Container className="pt-32 pb-20 max-w-2xl">
                <div className="space-y-8">
                    <div>
                        <Title as="h1" className="text-3xl font-serif">Account Settings</Title>
                        <Text className="text-muted-foreground">Manage your profile and presence.</Text>
                    </div>

                    <div className="space-y-6">
                        <Input
                            label="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="your-username"
                            helperText="Unique identifier for your profile URL."
                        />
                        <Textarea
                            label="Bio"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Tell your story..."
                            rows={4}
                        />
                        <Input
                            label="Website"
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                            placeholder="https://..."
                        />

                        <div className="pt-4 border-t border-gray-100">
                            <Title as="h6" className="mb-4">Privacy</Title>
                            <div className="flex flex-col gap-1">
                                <Switch
                                    label="Show Follower Counts on Profile"
                                    checked={showFollowersCount}
                                    onChange={handlePrivacyToggle}
                                    disabled={saving}
                                    className="col-span-1"
                                />
                                <Text className="text-sm text-gray-500 pl-1">
                                    When disabled, your follower and following counts will be hidden from everyone.
                                </Text>
                            </div>
                        </div>

                        {message && (
                            <div className={`p-4 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                {message.type === 'success' ? <CheckCircleIcon className="w-5 h-5" /> : <XCircleIcon className="w-5 h-5" />}
                                <Text>{message.text}</Text>
                            </div>
                        )}

                        <Button size="lg" onClick={handleSave} isLoading={saving} className="w-full md:w-auto">
                            Save Changes
                        </Button>
                    </div>
                </div>
            </Container>
        </div>
    );
}

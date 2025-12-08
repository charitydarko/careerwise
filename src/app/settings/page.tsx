"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FadeInSection } from "@/components/fade-in-section";
import { 
  User, 
  Lock, 
  LogOut, 
  Save, 
  Loader2,
  ChevronLeft,
  Mail,
  AlertCircle,
  CheckCircle2,
  Briefcase
} from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  // Profile form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{type: "success" | "error", text: string} | null>(null);

  // Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{type: "success" | "error", text: string} | null>(null);

  // Career track form state
  const [careerTrackId, setCareerTrackId] = useState("");
  const [tracks, setTracks] = useState<Array<{ id: string; name: string }>>([]);
  const [careerSaving, setCareerSaving] = useState(false);
  const [careerMessage, setCareerMessage] = useState<{type: "success" | "error", text: string} | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const [profileRes, tracksRes] = await Promise.all([
          fetch("/api/user/profile"),
          fetch("/api/tracks"),
        ]);

        let profileData: any = null;
        if (profileRes.ok) {
          profileData = await profileRes.json();
          setUserData(profileData);
          setName(profileData.user?.name || "");
          setEmail(profileData.user?.email || "");
        }

        if (tracksRes.ok) {
          const trackData = await tracksRes.json();
          const availableTracks = trackData.tracks as Array<{ id: string; name: string }>;
          setTracks(availableTracks);

          const profileTrackName = profileData?.profile?.careerTrack || "";
          const matchedTrack = availableTracks.find(
            (track) => track.name.toLowerCase() === profileTrackName?.toLowerCase(),
          );
          if (matchedTrack) {
            setCareerTrackId(matchedTrack.id);
          }
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    }

    if (status === "authenticated") {
      fetchUserData();
    }
  }, [status]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMessage(null);

    try {
      const response = await fetch("/api/user/update-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      const data = await response.json();

      if (response.ok) {
        setProfileMessage({ type: "success", text: "Profile updated successfully!" });
      } else {
        setProfileMessage({ type: "error", text: data.error || "Failed to update profile" });
      }
    } catch (error) {
      setProfileMessage({ type: "error", text: "An error occurred. Please try again." });
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSaving(true);
    setPasswordMessage(null);

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: "error", text: "New passwords don't match" });
      setPasswordSaving(false);
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage({ type: "error", text: "Password must be at least 6 characters" });
      setPasswordSaving(false);
      return;
    }

    try {
      const response = await fetch("/api/user/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setPasswordMessage({ type: "success", text: "Password changed successfully!" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordMessage({ type: "error", text: data.error || "Failed to change password" });
      }
    } catch (error) {
      setPasswordMessage({ type: "error", text: "An error occurred. Please try again." });
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleCareerTrackChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setCareerSaving(true);
    setCareerMessage(null);

    try {
      const response = await fetch("/api/user/update-career-track", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackId: careerTrackId }),
      });

      const data = await response.json();

      if (response.ok) {
        setCareerMessage({ type: "success", text: data.message || "Career track updated successfully!" });
      } else {
        setCareerMessage({ type: "error", text: data.error || "Failed to update career track" });
      }
    } catch (error) {
      setCareerMessage({ type: "error", text: "An error occurred. Please try again." });
    } finally {
      setCareerSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  if (loading || status === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f8ff]">
        <Loader2 className="h-8 w-8 animate-spin text-[#1F3C88]" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f8ff] pb-16 pt-12 font-[family:var(--font-inter)]">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 lg:px-10">
        {/* Header */}
        <header className="space-y-4">
          <Button
            variant="ghost"
            asChild
            className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#1F3C88] hover:bg-[#e4ebff]"
          >
            <Link href="/dashboard">
              <ChevronLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-3xl font-semibold text-[#1F3C88] md:text-4xl">
            Account Settings
          </h1>
          <p className="text-base text-slate-600">
            Manage your account preferences and security settings
          </p>
        </header>

        {/* Profile Information */}
        <FadeInSection>
          <Card className="rounded-3xl border border-white/80 bg-white/95 p-6 shadow-[0_18px_80px_rgba(31,60,136,0.12)] backdrop-blur lg:p-8">
            <div className="flex items-center gap-3 pb-4">
              <User className="h-6 w-6 text-[#1F3C88]" />
              <h2 className="text-xl font-semibold text-[#1F3C88]">
                Profile Information
              </h2>
            </div>

            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-[#1F3C88]">
                  Name
                </label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="mt-2 h-12 rounded-full border-slate-200"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-[#1F3C88]">
                  Email
                </label>
                <div className="relative mt-2">
                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="h-12 rounded-full border-slate-200 pl-12"
                  />
                </div>
              </div>

              {profileMessage && (
                <div className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
                  profileMessage.type === "success" 
                    ? "bg-[#ecfdf9] text-[#007864]" 
                    : "bg-red-50 text-red-700"
                }`}>
                  {profileMessage.type === "success" ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  {profileMessage.text}
                </div>
              )}

              <Button
                type="submit"
                disabled={profileSaving}
                className="h-12 rounded-full bg-[#00BFA6] px-6 text-white hover:bg-[#00a48f]"
              >
                {profileSaving ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Save className="mr-2 h-5 w-5" />
                    Save Changes
                  </>
                )}
              </Button>
            </form>
          </Card>
        </FadeInSection>

        {/* Career Track */}
        <FadeInSection>
          <Card className="rounded-3xl border border-white/80 bg-white/95 p-6 shadow-[0_18px_80px_rgba(31,60,136,0.12)] backdrop-blur lg:p-8">
            <div className="flex items-center gap-3 pb-4">
              <Briefcase className="h-6 w-6 text-[#1F3C88]" />
              <h2 className="text-xl font-semibold text-[#1F3C88]">
                Career Track
              </h2>
            </div>

            <p className="mb-4 text-sm text-slate-600">
              ⚠️ Warning: Changing your career track will reset your progress to Day 1 and clear all task completions.
            </p>

            <form onSubmit={handleCareerTrackChange} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-[#1F3C88]">
                  Select Career Track
                </label>
                <select
                  value={careerTrackId}
                  onChange={(e) => setCareerTrackId(e.target.value)}
                  className="mt-2 h-12 w-full rounded-full border border-slate-200 bg-white px-4 text-slate-700 focus:border-[#1F3C88] focus:outline-none focus:ring-2 focus:ring-[#1F3C88]/20"
                >
                  <option value="">Select a track...</option>
                  {tracks.map((track) => (
                    <option key={track.id} value={track.id}>
                      {track.name}
                    </option>
                  ))}
                </select>
              </div>

              {careerMessage && (
                <div className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
                  careerMessage.type === "success" 
                    ? "bg-[#ecfdf9] text-[#007864]" 
                    : "bg-red-50 text-red-700"
                }`}>
                  {careerMessage.type === "success" ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  {careerMessage.text}
                </div>
              )}

              <Button
                type="submit"
                disabled={
                  careerSaving ||
                  !careerTrackId ||
                  tracks.find((track) => track.id === careerTrackId)?.name === userData?.profile?.careerTrack
                }
                className="h-12 rounded-full bg-[#1F3C88] px-6 text-white hover:bg-[#152d6b] disabled:opacity-50"
              >
                {careerSaving ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Briefcase className="mr-2 h-5 w-5" />
                    Change Career Track
                  </>
                )}
              </Button>
            </form>
          </Card>
        </FadeInSection>

        {/* Change Password */}
        <FadeInSection>
          <Card className="rounded-3xl border border-white/80 bg-white/95 p-6 shadow-[0_18px_80px_rgba(31,60,136,0.12)] backdrop-blur lg:p-8">
            <div className="flex items-center gap-3 pb-4">
              <Lock className="h-6 w-6 text-[#1F3C88]" />
              <h2 className="text-xl font-semibold text-[#1F3C88]">
                Change Password
              </h2>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-[#1F3C88]">
                  Current Password
                </label>
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="mt-2 h-12 rounded-full border-slate-200"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-[#1F3C88]">
                  New Password
                </label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="mt-2 h-12 rounded-full border-slate-200"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-[#1F3C88]">
                  Confirm New Password
                </label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="mt-2 h-12 rounded-full border-slate-200"
                />
              </div>

              {passwordMessage && (
                <div className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
                  passwordMessage.type === "success" 
                    ? "bg-[#ecfdf9] text-[#007864]" 
                    : "bg-red-50 text-red-700"
                }`}>
                  {passwordMessage.type === "success" ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  {passwordMessage.text}
                </div>
              )}

              <Button
                type="submit"
                disabled={passwordSaving}
                className="h-12 rounded-full bg-[#00BFA6] px-6 text-white hover:bg-[#00a48f]"
              >
                {passwordSaving ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Lock className="mr-2 h-5 w-5" />
                    Update Password
                  </>
                )}
              </Button>
            </form>
          </Card>
        </FadeInSection>

        {/* Danger Zone */}
        <FadeInSection>
          <Card className="rounded-3xl border border-red-200 bg-white/95 p-6 shadow-[0_18px_80px_rgba(239,68,68,0.12)] backdrop-blur lg:p-8">
            <div className="flex items-center gap-3 pb-4">
              <LogOut className="h-6 w-6 text-red-600" />
              <h2 className="text-xl font-semibold text-red-600">
                Logout
              </h2>
            </div>
            <p className="mb-4 text-sm text-slate-600">
              Sign out of your account on this device
            </p>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="h-12 rounded-full border-red-200 text-red-600 hover:bg-red-50"
            >
              <LogOut className="mr-2 h-5 w-5" />
              Logout
            </Button>
          </Card>
        </FadeInSection>
      </div>
    </main>
  );
}

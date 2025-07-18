import { useState, useEffect } from "react";
import { User, Lock, Bell, ShieldCheck, Camera, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SideNavigation from "@/components/SideNavigation";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "@/components/ui/use-toast";
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential, sendEmailVerification } from "firebase/auth";
import { auth } from "@/lib/firebase";

const sidebarItems = [
  { label: "Profile Settings", icon: User },
  { label: "Password", icon: Lock },
  { label: "Notifications", icon: Bell },
  { label: "Verification", icon: ShieldCheck },
];

export default function MyProfile() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState("Profile Settings");
  const [avatar, setAvatar] = useState(profile?.photoURL || "");
  const [firstName, setFirstName] = useState(profile?.firstName || "");
  const [lastName, setLastName] = useState(profile?.lastName || "");
  const [email, setEmail] = useState(profile?.email || "");
  const [mobile, setMobile] = useState(profile?.mobile || "");
  const [gender, setGender] = useState(profile?.gender || "");
  const [id, setId] = useState(profile?.id || "");
  const [address, setAddress] = useState(profile?.address || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Email verification state
  const [isSendingVerification, setIsSendingVerification] = useState(false);
  const [isReloadingUser, setIsReloadingUser] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(auth.currentUser?.emailVerified ?? false);

  // Sync local state with profile from Firestore
  useEffect(() => {
    if (profile) {
      setAvatar(profile.photoURL || "");
      setFirstName(profile.firstName || "");
      setLastName(profile.lastName || "");
      setEmail(profile.email || "");
      setMobile(profile.mobile || "");
      setGender(profile.gender || "");
      setId(profile.id || "");
      setAddress(profile.address || "");
    }
  }, [profile]);

  // Keep email verification status in sync
  useEffect(() => {
    setIsEmailVerified(auth.currentUser?.emailVerified ?? false);
  }, [profile]);

  // Placeholder: handle avatar upload
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
      setAvatar(URL.createObjectURL(e.target.files[0]));
    }
  };
  // Placeholder: handle avatar delete
  const handleDeleteAvatar = () => {
    setAvatar("");
    setAvatarFile(null);
  };

  // Placeholder: handle save changes
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !profile.uid) {
      toast({ title: "Error", description: "User not found.", variant: "destructive" });
      return;
    }
    try {
      const userDocRef = doc(db, "users", profile.uid);
      await updateDoc(userDocRef, {
        firstName,
        lastName,
        mobile,
        gender,
        address,
        photoURL: avatar,
      });
      toast({ title: "Profile Updated", description: "Your changes have been saved." });
    } catch (err: any) {
      toast({ title: "Update Failed", description: err.message || String(err), variant: "destructive" });
    }
  };

  // Password change handler
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.email) {
      toast({ title: "Error", description: "User email not found.", variant: "destructive" });
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      toast({ title: "Password too short", description: "Password must be at least 6 characters.", variant: "destructive" });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast({ title: "Passwords do not match", description: "Please confirm your new password.", variant: "destructive" });
      return;
    }
    setIsChangingPassword(true);
    try {
      // Re-authenticate user
      const user = auth.currentUser;
      if (!user) throw new Error("No user is currently signed in.");
      const credential = EmailAuthProvider.credential(profile.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      toast({ title: "Password changed", description: "Your password has been updated." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err: any) {
      let message = err.message || "Failed to change password.";
      if (err.code === "auth/wrong-password") message = "Current password is incorrect.";
      if (err.code === "auth/too-many-requests") message = "Too many attempts. Please try again later.";
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Send verification email
  const handleSendVerification = async () => {
    if (!auth.currentUser) return;
    setIsSendingVerification(true);
    try {
      await sendEmailVerification(auth.currentUser);
      toast({ title: "Verification Email Sent", description: "Check your inbox for a verification link." });
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to send verification email.", variant: "destructive" });
    } finally {
      setIsSendingVerification(false);
    }
  };

  // Reload user to check verification status
  const handleReloadUser = async () => {
    if (!auth.currentUser) return;
    setIsReloadingUser(true);
    try {
      await auth.currentUser.reload();
      setIsEmailVerified(auth.currentUser.emailVerified);
      toast({ title: "Status Refreshed", description: auth.currentUser.emailVerified ? "Email is verified." : "Email is not verified yet." });
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to refresh status.", variant: "destructive" });
    } finally {
      setIsReloadingUser(false);
    }
    };
  
    return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navbar */}
        <Navbar showInDashboard={true} />
      <div className="flex flex-1 flex-col md:flex-row">
        {/* Main App Side Navigation */}
        <div className="hidden md:block">
          <SideNavigation className="h-full" />
        </div>
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col items-center py-6 px-2 sm:px-4 md:px-8 mt-16 w-full">
          <div className="w-full max-w-6xl flex flex-col md:flex-row gap-6 md:gap-8">
            {/* Account Settings Sidebar / Tab Bar */}
            {/* Mobile: horizontal tab bar, Desktop: vertical sidebar */}
            <aside className="w-full md:w-64 bg-white rounded-xl shadow p-1 sm:p-2 md:p-4 flex flex-row md:flex-col gap-1 md:gap-0 mb-4 md:mb-0 sticky top-16 z-10 overflow-x-auto">
              {sidebarItems.map((item) => (
                <button
                  key={item.label}
                  className={`flex flex-1 md:flex-none items-center justify-center md:justify-start gap-1 md:gap-3 px-2 py-2 md:px-4 md:py-2 rounded-lg text-xs sm:text-sm md:text-base w-full text-left transition-colors whitespace-nowrap ${
                    activeTab === item.label
                      ? "bg-primary/10 text-primary font-semibold"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                  onClick={() => setActiveTab(item.label)}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  <span className="hidden xs:inline md:inline">{item.label}</span>
                </button>
              ))}
            </aside>
            {/* Main Card */}
            <main className="flex-1 w-full">
              <Card className="p-3 xs:p-4 sm:p-8 rounded-xl shadow-xl bg-white w-full">
                {activeTab === "Profile Settings" && (
                  <form className="space-y-8" onSubmit={handleSave}>
                    {/* Avatar and Upload */}
                    <div className="flex flex-col md:flex-row items-center gap-4 xs:gap-6 mb-6">
                      <div className="relative">
                        <Avatar className="w-24 h-24">
                          <AvatarImage src={avatar} alt="Avatar" />
                          <AvatarFallback>
                            {firstName?.[0] || "U"}
                            {lastName?.[0] || ""}
                          </AvatarFallback>
                        </Avatar>
                        <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 cursor-pointer shadow-lg border-2 border-white">
                          <Camera className="h-5 w-5" />
                          <input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleAvatarChange}
                          />
                        </label>
                      </div>
                      <div className="flex flex-col xs:flex-row gap-2 xs:gap-3 w-full xs:w-auto mt-4 md:mt-0">
                        <Button type="button" onClick={() => document.getElementById('avatar-upload')?.click()} className="w-full xs:w-auto">
                          Upload New
                        </Button>
                        <Button type="button" variant="secondary" onClick={handleDeleteAvatar} className="w-full xs:w-auto">
                          <Trash2 className="h-4 w-4 mr-2" />Delete avatar
                        </Button>
                      </div>
                        </div>
                        
                    {/* Profile Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xs:gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-1">First Name <span className="text-red-500">*</span></label>
                        <Input value={firstName} onChange={e => setFirstName(e.target.value)} required placeholder="First name" />
                      </div>
                        <div>
                        <label className="block text-sm font-medium mb-1">Last Name <span className="text-red-500">*</span></label>
                        <Input value={lastName} onChange={e => setLastName(e.target.value)} required placeholder="Last name" />
                        </div>
                        <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <Input value={email} readOnly placeholder="Email" className="bg-gray-100 cursor-not-allowed" />
                        </div>
                        <div>
                        <label className="block text-sm font-medium mb-1">Mobile Number <span className="text-red-500">*</span></label>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">🇮🇳</span>
                          <Input value={mobile} onChange={e => setMobile(e.target.value)} required placeholder="0806 123 7890" />
                        </div>
                      </div>
                        <div>
                        <label className="block text-sm font-medium mb-1">Gender</label>
                        <div className="flex gap-4 mt-2">
                          <label className="flex items-center gap-2">
                            <input type="radio" name="gender" value="male" checked={gender === "male"} onChange={() => setGender("male")}/>
                            Male
                          </label>
                          <label className="flex items-center gap-2">
                            <input type="radio" name="gender" value="female" checked={gender === "female"} onChange={() => setGender("female")}/>
                            Female
                          </label>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">ID</label>
                        <Input value={id} readOnly placeholder="ID" className="bg-gray-100 cursor-not-allowed" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Residential Address</label>
                        <Input value={address} onChange={e => setAddress(e.target.value)} placeholder="Address" />
                    </div>
                  </div>
                  
                    <div className="flex justify-end">
                      <Button type="submit" className="px-8 py-2 text-base font-semibold">Save Changes</Button>
                    </div>
                  </form>
                )}
                {activeTab === "Password" && (
                  <form className="space-y-6 max-w-md mx-auto" onSubmit={handleChangePassword}>
                    <h2 className="text-xl font-semibold mb-4">Change Password</h2>
                    <div>
                      <label className="block text-sm font-medium mb-1">Current Password</label>
                      <Input
                        type="password"
                        value={currentPassword}
                        onChange={e => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                        required
                      />
                          </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">New Password</label>
                      <Input
                        type="password"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        required
                      />
                          </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                      <Input
                        type="password"
                        value={confirmNewPassword}
                        onChange={e => setConfirmNewPassword(e.target.value)}
                        placeholder="Confirm new password"
                        required
                      />
                        </div>
                    <Button type="submit" className="w-full" disabled={isChangingPassword}>
                      {isChangingPassword ? "Changing..." : "Change Password"}
                    </Button>
                  </form>
                )}
                {activeTab === "Verification" && (
                  <div className="space-y-6 max-w-md mx-auto">
                    <h2 className="text-xl font-semibold mb-4">Email Verification</h2>
                    <div>
                      <div className="mb-2">
                        <span className="font-medium">Email:</span> {profile?.email || "-"}
                          </div>
                      <div className="mb-4 flex items-center gap-2">
                        <span className="font-medium">Status:</span>
                        {isEmailVerified ? (
                          <span className="text-green-600 font-semibold">Verified</span>
                        ) : (
                          <span className="text-yellow-600 font-semibold">Not Verified</span>
                        )}
                      </div>
                      {!isEmailVerified && (
                        <Button onClick={handleSendVerification} disabled={isSendingVerification} className="mr-2">
                          {isSendingVerification ? "Sending..." : "Send Verification Email"}
                        </Button>
                      )}
                      <Button onClick={handleReloadUser} disabled={isReloadingUser} variant="outline">
                        {isReloadingUser ? "Refreshing..." : "Refresh Status"}
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            </main>
          </div>
        </div>
      </div>
      {/* Footer */}
        <Footer />
    </div>
    );
} 
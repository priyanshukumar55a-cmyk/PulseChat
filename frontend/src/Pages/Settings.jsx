import React, { useRef, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import api from "@/api/axios";
import { toast } from "sonner";

const Settings = () => {
  const { user, setUser } = useAuth();
  const fileInputRef = useRef(null);
  const [username, setUsername] = useState(user ? user.username : "");
  const [email, setEmail] = useState(user ? user.email : "");
  const [profilePic, setProfilePic] = useState(
    user?.pic || user?.username?.[0].toUpperCase() || "",
  );
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5 MB");
      return;
    }

    setSelectedFile(file);
    setProfilePic(URL.createObjectURL(file));
  };

  const uploadImage = async (file) => {
    const formData = new FormData();

    formData.append("image", file);

    const { data } = await api.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data.url;
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      let imageUrl = user.pic;
      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile);
      }
      const { data } = await api.put(
        "/user/profile",
        {
          username,
          email,
          pic: imageUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      );

      setUser(data);

      localStorage.setItem("userInfo", JSON.stringify(data));

      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      URL.revokeObjectURL(profilePic);
      setLoading(false);
    }
  };

  return (
    <div className="h-full mt-20 px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-white/60 mt-2">
            Manage your profile and preferences
          </p>
        </div> */}

        {/* Profile Settings Card */}
        <div className="bg-black/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 space-y-6">
          <h2 className="text-2xl font-semibold text-white justify-center flex">Profile Settings</h2>

          {/* Avatar Section */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-white/10">
            <div className="flex-shrink-0">
              <Avatar className="h-24 w-24 ring-2 ring-purple-500/50">
                <AvatarImage src={profilePic} />
                <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white text-lg font-bold">
                  {user?.username?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <p className="text-white font-semibold">{username}</p>
              <p className="text-white/60 text-sm mb-3">{email}</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              <Button
                className="cursor-pointer bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
                onClick={() => fileInputRef.current?.click()}
              >
                Change Photo
              </Button>
            </div>
          </div>

          {/* Form Section */}
          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-white/80 block mb-2">
                Username
              </label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:ring-purple-500/50 focus:border-purple-500/50"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-white/80 block mb-2">
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:ring-purple-500/50 focus:border-purple-500/50"
              />
            </div>

            <Button
              className="w-full cursor-pointer bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 py-6 text-base font-semibold shadow-lg"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

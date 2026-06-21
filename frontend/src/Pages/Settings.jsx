import React, { useRef, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
        console.log("pic =", imageUrl);
        console.log(typeof imageUrl);
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
    <div className="max-w-2xl mx-auto mt-20 px-4">
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold">Settings</h1>

        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="flex flex-col items-center gap-3">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profilePic} />
                <AvatarFallback>
                  {user?.username?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />

              <Button
                className="cursor-pointer"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                Change Photo
              </Button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Username</label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <Button
              className="cursor-pointer"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </CardContent>
        </Card>

        {/* Password Section */}
        {/* <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <Input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />

            <Input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <Input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <Button>Update Password</Button>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
};

export default Settings;

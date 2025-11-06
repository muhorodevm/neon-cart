import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Edit, X, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { userApi } from "@/lib/api";

type Profile = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

const DashboardProfile = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<Profile>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const { data, isLoading } = useQuery<{ user: { email: string; profile: Profile } }>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const response = await userApi.getProfile();
      return (response as { data: { user: { email: string; profile: Profile } } }).data;
    },
  });

  useEffect(() => {
    if (data?.user?.profile) {
      setProfile({
        firstName: data.user.profile.firstName,
        lastName: data.user.profile.lastName,
        email: data.user.email,
        phone: data.user.profile.phone,
      });
    }
  }, [data]);

  const updateMutation = useMutation({
    mutationFn: async (payload: Omit<Profile, "email">) => {
      const response = await userApi.updateProfile(payload);
      return response.data;
    },
    onSuccess: () => {
      toast({ title: "Profile Updated", description: "Your profile was saved." });
      setIsEditing(false);
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error?.response?.data?.error || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    updateMutation.mutate({
      firstName: profile.firstName,
      lastName: profile.lastName,
      phone: profile.phone,
    });
  };

  const handleCancel = () => setIsEditing(false);

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
            {!isEditing ? (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} disabled={isLoading}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSave} disabled={updateMutation.isPending}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={profile.firstName}
                  onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                  disabled={!isEditing}
                  className={!isEditing ? "cursor-not-allowed opacity-60" : ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={profile.lastName}
                  onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                  disabled={!isEditing}
                  className={!isEditing ? "cursor-not-allowed opacity-60" : ""}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={profile.email} disabled className="cursor-not-allowed opacity-60" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                disabled={!isEditing}
                className={!isEditing ? "cursor-not-allowed opacity-60" : ""}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardProfile;



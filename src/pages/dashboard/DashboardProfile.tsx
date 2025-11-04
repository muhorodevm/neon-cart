import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit2, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DashboardProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+254 712 345 678",
  });

  const { toast } = useToast();

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully",
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Profile Information</CardTitle>
        {!isEditing ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Edit
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(false)}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={profile.firstName}
              onChange={(e) =>
                setProfile({ ...profile, firstName: e.target.value })
              }
              disabled={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={profile.lastName}
              onChange={(e) =>
                setProfile({ ...profile, lastName: e.target.value })
              }
              disabled={!isEditing}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={profile.email}
            onChange={(e) =>
              setProfile({ ...profile, email: e.target.value })
            }
            disabled={!isEditing}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={profile.phone}
            onChange={(e) =>
              setProfile({ ...profile, phone: e.target.value })
            }
            disabled={!isEditing}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardProfile;

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit, Trash2 } from "lucide-react";
import AddressForm from "@/components/forms/AddressForm";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userApi } from "@/lib/api";

type Address = {
  id: string;
  street: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
  isDefault?: boolean;
  label?: string; // optional client-side label
};

const DashboardAddresses = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const { data: addresses = [], isLoading } = useQuery<Address[]>({
    queryKey: ["userAddresses"],
    queryFn: async () => {
      const response = await userApi.getAddresses();
      const body = (response as { data: { addresses?: Address[] } }).data;
      return Array.isArray(body?.addresses) ? body.addresses : [];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (payload: Address) => {
      if (editingAddress?.id) {
        const res = await userApi.updateAddress(editingAddress.id, payload);
        return res.data;
      }
      const res = await userApi.addAddress(payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userAddresses"] });
      toast({ title: editingAddress ? "Address Updated" : "Address Added" });
      setShowForm(false);
      setEditingAddress(null);
    },
    onError: (error: any) => {
      toast({
        title: "Save failed",
        description: error?.response?.data?.error || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await userApi.deleteAddress(id);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userAddresses"] });
      toast({ title: "Address Deleted" });
    },
    onError: () => toast({ title: "Delete failed", variant: "destructive" }),
  });

  const handleSubmit = (data: any) => {
    const payload = {
      street: data.street,
      city: data.city,
      state: data.state,
      postalCode: data.postalCode,
      country: data.country,
      isDefault: data.isDefault ?? false,
    } as any;
    saveMutation.mutate(payload);
  };

  const handleDelete = (id: string) => deleteMutation.mutate(id);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Saved Addresses</h2>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingAddress(null)}>
              Add New Address
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingAddress ? "Edit Address" : "Add New Address"}
              </DialogTitle>
            </DialogHeader>
            <AddressForm
              initialData={editingAddress as any}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingAddress(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <p>Loading addresses...</p>
      ) : addresses.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No addresses found. Use "Add New Address" to create one.
        </p>
      ) : (
        <div className="grid gap-4">
          {addresses.map((address) => (
            <Card key={address.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium flex items-center gap-2">
                      {address.label || "Address"}
                      {address.isDefault && <Badge>Default</Badge>}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-2">
                      {address.street}
                      <br />
                      {address.city}
                      {address.state ? `, ${address.state}` : ""}
                      {address.postalCode ? `, ${address.postalCode}` : ""}
                      <br />
                      {address.country}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingAddress({
                          ...address,
                          label: address.label || "",
                        });
                        setShowForm(true);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(address.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardAddresses;

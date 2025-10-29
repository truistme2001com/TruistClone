import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [isUpdateBalanceOpen, setIsUpdateBalanceOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);

  const { data: currentUser } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const response = await fetch("/api/me", { credentials: "include" });
      if (!response.ok) {
        setLocation("/login");
        throw new Error("Not authenticated");
      }
      return response.json();
    },
  });

  const { data: usersData } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const response = await fetch("/api/admin/users", { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch users");
      return response.json();
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await fetch("/api/logout", { method: "POST", credentials: "include" });
    },
    onSuccess: () => {
      setLocation("/login");
    },
  });

  const createUserMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setIsCreateUserOpen(false);
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to delete user");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });

  const updateBalanceMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch(`/api/admin/accounts/${data.accountId}/balance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: data.amount, type: data.type, description: data.description }),
        credentials: "include",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setIsUpdateBalanceOpen(false);
    },
  });

  const handleCreateUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createUserMutation.mutate({
      username: formData.get("username"),
      password: formData.get("password"),
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      isAdmin: formData.get("isAdmin") === "on",
      businessName: formData.get("businessName"),
      initialBalance: formData.get("initialBalance"),
    });
  };

  const handleUpdateBalance = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    updateBalanceMutation.mutate({
      accountId: selectedAccount.id,
      amount: formData.get("amount"),
      type: formData.get("type"),
      description: formData.get("description"),
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {currentUser?.user?.fullName} <Badge variant="secondary">Admin</Badge>
            </span>
            <Button variant="outline" onClick={() => logoutMutation.mutate()}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">Users & Accounts</TabsTrigger>
            <TabsTrigger value="overview">System Overview</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">User Management</h2>
              <Dialog open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
                <DialogTrigger asChild>
                  <Button>Create New User</Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create New User</DialogTitle>
                    <DialogDescription>
                      Add a new user with optional business account
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateUser} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input id="username" name="username" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" name="password" type="password" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input id="fullName" name="fullName" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email (optional)</Label>
                      <Input id="email" name="email" type="email" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="isAdmin" name="isAdmin" />
                      <Label htmlFor="isAdmin">Admin User</Label>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="businessName">Business Name (optional)</Label>
                      <Input id="businessName" name="businessName" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="initialBalance">Initial Balance (optional)</Label>
                      <Input id="initialBalance" name="initialBalance" type="number" step="0.01" />
                    </div>
                    {createUserMutation.error && (
                      <Alert variant="destructive">
                        <AlertDescription>{createUserMutation.error.message}</AlertDescription>
                      </Alert>
                    )}
                    <Button type="submit" className="w-full" disabled={createUserMutation.isPending}>
                      {createUserMutation.isPending ? "Creating..." : "Create User"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>All Users</CardTitle>
                <CardDescription>Manage user accounts and balances</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead>Business Account</TableHead>
                      <TableHead>Account Number</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usersData?.users?.map((user: any) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.fullName}</TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>
                          {user.accounts?.[0]?.businessName || "N/A"}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {user.accounts?.[0]?.accountNumber || "N/A"}
                        </TableCell>
                        <TableCell className="font-semibold text-green-600">
                          ${user.accounts?.[0]?.balance ? parseFloat(user.accounts[0].balance).toLocaleString() : "0.00"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.isAdmin ? "default" : "secondary"}>
                            {user.isAdmin ? "Admin" : "User"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {user.accounts?.[0] && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedAccount(user.accounts[0]);
                                  setIsUpdateBalanceOpen(true);
                                }}
                              >
                                Update Balance
                              </Button>
                            )}
                            {!user.isAdmin && (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => {
                                  if (confirm("Are you sure you want to delete this user?")) {
                                    deleteUserMutation.mutate(user.id);
                                  }
                                }}
                              >
                                Delete
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="overview">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">{usersData?.users?.length || 0}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Total Accounts</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">
                    {usersData?.users?.filter((u: any) => u.accounts?.length > 0).length || 0}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Total Balance</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-green-600">
                    ${usersData?.users?.reduce((acc: number, u: any) => {
                      const balance = u.accounts?.[0]?.balance ? parseFloat(u.accounts[0].balance) : 0;
                      return acc + balance;
                    }, 0).toLocaleString() || "0"}
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={isUpdateBalanceOpen} onOpenChange={setIsUpdateBalanceOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Account Balance</DialogTitle>
            <DialogDescription>
              {selectedAccount?.businessName} - Account #{selectedAccount?.accountNumber}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateBalance} className="space-y-4">
            <div className="space-y-2">
              <Label>Current Balance</Label>
              <p className="text-2xl font-bold text-green-600">
                ${selectedAccount?.balance ? parseFloat(selectedAccount.balance).toLocaleString() : "0.00"}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Transaction Type</Label>
              <Select name="type" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit">Credit (Add)</SelectItem>
                  <SelectItem value="debit">Debit (Subtract)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input id="amount" name="amount" type="number" step="0.01" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Input id="description" name="description" />
            </div>
            {updateBalanceMutation.error && (
              <Alert variant="destructive">
                <AlertDescription>{updateBalanceMutation.error.message}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full" disabled={updateBalanceMutation.isPending}>
              {updateBalanceMutation.isPending ? "Updating..." : "Update Balance"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

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
import truistLogo from "@/../../attached_assets/stock_images/truist_bank_logo_pur_b67575c5.jpg";
import { Users, DollarSign, Building2, Plus, Trash2, Edit, LogOut, Shield, User, Settings, Bell } from "lucide-react";

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
        setLocation("/");
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
      setLocation("/");
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

  const [isAdminUser, setIsAdminUser] = useState(false);

  const handleCreateUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createUserMutation.mutate({
      username: formData.get("username"),
      password: formData.get("password"),
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      isAdmin: isAdminUser,
      businessName: formData.get("businessName"),
      initialBalance: formData.get("initialBalance"),
    });
    setIsAdminUser(false);
  };

  const [transactionType, setTransactionType] = useState("credit");

  const handleUpdateBalance = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    updateBalanceMutation.mutate({
      accountId: selectedAccount.id,
      amount: formData.get("amount"),
      type: transactionType,
      description: formData.get("description"),
    });
  };

  const formatCurrency = (amount: string | number) => {
    return parseFloat(amount.toString()).toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  };

  const totalBalance = usersData?.users?.reduce((acc: number, u: any) => {
    const balance = u.accounts?.[0]?.balance ? parseFloat(u.accounts[0].balance) : 0;
    return acc + balance;
  }, 0) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50/30">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-6">
              <img src={truistLogo} alt="Truist Bank" className="h-10" />
              <div className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full">
                <Shield className="h-4 w-4 text-white" />
                <span className="text-white font-bold text-sm">Admin Portal</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="text-gray-600 hover:text-purple-600">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-600 hover:text-purple-600">
                <Settings className="h-5 w-5" />
              </Button>
              <div className="hidden sm:flex items-center gap-3 ml-2 pl-3 border-l border-gray-300">
                <div className="flex items-center gap-2">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <User className="h-4 w-4 text-purple-600" />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{currentUser?.user?.fullName}</span>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="border-purple-300 text-purple-600 hover:bg-purple-50 hover:text-purple-700 gap-2"
                onClick={() => logoutMutation.mutate()}
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage users, accounts, and system operations</p>
          </div>
          <Dialog open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg gap-2">
                <Plus className="h-5 w-5" />
                Create New User
              </Button>
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
                  <Switch id="isAdmin" name="isAdmin" checked={isAdminUser} onCheckedChange={setIsAdminUser} />
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
                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={createUserMutation.isPending}>
                  {createUserMutation.isPending ? "Creating..." : "Create User"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-white">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-2xl shadow-lg">
                  <Users className="h-7 w-7 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Users</p>
                  <p className="text-4xl font-bold text-gray-900">{usersData?.users?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-white">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl shadow-lg">
                  <Building2 className="h-7 w-7 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Accounts</p>
                  <p className="text-4xl font-bold text-gray-900">
                    {usersData?.users?.filter((u: any) => u.accounts?.length > 0).length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-white">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-2xl shadow-lg">
                  <DollarSign className="h-7 w-7 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Balance</p>
                  <p className="text-3xl font-bold text-green-600">
                    ${formatCurrency(totalBalance)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="bg-white border border-gray-200 shadow-sm h-12">
            <TabsTrigger 
              value="users" 
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white font-semibold"
            >
              User Management
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card className="border-0 shadow-lg">
              <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-purple-50 to-white">
                <CardTitle className="text-xl">All Users & Accounts</CardTitle>
                <CardDescription>Manage user accounts and balances</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50/80">
                        <TableHead className="font-bold">User</TableHead>
                        <TableHead className="font-bold">Username</TableHead>
                        <TableHead className="font-bold">Business Account</TableHead>
                        <TableHead className="font-bold">Account Number</TableHead>
                        <TableHead className="font-bold">Balance</TableHead>
                        <TableHead className="font-bold">Role</TableHead>
                        <TableHead className="font-bold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {usersData?.users?.map((user: any) => (
                        <TableRow key={user.id} className="hover:bg-purple-50/50 transition-colors">
                          <TableCell className="font-semibold text-gray-900">{user.fullName}</TableCell>
                          <TableCell className="text-gray-700">{user.username}</TableCell>
                          <TableCell className="text-gray-700">
                            {user.accounts?.[0]?.businessName || <span className="text-gray-400 italic">No account</span>}
                          </TableCell>
                          <TableCell className="font-mono text-sm text-gray-700">
                            {user.accounts?.[0]?.accountNumber || <span className="text-gray-400">N/A</span>}
                          </TableCell>
                          <TableCell className="font-bold text-green-600">
                            {user.accounts?.[0]?.balance ? `$${formatCurrency(user.accounts[0].balance)}` : <span className="text-gray-400">$0.00</span>}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={user.isAdmin ? "default" : "secondary"} 
                              className={user.isAdmin ? "bg-purple-100 text-purple-700 font-semibold" : "bg-gray-100 text-gray-700"}
                            >
                              {user.isAdmin ? "Admin" : "User"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {user.accounts?.[0] && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="gap-1.5 border-purple-300 text-purple-600 hover:bg-purple-50"
                                  onClick={() => {
                                    setSelectedAccount(user.accounts[0]);
                                    setIsUpdateBalanceOpen(true);
                                  }}
                                >
                                  <Edit className="h-3.5 w-3.5" />
                                  Update
                                </Button>
                              )}
                              {!user.isAdmin && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="gap-1.5 text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700"
                                  onClick={() => {
                                    if (confirm("Are you sure you want to delete this user?")) {
                                      deleteUserMutation.mutate(user.id);
                                    }
                                  }}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                  Delete
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
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
              <p className="text-3xl font-bold text-green-600">
                ${selectedAccount?.balance ? formatCurrency(selectedAccount.balance) : "0.00"}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Transaction Type</Label>
              <Select name="type" value={transactionType} onValueChange={setTransactionType} required>
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
            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={updateBalanceMutation.isPending}>
              {updateBalanceMutation.isPending ? "Updating..." : "Update Balance"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">
            <p>© 2025 Truist Financial Corporation. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-purple-600 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-purple-600 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-purple-600 transition-colors">Contact Us</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

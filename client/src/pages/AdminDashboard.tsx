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
import { useToast } from "@/hooks/use-toast";
import avatarTeddy from "@assets/generated_images/Cute_teddy_bear_avatar_c7acee2d.png";
import avatarCat from "@assets/generated_images/Cute_orange_cat_avatar_620953be.png";
import avatarDog from "@assets/generated_images/Cute_corgi_dog_avatar_c05836b9.png";
import avatarPanda from "@assets/generated_images/Cute_panda_avatar_446d56e7.png";
import avatarBunny from "@assets/generated_images/Cute_bunny_rabbit_avatar_1fad4cd8.png";
import avatarFox from "@assets/generated_images/Cute_fox_avatar_15511073.png";
import avatarUnicorn from "@assets/generated_images/Cute_unicorn_avatar_a716b055.png";
import avatarRobot from "@assets/generated_images/Cute_robot_avatar_945782ec.png";
import avatarPenguin from "@assets/generated_images/Cute_penguin_avatar_8452d04c.png";
import avatarKoala from "@assets/generated_images/Cute_koala_avatar_90299146.png";
import avatarOwl from "@assets/generated_images/Cute_owl_avatar_b6ecc7fc.png";
import avatarSloth from "@assets/generated_images/Cute_sloth_avatar_6f1e1b80.png";
import { apiRequest } from "@/lib/queryClient";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [isUpdateBalanceOpen, setIsUpdateBalanceOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
  const [fundsAmount, setFundsAmount] = useState("");
  
  const avatarOptions = [
    { id: "teddy", image: avatarTeddy, label: "Teddy Bear" },
    { id: "cat", image: avatarCat, label: "Cat" },
    { id: "dog", image: avatarDog, label: "Dog" },
    { id: "panda", image: avatarPanda, label: "Panda" },
    { id: "bunny", image: avatarBunny, label: "Bunny" },
    { id: "fox", image: avatarFox, label: "Fox" },
    { id: "unicorn", image: avatarUnicorn, label: "Unicorn" },
    { id: "robot", image: avatarRobot, label: "Robot" },
    { id: "penguin", image: avatarPenguin, label: "Penguin" },
    { id: "koala", image: avatarKoala, label: "Koala" },
    { id: "owl", image: avatarOwl, label: "Owl" },
    { id: "sloth", image: avatarSloth, label: "Sloth" },
  ];
  
  const getAvatarImage = (avatarId: string | undefined) => {
    if (!avatarId || avatarId === "default") return null;
    const avatar = avatarOptions.find(a => a.id === avatarId);
    return avatar?.image;
  };

  const { data: currentUser } = useQuery({
    queryKey: ["admin-me"],
    queryFn: async () => {
      const response = await fetch("/api/admin-me", { credentials: "include" });
      if (!response.ok) {
        if (response.status === 403 || response.status === 401) {
          setLocation("/admin/login");
        }
        throw new Error("Not authenticated");
      }
      return response.json();
    },
    retry: (failureCount, error: any) => {
      if (error.message === "Not authenticated") {
        return false;
      }
      return failureCount < 3;
    },
  });

  const { data: usersData } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const response = await fetch("/api/admin/users", { credentials: "include" });
      if (!response.ok) {
        if (response.status === 403 || response.status === 401) {
          setLocation("/admin/login");
        }
        throw new Error("Failed to fetch users");
      }
      return response.json();
    },
    refetchInterval: 3000,
    retry: (failureCount, error: any) => {
      if (error.message === "Failed to fetch users") {
        return false;
      }
      return failureCount < 3;
    },
  });

  const { data: adminAccountData } = useQuery({
    queryKey: ["admin-account"],
    queryFn: async () => {
      const response = await fetch("/api/admin/account", { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch admin account");
      return response.json();
    },
    refetchInterval: 3000,
  });

  const { data: notificationsData } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const response = await fetch("/api/notifications", { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch notifications");
      return response.json();
    },
    refetchInterval: 3000,
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await fetch("/api/admin-logout", { method: "POST", credentials: "include" });
    },
    onSuccess: () => {
      setLocation("/admin/login");
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

  const blockUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      const response = await fetch(`/api/admin/users/${userId}/block`, {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to block user");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });

  const unblockUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      const response = await fetch(`/api/admin/users/${userId}/unblock`, {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to unblock user");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch(`/api/admin/users/${data.userId}/update`, {
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
      setIsEditUserOpen(false);
      setSelectedUser(null);
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
      queryClient.invalidateQueries({ queryKey: ["admin-account"] });
      setIsUpdateBalanceOpen(false);
    },
  });

  const addFundsMutation = useMutation({
    mutationFn: async (data: { amount: string; description?: string }) => {
      const response = await fetch("/api/admin/account/add-funds", {
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
      queryClient.invalidateQueries({ queryKey: ["admin-account"] });
      setIsAddFundsOpen(false);
      setFundsAmount("");
      toast({
        title: "Success",
        description: "Funds added successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add funds",
        variant: "destructive",
      });
    },
  });

  const updateAvatarMutation = useMutation({
    mutationFn: async (avatar: string) => {
      return await apiRequest("POST", "/api/admin/profile/update-avatar", { avatar });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-me"] });
      setIsAvatarDialogOpen(false);
      toast({
        title: "Success",
        description: "Avatar updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update avatar",
        variant: "destructive",
      });
    },
  });

  const handleAvatarSelect = (avatarId: string) => {
    setSelectedAvatar(avatarId);
    updateAvatarMutation.mutate(avatarId);
  };

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

  const handleEditUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updateData: any = { userId: selectedUser.id };
    
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const dateJoined = formData.get("dateJoined") as string;
    
    if (fullName && fullName !== selectedUser.fullName) updateData.fullName = fullName;
    if (email && email !== selectedUser.email) updateData.email = email;
    if (username && username !== selectedUser.username) updateData.username = username;
    if (password) updateData.password = password;
    if (dateJoined) updateData.dateJoined = dateJoined;
    
    updateUserMutation.mutate(updateData);
  };

  const formatCurrency = (amount: string | number) => {
    return parseFloat(amount.toString()).toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  };

  const totalBalance = usersData?.users?.reduce((acc: number, u: any) => {
    // Exclude admin from total users balance
    if (u.isAdmin) return acc;
    const balance = u.accounts?.[0]?.balance ? parseFloat(u.accounts[0].balance) : 0;
    return acc + balance;
  }, 0) || 0;

  const adminBalance = adminAccountData?.account?.balance ? parseFloat(adminAccountData.account.balance) : 0;

  const formatBusinessName = (name: string | undefined) => {
    if (!name) return "";
    return name.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/40 to-indigo-50/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-200/20 rounded-full blur-3xl -mr-64 -mt-64"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-200/20 rounded-full blur-3xl -ml-48 -mb-48"></div>
      <div className="relative z-10">
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
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-600 hover:text-purple-600 relative" 
                onClick={() => setIsNotificationsOpen(true)}
                data-testid="button-notifications"
              >
                <Bell className="h-5 w-5" />
                {notificationsData?.unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {notificationsData.unreadCount > 9 ? '9+' : notificationsData.unreadCount}
                  </span>
                )}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-600 hover:text-purple-600" 
                onClick={() => setIsSettingsOpen(true)}
                data-testid="button-settings"
              >
                <Settings className="h-5 w-5" />
              </Button>
              <div className="hidden sm:flex items-center gap-3 ml-2 pl-3 border-l border-gray-300">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setIsAvatarDialogOpen(true)}
                    className="bg-purple-100 p-2 rounded-full hover:bg-purple-200 transition-colors cursor-pointer"
                    data-testid="button-admin-avatar"
                  >
                    {getAvatarImage(currentUser?.user?.avatar) ? (
                      <img 
                        src={getAvatarImage(currentUser?.user?.avatar)!} 
                        alt="Avatar" 
                        className="h-6 w-6 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-4 w-4 text-purple-600" />
                    )}
                  </button>
                  <span className="text-sm font-semibold text-gray-900">{currentUser?.user?.fullName}</span>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="border-purple-300 text-purple-600 hover:bg-purple-50 hover:text-purple-700 gap-2"
                onClick={() => logoutMutation.mutate()}
                data-testid="button-logout"
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
              <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg gap-2" data-testid="button-create-user">
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
                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={createUserMutation.isPending} data-testid="button-submit-create-user">
                  {createUserMutation.isPending ? "Creating..." : "Create User"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
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
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-600 mb-1">Users Balance</p>
                  <p className="text-2xl font-bold text-green-600 truncate">
                    ${formatCurrency(totalBalance)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-white">
            <CardContent className="pt-6">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-2xl shadow-lg">
                    <Shield className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-600 mb-1">Admin Balance</p>
                    <p className="text-2xl font-bold text-orange-600 truncate">
                      ${formatCurrency(adminBalance)}
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={() => setIsAddFundsOpen(true)}
                  size="sm"
                  className="bg-orange-600 hover:bg-orange-700 text-white mt-2"
                  data-testid="button-add-funds"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Funds
                </Button>
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
                        <TableHead className="font-bold">Status</TableHead>
                        <TableHead className="font-bold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {usersData?.users?.map((user: any) => (
                        <TableRow key={user.id} className="hover:bg-purple-50/50 transition-colors">
                          <TableCell className="font-semibold text-gray-900">{user.fullName}</TableCell>
                          <TableCell className="text-gray-700">{user.username}</TableCell>
                          <TableCell className="text-gray-700">
                            {user.accounts?.[0]?.businessName ? formatBusinessName(user.accounts[0].businessName) : <span className="text-gray-400 italic">No account</span>}
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
                            <Badge 
                              variant={user.isBlocked ? "destructive" : "default"} 
                              className={user.isBlocked ? "bg-red-100 text-red-700 font-semibold" : "bg-green-100 text-green-700 font-semibold"}
                            >
                              {user.isBlocked ? "Blocked" : "Active"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-1.5 border-blue-300 text-blue-600 hover:bg-blue-50"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setIsEditUserOpen(true);
                                }}
                                data-testid={`button-edit-user-${user.id}`}
                              >
                                <Edit className="h-3.5 w-3.5" />
                                Edit
                              </Button>
                              {user.accounts?.[0] && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="gap-1.5 border-green-300 text-green-600 hover:bg-green-50"
                                  onClick={() => {
                                    setSelectedAccount(user.accounts[0]);
                                    setIsUpdateBalanceOpen(true);
                                  }}
                                  data-testid={`button-update-balance-${user.id}`}
                                >
                                  <DollarSign className="h-3.5 w-3.5" />
                                  Fund/Debit
                                </Button>
                              )}
                              {!user.isAdmin && (
                                <>
                                  {user.isBlocked ? (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="gap-1.5 border-green-300 text-green-600 hover:bg-green-50"
                                      onClick={() => unblockUserMutation.mutate(user.id)}
                                      data-testid={`button-unblock-${user.id}`}
                                    >
                                      Unblock
                                    </Button>
                                  ) : (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="gap-1.5 border-orange-300 text-orange-600 hover:bg-orange-50"
                                      onClick={() => {
                                        if (confirm("Are you sure you want to block this user?")) {
                                          blockUserMutation.mutate(user.id);
                                        }
                                      }}
                                      data-testid={`button-block-${user.id}`}
                                    >
                                      Block
                                    </Button>
                                  )}
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="gap-1.5 text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700"
                                    onClick={() => {
                                      if (confirm("Are you sure you want to delete this user?")) {
                                        deleteUserMutation.mutate(user.id);
                                      }
                                    }}
                                    data-testid={`button-delete-${user.id}`}
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                    Delete
                                  </Button>
                                </>
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
            <DialogTitle>Fund or Debit Account</DialogTitle>
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
                <SelectTrigger data-testid="select-transaction-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit" data-testid="option-credit">Credit (Add Money)</SelectItem>
                  <SelectItem value="debit" data-testid="option-debit">Debit (Remove Money)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input id="amount" name="amount" type="number" step="0.01" required data-testid="input-balance-amount" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Input id="description" name="description" data-testid="input-balance-description" />
            </div>
            {updateBalanceMutation.error && (
              <Alert variant="destructive">
                <AlertDescription>{updateBalanceMutation.error.message}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={updateBalanceMutation.isPending} data-testid="button-submit-balance-update">
              {updateBalanceMutation.isPending ? "Processing..." : "Update Balance"}
            </Button>
          </form>
        </DialogContent>
        </Dialog>

        <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User Details</DialogTitle>
              <DialogDescription>
                Update information for {selectedUser?.fullName}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditUser} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-fullName">Full Name</Label>
                <Input 
                  id="edit-fullName" 
                  name="fullName" 
                  defaultValue={selectedUser?.fullName}
                  data-testid="input-edit-fullname"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input 
                  id="edit-email" 
                  name="email" 
                  type="email"
                  defaultValue={selectedUser?.email || ""}
                  data-testid="input-edit-email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-username">Username</Label>
                <Input 
                  id="edit-username" 
                  name="username" 
                  defaultValue={selectedUser?.username}
                  data-testid="input-edit-username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-password">Password (leave blank to keep current)</Label>
                <Input 
                  id="edit-password" 
                  name="password" 
                  type="password"
                  placeholder="Enter new password"
                  data-testid="input-edit-password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-dateJoined">Date Joined</Label>
                <Input 
                  id="edit-dateJoined" 
                  name="dateJoined" 
                  type="date"
                  defaultValue={selectedUser?.dateJoined ? new Date(selectedUser.dateJoined).toISOString().split('T')[0] : ""}
                  data-testid="input-edit-datejoined"
                />
              </div>
              {updateUserMutation.error && (
                <Alert variant="destructive">
                  <AlertDescription>{updateUserMutation.error.message}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={updateUserMutation.isPending} data-testid="button-submit-edit-user">
                {updateUserMutation.isPending ? "Updating..." : "Update User"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={isAvatarDialogOpen} onOpenChange={setIsAvatarDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Choose Your Avatar</DialogTitle>
              <DialogDescription>
                Select an avatar that represents you
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-4 gap-4 py-4">
              {avatarOptions.map((avatar) => (
                <button
                  key={avatar.id}
                  onClick={() => handleAvatarSelect(avatar.id)}
                  className={`p-2 rounded-lg border-2 transition-all hover:scale-105 ${
                    selectedAvatar === avatar.id || currentUser?.user?.avatar === avatar.id
                      ? "border-purple-600 bg-purple-50"
                      : "border-gray-200 hover:border-purple-300"
                  }`}
                  disabled={updateAvatarMutation.isPending}
                  data-testid={`button-select-avatar-${avatar.id}`}
                >
                  <img
                    src={avatar.image}
                    alt={avatar.label}
                    className="w-full aspect-square object-cover rounded-lg"
                  />
                  <p className="text-xs text-center mt-2 font-medium">{avatar.label}</p>
                </button>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle>Notifications</DialogTitle>
                  <DialogDescription>
                    System notifications and alerts
                  </DialogDescription>
                </div>
                {notificationsData?.unreadCount > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      const response = await fetch("/api/notifications/read-all", {
                        method: "POST",
                        credentials: "include",
                      });
                      if (response.ok) {
                        queryClient.invalidateQueries({ queryKey: ["notifications"] });
                      }
                    }}
                    data-testid="button-mark-all-read"
                  >
                    Mark all as read
                  </Button>
                )}
              </div>
            </DialogHeader>
            <div className="space-y-2 overflow-y-auto flex-1 pr-2">
              {notificationsData?.notifications && notificationsData.notifications.length > 0 ? (
                notificationsData.notifications.map((notification: any) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border ${
                      notification.isRead
                        ? 'bg-gray-50 border-gray-200'
                        : 'bg-purple-50 border-purple-200'
                    }`}
                    data-testid={`notification-${notification.id}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="font-semibold text-sm mb-1">{notification.title}</p>
                        <p className="text-sm text-gray-700">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={async () => {
                            const response = await fetch(`/api/notifications/${notification.id}/read`, {
                              method: "POST",
                              credentials: "include",
                            });
                            if (response.ok) {
                              queryClient.invalidateQueries({ queryKey: ["notifications"] });
                            }
                          }}
                          className="text-purple-600 hover:text-purple-700"
                          data-testid={`button-mark-read-${notification.id}`}
                        >
                          Mark as read
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Bell className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-sm">No notifications</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Admin Settings</DialogTitle>
              <DialogDescription>
                Manage your admin preferences
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-gray-500">Receive email alerts for important events</p>
                </div>
                <Switch defaultChecked data-testid="switch-email-notifications" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-500">Add an extra layer of security</p>
                </div>
                <Switch data-testid="switch-2fa" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">System Alerts</p>
                  <p className="text-sm text-gray-500">Show critical system alerts</p>
                </div>
                <Switch defaultChecked data-testid="switch-system-alerts" />
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isAddFundsOpen} onOpenChange={setIsAddFundsOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Funds to Admin Account</DialogTitle>
              <DialogDescription>
                Add money to your admin operations account
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (fundsAmount && parseFloat(fundsAmount) > 0) {
                  addFundsMutation.mutate({
                    amount: fundsAmount,
                    description: "Admin funds added",
                  });
                }
              }}
              className="space-y-4 py-4"
            >
              <div className="space-y-2">
                <Label htmlFor="funds-amount">Amount ($)</Label>
                <Input
                  id="funds-amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="Enter amount"
                  value={fundsAmount}
                  onChange={(e) => setFundsAmount(e.target.value)}
                  required
                  data-testid="input-funds-amount"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700"
                disabled={addFundsMutation.isPending || !fundsAmount || parseFloat(fundsAmount) <= 0}
                data-testid="button-submit-add-funds"
              >
                {addFundsMutation.isPending ? "Adding..." : "Add Funds"}
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
    </div>
  );
}

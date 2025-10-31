import { useState, Fragment } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLocation, Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { queryClient, apiRequest } from "@/lib/queryClient";
import truistLogo from "@/../../attached_assets/stock_images/truist_bank_logo_pur_b67575c5.jpg";
import { ArrowUpRight, ArrowDownRight, CreditCard, Download, FileText, LogOut, User, Settings, Bell, Send, ChevronDown, Globe, Building2, Lock, Unlock } from "lucide-react";
import { BankCard } from "@/components/BankCard";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { format } from "date-fns";
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

export default function UserDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [transferType, setTransferType] = useState<"internal" | "domestic_wire" | "international_wire">("internal");
  const [expandedTransaction, setExpandedTransaction] = useState<number | null>(null);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [enlargedCard, setEnlargedCard] = useState<"debit" | "credit" | null>(null);
  const [isPinDialogOpen, setIsPinDialogOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [nickname, setNickname] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isBlocked, setIsBlocked] = useState(false);
  
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

  const { data: userData } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const response = await fetch("/api/me", { credentials: "include" });
      if (!response.ok) {
        if (response.status === 403) {
          const errorData = await response.json();
          if (errorData.blocked) {
            setIsBlocked(true);
            throw new Error("Account blocked");
          }
          setLocation("/");
        }
        if (response.status === 401) {
          setLocation("/");
        }
        throw new Error("Not authenticated");
      }
      const data = await response.json();
      if (data.user.accounts && data.user.accounts.length > 0) {
        setSelectedAccountId(data.user.accounts[0].id);
      }
      return data;
    },
    refetchInterval: isBlocked ? false : 3000,
    retry: (failureCount, error: any) => {
      if (error.message === "Not authenticated" || error.message === "Account blocked") {
        return false;
      }
      return failureCount < 3;
    },
  });

  const { data: transactionsData } = useQuery({
    queryKey: ["transactions", selectedAccountId],
    queryFn: async () => {
      if (!selectedAccountId) return { transactions: [] };
      const response = await fetch(`/api/accounts/${selectedAccountId}/transactions?limit=100`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch transactions");
      return response.json();
    },
    enabled: !!selectedAccountId && !isBlocked,
    refetchInterval: isBlocked ? false : 3000,
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await fetch("/api/logout", { method: "POST", credentials: "include" });
    },
    onSuccess: () => {
      setLocation("/");
    },
  });

  const transferMutation = useMutation({
    mutationFn: async (data: any) => {
      let endpoint = "/api/transfer";
      if (data.transferType === "domestic_wire") {
        endpoint = "/api/transfer/domestic-wire";
      } else if (data.transferType === "international_wire") {
        endpoint = "/api/transfer/international-wire";
      }
      
      const response = await fetch(endpoint, {
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
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["transactions", selectedAccountId] });
      setIsTransferOpen(false);
      setTransferType("internal");
    },
  });

  const cardLockMutation = useMutation({
    mutationFn: async (data: { accountId: number; cardType: "debit" | "credit"; locked: boolean }) => {
      return await apiRequest("POST", "/api/cards/toggle-lock", data);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      const cardName = variables.cardType === "debit" ? "Debit Card" : "Credit Card";
      toast({
        title: variables.locked ? "🔒 Card Locked" : "🔓 Card Unlocked",
        description: variables.locked 
          ? `${cardName} has been locked for purchases` 
          : `${cardName} has been unlocked for purchases`,
        duration: 3000,
      });
    },
  });

  const setPinMutation = useMutation({
    mutationFn: async (pinValue: string) => {
      return new Promise((resolve) => setTimeout(resolve, 500));
    },
    onSuccess: () => {
      setIsPinDialogOpen(false);
      setPin("");
      toast({
        title: "✅ PIN Set Successfully",
        description: "Your new PIN has been set and is ready to use.",
        duration: 3000,
      });
    },
  });

  const updateLimitMutation = useMutation({
    mutationFn: async (data: { accountId: number; cardType: "debit" | "credit"; newLimit: string }) => {
      return await apiRequest("POST", "/api/cards/update-limit", data);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      const cardName = variables.cardType === "debit" ? "Debit Card" : "Credit Card";
      toast({
        title: "✅ Limit Updated",
        description: `${cardName} limit has been updated to $${parseFloat(variables.newLimit).toLocaleString()}`,
        duration: 3000,
      });
    },
  });

  const updateAvatarMutation = useMutation({
    mutationFn: async (avatar: string) => {
      return await apiRequest("POST", "/api/profile/update-avatar", { avatar });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      setIsAvatarDialogOpen(false);
      toast({
        title: "✅ Avatar Updated",
        description: "Your profile avatar has been updated successfully.",
        duration: 3000,
      });
    },
  });

  const updateNicknameMutation = useMutation({
    mutationFn: async (nickname: string) => {
      return await apiRequest("POST", "/api/profile/update-nickname", { nickname });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast({
        title: "✅ Nickname Updated",
        description: "Your nickname has been updated successfully.",
        duration: 3000,
      });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      return await apiRequest("POST", "/api/profile/change-password", data);
    },
    onSuccess: () => {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast({
        title: "✅ Password Changed",
        description: "Your password has been changed successfully. Use your new password next time you sign in.",
        duration: 4000,
      });
    },
    onError: (error: any) => {
      toast({
        title: "❌ Password Change Failed",
        description: error.message || "Failed to change password. Please try again.",
        duration: 4000,
      });
    },
  });

  const handleTransfer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (transferType === "internal") {
      transferMutation.mutate({
        fromAccountId: selectedAccountId,
        toAccountNumber: formData.get("toAccountNumber"),
        amount: formData.get("amount"),
        description: formData.get("description"),
        transferType: "internal"
      });
    } else if (transferType === "domestic_wire") {
      transferMutation.mutate({
        fromAccountId: selectedAccountId,
        amount: formData.get("amount"),
        beneficiaryName: formData.get("beneficiaryName"),
        beneficiaryAccount: formData.get("beneficiaryAccount"),
        beneficiaryBank: formData.get("beneficiaryBank"),
        routingNumber: formData.get("routingNumber"),
        beneficiaryAddress: formData.get("beneficiaryAddress"),
        description: formData.get("description"),
        transferType: "domestic_wire"
      });
    } else if (transferType === "international_wire") {
      transferMutation.mutate({
        fromAccountId: selectedAccountId,
        amount: formData.get("amount"),
        beneficiaryName: formData.get("beneficiaryName"),
        beneficiaryAccount: formData.get("beneficiaryAccount"),
        beneficiaryBank: formData.get("beneficiaryBank"),
        swiftCode: formData.get("swiftCode"),
        beneficiaryAddress: formData.get("beneficiaryAddress"),
        description: formData.get("description"),
        transferType: "international_wire"
      });
    }
  };

  const user = userData?.user;
  const account = user?.accounts?.[0];

  const formatCurrency = (amount: string | number) => {
    return parseFloat(amount.toString()).toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  };

  const formatBusinessName = (name: string | undefined) => {
    if (!name) return "";
    return name.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const getShortBusinessName = (name: string | undefined) => {
    if (!name) return "";
    if (name.includes("M. Lowry")) return "M. Lowry";
    const words = name.split(' ');
    return words.length > 2 ? words.slice(0, 2).join(' ') : name;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/40 to-indigo-50/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-200/20 rounded-full blur-3xl -mr-64 -mt-64"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-200/20 rounded-full blur-3xl -ml-48 -mb-48"></div>
      <div className="relative z-10">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link href="/dashboard">
                <img src={truistLogo} alt="Truist Bank" className="h-10 cursor-pointer" />
              </Link>
              <nav className="hidden md:flex gap-6">
                <Link href="/dashboard" className="text-purple-600 font-semibold border-b-2 border-purple-600 pb-4 pt-4">Accounts</Link>
                <Link href="/transfer" className="text-gray-600 hover:text-purple-600 transition-colors pb-4 pt-4">Transfer</Link>
                <Link href="/pay-bills" className="text-gray-600 hover:text-purple-600 transition-colors pb-4 pt-4">Pay Bills</Link>
                <Link href="/services" className="text-gray-600 hover:text-purple-600 transition-colors pb-4 pt-4">Services</Link>
              </nav>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-600 hover:text-purple-600"
                onClick={() => setIsNotificationOpen(true)}
                data-testid="button-notifications"
              >
                <Bell className="h-5 w-5" />
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
                <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setIsAvatarDialogOpen(true)} data-testid="profile-avatar">
                  <div className="bg-purple-100 p-1 rounded-full flex items-center justify-center w-10 h-10 overflow-hidden">
                    <img 
                      src={avatarOptions.find(a => a.id === (user?.avatar || "teddy"))?.image || avatarTeddy} 
                      alt="User avatar"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-900 block">{user?.nickname || user?.fullName}</span>
                    {user?.nickname && <span className="text-xs text-gray-500">{user?.fullName}</span>}
                  </div>
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
        {isBlocked && (
          <Alert className="mb-6 bg-red-50 border-red-200" data-testid="alert-blocked">
            <Lock className="h-5 w-5 text-red-600" />
            <AlertDescription className="text-red-800 font-medium text-base">
              <strong className="block mb-1">Account Access Blocked</strong>
              Your account has been temporarily blocked by the administrator. You cannot perform any transactions or access account features at this time. 
              Please contact Truist Bank support at <span className="font-semibold">1-800-TRUIST-1</span> for assistance.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {getGreeting()}, {getShortBusinessName(account?.businessName)}
          </h1>
          <p className="text-gray-600 text-lg">Account Overview</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-12 mb-8">
          <Card className="lg:col-span-8 border-0 shadow-lg bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-700 text-white overflow-hidden relative">
            {/* Dot pattern overlay */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}></div>
            
            {/* Diagonal stripe pattern */}
            <div className="absolute inset-0 opacity-5" style={{
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, white 10px, white 11px)'
            }}></div>
            
            {/* Large decorative circles */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -mr-40 -mt-40"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mb-32"></div>
            
            {/* Medium decorative elements */}
            <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-indigo-400/10 rounded-full"></div>
            <div className="absolute bottom-1/3 right-1/3 w-24 h-24 bg-purple-400/10 rounded-full"></div>
            
            {/* Geometric shapes */}
            <div className="absolute top-8 right-8 w-16 h-16 border-2 border-white/10 rounded-lg rotate-12"></div>
            <div className="absolute bottom-12 left-12 w-20 h-20 border-2 border-white/10 rounded-full"></div>
            
            {/* Wave pattern at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-24 opacity-10">
              <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full">
                <path d="M0,0 C150,100 350,0 600,50 C850,100 1050,0 1200,50 L1200,120 L0,120 Z" fill="white"/>
              </svg>
            </div>
            
            <CardHeader className="pb-4 relative z-10">
              <div className="flex justify-between items-start">
                <div>
                  <CardDescription className="text-purple-100 text-xs uppercase tracking-wide mb-1">Business Checking</CardDescription>
                  <CardTitle className="text-white text-xl mb-1">{formatBusinessName(account?.businessName)}</CardTitle>
                  <p className="text-purple-200 text-sm">Account #{account?.accountNumber}</p>
                </div>
                <CreditCard className="h-10 w-10 text-purple-300" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="mt-2">
                <p className="text-purple-100 text-sm mb-2">Available Balance</p>
                <p className="text-5xl font-bold tracking-tight mb-6">
                  ${account?.balance ? formatCurrency(account.balance) : "0.00"}
                </p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-purple-400/30">
                <div className="flex gap-6">
                  <div>
                    <p className="text-purple-200 text-xs mb-1">Account Type</p>
                    <p className="font-semibold capitalize">{account?.accountType || "Business"}</p>
                  </div>
                  <div>
                    <p className="text-purple-200 text-xs mb-1">Status</p>
                    <Badge variant="secondary" className="bg-green-500/90 text-white border-0 hover:bg-green-500">
                      {account?.status || "Active"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            <Card 
              className="border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer group bg-gradient-to-br from-green-50 to-green-100/50"
              onClick={() => setIsTransferOpen(true)}
              data-testid="card-quick-transfer"
            >
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="bg-green-500 p-3.5 rounded-xl group-hover:scale-110 transition-transform">
                    <Send className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Quick Transfer</p>
                    <p className="font-bold text-gray-900">Send Money</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer group bg-gradient-to-br from-blue-50 to-blue-100/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-500 p-3.5 rounded-xl group-hover:scale-110 transition-transform">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Documents</p>
                    <p className="font-bold text-gray-900">View Statements</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="transactions" className="space-y-6">
          <TabsList className="bg-white border border-gray-200 shadow-sm h-12">
            <TabsTrigger 
              value="transactions" 
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white font-semibold"
            >
              Transaction History
            </TabsTrigger>
            <TabsTrigger 
              value="cards" 
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white font-semibold"
            >
              My Cards
            </TabsTrigger>
            <TabsTrigger 
              value="details" 
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white font-semibold"
            >
              Account Details
            </TabsTrigger>
          </TabsList>

          <TabsContent value="transactions">
            <Card className="border-0 shadow-lg">
              <CardHeader className="border-b border-gray-100 bg-white">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl">Recent Transactions</CardTitle>
                    <CardDescription className="mt-1">Your latest account activity</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2 border-purple-300 text-purple-600 hover:bg-purple-50">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {transactionsData?.transactions?.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50/80">
                          <TableHead className="font-bold">Date</TableHead>
                          <TableHead className="font-bold">Description</TableHead>
                          <TableHead className="font-bold">Type</TableHead>
                          <TableHead className="text-right font-bold">Amount</TableHead>
                          <TableHead className="text-right font-bold">Balance</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactionsData.transactions.map((transaction: any) => (
                          <Fragment key={transaction.id}>
                            <TableRow 
                              className="hover:bg-purple-50/50 transition-colors cursor-pointer"
                              onClick={() => setExpandedTransaction(expandedTransaction === transaction.id ? null : transaction.id)}
                            >
                              <TableCell className="text-gray-900">
                                {new Date(transaction.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                })}
                                <div className="text-xs text-gray-500">
                                  {new Date(transaction.createdAt).toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  {transaction.type === "credit" ? (
                                    <div className="bg-green-100 p-2 rounded-lg">
                                      <ArrowDownRight className="h-4 w-4 text-green-600" />
                                    </div>
                                  ) : (
                                    <div className="bg-red-100 p-2 rounded-lg">
                                      <ArrowUpRight className="h-4 w-4 text-red-600" />
                                    </div>
                                  )}
                                  <div>
                                    <div className="font-semibold text-gray-900">{transaction.description || "N/A"}</div>
                                    {transaction.transferMethod && (
                                      <div className="flex items-center gap-1 mt-1">
                                        {transaction.transferMethod === "international_wire" && <Globe className="h-3 w-3 text-gray-500" />}
                                        {transaction.transferMethod === "domestic_wire" && <Building2 className="h-3 w-3 text-gray-500" />}
                                        <span className="text-xs text-gray-500 capitalize">{transaction.transferMethod.replace('_', ' ')}</span>
                                        {(transaction.transferMethod === "domestic_wire" || transaction.transferMethod === "international_wire") && (
                                          <ChevronDown className={`h-3 w-3 text-gray-500 transition-transform ${expandedTransaction === transaction.id ? 'rotate-180' : ''}`} />
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge 
                                  variant={transaction.type === "credit" ? "default" : "secondary"} 
                                  className={transaction.type === "credit" ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-gray-100 text-gray-700 hover:bg-gray-100"}
                                >
                                  {transaction.type === "credit" ? "Credit" : "Debit"}
                                </Badge>
                              </TableCell>
                              <TableCell className={`text-right font-bold text-base ${transaction.type === "credit" ? "text-green-600" : "text-red-600"}`}>
                                {transaction.type === "credit" ? "+" : "-"}${formatCurrency(transaction.amount)}
                              </TableCell>
                              <TableCell className="text-right font-semibold text-gray-900">
                                ${formatCurrency(transaction.balanceAfter)}
                              </TableCell>
                            </TableRow>
                            {expandedTransaction === transaction.id && (transaction.transferMethod === "domestic_wire" || transaction.transferMethod === "international_wire") && (
                              <TableRow>
                                <TableCell colSpan={5} className="bg-gray-50/80 border-t-0">
                                  <div className="py-4 px-6 space-y-3">
                                    <h4 className="font-bold text-gray-900 mb-3">Transfer Details</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                      {transaction.beneficiaryName && (
                                        <div>
                                          <span className="text-xs text-gray-600 font-medium">Beneficiary Name</span>
                                          <p className="text-sm font-semibold text-gray-900">{transaction.beneficiaryName}</p>
                                        </div>
                                      )}
                                      {transaction.beneficiaryAccount && (
                                        <div>
                                          <span className="text-xs text-gray-600 font-medium">Beneficiary Account</span>
                                          <p className="text-sm font-mono font-semibold text-gray-900">{transaction.beneficiaryAccount}</p>
                                        </div>
                                      )}
                                      {transaction.beneficiaryBank && (
                                        <div>
                                          <span className="text-xs text-gray-600 font-medium">Beneficiary Bank</span>
                                          <p className="text-sm font-semibold text-gray-900">{transaction.beneficiaryBank}</p>
                                        </div>
                                      )}
                                      {transaction.routingNumber && (
                                        <div>
                                          <span className="text-xs text-gray-600 font-medium">Routing Number</span>
                                          <p className="text-sm font-mono font-semibold text-gray-900">{transaction.routingNumber}</p>
                                        </div>
                                      )}
                                      {transaction.swiftCode && (
                                        <div>
                                          <span className="text-xs text-gray-600 font-medium">SWIFT/BIC Code</span>
                                          <p className="text-sm font-mono font-semibold text-gray-900">{transaction.swiftCode}</p>
                                        </div>
                                      )}
                                      {transaction.beneficiaryAddress && (
                                        <div>
                                          <span className="text-xs text-gray-600 font-medium">Beneficiary Address</span>
                                          <p className="text-sm font-semibold text-gray-900">{transaction.beneficiaryAddress}</p>
                                        </div>
                                      )}
                                      {transaction.referenceNumber && (
                                        <div>
                                          <span className="text-xs text-gray-600 font-medium">Reference Number</span>
                                          <p className="text-sm font-mono font-semibold text-purple-600">{transaction.referenceNumber}</p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )}
                          </Fragment>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-16 text-gray-500">
                    <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                      <FileText className="h-10 w-10 text-gray-400" />
                    </div>
                    <p className="font-semibold text-lg text-gray-700">No transactions yet</p>
                    <p className="text-sm mt-2">Your transaction history will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cards">
            <div className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-purple-50 to-white">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-xl">My Bank Cards</CardTitle>
                      <CardDescription className="mt-1">Debit and Credit Cards linked to your account</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-8 pb-8">
                  <div className="grid gap-8 md:grid-cols-2">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="bg-purple-100 p-2 rounded-lg">
                          <CreditCard className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">Business Debit Card</h3>
                          <p className="text-sm text-gray-600">Direct access to your checking account</p>
                        </div>
                      </div>
                      <BankCard
                        type="debit"
                        cardholderName={user?.fullName || ""}
                        businessName={formatBusinessName(account?.businessName)}
                        cardNumber={account?.debitCardNumber || ""}
                        cardType={account?.debitCardType || "Visa"}
                        expiryDate={account?.debitCardExpiry || "12/28"}
                        cvv={account?.debitCardCvv || "***"}
                        onClick={() => setEnlargedCard("debit")}
                      />
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <p className="text-xs text-gray-600 mb-1">Daily Limit</p>
                          <p className="text-lg font-bold text-gray-900" data-testid="text-debit-daily-limit">
                            ${formatCurrency(account?.debitCardLimit || "50000")}
                          </p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <p className="text-xs text-gray-600 mb-1">Card Status</p>
                          <Badge className={account?.debitCardLocked ? "bg-red-500 text-white" : "bg-green-500 text-white"}>
                            {account?.debitCardLocked ? "Locked" : "Active"}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="bg-slate-100 p-2 rounded-lg">
                          <CreditCard className="h-5 w-5 text-slate-700" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">Business Credit Card</h3>
                          <p className="text-sm text-gray-600">Platinum rewards card</p>
                        </div>
                      </div>
                      <BankCard
                        type="credit"
                        cardholderName={user?.fullName || ""}
                        businessName={formatBusinessName(account?.businessName)}
                        cardNumber={account?.creditCardNumber || ""}
                        cardType={account?.creditCardType || "Mastercard"}
                        expiryDate={account?.creditCardExpiry || "09/27"}
                        cvv={account?.creditCardCvv || "***"}
                        onClick={() => setEnlargedCard("credit")}
                      />
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <p className="text-xs text-gray-600 mb-1">Credit Limit</p>
                          <p className="text-lg font-bold text-gray-900" data-testid="text-credit-limit">
                            ${formatCurrency(account?.creditCardLimit || "250000")}
                          </p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <p className="text-xs text-gray-600 mb-1">Available Credit</p>
                          <p className="text-lg font-bold text-green-600">
                            ${formatCurrency(account?.creditCardLimit || "250000")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h4 className="font-bold text-gray-900 mb-6">Card Management</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-3">
                          {account?.debitCardLocked ? <Lock className="h-5 w-5 text-red-600" /> : <Unlock className="h-5 w-5 text-green-600" />}
                          <div>
                            <p className="font-semibold text-gray-900">Debit Card Lock</p>
                            <p className="text-sm text-gray-600">{account?.debitCardLocked ? "Card is locked" : "Card is unlocked"}</p>
                          </div>
                        </div>
                        <Switch 
                          checked={account?.debitCardLocked || false}
                          onCheckedChange={(checked) => {
                            if (account?.id) {
                              cardLockMutation.mutate({ accountId: account.id, cardType: "debit", locked: checked });
                            }
                          }}
                          data-testid="switch-lock-debit"
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-3">
                          {account?.creditCardLocked ? <Lock className="h-5 w-5 text-red-600" /> : <Unlock className="h-5 w-5 text-green-600" />}
                          <div>
                            <p className="font-semibold text-gray-900">Credit Card Lock</p>
                            <p className="text-sm text-gray-600">{account?.creditCardLocked ? "Card is locked" : "Card is unlocked"}</p>
                          </div>
                        </div>
                        <Switch 
                          checked={account?.creditCardLocked || false}
                          onCheckedChange={(checked) => {
                            if (account?.id) {
                              cardLockMutation.mutate({ accountId: account.id, cardType: "credit", locked: checked });
                            }
                          }}
                          data-testid="switch-lock-credit"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <Button 
                          variant="outline" 
                          className="w-full hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300"
                          data-testid="button-report-lost"
                          onClick={() => {
                            toast({
                              title: "📞 Report Lost or Stolen Card",
                              description: "Please call 1-800-TRUIST (1-800-878-4789) immediately to report your card.",
                              duration: 5000,
                            });
                          }}
                        >
                          Report Lost
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300"
                          data-testid="button-set-pin"
                          onClick={() => setIsPinDialogOpen(true)}
                        >
                          Set PIN
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300"
                          data-testid="button-view-card-transactions"
                          onClick={() => {
                            const transactionsTab = document.querySelector('[value="transactions"]') as HTMLElement;
                            if (transactionsTab) transactionsTab.click();
                          }}
                        >
                          View Transactions
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="details">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-0 shadow-lg">
                <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-purple-50 to-white">
                  <CardTitle className="text-xl">Account Information</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-5">
                  <div className="flex justify-between py-4 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Business Name</span>
                    <span className="font-bold text-gray-900">{formatBusinessName(account?.businessName)}</span>
                  </div>
                  <div className="flex justify-between py-4 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Account Type</span>
                    <span className="font-bold text-gray-900 capitalize">{account?.accountType}</span>
                  </div>
                  <div className="flex justify-between py-4 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Account Number</span>
                    <span className="font-mono font-bold text-gray-900">{account?.accountNumber}</span>
                  </div>
                  <div className="flex justify-between py-4 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Routing Number</span>
                    <span className="font-mono font-bold text-gray-900">{account?.routingNumber || "061000104"}</span>
                  </div>
                  <div className="flex justify-between py-4">
                    <span className="text-gray-600 font-medium">Status</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-700 font-semibold">{account?.status || "Active"}</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
                  <CardTitle className="text-xl">Account Holder</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-5">
                  <div className="flex justify-between py-4 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Full Name</span>
                    <span className="font-bold text-gray-900">{user?.fullName}</span>
                  </div>
                  {user?.email && (
                    <div className="flex justify-between py-4 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">Email</span>
                      <span className="font-bold text-gray-900">{user.email}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-4 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Username</span>
                    <span className="font-bold text-gray-900">{user?.username}</span>
                  </div>
                  {user?.dateJoined && (
                    <div className="flex justify-between py-4" data-testid="text-date-joined">
                      <span className="text-gray-600 font-medium">Date Joined</span>
                      <span className="font-bold text-gray-900">{format(new Date(user.dateJoined), "MMMM d, yyyy")}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={isTransferOpen} onOpenChange={setIsTransferOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Transfer Money</DialogTitle>
            <DialogDescription>
              Choose your transfer method and complete the form
            </DialogDescription>
          </DialogHeader>

          <Tabs value={transferType} onValueChange={(v) => setTransferType(v as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="internal">Internal Transfer</TabsTrigger>
              <TabsTrigger value="domestic_wire">Domestic Wire</TabsTrigger>
              <TabsTrigger value="international_wire">International Wire</TabsTrigger>
            </TabsList>

            <form onSubmit={handleTransfer} className="mt-6">
              <div className="space-y-4">
                <div className="space-y-2 pb-4 border-b">
                  <Label>From Account</Label>
                  <p className="text-lg font-semibold text-purple-600">
                    {formatBusinessName(account?.businessName)}
                  </p>
                  <p className="text-sm text-gray-600">
                    Account #{account?.accountNumber}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${account?.balance ? formatCurrency(account.balance) : "0.00"}
                  </p>
                </div>

                <TabsContent value="internal" className="space-y-4 mt-0">
                  <div className="space-y-2">
                    <Label htmlFor="toAccountNumber">Recipient Account Number</Label>
                    <Input 
                      id="toAccountNumber" 
                      name="toAccountNumber" 
                      placeholder="Enter Truist account number" 
                      required={transferType === "internal"}
                      data-testid="input-recipient-account"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input 
                      id="amount" 
                      name="amount" 
                      type="number" 
                      step="0.01" 
                      placeholder="0.00" 
                      required 
                      data-testid="input-transfer-amount"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (optional)</Label>
                    <Input 
                      id="description" 
                      name="description" 
                      placeholder="What's this for?" 
                      data-testid="input-transfer-description"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="domestic_wire" className="space-y-4 mt-0">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="beneficiaryName">Beneficiary Name</Label>
                      <Input 
                        id="beneficiaryName" 
                        name="beneficiaryName" 
                        placeholder="Full name" 
                        required={transferType === "domestic_wire"}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="beneficiaryAccount">Beneficiary Account Number</Label>
                      <Input 
                        id="beneficiaryAccount" 
                        name="beneficiaryAccount" 
                        placeholder="Account number" 
                        required={transferType === "domestic_wire"}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="routingNumber">Routing Number</Label>
                      <Input 
                        id="routingNumber" 
                        name="routingNumber" 
                        placeholder="9-digit routing number" 
                        maxLength={9}
                        required={transferType === "domestic_wire"}
                      />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="beneficiaryBank">Beneficiary Bank</Label>
                      <Input 
                        id="beneficiaryBank" 
                        name="beneficiaryBank" 
                        placeholder="Bank name" 
                        required={transferType === "domestic_wire"}
                      />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="beneficiaryAddress">Beneficiary Address</Label>
                      <Input 
                        id="beneficiaryAddress" 
                        name="beneficiaryAddress" 
                        placeholder="Full address" 
                        required={transferType === "domestic_wire"}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="wireAmount">Amount</Label>
                      <Input 
                        id="wireAmount" 
                        name="amount" 
                        type="number" 
                        step="0.01" 
                        placeholder="0.00" 
                        required={transferType === "domestic_wire"}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="wireDescription">Description (optional)</Label>
                      <Input 
                        id="wireDescription" 
                        name="description" 
                        placeholder="Purpose of transfer" 
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="international_wire" className="space-y-4 mt-0">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="intlBeneficiaryName">Beneficiary Name</Label>
                      <Input 
                        id="intlBeneficiaryName" 
                        name="beneficiaryName" 
                        placeholder="Full name" 
                        required={transferType === "international_wire"}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="intlBeneficiaryAccount">Beneficiary Account/IBAN</Label>
                      <Input 
                        id="intlBeneficiaryAccount" 
                        name="beneficiaryAccount" 
                        placeholder="IBAN or account number" 
                        required={transferType === "international_wire"}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="swiftCode">SWIFT/BIC Code</Label>
                      <Input 
                        id="swiftCode" 
                        name="swiftCode" 
                        placeholder="8 or 11 characters" 
                        required={transferType === "international_wire"}
                      />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="intlBeneficiaryBank">Beneficiary Bank</Label>
                      <Input 
                        id="intlBeneficiaryBank" 
                        name="beneficiaryBank" 
                        placeholder="Bank name and branch" 
                        required={transferType === "international_wire"}
                      />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="intlBeneficiaryAddress">Beneficiary Address</Label>
                      <Input 
                        id="intlBeneficiaryAddress" 
                        name="beneficiaryAddress" 
                        placeholder="Full address with country" 
                        required={transferType === "international_wire"}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="intlAmount">Amount (USD)</Label>
                      <Input 
                        id="intlAmount" 
                        name="amount" 
                        type="number" 
                        step="0.01" 
                        placeholder="0.00" 
                        required={transferType === "international_wire"}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="intlDescription">Description (optional)</Label>
                      <Input 
                        id="intlDescription" 
                        name="description" 
                        placeholder="Purpose of transfer" 
                      />
                    </div>
                  </div>
                </TabsContent>

                {transferMutation.error && (
                  <Alert variant="destructive">
                    <AlertDescription>{transferMutation.error.message}</AlertDescription>
                  </Alert>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-green-600 hover:bg-green-700" 
                  disabled={transferMutation.isPending}
                  data-testid="button-send-transfer"
                >
                  {transferMutation.isPending ? "Processing..." : 
                   transferType === "internal" ? "Send Transfer" : 
                   `Send ${transferType === "domestic_wire" ? "Domestic" : "International"} Wire`}
                </Button>
              </div>
            </form>
          </Tabs>
        </DialogContent>
      </Dialog>

      <Dialog open={isNotificationOpen} onOpenChange={setIsNotificationOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-purple-600" />
              Notifications
            </DialogTitle>
            <DialogDescription>
              Stay updated with your account activity
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-purple-50 border border-purple-100">
              <div className="bg-purple-600 p-2 rounded-full">
                <ArrowUpRight className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">Wire Transfer Received</p>
                <p className="text-xs text-gray-600 mt-1">$50,000 deposited to your account</p>
                <p className="text-xs text-gray-400 mt-1">Oct 2, 2025</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
              <div className="bg-gray-400 p-2 rounded-full">
                <ArrowDownRight className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">Payment Processed</p>
                <p className="text-xs text-gray-600 mt-1">$12,500 payment to vendors completed</p>
                <p className="text-xs text-gray-400 mt-1">Oct 3, 2025</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
              <div className="bg-green-500 p-2 rounded-full">
                <FileText className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">Statement Available</p>
                <p className="text-xs text-gray-600 mt-1">Your monthly statement is ready to view</p>
                <p className="text-xs text-gray-400 mt-1">Oct 1, 2025</p>
              </div>
            </div>
          </div>
          <Button onClick={() => setIsNotificationOpen(false)} className="mt-4">Close</Button>
        </DialogContent>
      </Dialog>

      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-purple-600" />
              Account Settings
            </DialogTitle>
            <DialogDescription>
              Manage your profile and security preferences
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-base font-semibold">Profile Information</Label>
              <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-purple-100 p-1 rounded-full flex items-center justify-center w-14 h-14 overflow-hidden">
                    <img 
                      src={avatarOptions.find(a => a.id === (user?.avatar || "teddy"))?.image || avatarTeddy} 
                      alt="User avatar"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{user?.fullName}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{user?.email}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setIsAvatarDialogOpen(true)} data-testid="button-change-avatar">
                    Change Avatar
                  </Button>
                </div>
                <div className="space-y-2 pt-3 border-t border-gray-200">
                  <Label htmlFor="nickname-input" className="text-sm">Display Name / Nickname (Optional)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="nickname-input"
                      placeholder={user?.fullName || "Enter nickname"}
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      className="flex-1"
                      data-testid="input-nickname"
                    />
                    <Button
                      onClick={() => {
                        updateNicknameMutation.mutate(nickname);
                      }}
                      disabled={updateNicknameMutation.isPending}
                      size="sm"
                      className="bg-purple-600 hover:bg-purple-700"
                      data-testid="button-save-nickname"
                    >
                      {updateNicknameMutation.isPending ? "Saving..." : "Save"}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">This will be displayed instead of your full name</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">Security & Password</Label>
              <div className="p-4 rounded-lg bg-purple-50 border border-purple-200 space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="current-password" className="text-sm">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    data-testid="input-current-password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password" className="text-sm">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    data-testid="input-new-password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-sm">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    data-testid="input-confirm-password"
                  />
                </div>
                <Button
                  onClick={() => {
                    if (newPassword !== confirmPassword) {
                      toast({
                        title: "❌ Passwords Don't Match",
                        description: "Please make sure your new passwords match.",
                        duration: 3000,
                      });
                      return;
                    }
                    changePasswordMutation.mutate({ currentPassword, newPassword });
                  }}
                  disabled={!currentPassword || !newPassword || !confirmPassword || changePasswordMutation.isPending}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  data-testid="button-change-password"
                >
                  {changePasswordMutation.isPending ? "Changing Password..." : "Change Password"}
                </Button>
                <p className="text-xs text-gray-600">Password must be at least 6 characters</p>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">Notifications & Alerts</Label>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200">
                  <div className="flex-1">
                    <p className="text-sm font-medium">Email Notifications</p>
                    <p className="text-xs text-gray-600">Receive transaction alerts via email</p>
                  </div>
                  <Switch checked={true} />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200">
                  <div className="flex-1">
                    <p className="text-sm font-medium">SMS Alerts</p>
                    <p className="text-xs text-gray-600">Get text alerts for large transactions</p>
                  </div>
                  <Switch checked={true} />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200">
                  <div className="flex-1">
                    <p className="text-sm font-medium">Push Notifications</p>
                    <p className="text-xs text-gray-600">Mobile app notifications</p>
                  </div>
                  <Switch checked={false} />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">Security Preferences</Label>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200">
                  <div className="flex-1">
                    <p className="text-sm font-medium">Two-Factor Authentication</p>
                    <p className="text-xs text-gray-600">Extra security for your account</p>
                  </div>
                  <Badge variant="secondary" className="bg-green-500 text-white">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200">
                  <div className="flex-1">
                    <p className="text-sm font-medium">Biometric Login</p>
                    <p className="text-xs text-gray-600">Use fingerprint or Face ID</p>
                  </div>
                  <Switch checked={true} />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200">
                  <div className="flex-1">
                    <p className="text-sm font-medium">Session Timeout</p>
                    <p className="text-xs text-gray-600">Auto logout after 30 minutes</p>
                  </div>
                  <Switch checked={true} />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">Privacy & Data</Label>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-between" data-testid="button-download-data">
                  <span>Download Account Data</span>
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="w-full justify-between text-left">
                  <span>Manage Linked Accounts</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <Button onClick={() => setIsSettingsOpen(false)} className="mt-4" data-testid="button-close-settings">Close</Button>
        </DialogContent>
      </Dialog>

      <Dialog open={enlargedCard !== null} onOpenChange={() => setEnlargedCard(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-purple-600" />
              {enlargedCard === "debit" ? "Business Debit Card" : "Business Credit Card"}
            </DialogTitle>
            <DialogDescription>
              Card details and limits
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="transform scale-110">
                <BankCard
                  type={enlargedCard || "debit"}
                  cardholderName={user?.fullName || ""}
                  businessName={formatBusinessName(account?.businessName)}
                  cardNumber={enlargedCard === "debit" ? (account?.debitCardNumber || "") : (account?.creditCardNumber || "")}
                  cardType={enlargedCard === "debit" ? (account?.debitCardType || "Visa") : (account?.creditCardType || "Mastercard")}
                  expiryDate={enlargedCard === "debit" ? (account?.debitCardExpiry || "12/28") : (account?.creditCardExpiry || "09/27")}
                  cvv={enlargedCard === "debit" ? (account?.debitCardCvv || "***") : (account?.creditCardCvv || "***")}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 mb-2">{enlargedCard === "debit" ? "Daily Limit" : "Credit Limit"}</p>
                <p className="text-2xl font-bold text-gray-900" data-testid={`text-${enlargedCard}-limit`}>
                  ${enlargedCard === "debit" 
                    ? formatCurrency(account?.debitCardLimit || "50000") 
                    : formatCurrency(account?.creditCardLimit || "250000")}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 mb-2">{enlargedCard === "debit" ? "Card Status" : "Available Credit"}</p>
                <p className="text-2xl font-bold text-green-600">
                  {enlargedCard === "debit" 
                    ? (account?.debitCardLocked ? "Locked" : "Active") 
                    : `$${formatCurrency(account?.creditCardLimit || "250000")}`}
                </p>
              </div>
            </div>
            
            <div className="p-4 bg-gradient-to-br from-purple-50 to-white rounded-lg border border-purple-200">
              <Label className="font-semibold text-gray-900 mb-2 block">
                Increase {enlargedCard === "debit" ? "Daily" : "Credit"} Limit
              </Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Enter new limit"
                  step="1000"
                  min={enlargedCard === "debit" ? "50000" : "250000"}
                  className="flex-1"
                  data-testid={`input-${enlargedCard}-limit`}
                  id={`new-${enlargedCard}-limit`}
                />
                <Button
                  onClick={() => {
                    const input = document.getElementById(`new-${enlargedCard}-limit`) as HTMLInputElement;
                    const newLimit = input?.value;
                    if (newLimit && account?.id && enlargedCard) {
                      updateLimitMutation.mutate({
                        accountId: account.id,
                        cardType: enlargedCard,
                        newLimit,
                      });
                      input.value = "";
                    }
                  }}
                  disabled={updateLimitMutation.isPending}
                  data-testid={`button-update-${enlargedCard}-limit`}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {updateLimitMutation.isPending ? "Updating..." : "Update"}
                </Button>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Current limit: ${enlargedCard === "debit" 
                  ? formatCurrency(account?.debitCardLimit || "50000") 
                  : formatCurrency(account?.creditCardLimit || "250000")}
              </p>
            </div>

            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center gap-3">
                {(enlargedCard === "debit" ? account?.debitCardLocked : account?.creditCardLocked) ? (
                  <Lock className="h-6 w-6 text-red-600" />
                ) : (
                  <Unlock className="h-6 w-6 text-green-600" />
                )}
                <div>
                  <p className="font-semibold text-gray-900">Card Lock Status</p>
                  <p className="text-sm text-gray-600">
                    {(enlargedCard === "debit" ? account?.debitCardLocked : account?.creditCardLocked) 
                      ? "Card is currently locked for purchases" 
                      : "Card is unlocked and ready for purchases"}
                  </p>
                </div>
              </div>
              <Switch 
                checked={(enlargedCard === "debit" ? account?.debitCardLocked : account?.creditCardLocked) || false}
                onCheckedChange={(checked) => {
                  if (account?.id && enlargedCard) {
                    cardLockMutation.mutate({ accountId: account.id, cardType: enlargedCard, locked: checked });
                  }
                }}
                data-testid={`switch-lock-${enlargedCard}-enlarged`}
              />
            </div>
          </div>
          <Button onClick={() => setEnlargedCard(null)} className="mt-4" data-testid="button-close-card-dialog">Close</Button>
        </DialogContent>
      </Dialog>

      <Dialog open={isAvatarDialogOpen} onOpenChange={setIsAvatarDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              👤 Choose Your Avatar
            </DialogTitle>
            <DialogDescription>
              Select an avatar to personalize your profile
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-4 gap-3 py-4">
            {avatarOptions.map((avatar) => (
              <button
                key={avatar.id}
                onClick={() => {
                  setSelectedAvatar(avatar.id);
                  updateAvatarMutation.mutate(avatar.id);
                }}
                className={`
                  flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all hover:scale-105
                  ${(user?.avatar || "teddy") === avatar.id 
                    ? "border-purple-600 bg-purple-50" 
                    : "border-gray-200 hover:border-purple-300 bg-white"}
                `}
                data-testid={`avatar-option-${avatar.id}`}
              >
                <div className="w-16 h-16 mb-2 rounded-full overflow-hidden bg-purple-50">
                  <img 
                    src={avatar.image} 
                    alt={avatar.label}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xs text-gray-600 font-medium">{avatar.label}</span>
              </button>
            ))}
          </div>
          <Button onClick={() => setIsAvatarDialogOpen(false)} className="mt-2" data-testid="button-close-avatar">Close</Button>
        </DialogContent>
      </Dialog>

      <Dialog open={isPinDialogOpen} onOpenChange={setIsPinDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              🔢 Set Card PIN
            </DialogTitle>
            <DialogDescription>
              Create a 4-digit PIN for your card
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pin-input">Enter 4-Digit PIN</Label>
              <Input
                id="pin-input"
                type="password"
                maxLength={4}
                placeholder="Enter PIN"
                value={pin}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setPin(value);
                }}
                className="text-center text-2xl tracking-widest"
                data-testid="input-pin"
              />
              <p className="text-xs text-gray-500">Enter a 4-digit PIN to secure your card</p>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsPinDialogOpen(false);
                setPin("");
              }}
              className="flex-1"
              data-testid="button-cancel-pin"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (pin.length === 4) {
                  setPinMutation.mutate(pin);
                }
              }}
              disabled={pin.length !== 4 || setPinMutation.isPending}
              className="flex-1 bg-purple-600 hover:bg-purple-700"
              data-testid="button-submit-pin"
            >
              {setPinMutation.isPending ? "Setting..." : "Set PIN"}
            </Button>
          </div>
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

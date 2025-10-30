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
import { queryClient } from "@/lib/queryClient";
import truistLogo from "@/../../attached_assets/stock_images/truist_bank_logo_pur_b67575c5.jpg";
import { ArrowUpRight, ArrowDownRight, CreditCard, Download, FileText, LogOut, User, Settings, Bell, Send, ChevronDown, Globe, Building2 } from "lucide-react";

export default function UserDashboard() {
  const [, setLocation] = useLocation();
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [transferType, setTransferType] = useState<"internal" | "domestic_wire" | "international_wire">("internal");
  const [expandedTransaction, setExpandedTransaction] = useState<number | null>(null);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const { data: userData } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const response = await fetch("/api/me", { credentials: "include" });
      if (!response.ok) {
        if (response.status === 403 || response.status === 401) {
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
    refetchInterval: 3000,
    retry: (failureCount, error: any) => {
      if (error.message === "Not authenticated") {
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
    enabled: !!selectedAccountId,
    refetchInterval: 3000,
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
                <div className="flex items-center gap-2">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <User className="h-4 w-4 text-purple-600" />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{user?.fullName}</span>
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Overview</h1>
          <p className="text-gray-600 text-lg">{formatBusinessName(account?.businessName)}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-12 mb-8">
          <Card className="lg:col-span-8 border-0 shadow-lg bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-700 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
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
                  <div className="flex justify-between py-4">
                    <span className="text-gray-600 font-medium">Username</span>
                    <span className="font-bold text-gray-900">{user?.username}</span>
                  </div>
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-purple-600" />
              Account Settings
            </DialogTitle>
            <DialogDescription>
              Manage your account preferences
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Profile Information</Label>
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                <p className="text-sm font-semibold text-gray-900">{user?.fullName}</p>
                <p className="text-xs text-gray-600 mt-1">{user?.email}</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Security</Label>
              <Button variant="outline" className="w-full justify-start">
                Change Password
              </Button>
            </div>
            <div className="space-y-2">
              <Label>Preferences</Label>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200">
                  <span className="text-sm">Email Notifications</span>
                  <Badge variant="secondary" className="bg-green-500 text-white">On</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200">
                  <span className="text-sm">Two-Factor Authentication</span>
                  <Badge variant="secondary" className="bg-green-500 text-white">Enabled</Badge>
                </div>
              </div>
            </div>
          </div>
          <Button onClick={() => setIsSettingsOpen(false)} className="mt-4">Close</Button>
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

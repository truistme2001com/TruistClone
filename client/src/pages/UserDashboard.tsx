import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import truistLogo from "@/../../attached_assets/stock_images/truist_bank_logo_pur_b67575c5.jpg";
import { ArrowUpRight, ArrowDownRight, CreditCard, Download, FileText, LogOut, User, Settings, Bell } from "lucide-react";

export default function UserDashboard() {
  const [, setLocation] = useLocation();
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);

  const { data: userData } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const response = await fetch("/api/me", { credentials: "include" });
      if (!response.ok) {
        setLocation("/");
        throw new Error("Not authenticated");
      }
      const data = await response.json();
      if (data.user.accounts && data.user.accounts.length > 0) {
        setSelectedAccountId(data.user.accounts[0].id);
      }
      return data;
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
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await fetch("/api/logout", { method: "POST", credentials: "include" });
    },
    onSuccess: () => {
      setLocation("/");
    },
  });

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
              <img src={truistLogo} alt="Truist Bank" className="h-10" />
              <nav className="hidden md:flex gap-6">
                <a href="#" className="text-purple-600 font-semibold border-b-2 border-purple-600 pb-4 pt-4">Accounts</a>
                <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors pb-4 pt-4">Transfer</a>
                <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors pb-4 pt-4">Pay Bills</a>
                <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors pb-4 pt-4">Services</a>
              </nav>
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
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer group bg-gradient-to-br from-green-50 to-green-100/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="bg-green-500 p-3.5 rounded-xl group-hover:scale-110 transition-transform">
                    <ArrowUpRight className="h-6 w-6 text-white" />
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
                          <TableRow key={transaction.id} className="hover:bg-purple-50/50 transition-colors">
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
                                <span className="font-semibold text-gray-900">{transaction.description || "N/A"}</span>
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

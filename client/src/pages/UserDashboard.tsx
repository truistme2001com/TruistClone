import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import truistLogo from "@/../../attached_assets/stock_images/truist_bank_logo_pur_b67575c5.jpg";
import { ArrowUpRight, ArrowDownRight, CreditCard, TrendingUp, Download, FileText } from "lucide-react";

export default function UserDashboard() {
  const [, setLocation] = useLocation();
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);

  const { data: userData } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const response = await fetch("/api/me", { credentials: "include" });
      if (!response.ok) {
        setLocation("/login");
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
      setLocation("/login");
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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <img src={truistLogo} alt="Truist Bank" className="h-8" />
              <nav className="hidden md:flex gap-6">
                <a href="#" className="text-purple-600 font-medium border-b-2 border-purple-600 pb-4 pt-4">Accounts</a>
                <a href="#" className="text-gray-600 hover:text-gray-900 pb-4 pt-4">Transfer</a>
                <a href="#" className="text-gray-600 hover:text-gray-900 pb-4 pt-4">Pay Bills</a>
                <a href="#" className="text-gray-600 hover:text-gray-900 pb-4 pt-4">Services</a>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-700 hidden sm:block">
                Welcome, <span className="font-semibold">{user?.fullName}</span>
              </span>
              <Button 
                variant="outline" 
                size="sm"
                className="border-gray-300 hover:bg-gray-50"
                onClick={() => logoutMutation.mutate()}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Account Overview</h1>
          <p className="text-gray-600 mt-1">{account?.businessName}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="border-0 shadow-md bg-gradient-to-br from-purple-600 to-purple-700 text-white col-span-2">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardDescription className="text-purple-100 text-sm">Business Checking</CardDescription>
                  <CardTitle className="text-white mt-1">{account?.businessName}</CardTitle>
                </div>
                <CreditCard className="h-8 w-8 text-purple-200" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="mt-4">
                <p className="text-purple-100 text-sm mb-2">Available Balance</p>
                <p className="text-5xl font-bold tracking-tight">
                  ${account?.balance ? formatCurrency(account.balance) : "0.00"}
                </p>
              </div>
              <div className="mt-6 flex gap-4 text-sm">
                <div>
                  <p className="text-purple-100">Account Number</p>
                  <p className="font-mono mt-1">****{account?.accountNumber?.slice(-4)}</p>
                </div>
                <div className="ml-auto">
                  <Badge variant="secondary" className="bg-purple-500/30 text-white border-0">
                    {account?.status || "Active"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <ArrowUpRight className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Transfer Money</p>
                    <p className="font-semibold text-gray-900">Send or Receive</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Statements</p>
                    <p className="font-semibold text-gray-900">View & Download</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="transactions" className="space-y-6">
          <TabsList className="bg-white border border-gray-200">
            <TabsTrigger value="transactions" className="data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700">
              Transaction History
            </TabsTrigger>
            <TabsTrigger value="details" className="data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700">
              Account Details
            </TabsTrigger>
          </TabsList>

          <TabsContent value="transactions">
            <Card className="border-0 shadow-md">
              <CardHeader className="border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription className="mt-1">Your latest account activity</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
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
                        <TableRow className="bg-gray-50">
                          <TableHead className="font-semibold">Date</TableHead>
                          <TableHead className="font-semibold">Description</TableHead>
                          <TableHead className="font-semibold">Type</TableHead>
                          <TableHead className="text-right font-semibold">Amount</TableHead>
                          <TableHead className="text-right font-semibold">Balance</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactionsData.transactions.map((transaction: any) => (
                          <TableRow key={transaction.id} className="hover:bg-gray-50">
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
                              <div className="flex items-center gap-2">
                                {transaction.type === "credit" ? (
                                  <div className="bg-green-100 p-1.5 rounded">
                                    <ArrowDownRight className="h-4 w-4 text-green-600" />
                                  </div>
                                ) : (
                                  <div className="bg-red-100 p-1.5 rounded">
                                    <ArrowUpRight className="h-4 w-4 text-red-600" />
                                  </div>
                                )}
                                <span className="font-medium text-gray-900">{transaction.description || "N/A"}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={transaction.type === "credit" ? "default" : "secondary"} className={transaction.type === "credit" ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-gray-100 text-gray-700 hover:bg-gray-100"}>
                                {transaction.type === "credit" ? "Credit" : "Debit"}
                              </Badge>
                            </TableCell>
                            <TableCell className={`text-right font-semibold ${transaction.type === "credit" ? "text-green-600" : "text-red-600"}`}>
                              {transaction.type === "credit" ? "+" : "-"}${formatCurrency(transaction.amount)}
                            </TableCell>
                            <TableCell className="text-right font-medium text-gray-900">
                              ${formatCurrency(transaction.balanceAfter)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <p className="font-medium">No transactions yet</p>
                    <p className="text-sm mt-1">Your transaction history will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-0 shadow-md">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle>Account Information</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">Business Name</span>
                    <span className="font-semibold text-gray-900">{account?.businessName}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">Account Type</span>
                    <span className="font-semibold text-gray-900 capitalize">{account?.accountType}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">Account Number</span>
                    <span className="font-mono text-sm font-semibold text-gray-900">{account?.accountNumber}</span>
                  </div>
                  <div className="flex justify-between py-3">
                    <span className="text-gray-600">Status</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">{account?.status || "Active"}</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle>Account Holder</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">Full Name</span>
                    <span className="font-semibold text-gray-900">{user?.fullName}</span>
                  </div>
                  {user?.email && (
                    <div className="flex justify-between py-3 border-b border-gray-100">
                      <span className="text-gray-600">Email</span>
                      <span className="font-semibold text-gray-900">{user.email}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-3">
                    <span className="text-gray-600">Username</span>
                    <span className="font-semibold text-gray-900">{user?.username}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">
            <p>© 2025 Truist Financial Corporation. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-purple-600">Privacy Policy</a>
              <a href="#" className="hover:text-purple-600">Terms of Service</a>
              <a href="#" className="hover:text-purple-600">Contact Us</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

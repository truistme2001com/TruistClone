import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Welcome, {user?.fullName}</h1>
              <p className="text-blue-100 mt-1">{account?.businessName}</p>
            </div>
            <Button variant="outline" className="bg-white text-blue-600 hover:bg-blue-50" onClick={() => logoutMutation.mutate()}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Account Balance</CardTitle>
              <CardDescription>Business Account #{account?.accountNumber}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-green-600">
                  ${account?.balance ? parseFloat(account.balance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00"}
                </span>
                <Badge variant="secondary" className="text-sm">
                  {account?.status || "Active"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Account Type</p>
                <p className="font-medium capitalize">{account?.accountType || "Business"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Account Number</p>
                <p className="font-mono text-sm">{account?.accountNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Username</p>
                <p className="font-medium">{user?.username}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="transactions" className="space-y-6">
          <TabsList>
            <TabsTrigger value="transactions">Transaction History</TabsTrigger>
            <TabsTrigger value="overview">Account Overview</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your latest account activity</CardDescription>
              </CardHeader>
              <CardContent>
                {transactionsData?.transactions?.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Balance After</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactionsData.transactions.map((transaction: any) => (
                        <TableRow key={transaction.id}>
                          <TableCell>
                            {new Date(transaction.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </TableCell>
                          <TableCell>
                            <Badge variant={transaction.type === "credit" ? "default" : "secondary"}>
                              {transaction.type === "credit" ? "Credit" : "Debit"}
                            </Badge>
                          </TableCell>
                          <TableCell>{transaction.description || "N/A"}</TableCell>
                          <TableCell className={`text-right font-semibold ${transaction.type === "credit" ? "text-green-600" : "text-red-600"}`}>
                            {transaction.type === "credit" ? "+" : "-"}${parseFloat(transaction.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            ${parseFloat(transaction.balanceAfter).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No transactions yet
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="overview">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Account Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Business Name:</span>
                    <span className="font-semibold">{account?.businessName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Account Status:</span>
                    <Badge variant="secondary">{account?.status || "Active"}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Account Type:</span>
                    <span className="font-semibold capitalize">{account?.accountType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Transactions:</span>
                    <span className="font-semibold">{transactionsData?.transactions?.length || 0}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">{user?.fullName}</p>
                  </div>
                  {user?.email && (
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-500">Username</p>
                    <p className="font-medium">{user?.username}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

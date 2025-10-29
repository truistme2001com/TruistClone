import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation, Link } from "wouter";
import { queryClient } from "@/lib/queryClient";
import truistLogo from "@/../../attached_assets/stock_images/truist_bank_logo_pur_b67575c5.jpg";
import { ArrowLeft, Send, Globe, Building2, LogOut, User, Settings, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

export default function Transfer() {
  const [, setLocation] = useLocation();
  const [transferType, setTransferType] = useState<"internal" | "domestic_wire" | "international_wire">("internal");
  const { toast } = useToast();

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
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast({
        title: "Transfer Successful",
        description: data.referenceNumber 
          ? `Transfer completed. Reference: ${data.referenceNumber}`
          : "Your transfer has been processed successfully.",
      });
      setTransferType("internal");
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Transfer Failed",
        description: error.message || "An error occurred during the transfer",
      });
    },
  });

  const handleTransfer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const account = userData?.user?.accounts?.[0];
    
    if (!account) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No account found",
      });
      return;
    }

    if (transferType === "internal") {
      transferMutation.mutate({
        fromAccountId: account.id,
        toAccountNumber: formData.get("toAccountNumber"),
        amount: formData.get("amount"),
        description: formData.get("description"),
        transferType: "internal"
      });
    } else if (transferType === "domestic_wire") {
      transferMutation.mutate({
        fromAccountId: account.id,
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
        fromAccountId: account.id,
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
    
    e.currentTarget.reset();
  };

  const user = userData?.user;
  const account = user?.accounts?.[0];

  const formatCurrency = (amount: string | number) => {
    return parseFloat(amount.toString()).toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
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
                  <Link href="/dashboard" className="text-gray-600 hover:text-purple-600 transition-colors pb-4 pt-4">
                    Accounts
                  </Link>
                  <Link href="/transfer" className="text-purple-600 font-semibold border-b-2 border-purple-600 pb-4 pt-4">
                    Transfer
                  </Link>
                  <Link href="/pay-bills" className="text-gray-600 hover:text-purple-600 transition-colors pb-4 pt-4">
                    Pay Bills
                  </Link>
                  <Link href="/services" className="text-gray-600 hover:text-purple-600 transition-colors pb-4 pt-4">
                    Services
                  </Link>
                </nav>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="text-gray-600 hover:text-purple-600" data-testid="button-notifications">
                  <Bell className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-600 hover:text-purple-600" data-testid="button-settings">
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
                  data-testid="button-signout"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Link href="/dashboard">
              <Button variant="ghost" className="gap-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 -ml-2" data-testid="button-back">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>

          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Transfer Money</h1>
            <p className="text-gray-600">Send money to other accounts</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 mb-6">
            <Card className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white border-0 shadow-lg">
              <CardContent className="pt-6">
                <p className="text-purple-100 text-sm mb-1">Available Balance</p>
                <p className="text-2xl font-bold">${account?.balance ? formatCurrency(account.balance) : "0.00"}</p>
                <p className="text-purple-200 text-xs mt-2">Account #{account?.accountNumber}</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Transfer Options</CardTitle>
              <CardDescription>Choose your transfer method</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={transferType} onValueChange={(value: any) => setTransferType(value)}>
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="internal" data-testid="tab-internal-transfer">
                    <Send className="h-4 w-4 mr-2" />
                    Internal Transfer
                  </TabsTrigger>
                  <TabsTrigger value="domestic_wire" data-testid="tab-domestic-wire">
                    <Building2 className="h-4 w-4 mr-2" />
                    Domestic Wire
                  </TabsTrigger>
                  <TabsTrigger value="international_wire" data-testid="tab-international-wire">
                    <Globe className="h-4 w-4 mr-2" />
                    International Wire
                  </TabsTrigger>
                </TabsList>

                <form onSubmit={handleTransfer}>
                  <TabsContent value="internal" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="toAccountNumber">Recipient Account Number</Label>
                      <Input
                        id="toAccountNumber"
                        name="toAccountNumber"
                        placeholder="Enter account number"
                        required
                        data-testid="input-recipient-account"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount (USD)</Label>
                      <Input
                        id="amount"
                        name="amount"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        required
                        data-testid="input-amount"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description (Optional)</Label>
                      <Input
                        id="description"
                        name="description"
                        placeholder="What's this for?"
                        data-testid="input-description"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-purple-600 hover:bg-purple-700"
                      disabled={transferMutation.isPending}
                      data-testid="button-submit-transfer"
                    >
                      {transferMutation.isPending ? "Processing..." : "Send Money"}
                    </Button>
                  </TabsContent>

                  <TabsContent value="domestic_wire" className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="beneficiaryName">Beneficiary Name</Label>
                        <Input
                          id="beneficiaryName"
                          name="beneficiaryName"
                          placeholder="Full name"
                          required
                          data-testid="input-beneficiary-name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="beneficiaryAccount">Beneficiary Account Number</Label>
                        <Input
                          id="beneficiaryAccount"
                          name="beneficiaryAccount"
                          placeholder="Account number"
                          required
                          data-testid="input-beneficiary-account"
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="beneficiaryBank">Beneficiary Bank</Label>
                        <Input
                          id="beneficiaryBank"
                          name="beneficiaryBank"
                          placeholder="Bank name"
                          required
                          data-testid="input-beneficiary-bank"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="routingNumber">Routing Number</Label>
                        <Input
                          id="routingNumber"
                          name="routingNumber"
                          placeholder="9-digit routing number"
                          maxLength={9}
                          required
                          data-testid="input-routing-number"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="beneficiaryAddress">Beneficiary Address</Label>
                      <Textarea
                        id="beneficiaryAddress"
                        name="beneficiaryAddress"
                        placeholder="Full address"
                        required
                        data-testid="input-beneficiary-address"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount (USD)</Label>
                      <Input
                        id="amount"
                        name="amount"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        required
                        data-testid="input-wire-amount"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description (Optional)</Label>
                      <Input
                        id="description"
                        name="description"
                        placeholder="Purpose of transfer"
                        data-testid="input-wire-description"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-purple-600 hover:bg-purple-700"
                      disabled={transferMutation.isPending}
                      data-testid="button-submit-domestic-wire"
                    >
                      {transferMutation.isPending ? "Processing..." : "Send Domestic Wire"}
                    </Button>
                  </TabsContent>

                  <TabsContent value="international_wire" className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="beneficiaryName">Beneficiary Name</Label>
                        <Input
                          id="beneficiaryName"
                          name="beneficiaryName"
                          placeholder="Full name"
                          required
                          data-testid="input-intl-beneficiary-name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="beneficiaryAccount">Beneficiary Account/IBAN</Label>
                        <Input
                          id="beneficiaryAccount"
                          name="beneficiaryAccount"
                          placeholder="Account number or IBAN"
                          required
                          data-testid="input-intl-beneficiary-account"
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="beneficiaryBank">Beneficiary Bank</Label>
                        <Input
                          id="beneficiaryBank"
                          name="beneficiaryBank"
                          placeholder="Bank name"
                          required
                          data-testid="input-intl-beneficiary-bank"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="swiftCode">SWIFT/BIC Code</Label>
                        <Input
                          id="swiftCode"
                          name="swiftCode"
                          placeholder="8 or 11 characters"
                          required
                          data-testid="input-swift-code"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="beneficiaryAddress">Beneficiary Address</Label>
                      <Textarea
                        id="beneficiaryAddress"
                        name="beneficiaryAddress"
                        placeholder="Full address"
                        required
                        data-testid="input-intl-beneficiary-address"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount (USD)</Label>
                      <Input
                        id="amount"
                        name="amount"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        required
                        data-testid="input-intl-amount"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description (Optional)</Label>
                      <Input
                        id="description"
                        name="description"
                        placeholder="Purpose of transfer"
                        data-testid="input-intl-description"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-purple-600 hover:bg-purple-700"
                      disabled={transferMutation.isPending}
                      data-testid="button-submit-international-wire"
                    >
                      {transferMutation.isPending ? "Processing..." : "Send International Wire"}
                    </Button>
                  </TabsContent>
                </form>
              </Tabs>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}

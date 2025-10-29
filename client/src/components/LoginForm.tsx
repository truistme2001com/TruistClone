import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { loginSchema, type LoginRequest, type LoginResponse } from "@shared/schema";

export function LoginForm() {
  const { toast } = useToast();
  
  const form = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      userId: "",
      password: "",
      saveUserId: false,
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginRequest) => {
      return apiRequest<LoginResponse>("POST", "/api/login", data);
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: data.message,
      });
      form.reset({ ...form.getValues(), password: "" });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Login failed. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LoginRequest) => {
    loginMutation.mutate(data);
  };

  return (
    <Card className="w-full shadow-lg" data-testid="card-login">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-xl font-bold text-foreground">Sign in</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">User ID</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter User ID"
                      data-testid="input-user-id"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="saveUserId"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      data-testid="checkbox-save-user-id"
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal cursor-pointer">
                    Save user ID
                  </FormLabel>
                </FormItem>
              )}
            />

            <a 
              href="#" 
              className="text-sm text-primary hover:underline block"
              data-testid="link-forgot-user-id"
            >
              Forgot user ID?
            </a>

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter Password"
                      data-testid="input-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <a 
              href="#" 
              className="text-sm text-primary hover:underline block"
              data-testid="link-reset-password"
            >
              Reset password
            </a>

            <Button 
              type="submit" 
              className="w-full"
              disabled={loginMutation.isPending}
              data-testid="button-sign-in"
            >
              {loginMutation.isPending ? "Signing in..." : "Sign in"}
            </Button>

            <div className="pt-4 space-y-3 text-sm">
              <p className="font-semibold text-foreground">Need a user ID?</p>
              <a 
                href="#" 
                className="text-primary hover:underline block"
                data-testid="link-setup-online-banking"
              >
                Set up online banking
              </a>
              <a 
                href="#" 
                className="text-primary hover:underline block"
                data-testid="link-online-security"
              >
                Online security measures
              </a>
              <a 
                href="#" 
                className="text-primary hover:underline block"
                data-testid="link-sign-in-another"
              >
                Sign in to another account
              </a>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

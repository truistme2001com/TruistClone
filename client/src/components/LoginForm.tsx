import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { loginSchema } from "@shared/schema";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

type LoginFormData = {
  username: string;
  password: string;
};

export function LoginForm() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Login failed");
      }

      return response.json();
    },
    onSuccess: (data) => {
      if (data.user.isAdmin) {
        setLocation("/admin");
      } else {
        setLocation("/dashboard");
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Login failed. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="w-full bg-gradient-to-br from-purple-700 via-purple-600 to-purple-800 p-8 rounded-2xl shadow-2xl backdrop-blur-sm border border-purple-400/20" data-testid="card-login">
      <div className="mb-6">
        <div className="bg-white px-4 py-2 rounded mb-4 inline-block">
          <svg className="h-8" viewBox="0 0 140 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Truist T+ Icon */}
            <g>
              <rect x="0" y="4" width="24" height="24" rx="3" fill="#5D2A8F"/>
              <path d="M6 10 L18 10" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M12 10 L12 22" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="19" cy="19" r="1.8" fill="white"/>
            </g>
            
            {/* TRUIST Text */}
            <text x="30" y="21" style={{
              fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
              fontSize: '18px',
              fontWeight: '700',
              fill: '#2D1B4E',
              letterSpacing: '0.3px'
            }}>TRUIST</text>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Sign In</h2>
        <p className="text-purple-100">Access your account securely</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white text-sm font-medium">Username</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter your username"
                    className="bg-white/95 border-white text-gray-900 placeholder:text-gray-400 h-11 focus:ring-2 focus:ring-purple-300"
                    data-testid="input-user-id"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-200" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white text-sm font-medium">Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="bg-white/95 border-white text-gray-900 placeholder:text-gray-400 pr-10 h-11 focus:ring-2 focus:ring-purple-300"
                      data-testid="input-password"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="text-red-200" />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full bg-white hover:bg-gray-50 text-purple-700 border-0 h-12 text-base font-semibold shadow-lg"
            disabled={loginMutation.isPending}
            data-testid="button-sign-in"
          >
            {loginMutation.isPending ? "Signing in..." : "Sign In"}
          </Button>

          <div className="pt-4 space-y-3 text-sm text-center">
            <a 
              href="#" 
              className="text-purple-100 hover:text-white hover:underline block font-medium"
              data-testid="link-reset-password"
            >
              Forgot your password? Reset it here
            </a>
            
            <div className="pt-2 border-t border-purple-400/30">
              <p className="text-purple-100 font-normal">New to Truist? <a href="#" className="text-white hover:underline font-medium" data-testid="link-setup-online-banking">Create an account</a></p>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}

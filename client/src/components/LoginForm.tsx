import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { loginSchema, type LoginRequest, type LoginResponse } from "@shared/schema";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export function LoginForm() {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  
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
      const res = await apiRequest("POST", "/api/login", data);
      return await res.json() as LoginResponse;
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
    <div className="w-full bg-[#2E1A47] p-8 rounded-lg shadow-xl" data-testid="card-login">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="userId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white text-sm font-normal">User ID</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder=""
                    className="bg-white border-white text-gray-900 placeholder:text-gray-400"
                    data-testid="input-user-id"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-300" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="saveUserId"
            render={({ field }) => (
              <FormItem className="flex items-start space-x-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="border-white data-[state=checked]:bg-white data-[state=checked]:text-[#2E1A47] mt-0.5"
                    data-testid="checkbox-save-user-id"
                  />
                </FormControl>
                <div className="flex items-center justify-between w-full">
                  <FormLabel className="text-white text-sm font-normal cursor-pointer">
                    Save user ID
                  </FormLabel>
                  <a 
                    href="#" 
                    className="text-sm text-[#B8A9D4] hover:text-white hover:underline"
                    data-testid="link-forgot-user-id"
                  >
                    Forgot user ID?
                  </a>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white text-sm font-normal">Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder=""
                      className="bg-white border-white text-gray-900 placeholder:text-gray-400 pr-10"
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
                <FormMessage className="text-red-300" />
              </FormItem>
            )}
          />

          <a 
            href="#" 
            className="text-sm text-[#B8A9D4] hover:text-white hover:underline block"
            data-testid="link-reset-password"
          >
            Reset password
          </a>

          <Button 
            type="submit" 
            className="w-full bg-[#A896C8] hover:bg-[#9785B7] text-white border-0 h-12 text-base font-medium"
            disabled={loginMutation.isPending}
            data-testid="button-sign-in"
          >
            {loginMutation.isPending ? "Signing in..." : "Sign in"}
          </Button>

          <div className="pt-2 space-y-3 text-sm">
            <p className="text-white font-normal">Need a user ID? <a href="#" className="text-[#B8A9D4] hover:text-white hover:underline" data-testid="link-setup-online-banking">Set up online banking</a></p>
            
            <a 
              href="#" 
              className="text-[#B8A9D4] hover:text-white hover:underline block"
              data-testid="link-online-security"
            >
              Online security measures
            </a>
            <a 
              href="#" 
              className="text-[#B8A9D4] hover:text-white hover:underline flex items-center gap-1"
              data-testid="link-sign-in-another"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V5h2v4z"/>
              </svg>
              Sign in to another account →
            </a>
          </div>
        </form>
      </Form>
    </div>
  );
}

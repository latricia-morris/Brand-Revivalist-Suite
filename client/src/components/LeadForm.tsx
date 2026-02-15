import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCreateLead } from "@/hooks/use-leads";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  email: z.string().email("Invalid email address"),
});

interface LeadFormProps {
  onSuccess: (data: z.infer<typeof formSchema>) => void;
  archetypeData: {
    primary: string;
    primaryScore: number;
    secondary: string;
    secondaryScore: number;
    answers: Record<string, string>;
  };
}

export function LeadForm({ onSuccess, archetypeData }: LeadFormProps) {
  const { toast } = useToast();
  const { mutate, isPending } = useCreateLead();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      email: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(
      {
        ...values,
        primaryArchetype: archetypeData.primary,
        primaryScore: archetypeData.primaryScore,
        secondaryArchetype: archetypeData.secondary,
        secondaryScore: archetypeData.secondaryScore,
        answers: archetypeData.answers,
      },
      {
        onSuccess: () => {
          if (typeof window !== 'undefined' && (window as any).fbq) {
            (window as any).fbq('track', 'Lead');
          }
          toast({ title: "Success!", description: "Your results are ready." });
          onSuccess(values);
        },
        onError: () => {
          toast({ variant: "destructive", title: "Error", description: "Failed to submit. Please try again." });
        },
      }
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 glass-card rounded-[7px] animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-serif text-[#0f0f1a] mb-4">Almost There...</h3>
        <div className="rounded-[7px] overflow-hidden mb-6 shadow-sm border border-gray-100 max-h-48">
          <img 
            src="https://media.tenor.com/2K1lW_q6gYsAAAAC/mission-accomplished.gif" 
            alt="Mission Accomplished" 
            className="w-full h-full object-cover"
          />
        </div>
        <p className="text-sm text-muted-foreground mb-6">Enter your details to reveal your archetype.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-xs font-bold uppercase tracking-widest text-[#660000]">First Name</FormLabel>
                <FormControl>
                  <Input placeholder="Jane" className="h-10 text-sm" {...field} />
                </FormControl>
                <FormMessage className="text-[10px]" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-xs font-bold uppercase tracking-widest text-[#660000]">Email</FormLabel>
                <FormControl>
                  <Input placeholder="jane@example.com" className="h-10 text-sm" {...field} />
                </FormControl>
                <FormMessage className="text-[10px]" />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full h-10 text-sm font-bold uppercase tracking-widest mt-2" disabled={isPending}>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Reveal Results"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

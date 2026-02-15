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
          // Track Lead event
          if (typeof window !== 'undefined' && (window as any).fbq) {
            (window as any).fbq('track', 'Lead');
          }
          
          toast({
            title: "Success!",
            description: "Your results are ready.",
          });
          onSuccess(values);
        },
        onError: (error) => {
          console.error(error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to submit. Please try again.",
          });
        },
      }
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 glass-card rounded-[7px] animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-serif text-[#f7f5f5] mb-2">
          Mission Accomplished...
        </h3>
        {/* GIF: Mission Accomplished */}
        <div className="rounded-[7px] overflow-hidden mb-4 shadow-lg border border-white/10">
          <img 
            src="https://media.tenor.com/2K1lW_q6gYsAAAAC/mission-accomplished.gif" 
            alt="Mission Accomplished" 
            className="w-full h-auto object-cover"
          />
        </div>
        <p className="text-[#f7f5f5]/80 font-sans">
          Enter your details to reveal your archetype.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#f7f5f5]">First Name</FormLabel>
                <FormControl>
                  <Input placeholder="Jane" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#f7f5f5]">Email</FormLabel>
                <FormControl>
                  <Input placeholder="jane@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button 
            type="submit" 
            className="w-full text-lg h-12" 
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Reveal My Archetype"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}

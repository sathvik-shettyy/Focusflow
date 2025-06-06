import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Zone } from "@shared/schema";

const checkInSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  zoneId: z.number().min(1, "Please select a zone"),
  duration: z.string().min(1, "Please select session duration"),
});

type CheckInForm = z.infer<typeof checkInSchema>;

interface CheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  zones: Zone[];
  selectedZone?: Zone | null;
}

export default function CheckInModal({ isOpen, onClose, zones, selectedZone }: CheckInModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<CheckInForm>({
    resolver: zodResolver(checkInSchema),
    defaultValues: {
      name: "",
      email: "",
      zoneId: selectedZone?.id || 0,
      duration: "",
    },
  });

  // Update form when selectedZone changes
  useState(() => {
    if (selectedZone) {
      form.setValue("zoneId", selectedZone.id);
    }
  });

  const checkInMutation = useMutation({
    mutationFn: async (data: CheckInForm) => {
      const response = await apiRequest("POST", "/api/checkin", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Welcome to Focus Flow!",
        description: "You've successfully checked in. Enjoy your focused work session.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/zones"] });
      queryClient.invalidateQueries({ queryKey: ["/api/presence"] });
      onClose();
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Check-in failed",
        description: error.message || "Failed to check in. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CheckInForm) => {
    checkInMutation.mutate(data);
  };

  const handleClose = () => {
    onClose();
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Join Focus Flow
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field} />
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
                  <FormLabel>Email (Optional)</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="your@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="zoneId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Zone</FormLabel>
                  <Select
                    value={field.value?.toString()}
                    onValueChange={(value) => field.onChange(parseInt(value))}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose your focus zone" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {zones.map((zone) => (
                        <SelectItem key={zone.id} value={zone.id.toString()}>
                          {zone.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Session Duration</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="How long will you focus?" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="25 minutes (Pomodoro)">25 minutes (Pomodoro)</SelectItem>
                      <SelectItem value="50 minutes">50 minutes</SelectItem>
                      <SelectItem value="90 minutes">90 minutes</SelectItem>
                      <SelectItem value="2 hours">2 hours</SelectItem>
                      <SelectItem value="4+ hours">4+ hours</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
                disabled={checkInMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-coffee hover:bg-coffee/90"
                disabled={checkInMutation.isPending}
              >
                {checkInMutation.isPending ? "Starting..." : "Start Session"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

import { useMutation } from "@tanstack/react-query";
import { api, type InsertLead } from "@shared/routes";
import { insertLeadSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export function useCreateLead() {
  return useMutation({
    mutationFn: async (data: InsertLead) => {
      // Validate client-side before sending
      const validated = insertLeadSchema.parse(data);
      const res = await apiRequest(
        api.leads.create.method,
        api.leads.create.path,
        validated
      );
      return api.leads.create.responses[201].parse(await res.json());
    },
  });
}

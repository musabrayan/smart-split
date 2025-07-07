"use client";

import { useRouter } from "next/navigation";
import { ExpenseForm } from "./components/expense-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

export default function NewExpensePage() {
  const router = useRouter();

  return (
    <div className="container px-4 py-6 max-w-full md:max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl md:text-5xl font-bold text-primary leading-tight">
          Add a new expense
        </h1>
        <p className="text-sm md:text-base text-muted-foreground mt-2">
          Record a new expense to split with others
        </p>
      </div>

      {/* Card with Tabs */}
      <Card className="rounded-xl shadow-md border border-border">
        <CardContent className="p-4 md:p-6">
          <Tabs className="w-full" defaultValue="individual">
            <TabsList className="grid grid-cols-2 w-full border border-border rounded-md overflow-hidden bg-muted text-muted-foreground mb-4">
              <TabsTrigger
                value="individual"
                className="text-sm px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Individual Expense
              </TabsTrigger>
              <TabsTrigger
                value="group"
                className="text-sm px-4 py-2 data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
              >
                Group Expense
              </TabsTrigger>
            </TabsList>

            <TabsContent value="individual">
              <ExpenseForm
                type="individual"
                onSuccess={(id) => router.push(`/person/${id}`)}
              />
            </TabsContent>

            <TabsContent value="group">
              <ExpenseForm
                type="group"
                onSuccess={(id) => router.push(`/groups/${id}`)}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

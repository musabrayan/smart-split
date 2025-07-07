"use client";
import { useRouter } from "next/navigation";
import { ExpenseForm } from "./components/expense-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

export default function NewExpensePage() {
  const router = useRouter();

  return (
    <div className="container px-4 py-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-primary">
          Add a new expense
        </h1>
        <p className="text-muted-foreground mt-2">
          Record a new expense to split with others
        </p>
      </div>

      {/* Card with Tabs */}
      <Card>
        <CardContent className="p-4 md:p-6">
          <Tabs className="w-full" defaultValue="individual">
            <TabsList className="grid grid-cols-2 w-full mb-4">
              <TabsTrigger value="individual">
                Individual Expense
              </TabsTrigger>
              <TabsTrigger value="group">
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
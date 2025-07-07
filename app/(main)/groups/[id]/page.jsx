"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/convex/_generated/api";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { BarLoader } from "react-spinners";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, ArrowLeftRight, ArrowLeft, Users } from "lucide-react";
import { ExpenseList } from "@/components/expense-list";
import { SettlementList } from "@/components/settlement-list";
import { GroupBalances } from "@/components/group-balances";
import { GroupMembers } from "@/components/group-members";

export default function GroupExpensesPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("expenses");

  const { data, isLoading } = useConvexQuery(api.groups.getGroupExpenses, {
    groupId: params.id,
  });

  if (isLoading) {
    return (
      <div className="px-4 py-12">
        <BarLoader width={"100%"} color="#00d883" />
      </div>
    );
  }

  const group = data?.group;
  const members = data?.members || [];
  const expenses = data?.expenses || [];
  const settlements = data?.settlements || [];
  const balances = data?.balances || [];
  const userLookupMap = data?.userLookupMap || {};

  return (
    <div className="px-4 py-6 max-w-5xl mx-auto">
      {/* Back Button */}
      <div className="mb-4">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Group Info + Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-start gap-4">
          <div className="bg-primary/10 p-4 rounded-md">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-primary">{group?.name}</h1>
            <p className="text-muted-foreground">{group?.description}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {members.length} members
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-2">
          <Button asChild variant="outline" className="w-full md:w-auto">
            <Link href={`/settlements/group/${params.id}`}>
              <ArrowLeftRight className="mr-2 h-4 w-4" />
              Settle up
            </Link>
          </Button>
          <Button asChild className="w-full md:w-auto">
            <Link href={`/expenses/new`}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add expense
            </Link>
          </Button>
        </div>
      </div>

      {/* Grid Layout for Balances + Members */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Group Balances</CardTitle>
            </CardHeader>
            <CardContent>
              <GroupBalances balances={balances} />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Members</CardTitle>
            </CardHeader>
            <CardContent>
              <GroupMembers members={members} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs for Expenses and Settlements */}
      <Tabs
        defaultValue="expenses"
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="expenses">Expenses ({expenses.length})</TabsTrigger>
          <TabsTrigger value="settlements">Settlements ({settlements.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="expenses" className="space-y-4">
          <ExpenseList
            expenses={expenses}
            showOtherPerson={true}
            isGroupExpense={true}
            userLookupMap={userLookupMap}
          />
        </TabsContent>

        <TabsContent value="settlements" className="space-y-4">
          <SettlementList
            settlements={settlements}
            isGroupSettlement={true}
            userLookupMap={userLookupMap}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

"use client";

import { useConvexQuery, useConvexMutation } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getCategoryById, getCategoryIcon } from "@/lib/expense-categories";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function ExpenseList({
    expenses,
    showOtherPerson = true,
    isGroupExpense = false,
    otherPersonId = null,
    userLookupMap = {},
}) {
    const { data: currentUser } = useConvexQuery(api.users.getCurrentUser);
    const deleteExpense = useConvexMutation(api.expenses.deleteExpense);

    if (!expenses || !expenses.length) {
        return (
            <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                    No expenses found
                </CardContent>
            </Card>
        );
    }

    const getUserDetails = (userId) => ({
        name:
            userId === currentUser?._id
                ? "You"
                : userLookupMap[userId]?.name || "Other User",
        imageUrl: userLookupMap[userId]?.imageUrl || null,
        id: userId,
    });

    const canDeleteExpense = (expense) => {
        if (!currentUser) return false;
        return (
            expense.createdBy === currentUser._id ||
            expense.paidByUserId === currentUser._id
        );
    };

    const handleDeleteExpense = async (expense) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this expense? This action cannot be undone."
        );
        if (!confirmed) return;

        try {
            await deleteExpense.mutate({ expenseId: expense._id });
            toast.success("Expense deleted successfully");
        } catch (error) {
            toast.error("Failed to delete expense: " + error.message);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            {expenses.map((expense) => {
                const payer = getUserDetails(expense.paidByUserId);
                const isCurrentUserPayer = expense.paidByUserId === currentUser?._id;
                const category = getCategoryById(expense.category);
                const CategoryIcon = getCategoryIcon(category.id);
                const showDeleteOption = canDeleteExpense(expense);

                return (
                    <Card
                        key={expense._id}
                        className="transition-colors hover:bg-muted/40"
                    >
                        <CardContent className="py-4 space-y-3">
                            {/* Top Row: Category + Description */}
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                <div className="flex items-start gap-3">
                                    {/* Icon */}
                                    <div className="bg-primary/10 p-2 rounded-full">
                                        <CategoryIcon className="h-5 w-5 text-primary" />
                                    </div>
                                    {/* Description and meta */}
                                    <div>
                                        <h3 className="font-medium text-base">{expense.description}</h3>
                                        <div className="text-sm text-muted-foreground flex flex-wrap items-center gap-2">
                                            <span>{format(new Date(expense.date), "MMM d, yyyy")}</span>
                                            {showOtherPerson && (
                                                <>
                                                    <span>•</span>
                                                    <span>
                                                        {isCurrentUserPayer ? "You" : payer.name} paid
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Amount and Delete */}
                                <div className="flex items-center justify-between md:justify-end gap-2 md:min-w-[150px]">
                                    <div className="text-right">
                                        <div className="font-medium text-base text-foreground">
                                            ₹{expense.amount.toFixed(2)}
                                        </div>
                                        {isGroupExpense ? (
                                            <Badge variant="outline" className="mt-1">
                                                Group expense
                                            </Badge>
                                        ) : (
                                            <div className="text-sm text-muted-foreground">
                                                {isCurrentUserPayer ? (
                                                    <span className="text-primary">You paid</span>
                                                ) : (
                                                    <span className="text-red-600">{payer.name} paid</span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {showDeleteOption && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 rounded-full text-red-500 hover:text-red-700 hover:bg-red-100"
                                            onClick={() => handleDeleteExpense(expense)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            <span className="sr-only">Delete expense</span>
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Splits */}
                            <div className="flex flex-wrap gap-2">
                                {expense.splits.map((split, idx) => {
                                    const splitUser = getUserDetails(split.userId);
                                    const isCurrentUser = split.userId === currentUser?._id;

                                    const shouldShow =
                                        showOtherPerson ||
                                        (!showOtherPerson &&
                                            (split.userId === currentUser?._id ||
                                                split.userId === otherPersonId));

                                    if (!shouldShow) return null;

                                    return (
                                        <Badge
                                            key={idx}
                                            className={`
    flex items-center gap-1 px-2 py-1 rounded-md text-sm
    ${split.paid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
    ${isCurrentUser ? "ring-2 ring-primary/60" : ""}
  `}
                                        >
                                            <Avatar className="h-4 w-4">
                                                <AvatarImage src={splitUser.imageUrl} />
                                                <AvatarFallback>
                                                    {splitUser.name?.charAt(0) || "?"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span>
                                                {isCurrentUser ? "You" : splitUser.name}: ₹
                                                {split.amount.toFixed(2)}
                                            </span>
                                        </Badge>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}

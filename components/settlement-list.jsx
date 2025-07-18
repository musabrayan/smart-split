"use client";

import { useConvexQuery } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeftRight } from "lucide-react";

export function SettlementList({
  settlements,
  isGroupSettlement = false,
  userLookupMap,
}) {
  const { data: currentUser } = useConvexQuery(api.users.getCurrentUser);

  if (!settlements || settlements.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No settlements found
        </CardContent>
      </Card>
    );
  }

  const getUserDetails = (userId) => {
    return {
      name:
        userId === currentUser?._id
          ? "You"
          : userLookupMap[userId]?.name || "Other User",
      imageUrl: null,
      id: userId,
    };
  };

  return (
    <div className="flex flex-col gap-4">
      {settlements.map((settlement) => {
        const payer = getUserDetails(settlement.paidByUserId);
        const receiver = getUserDetails(settlement.receivedByUserId);
        const isCurrentUserPayer = settlement.paidByUserId === currentUser?._id;
        const isCurrentUserReceiver = settlement.receivedByUserId === currentUser?._id;

        return (
          <Card
            key={settlement._id}
            className="hover:bg-muted/30 transition-colors"
          >
            <CardContent className="py-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                {/* Left - icon + text */}
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <ArrowLeftRight className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium text-sm md:text-base">
                      {isCurrentUserPayer
                        ? `You paid ${receiver.name}`
                        : isCurrentUserReceiver
                        ? `${payer.name} paid you`
                        : `${payer.name} paid ${receiver.name}`}
                    </h3>
                    <div className="flex flex-wrap items-center text-xs md:text-sm text-muted-foreground gap-x-2 gap-y-1">
                      <span>{format(new Date(settlement.date), "MMM d, yyyy")}</span>
                      {settlement.note && (
                        <>
                          <span>•</span>
                          <span>{settlement.note}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right - amount and type */}
                <div className="text-right min-w-[6rem]">
                  <div className="font-semibold text-base">
                    ₹{settlement.amount.toFixed(2)}
                  </div>
                  {isGroupSettlement ? (
                    <Badge variant="outline" className="mt-1">
                      Group settlement
                    </Badge>
                  ) : (
                    <div className="text-sm text-muted-foreground mt-1">
                      {isCurrentUserPayer ? (
                        <span className="text-amber-600">You paid</span>
                      ) : isCurrentUserReceiver ? (
                        <span className="text-green-600">You received</span>
                      ) : (
                        <span>Payment</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

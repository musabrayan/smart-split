"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { api } from "@/convex/_generated/api";
import { useConvexMutation, useConvexQuery } from "@/hooks/use-convex-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

// Form schema validation
const settlementSchema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Amount must be a positive number",
    }),
  note: z.string().optional(),
  paymentType: z.enum(["youPaid", "theyPaid"]),
});

export default function SettlementForm({ entityType, entityData, onSuccess }) {
  const { data: currentUser } = useConvexQuery(api.users.getCurrentUser);
  const createSettlement = useConvexMutation(api.settlements.createSettlement);

  // Set up form with validation
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(settlementSchema),
    defaultValues: {
      amount: "",
      note: "",
      paymentType: "youPaid",
    },
  });

  // Get selected payment direction
  const paymentType = watch("paymentType");

  // Single user settlement
  const handleUserSettlement = async (data) => {
    const amount = parseFloat(data.amount);

    try {
      // Determine payer and receiver based on the selected payment type
      const paidByUserId =
        data.paymentType === "youPaid"
          ? currentUser._id
          : entityData.counterpart.userId;

      const receivedByUserId =
        data.paymentType === "youPaid"
          ? entityData.counterpart.userId
          : currentUser._id;

      await createSettlement.mutate({
        amount,
        note: data.note,
        paidByUserId,
        receivedByUserId,
        // No groupId for user settlements
      });

      toast.success("Settlement recorded successfully!");
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error("Failed to record settlement: " + error.message);
    }
  };

  // Group settlement
  const handleGroupSettlement = async (data, selectedUserId) => {
    if (!selectedUserId) {
      toast.error("Please select a group member to settle with");
      return;
    }

    const amount = parseFloat(data.amount);

    try {
      // Get the selected user from the group balances
      const selectedUser = entityData.balances.find(
        (balance) => balance.userId === selectedUserId
      );

      if (!selectedUser) {
        toast.error("Selected user not found in group");
        return;
      }

      // Determine payer and receiver based on the selected payment type and balances
      const paidByUserId =
        data.paymentType === "youPaid" ? currentUser._id : selectedUser.userId;

      const receivedByUserId =
        data.paymentType === "youPaid" ? selectedUser.userId : currentUser._id;

      await createSettlement.mutate({
        amount,
        note: data.note,
        paidByUserId,
        receivedByUserId,
        groupId: entityData.group.id,
      });

      toast.success("Settlement recorded successfully!");
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error("Failed to record settlement: " + error.message);
    }
  };

  // Handle form submission
  const onSubmit = async (data) => {
    if (entityType === "user") {
      await handleUserSettlement(data);
    } else if (entityType === "group" && selectedGroupMemberId) {
      await handleGroupSettlement(data, selectedGroupMemberId);
    }
  };

  // For group settlements, we need to select a member
  const [selectedGroupMemberId, setSelectedGroupMemberId] = useState(null);

  if (!currentUser) return null;

  // Render the form for individual settlement
  if (entityType === "user") {
    const otherUser = entityData.counterpart;
    const netBalance = entityData.netBalance;

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
        {/* Balance information */}
        <div className="bg-muted p-3 sm:p-4 rounded-lg">
          <h3 className="font-medium mb-2 text-sm sm:text-base">Current balance</h3>
          {netBalance === 0 ? (
            <p className="text-sm sm:text-base">You are all settled up with {otherUser.name}</p>
          ) : netBalance > 0 ? (
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <p className="text-sm sm:text-base">
                <span className="font-medium">{otherUser.name}</span> owes you
              </p>
              <span className="text-lg sm:text-xl font-bold text-primary">
                ₹{netBalance.toFixed(2)}
              </span>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <p className="text-sm sm:text-base">
                You owe <span className="font-medium">{otherUser.name}</span>
              </p>
              <span className="text-lg sm:text-xl font-bold text-red-600">
                ₹{Math.abs(netBalance).toFixed(2)}
              </span>
            </div>
          )}
        </div>

        {/* Payment direction */}
        <div className="space-y-2">
          <Label className="text-sm sm:text-base">Who paid?</Label>
          <RadioGroup
            defaultValue="youPaid"
            {...register("paymentType")}
            className="flex flex-col space-y-3"
            onValueChange={(value) => {
              // This manual approach is needed because RadioGroup doesn't work directly with react-hook-form
              register("paymentType").onChange({
                target: { name: "paymentType", value },
              });
            }}
          >
            <div className="flex items-center space-x-3 border rounded-md p-3 sm:p-4 min-h-[52px]">
              <RadioGroupItem value="youPaid" id="youPaid" />
              <Label htmlFor="youPaid" className="flex-grow cursor-pointer">
                <div className="flex items-center">
                  <Avatar className="h-7 w-7 sm:h-6 sm:w-6 mr-3 sm:mr-2">
                    <AvatarImage src={currentUser?.imageUrl} />
                    <AvatarFallback>
                      {currentUser?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm sm:text-base">You paid {otherUser?.name}</span>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-3 border rounded-md p-3 sm:p-4 min-h-[52px]">
              <RadioGroupItem value="theyPaid" id="theyPaid" />
              <Label htmlFor="theyPaid" className="flex-grow cursor-pointer">
                <div className="flex items-center">
                  <Avatar className="h-7 w-7 sm:h-6 sm:w-6 mr-3 sm:mr-2">
                    <AvatarImage src={otherUser?.imageUrl} />
                    <AvatarFallback>{otherUser?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm sm:text-base">{otherUser?.name} paid you</span>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Amount */}
        <div className="space-y-2">
          <Label htmlFor="amount" className="text-sm sm:text-base">Amount</Label>
          <div className="relative">
            <span className="absolute left-3 top-3 sm:top-2.5 text-base sm:text-sm">₹</span>
            <Input
              id="amount"
              placeholder="0.00"
              type="number"
              step="0.01"
              min="0.01"
              className="pl-7 text-base sm:text-sm h-12 sm:h-10"
              {...register("amount")}
            />
          </div>
          {errors.amount && (
            <p className="text-sm text-red-500">{errors.amount.message}</p>
          )}
        </div>

        {/* Note */}
        <div className="space-y-2">
          <Label htmlFor="note" className="text-sm sm:text-base">Note (optional)</Label>
          <Textarea
            id="note"
            placeholder="Dinner, rent, etc."
            className="text-base sm:text-sm min-h-[80px] sm:min-h-[60px]"
            {...register("note")}
          />
        </div>

        <Button type="submit" className="w-full min-h-[48px] text-base sm:text-sm" disabled={isSubmitting}>
          {isSubmitting ? "Recording..." : "Record settlement"}
        </Button>
      </form>
    );
  }

  // Render form for group settlement
  if (entityType === "group") {
    const groupMembers = entityData.balances;

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
        {/* Select group member */}
        <div className="space-y-2">
          <Label className="text-sm sm:text-base">Who are you settling with?</Label>
          <div className="space-y-3">
            {groupMembers.map((member) => {
              const isSelected = selectedGroupMemberId === member.userId;
              const isOwing = member.netBalance < 0; // negative means they owe you
              const isOwed = member.netBalance > 0; // positive means you owe them

              return (
                <div
                  key={member.userId}
                  className={`border rounded-md p-3 sm:p-4 cursor-pointer transition-colors min-h-[64px] ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "hover:bg-muted/50"
                  }`}
                  onClick={() => setSelectedGroupMemberId(member.userId)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 sm:h-8 sm:w-8">
                        <AvatarImage src={member.imageUrl} />
                        <AvatarFallback>{member?.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm sm:text-base">{member.name}</span>
                    </div>
                    <div
                      className={`font-medium text-xs sm:text-sm text-right ${
                        isOwing
                          ? "text-primary"
                          : isOwed
                            ? "text-red-600"
                            : ""
                      }`}
                    >
                      {isOwing
                        ? `They owe you ₹${Math.abs(member.netBalance).toFixed(2)}`
                        : isOwed
                          ? `You owe ₹${Math.abs(member.netBalance).toFixed(2)}`
                          : "Settled up"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {!selectedGroupMemberId && (
            <p className="text-sm text-amber-600">
              Please select a member to settle with
            </p>
          )}
        </div>

        {selectedGroupMemberId && (
          <>
            {/* Payment direction */}
            <div className="space-y-2">
              <Label className="text-sm sm:text-base">Who paid?</Label>
              <RadioGroup
                defaultValue="youPaid"
                {...register("paymentType")}
                className="flex flex-col space-y-3"
                onValueChange={(value) => {
                  register("paymentType").onChange({
                    target: { name: "paymentType", value },
                  });
                }}
              >
                <div className="flex items-center space-x-3 border rounded-md p-3 sm:p-4 min-h-[52px]">
                  <RadioGroupItem value="youPaid" id="youPaid" />
                  <Label htmlFor="youPaid" className="flex-grow cursor-pointer">
                    <div className="flex items-center">
                      <Avatar className="h-7 w-7 sm:h-6 sm:w-6 mr-3 sm:mr-2">
                        <AvatarImage src={currentUser.imageUrl} />
                        <AvatarFallback>
                          {currentUser?.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm sm:text-base">
                        You paid{" "}
                        {
                          groupMembers.find(
                            (m) => m.userId === selectedGroupMemberId
                          )?.name
                        }
                      </span>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-3 border rounded-md p-3 sm:p-4 min-h-[52px]">
                  <RadioGroupItem value="theyPaid" id="theyPaid" />
                  <Label
                    htmlFor="theyPaid"
                    className="flex-grow cursor-pointer"
                  >
                    <div className="flex items-center">
                      <Avatar className="h-7 w-7 sm:h-6 sm:w-6 mr-3 sm:mr-2">
                        <AvatarImage
                          src={
                            groupMembers.find(
                              (m) => m.userId === selectedGroupMemberId
                            )?.imageUrl
                          }
                        />
                        <AvatarFallback>
                          {groupMembers
                            .find((m) => m.userId === selectedGroupMemberId)
                            ?.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm sm:text-base">
                        {
                          groupMembers.find(
                            (m) => m.userId === selectedGroupMemberId
                          )?.name
                        }{" "}
                        paid you
                      </span>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm sm:text-base">Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-3 sm:top-2.5 text-base sm:text-sm">₹</span>
                <Input
                  id="amount"
                  placeholder="0.00"
                  type="number"
                  step="0.01"
                  min="0.01"
                  className="pl-7 text-base sm:text-sm h-12 sm:h-10"
                  {...register("amount")}
                />
              </div>
              {errors.amount && (
                <p className="text-sm text-red-500">{errors.amount.message}</p>
              )}
            </div>

            {/* Note */}
            <div className="space-y-2">
              <Label htmlFor="note" className="text-sm sm:text-base">Note (optional)</Label>
              <Textarea
                id="note"
                placeholder="Dinner, rent, etc."
                className="text-base sm:text-sm min-h-[80px] sm:min-h-[60px]"
                {...register("note")}
              />
            </div>
          </>
        )}

        <Button
          type="submit"
          className="w-full min-h-[48px] text-base sm:text-sm"
          disabled={isSubmitting || !selectedGroupMemberId}
        >
          {isSubmitting ? "Recording..." : "Record settlement"}
        </Button>
      </form>
    );
  }

  return null;
}
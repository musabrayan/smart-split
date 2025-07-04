import { mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

// Define a query endpoint to fetch all contacts (users and groups) related to the current user
export const getAllContacts = query({
  handler: async (ctx) => {
    // 1️⃣ Get the current logged-in user using an internal query
    const currentUser = await ctx.runQuery(internal.users.getCurrentUser);

    // 2️⃣ Fetch personal expenses paid by the current user where groupId is undefined (i.e., personal)
    const expensesYouPaid = await ctx.db
      .query("expenses")
      .withIndex("by_user_and_group", (q) =>
        q.eq("paidByUserId", currentUser._id).eq("groupId", undefined)
      )
      .collect();

    // 3️⃣ Fetch personal expenses NOT paid by the current user but where they are a participant (split)
    const expensesNotYouPaid = (await ctx.db
      .query("expenses")
      .withIndex("by_group", (q) => q.eq("groupId", undefined))
      .collect()
    ).filter(
      (expense) =>
        expense.paidByUserId !== currentUser._id &&
        expense.splits.some((split) => split.userId === currentUser._id)
    );

    // 4️⃣ Combine both to get all personal expenses related to the current user
    const personalExpenses = [...expensesYouPaid, ...expensesNotYouPaid];

    // 5️⃣ Extract unique contact user IDs from the expenses
    const contactIds = new Set();
    personalExpenses.forEach((expense) => {
      // Add payer if not the current user
      if (expense.paidByUserId !== currentUser._id) {
        contactIds.add(expense.paidByUserId);
      }

      // Add each participant (split) if not the current user
      expense.splits.forEach((split) => {
        if (split.userId !== currentUser._id) {
          contactIds.add(split.userId);
        }
      });
    });

    // 6️⃣ Fetch user objects for each contactId
    const contactUsers = await Promise.all(
      [...contactIds].map(async (id) => {
        const user = await ctx.db.get(id);
        return user
          ? {
              id: user._id,
              name: user.name,
              email: user.email,
              imageUrl: user.imageUrl,
              type: "user",
            }
          : null;
      })
    );

    // 7️⃣ Fetch groups that the current user is a part of
    const userGroups = (await ctx.db.query("groups").collect())
      .filter((group) =>
        group.members.some((member) => member.userId === currentUser._id)
      )
      .map((group) => ({
        id: group._id,
        name: group.name,
        description: group.description,
        memberCount: group.members.length,
        type: "group",
      }));

    // 8️⃣ Sort users and groups alphabetically by name
    contactUsers.sort((a, b) => a?.name.localeCompare(b?.name));
    userGroups.sort((a, b) => a.name.localeCompare(b.name));

    // 9️⃣ Return both users and groups, filtering out any null entries from contacts
    return {
      users: contactUsers.filter(Boolean),
      groups: userGroups,
    };
  },
});

export const createGroup = mutation({
    args:{
        name: v.string(),
        description: v.optional(v.string()),
        members: v.array(v.id("users"))
    },
    headers: async (ctx,args)=>{
        const currentUser = await ctx.runQuery(internal.users.getCurrentUser);

        if(!args.name.trim()) throw new Error("Group name cannot be empty")

        const uniqueMembers = new Set(args.members);
        
        uniqueMembers.add(currentUser._id)

        for (const id of uniqueMembers){
            if(!(await ctx.db.get(id))){
                throw new Error(`User with Id ${id} not found`)
            }
        }

        return await ctx.db.insert("groups", {
            name:args.name.trim(),
            description: args.description?.trim() ?? "",
            createdBy: currentUser._id,
            members:[...uniqueMembers].map((id) => ({
                userId: id,
                role:  id === currentUser._id? "admin" : "member",
                joinedAt: Date.now()
            }))
        })
    }
})
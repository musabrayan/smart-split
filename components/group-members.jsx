"use client";

import { useConvexQuery } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function GroupMembers({ members }) {
  const { data: currentUser } = useConvexQuery(api.users.getCurrentUser);

  if (!members || members.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No members in this group
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {members.map((member) => {
        const isCurrentUser = member?.id === currentUser?._id;
        const isAdmin = member?.role === "admin";

        return (
          <div
            key={member.id}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-2"
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={member?.imageUrl} />
                <AvatarFallback>{member?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium">
                    {isCurrentUser ? "You" : member.name}
                  </span>
                  {isCurrentUser && (
                    <Badge variant="outline" className="text-xs py-0 h-5">
                      You
                    </Badge>
                  )}
                  {isAdmin && (
                    <Badge variant="secondary" className="text-xs py-0 h-5">
                      Admin
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

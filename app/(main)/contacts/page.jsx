"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/convex/_generated/api";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { BarLoader } from "react-spinners";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Users, User } from "lucide-react";
import { CreateGroupModal } from "./components/create-group-modal";

export default function ContactsPage() {
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data, isLoading } = useConvexQuery(api.contacts.getAllContacts);

  // Check for the createGroup parameter when the component mounts
  useEffect(() => {
    const createGroupParam = searchParams.get("createGroup");

    if (createGroupParam === "true") {
      // Open the modal
      setIsCreateGroupModalOpen(true);

      // Remove the parameter from the URL
      const url = new URL(window.location.href);
      url.searchParams.delete("createGroup");

      // Replace the current URL without the parameter
      router.replace(url.pathname + url.search);
    }
  }, [searchParams, router]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-12">
        <BarLoader width={"100%"} color="#36d7b7" />
      </div>
    );
  }

  const { users, groups } = data || { users: [], groups: [] };

  return (
   <div className="container max-w-screen-lg px-4 sm:px-6 py-6 mx-auto">
  {/* Header */}
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
    <h1 className="text-3xl md:text-5xl font-bold text-primary tracking-tight">
      Contacts
    </h1>
    <Button
      onClick={() => setIsCreateGroupModalOpen(true)}
      className="w-full md:w-auto"
    >
      <Plus className="mr-2 h-4 w-4" />
      Create Group
    </Button>
  </div>

  {/* Content Grid */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Users List */}
    <div>
      <h2 className="text-lg md:text-xl font-semibold mb-3 flex items-center gap-2">
        <User className="h-5 w-5" />
        People
      </h2>
      {users.length === 0 ? (
        <Card>
          <CardContent className="py-6 text-center text-muted-foreground text-sm">
            No contacts yet. Add an expense with someone to see them here.
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {users.map((user) => (
            <Link key={user.id} href={`/person/${user.id}`}>
              <Card className="hover:bg-muted/40 transition-colors cursor-pointer">
                <CardContent className="py-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.imageUrl} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="font-medium truncate">{user.name}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>

    {/* Groups List */}
    <div>
      <h2 className="text-lg md:text-xl font-semibold mb-3 flex items-center gap-2">
        <Users className="h-5 w-5" />
        Groups
      </h2>
      {groups.length === 0 ? (
        <Card>
          <CardContent className="py-6 text-center text-muted-foreground text-sm">
            No groups yet. Create a group to start tracking shared expenses.
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {groups.map((group) => (
            <Link key={group.id} href={`/groups/${group.id}`}>
              <Card className="hover:bg-muted/40 transition-colors cursor-pointer">
                <CardContent className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-md">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium truncate">{group.name}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {group.memberCount} members
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  </div>

  {/* Modal */}
  <CreateGroupModal
    isOpen={isCreateGroupModalOpen}
    onClose={() => setIsCreateGroupModalOpen(false)}
    onSuccess={(groupId) => {
      router.push(`/groups/${groupId}`);
    }}
  />
</div>
  );
}
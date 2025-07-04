"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Plus, User, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { BarLoader } from "react-spinners";

const ContactPage = () => {
  const { data, isLoading } = useConvexQuery(api.contacts.getAllContacts);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { users, groups } = data || { users: [], groups: [] };
  console.log(groups);
  

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-3xl md:text-5xl font-bold text-primary">Contacts</h1>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Group
        </Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* People Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <User className="w-5 h-5" /> People
          </h2>

          {users.length === 0 ? (
            <Card>
              <CardContent className="p-4 text-muted-foreground">
                No contacts to show
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col gap-4">
              {users.map((user) => (
                <Link key={user.id} href={`/person/${user.id}`}>
                  <Card>
                    <CardContent className="flex items-center gap-4 p-4">
                      <Avatar className="w-10 h-10">
                        <AvatarImage className="rounded-full" src={user.imageUrl} />
                        <AvatarFallback>{user.name?.[0] || "?"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-base font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Groups Section */}
         <div>
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Groups
          </h2>
          {groups.length === 0 ? (
            <Card>
              <CardContent className="py-6 text-center text-muted-foreground">
                No groups yet. Create a group to start tracking shared expenses.
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col gap-4">
              {groups.map((group) => (
                <Link key={group.id} href={`/groups/${group.id}`}>
                  <Card className="hover:bg-muted/30 transition-colors cursor-pointer">
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 p-2 rounded-md">
                            <Users className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{group.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {group.memberCount} members
                            </p>
                          </div>
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

      {/* Loader */}
      {isLoading && (
        <div className="px-4 md:px-8">
          <BarLoader width="100%" color="#00d883" />
        </div>
      )}
    </div>
  );
};

export default ContactPage;

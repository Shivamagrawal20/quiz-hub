import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getAllUsers } from "@/lib/quizFirestore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ManageUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      try {
        const users = await getAllUsers();
        setUsers(users);
      } catch (err) {
        toast({ title: "Error loading users", description: String(err), variant: "destructive" });
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-secondary/10 to-secondary/5 dark:from-gray-900 dark:to-gray-950">
      <Navbar showInDashboard />
      <main className="flex-grow pt-20 pb-16">
        <div className="container mx-auto px-2 sm:px-4 mt-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <User className="h-8 w-8 text-primary" />
            <h1 className="text-2xl sm:text-3xl font-bold text-primary">Manage Users</h1>
          </div>
          <Card className="p-6 shadow-lg rounded-xl bg-white dark:bg-gray-900">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading users...</div>
            ) : users.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-4">
                <span className="text-lg font-medium">No users found.</span>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-primary/5 transition">
                        <td className="px-6 py-4 whitespace-nowrap font-medium">{user.name || "—"}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{user.email || "—"}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-block px-2 py-1 rounded bg-primary/10 text-primary text-xs font-semibold">
                            {user.role || "user"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center flex gap-2 justify-center">
                          <Button size="icon" variant="ghost" className="hover:bg-blue-100 dark:hover:bg-blue-900" disabled>
                            <Edit2 className="h-4 w-4 text-blue-500" />
                          </Button>
                          <Button size="icon" variant="ghost" className="hover:bg-red-100 dark:hover:bg-red-900" disabled>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ManageUsers; 
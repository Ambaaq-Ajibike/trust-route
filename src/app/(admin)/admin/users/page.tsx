import { CustomerDirectoryClient } from "@/components/users/CustomerDirectoryClient";

export default function AdminUsersPage() {
  return <CustomerDirectoryClient role="super_admin" />;
}

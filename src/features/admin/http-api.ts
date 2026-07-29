import { encryptedApiRequest } from "@/lib/api-client";

export type AdminRoleFilter = "" | "Admin" | "Supervisor";
export type AdminRole = Exclude<AdminRoleFilter, "">;

export type AdminUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  createdOn: string;
};

export type AdminPage = {
  items: AdminUser[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

export type CreateAdminInput = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: AdminRole;
};

export const adminHttpApi = {
  list(pageNumber: number, pageSize: number, role: AdminRoleFilter) {
    return encryptedApiRequest<AdminPage>("/Admins/GetAllAdmins", {
      PageNumber: pageNumber,
      PageSize: pageSize,
      ...(role ? { Role: role } : {}),
    });
  },

  create(input: CreateAdminInput) {
    return encryptedApiRequest<boolean>("/Admins/CreateAdmin", {
      FirstName: input.firstName,
      LastName: input.lastName,
      Email: input.email,
      PhoneNumber: input.phoneNumber,
      Password: input.password,
      Role: input.role,
    });
  },
};
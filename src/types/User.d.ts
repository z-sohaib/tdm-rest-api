declare interface UserAuthI {
  email: string;
  password: string;
}

declare interface UserI extends UserAuthI {
  name: string;
  phone: string;
  role: "admin" | "user";
}

type OptimizedUser = Omit<UserI, "password"> & { _id: string };

interface ResetI {
  email: string;
  user: Types.ObjectId;
  createdAt: Date;
  expiresAt: Date;
}

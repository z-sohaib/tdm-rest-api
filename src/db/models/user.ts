import { Model, Schema, model, Document } from "mongoose";
import bcrypt from "bcrypt";
import { RandomEmail, validateEmail } from "../../utils/Function";
const required = true;

export interface UserI {
  name: string;
  phone: string;
  email: string;
  address?: string[];
  password: string;
  image?: string;
  googleId?: string;
  isVerified?: boolean;
  verificationToken?: string;
  verificationTokenExpiry?: Date;
  resetPasswordToken?: string;
  resetPasswordTokenExpiry?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  role?: "admin" | "user";
}

export interface UserD extends Document<UserI>, UserI {
  comparePasswords(password: string): Promise<boolean>;
  Optimize(): OptimizedUser;
}

export interface UserModel extends Model<UserD> {
  findUser(id: string): Promise<UserI>;
}

const usersSchema = new Schema<UserI>(
  {
    name: { type: String, required },
    phone: { type: String, required },
    email: {
      type: String,
      required,
      validate: [validateEmail, "Please fill a valid email address"],
    },
    address: { type: [String], default: [] },
    password: { type: String, required },
    image: { type: String, default: null },
    googleId: { type: String, default: null },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String, default: null },
    verificationTokenExpiry: { type: Date, default: null },
    resetPasswordToken: { type: String, default: null },
    resetPasswordTokenExpiry: { type: Date, default: null },
    role: { type: String, enum: ["admin", "user"], default: "user" },
  },
  {
    timestamps: true,
    discriminatorKey: "kind",
  },
);

usersSchema.index({ email: 1 }, { unique: true });

usersSchema.pre("save", async function (next) {
  try {
    if (this.isNew || this.isModified("password")) {
      if (this.password.length < 8)
        throw new Error("Password must be at least 8 characters long");
      this.password = await bcrypt.hash(this.password, 10);
    }
    next();
  } catch (err) {
    next(err as Error);
  }
});

usersSchema.set("toJSON", { virtuals: true });

usersSchema.methods.Optimize = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

usersSchema.methods.comparePasswords = async function (
  candidatePassword: string,
) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const UserModel = model<UserI, UserModel>("Users", usersSchema);

export const createUserFactory = async (
  props: Partial<UserI>,
): Promise<UserD> => {
  const user = new UserModel({
    name: props.name || "John Doe",
    phone: props.phone || "+213777777777",
    email: props.email || RandomEmail(),
    password: props.password || "password",
    role: props.role || "user",
    image: props.image || null,
    googleId: props.googleId || null,
    address: props.address || [],
    isVerified: props.isVerified || false,
  });
  const savedUser = await user.save();
  return savedUser;
};

import { createUserFactory } from "../models/user";
export const seedUsers = async () => {
  try {
    const user = await createUserFactory({
      name: process.env.USER_name || "Zouambia Sohaib",
      email: process.env.USER_email || "js_zouambia@esi.dz",

      password: process.env.USER_password || "password",
      role: "admin",
    });
    if (user) {
      console.log("🌱 seeding => users : user :", user);
      return user;
    }
  } catch (err) {
    console.error(`🔥seeding failed  err : ${err}`);
  }
};

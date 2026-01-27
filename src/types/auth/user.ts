export interface AppUser {
  uid: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role: "ORGANIZER" | "MEMBER" | "HOST" | "GUEST";
}

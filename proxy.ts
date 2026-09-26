import { auth } from "@/lib/auth/server";

export default auth.middleware({ loginUrl: "/auth/sign-in" });

export const config = {
  matcher: ["/dashboard/:path*", "/capture/:path*", "/submissions/:path*", "/users/:path*", "/retailers/:path*", "/catalog/:path*"],
};

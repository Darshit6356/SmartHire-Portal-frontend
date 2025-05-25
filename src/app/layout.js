import { AuthProvider } from "../contexts/AuthContext";
import { JobProvider } from "../contexts/JobContext";
import "./globals.css";

export const metadata = {
  title: "Agent-AI Job Portal",
  description: "AI-powered job matching platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <JobProvider>{children}</JobProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

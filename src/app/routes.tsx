import { createBrowserRouter } from "react-router";
import { Landing } from "./screens/Landing";
import { AuthLayout } from "./layouts/AuthLayout";
import { MainLayout } from "./layouts/MainLayout";
import { PhoneLogin } from "./screens/auth/PhoneLogin";
import { OTPVerification } from "./screens/auth/OTPVerification";
import { ProfileSetup } from "./screens/auth/ProfileSetup";
import { ProviderOnboarding } from "./screens/provider/ProviderOnboarding";
import { Home } from "./screens/customer/Home";
import { ProviderProfile } from "./screens/customer/ProviderProfile";
import { CreateWorkRequest } from "./screens/customer/CreateWorkRequest";
import { MyJobs } from "./screens/customer/MyJobs";
import { JobDetails } from "./screens/customer/JobDetails";
import { Chat } from "./screens/Chat";
import { Meetup } from "./screens/Meetup";
import { Rating } from "./screens/Rating";
import { ProviderDashboard } from "./screens/provider/ProviderDashboard";
import { ProviderJobDetails } from "./screens/provider/ProviderJobDetails";
import { Profile } from "./screens/Profile";
import { AdminDashboard } from "./screens/admin/AdminDashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { index: true, element: <PhoneLogin /> },
      { path: "otp", element: <OTPVerification /> },
      { path: "profile-setup", element: <ProfileSetup /> },
      { path: "provider-onboarding", element: <ProviderOnboarding /> },
    ],
  },
  {
    path: "/customer",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "provider/:id", element: <ProviderProfile /> },
      { path: "create-request", element: <CreateWorkRequest /> },
      { path: "my-jobs", element: <MyJobs /> },
      { path: "job/:id", element: <JobDetails /> },
      { path: "profile", element: <Profile /> },
    ],
  },
  {
    path: "/provider",
    element: <MainLayout />,
    children: [
      { index: true, element: <ProviderDashboard /> },
      { path: "job/:id", element: <ProviderJobDetails /> },
      { path: "profile", element: <Profile /> },
    ],
  },
  {
    path: "/chat/:jobId",
    element: <Chat />,
  },
  {
    path: "/meetup/:jobId",
    element: <Meetup />,
  },
  {
    path: "/rating/:jobId",
    element: <Rating />,
  },
  {
    path: "/admin",
    element: <AdminDashboard />,
  },
]);
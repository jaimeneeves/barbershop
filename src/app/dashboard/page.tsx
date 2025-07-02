export default function Page() {
  return (
    <div className="flex flex-col min-h-screen p-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-4 text-lg">Welcome to the dashboard!</p>
      <div className="mt-8">
        {/* Add your dashboard content here */}
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic"; // Ensure this page is always server-rendered
export const revalidate = 0; // Disable static generation for this page
export const fetchCache = "force-no-store"; // Disable caching for this page
export const runtime = "edge"; // Use edge runtime for better performance

export const metadata = {
  title: "Dashboard",
  description: "Your dashboard overview",
};
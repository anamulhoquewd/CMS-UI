import { UserProfile } from "./_components/profile-page";

function Me() {
  return (
    <div className="px-12">
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold">Stay in Control of Your Profile</h1>
        <p className="text-gray-500 text-sm mb-8">Manage your Personal information.</p>
        <UserProfile />
      </div>
    </div>
  );
}

export default Me;

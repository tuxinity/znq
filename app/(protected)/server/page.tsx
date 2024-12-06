import { UserInfo } from "@/components/user-info";
import { getCurrentUser } from "@/lib/auth";

const ServerPage = async () => {
  const user = await getCurrentUser();

  return (
    <div>
      <UserInfo label="💻 Server Component" user={user} />
    </div>
  )
}

export default ServerPage;
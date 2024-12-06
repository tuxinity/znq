import { auth } from "@/auth";

const ServerPage = async () => {
  const session = await auth()

  return (
    <div>
      {JSON.stringify(session?.user)}
    </div>
  )
}

export default ServerPage;
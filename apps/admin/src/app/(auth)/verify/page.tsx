import getServerSession from "@/lib/auth/server"
import PageContent from "./page-content"

async function Page() {
  const session = await getServerSession()

  return (
    <PageContent userEmail={session?.user.email as string}/>
  )
}

export default Page
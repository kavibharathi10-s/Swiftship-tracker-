import { redirect } from "next/navigation";

export default async function Page() {
  // const user = await currentUser();
  return redirect("/driver/dashboard/find-jobs");
}

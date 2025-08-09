import { getMenuData } from "@/actions/menu";
import type { StaffUser } from "@/utils/auth";
import { StaffMenuContent } from "./StaffMenuLayout";
import { StaffMenuContextProvider } from "./StaffMenuProvider";

export async function StaffMenuClient({ staff }: { staff: StaffUser }) {
  const data = await getMenuData();
  return (
    <StaffMenuContextProvider
      staff={staff}
      initialCategories={data.categories}
      initialCategoryGroups={data.categoryGroups}
    >
      <StaffMenuContent staff={staff} />
    </StaffMenuContextProvider>
  );
}

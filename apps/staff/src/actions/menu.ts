"use server";

import { requireAuth } from "@/utils/auth";
import db from "@platter/db";
import { revalidatePath } from "next/cache";

// Shared types
interface VarietyInput {
  id?: string;
  name: string;
  description: string | null;
  price: number;
  position: number;
  isAvailable: boolean;
  isDefault: boolean;
}

export async function getMenuData() {
  const staff = await requireAuth();
  if (!staff.canManageMenu) throw new Error("Access denied");

  const [categories, groups] = await Promise.all([
    db.category.findMany({
      where: { userId: staff.restaurantId, deletedAt: null },
      include: {
        menuItems: {
          where: { deletedAt: null },
          include: {
            varieties: true,
            servicePoint: {
              select: {
                id: true,
                name: true,
                description: true,
                isActive: true,
              },
            },
          },
        },
      },
      orderBy: { position: "asc" },
    }),
    db.categoryGroup.findMany({
      where: { userId: staff.restaurantId },
      include: {
        categories: {
          where: { deletedAt: null },
          include: {
            menuItems: {
              where: { deletedAt: null },
              include: {
                varieties: true,
                servicePoint: {
                  select: {
                    id: true,
                    name: true,
                    description: true,
                    isActive: true,
                  },
                },
              },
            },
          },
          orderBy: { position: "asc" },
        },
      },
      orderBy: { position: "asc" },
    }),
  ]);

  return { categories, categoryGroups: groups };
}

export async function getServicePoints() {
  const staff = await requireAuth();
  const servicePoints = await db.servicePoint.findMany({
    where: { userId: staff.restaurantId, isActive: true },
    select: { id: true, name: true, description: true, isActive: true },
    orderBy: { name: "asc" },
  });
  return servicePoints;
}

export async function createCategoryAction(data: {
  name: string;
  description?: string;
  image?: string | null;
  groupId?: string | null;
}) {
  const staff = await requireAuth();
  if (!staff.canManageMenu) throw new Error("Access denied");

  const name = (data.name || "").trim();
  if (!name) throw new Error("Category name is required");

  // If an active category with the same name exists for this restaurant, abort
  const existingActive = await db.category.findFirst({
    where: {
      userId: staff.restaurantId,
      name,
      deletedAt: null,
    },
    select: { id: true },
  });
  if (existingActive) {
    throw new Error("A category with this name already exists");
  }

  // If a soft-deleted category exists with same name, revive it instead
  const existingDeleted = await db.category.findFirst({
    where: {
      userId: staff.restaurantId,
      name,
      NOT: { deletedAt: null },
    },
    select: { id: true },
  });

  if (existingDeleted) {
    await db.category.update({
      where: { id: existingDeleted.id, userId: staff.restaurantId },
      data: {
        deletedAt: null,
        isActive: true,
        description: data.description || "",
        image: data.image || null,
        groupId: data.groupId || null,
        name,
      },
    });
    revalidatePath("/menu");
    return;
  }

  // Assign next position
  const last = await db.category.findFirst({
    where: { userId: staff.restaurantId, deletedAt: null },
    orderBy: { position: "desc" },
    select: { position: true },
  });

  await db.category.create({
    data: {
      name,
      description: data.description || "",
      image: data.image || null,
      groupId: data.groupId || null,
      userId: staff.restaurantId,
      position: last ? last.position + 1 : 1,
      isActive: true,
    },
  });
  revalidatePath("/menu");
}

export async function updateCategoryAction(categoryId: string, form: FormData) {
  const staff = await requireAuth();
  if (!staff.canManageMenu) throw new Error("Access denied");
  const name = (form.get("name") as string) || "";
  const description = ((form.get("description") as string) || "").toString();
  const groupIdRaw = (form.get("groupId") as string) || "null";
  const existingImage = (form.get("existingImage") as string) || null;
  const uploadedImageUrl = (form.get("image") as string) || null; // URL from UploadThing
  const image: string | null = uploadedImageUrl ?? existingImage;

  await db.category.update({
    where: { id: categoryId, userId: staff.restaurantId },
    data: {
      name,
      description: description || null,
      image,
      groupId: groupIdRaw && groupIdRaw !== "null" ? groupIdRaw : null,
    },
  });
  revalidatePath("/menu");
}

export async function deleteCategoryAction(categoryId: string) {
  const staff = await requireAuth();
  if (!staff.canManageMenu) throw new Error("Access denied");
  // Soft delete (align with admin behavior)
  await db.category.update({
    where: { id: categoryId, userId: staff.restaurantId },
    data: { deletedAt: new Date(), isActive: false },
  });
  revalidatePath("/menu");
}

export async function createCategoryGroupAction(data: {
  name: string;
  description?: string;
}) {
  const staff = await requireAuth();
  if (!staff.canManageMenu) throw new Error("Access denied");
  const last = await db.categoryGroup.findFirst({
    where: { userId: staff.restaurantId },
    orderBy: { position: "desc" },
  });
  await db.categoryGroup.create({
    data: {
      name: data.name,
      description: data.description || "",
      userId: staff.restaurantId,
      position: last ? last.position + 1 : 1,
    },
  });
  revalidatePath("/menu");
}

export async function updateCategoryGroupAction(
  groupId: string,
  data: { name: string; description?: string },
) {
  const staff = await requireAuth();
  if (!staff.canManageMenu) throw new Error("Access denied");
  await db.categoryGroup.update({
    where: { id: groupId, userId: staff.restaurantId },
    data: { name: data.name, description: data.description || "" },
  });
  revalidatePath("/menu");
}

export async function deleteCategoryGroupAction(groupId: string) {
  const staff = await requireAuth();
  if (!staff.canManageMenu) throw new Error("Access denied");
  await db.categoryGroup.delete({
    where: { id: groupId, userId: staff.restaurantId },
  });
  revalidatePath("/menu");
}

export async function assignCategoryToGroupAction(
  categoryId: string,
  groupId: string | null,
) {
  const staff = await requireAuth();
  if (!staff.canManageMenu) throw new Error("Access denied");
  await db.category.update({
    where: { id: categoryId, userId: staff.restaurantId },
    data: { groupId },
  });
  revalidatePath("/menu");
}

export async function createMenuItemAction(form: FormData) {
  const staff = await requireAuth();
  if (!staff.canManageMenu) throw new Error("Access denied");
  const name = (form.get("name") as string) || "";
  const description = ((form.get("description") as string) || "").toString();
  const price = Number.parseFloat((form.get("price") as string) || "0");
  const categoryId = (form.get("categoryId") as string) || "";
  const isAvailable = (form.get("isAvailable") as string) === "true";
  const servicePointId = (form.get("servicePointId") as string) || null;
  const imageUrl = (form.get("image") as string) || null;

  const varietyCount = Number.parseInt(
    (form.get("varietyCount") as string) || "0",
    10,
  );
  const varieties: VarietyInput[] = [];
  for (let i = 0; i < varietyCount; i++) {
    varieties.push({
      name: (form.get(`variety_${i}_name`) as string) || "",
      description: (
        (form.get(`variety_${i}_description`) as string) || ""
      ).toString(),
      price: Number.parseFloat(
        (form.get(`variety_${i}_price`) as string) || "0",
      ),
      position: Number.parseInt(
        (form.get(`variety_${i}_position`) as string) || `${i + 1}`,
        10,
      ),
      isAvailable: (form.get(`variety_${i}_isAvailable`) as string) === "true",
      isDefault: (form.get(`variety_${i}_isDefault`) as string) === "true",
    });
  }

  const created = await db.menuItem.create({
    data: {
      name,
      description,
      price,
      image: imageUrl,
      isAvailable,
      categoryId,
      userId: staff.restaurantId,
      servicePointId:
        servicePointId && servicePointId !== "null" ? servicePointId : null,
      varieties:
        varieties.length > 0
          ? {
              create: varieties.map((v, idx) => ({
                name: v.name,
                description: v.description,
                price: v.price,
                position: v.position || idx + 1,
                isAvailable: v.isAvailable,
                isDefault: v.isDefault,
                userId: staff.restaurantId,
              })),
            }
          : undefined,
    },
    include: {
      varieties: true,
      servicePoint: {
        select: { id: true, name: true, description: true, isActive: true },
      },
    },
  });

  revalidatePath("/menu");
  return created;
}

export async function updateMenuItemAction(menuItemId: string, form: FormData) {
  const staff = await requireAuth();
  if (!staff.canManageMenu) throw new Error("Access denied");

  const name = (form.get("name") as string) || "";
  const description = ((form.get("description") as string) || "").toString();
  const price = Number.parseFloat((form.get("price") as string) || "0");
  const isAvailable = (form.get("isAvailable") as string) === "true";
  const existingImage = (form.get("existingImage") as string) || null;
  const imageUrl = (form.get("image") as string) || null;
  const servicePointId = (form.get("servicePointId") as string) || null;

  const image: string | null = imageUrl ?? existingImage;

  const varietyCount = Number.parseInt(
    (form.get("varietyCount") as string) || "0",
    10,
  );
  const varieties: VarietyInput[] = [];
  for (let i = 0; i < varietyCount; i++) {
    varieties.push({
      id: (form.get(`variety_${i}_id`) as string) || undefined,
      name: (form.get(`variety_${i}_name`) as string) || "",
      description: (
        (form.get(`variety_${i}_description`) as string) || ""
      ).toString(),
      price: Number.parseFloat(
        (form.get(`variety_${i}_price`) as string) || "0",
      ),
      position: Number.parseInt(
        (form.get(`variety_${i}_position`) as string) || `${i + 1}`,
        10,
      ),
      isAvailable: (form.get(`variety_${i}_isAvailable`) as string) === "true",
      isDefault: (form.get(`variety_${i}_isDefault`) as string) === "true",
    });
  }

  // Transaction: update item and varieties
  await db.$transaction(async (tx: typeof db) => {
    await tx.menuItem.update({
      where: { id: menuItemId, userId: staff.restaurantId },
      data: {
        name,
        description: description || null,
        price,
        isAvailable,
        image,
        ...(servicePointId !== null
          ? servicePointId && servicePointId !== "null"
            ? { servicePoint: { connect: { id: servicePointId } } }
            : { servicePoint: { disconnect: true } }
          : {}),
      },
    });

    // Varieties sync
    const existing = await tx.menuItemVariety.findMany({
      where: { menuItemId, userId: staff.restaurantId },
    });
    const incomingIds = varieties
      .filter((v: VarietyInput) => v.id)
      .map((v: VarietyInput) => v.id as string);
    const toDelete = existing.filter(
      (ev: { id: string }) => !incomingIds.includes(ev.id),
    );
    if (toDelete.length > 0) {
      await tx.menuItemVariety.deleteMany({
        where: {
          id: { in: toDelete.map((v: { id: string }) => v.id) },
          userId: staff.restaurantId,
        },
      });
    }
    // Upserts
    for (const v of varieties as Array<VarietyInput>) {
      if (v.id) {
        await tx.menuItemVariety.update({
          where: { id: v.id, userId: staff.restaurantId },
          data: {
            name: v.name,
            description: v.description,
            price: v.price,
            position: v.position,
            isAvailable: v.isAvailable,
            isDefault: v.isDefault,
          },
        });
      } else {
        await tx.menuItemVariety.create({
          data: {
            name: v.name,
            description: v.description,
            price: v.price,
            position: v.position,
            isAvailable: v.isAvailable,
            isDefault: v.isDefault,
            menuItemId,
            userId: staff.restaurantId,
          },
        });
      }
    }
  });

  revalidatePath("/menu");
}

export async function deleteMenuItemAction(menuItemId: string) {
  const staff = await requireAuth();
  if (!staff.canManageMenu) throw new Error("Access denied");
  await db.menuItem.update({
    where: { id: menuItemId, userId: staff.restaurantId },
    data: { deletedAt: new Date(), isAvailable: false },
  });
  await db.menuItemVariety.updateMany({
    where: { menuItemId, userId: staff.restaurantId, deletedAt: null },
    data: { deletedAt: new Date(), isAvailable: false },
  });
  revalidatePath("/menu");
}

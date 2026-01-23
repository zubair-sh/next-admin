import prisma from "@/lib/prisma";
import { PaginatedResponse, PaginationOptions } from "@/types";
import { Prisma } from "@prisma/client";
import { CreateRoleRequest, IRole, UpdateRoleRequest } from "../types";
import { normalizePagination } from "@/lib/utils";

export class RolesService {
  static async getAll(
    where: Prisma.RoleWhereInput,
    options: PaginationOptions = {},
  ): Promise<PaginatedResponse<IRole>> {
    const { page, pageSize, sortOrder, sortBy } = normalizePagination(options);

    const [items, totalCount] = await prisma.$transaction([
      prisma.role.findMany({
        where,
        include: {
          permissions: true,
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.role.count({ where }),
    ]);

    return { items, page, pageSize, totalCount };
  }

  static async getById(id: string): Promise<IRole | null> {
    const role = await prisma.role.findUnique({
      where: { id },
      include: {
        permissions: true,
      },
    });
    return role as unknown as IRole | null;
  }

  static async create(data: CreateRoleRequest): Promise<IRole> {
    const existing = await prisma.role.findUnique({
      where: {
        name: data.name,
      },
    });

    if (existing) {
      throw new Error("Role with this name already exists");
    }

    const { permissionIds, ...rest } = data;

    const role = await prisma.role.create({
      data: {
        ...rest,
        permissions: permissionIds
          ? {
              connect: permissionIds.map((id) => ({ id })),
            }
          : undefined,
      },
      include: {
        permissions: true,
      },
    });

    return role as unknown as IRole;
  }

  static async update(id: string, data: UpdateRoleRequest): Promise<IRole> {
    const { permissionIds, ...rest } = data;

    const role = await prisma.role.update({
      where: { id },
      data: {
        ...rest,
        permissions: permissionIds
          ? {
              set: permissionIds.map((id) => ({ id })),
            }
          : undefined,
      },
      include: {
        permissions: true,
      },
    });

    return role as unknown as IRole;
  }

  static async delete(id: string): Promise<void> {
    await prisma.role.delete({
      where: { id },
    });
  }
}

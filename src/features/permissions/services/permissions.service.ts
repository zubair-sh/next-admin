import prisma from "@/lib/prisma";
import { PaginatedResponse, PaginationOptions } from "@/types";
import { Prisma } from "@prisma/client";
import {
  CreatePermissionRequest,
  IPermission,
  UpdatePermissionRequest,
} from "../types";
import { normalizePagination } from "@/lib/utils";

export class PermissionsService {
  static async getAll(
    where: Prisma.PermissionWhereInput,
    options: PaginationOptions = {},
  ): Promise<PaginatedResponse<IPermission>> {
    const { page, pageSize, sortOrder, sortBy } = normalizePagination(options);

    const [items, totalCount] = await prisma.$transaction([
      prisma.permission.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.permission.count({ where }),
    ]);

    return { items, page, pageSize, totalCount };
  }

  static async getById(id: string): Promise<IPermission | null> {
    return await prisma.permission.findUnique({
      where: { id },
    });
  }

  static async create(data: CreatePermissionRequest): Promise<IPermission> {
    const existing = await prisma.permission.findFirst({
      where: {
        action: data.action,
        subject: data.subject,
      },
    });

    if (existing) {
      throw new Error("Permission with this action and subject already exists");
    }

    return await prisma.permission.create({
      data,
    });
  }

  static async update(
    id: string,
    data: UpdatePermissionRequest,
  ): Promise<IPermission> {
    return await prisma.permission.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string): Promise<void> {
    await prisma.permission.delete({
      where: { id },
    });
  }
}

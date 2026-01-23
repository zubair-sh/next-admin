import prisma from "@/lib/prisma";
import { normalizePagination } from "@/lib/utils";
import { AppConstants } from "@/config/constants";
import { PaginatedResponse, PaginationOptions } from "@/types";
import { Prisma } from "@prisma/client";
import { CreateUserRequest, IUser, UpdateUserRequest } from "../types";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const DEFAULT_INCLUDE = {
  role: true,
} satisfies Prisma.UserInclude;

const supabaseAdmin: SupabaseClient = createClient(
  AppConstants.supabaseUrl!,
  AppConstants.supabaseServiceRoleKey!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

const buildFullName = (firstName?: string | null, lastName?: string | null) =>
  `${firstName ?? ""} ${lastName ?? ""}`.trim();

export class UsersService {
  static async getAll(
    where: Prisma.UserWhereInput,
    options: PaginationOptions = {},
  ): Promise<PaginatedResponse<IUser>> {
    const { page, pageSize, sortBy, sortOrder } = normalizePagination(options);

    const [items, totalCount] = await prisma.$transaction([
      prisma.user.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { [sortBy]: sortOrder },
        include: DEFAULT_INCLUDE,
      }),
      prisma.user.count({ where }),
    ]);

    return { items, page, pageSize, totalCount };
  }

  static async getById(
    id: string,
    include: Prisma.UserInclude = DEFAULT_INCLUDE,
  ): Promise<IUser | null> {
    return prisma.user.findUnique({
      where: { id },
      include,
    });
  }

  static async create(data: CreateUserRequest): Promise<IUser> {
    const exists = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (exists) {
      throw new Error("User with this email already exists");
    }

    const { data: authData, error } = await supabaseAdmin.auth.admin.createUser(
      {
        email: data.email,
        password: data.password,
        email_confirm: true,
      },
    );

    if (error || !authData.user) {
      throw new Error(`Supabase user creation failed: ${error?.message}`);
    }

    try {
      return await prisma.user.create({
        data: {
          ...data,
          id: authData.user.id,
          fullName: buildFullName(data.firstName, data.lastName),
        },
        include: DEFAULT_INCLUDE,
      });
    } catch (err) {
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      throw err;
    }
  }

  static async update(
    id: string,
    data: UpdateUserRequest,
    include: Prisma.UserInclude = DEFAULT_INCLUDE,
  ): Promise<IUser> {
    if (data.email || data.password) {
      const { error } = await supabaseAdmin.auth.admin.updateUserById(id, {
        email: data.email,
        password: data.password,
      });

      if (error) {
        throw new Error(`Supabase update failed: ${error.message}`);
      }
    }

    return prisma.user.update({
      where: { id },
      data: {
        ...data,
        fullName: buildFullName(data.firstName, data.lastName),
      },
      include,
    });
  }

  static async delete(id: string): Promise<void> {
    const { error } = await supabaseAdmin.auth.admin.deleteUser(id);

    if (error) {
      throw new Error(`Supabase delete failed: ${error.message}`);
    }

    await prisma.user.delete({ where: { id } });
  }
}

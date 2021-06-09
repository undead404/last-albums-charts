import prisma from './prisma';

export default async function deleteTag(tagName: string): Promise<void> {
  await prisma.$executeRaw`DELETE FROM "public"."Tag" WHERE "name" = ${tagName};`;
}

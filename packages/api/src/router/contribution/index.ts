import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '../../trpc';
import { z } from 'zod';
import { v4 as uuid } from 'uuid';
import { qfV1 } from '../../utils/qf';
import { Prisma, ProjectJoinRound } from '@cubik/database';
export const contributionRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        userId: z.string().nonempty(),
        token: z.string().nonempty(),
        split: z.number(),
        totalAmount: z.number(),
        tx: z.string().nonempty(),
        usd: z.number().positive(),
        projectId: z.string().nonempty(),
        roundId: z.string().nonempty(),
        projectJoinRoundId: z.string().nonempty(),
      })
    )
    .mutation(async ({ input, ctx: { prisma } }) => {
      const contribution = await prisma.contribution.findFirst({
        where: {
          isLatest: true,
          projectId: input.projectId,
          roundId: input.roundId,
        },
      });
      if (contribution) {
        const contributionRes = await prisma.contribution.create({
          data: {
            id: uuid(),
            token: input.token,
            split: input.split,
            currentTotal: contribution.currentTotal + input.totalAmount,
            currentusdTotal: contribution.currentusdTotal + input.usd,
            usdTotal: input.usd,
            total: input.totalAmount,
            count: contribution.count + 1,
            tx: input.tx,
            userId: input.userId,
            projectId: input.projectId,
            roundId: input.roundId,
            isLatest: true,
            projectJoinRoundId: contribution.projectJoinRoundId,
          },
        });
        await prisma.contribution.update({
          where: {
            id: contribution.id,
          },
          data: {
            isLatest: false,
          },
        });
        return contributionRes;
      } else {
        const contributionRes = await prisma.contribution.create({
          data: {
            id: uuid(),
            token: input.token,
            split: input.split,
            usdTotal: input.usd,
            total: input.totalAmount,
            tx: input.tx,
            userId: input.userId,
            projectId: input.projectId,
            roundId: input.roundId,
            currentTotal: input.totalAmount,
            currentusdTotal: input.usd,
            isLatest: true,
            projectJoinRoundId: input.projectJoinRoundId,
          },
        });
        return contributionRes;
      }
    }),

  updateProjectRaise: protectedProcedure
    .input(
      z.object({
        projectJoinRoundId: z.string().nonempty(),
        roundId: z.string().nonempty(),
        projectId: z.string().nonempty(),
      })
    )
    .mutation(async ({ input, ctx: { prisma } }) => {
      const res = await prisma.round.findUnique({
        where: {
          id: input.roundId,
        },
        include: {
          Contribution: {
            include: {
              ProjectsModel: true,
            },
          },
          ProjectJoinRound: {
            where: {
              isArchive: false,
            },
          },
        },
      });
      if (!res) return null;
      const qf = qfV1(res);

      const allProjects = await prisma.projectJoinRound.findMany({
        where: {
          roundId: input.roundId,
          isArchive: false,
        },
      });
      const updatePromise: Prisma.Prisma__ProjectJoinRoundClient<
        ProjectJoinRound,
        never
      >[] = [];
      allProjects.forEach(async (e) => {
        const a = prisma.projectJoinRound.update({
          where: {
            id: e.id,
          },
          data: {
            amountRaise:
              qf.find((el) => el.projectId === e.projectId)?.amount ?? 0,
          },
        });
        updatePromise.push(a);
      });
      return await Promise.all(updatePromise);
    }),

  getProjectContributors: publicProcedure
    .input(
      z.object({
        projectId: z.string().nonempty(),
        roundId: z.string(),
        skip: z.number().default(0),
      })
    )
    .query(async ({ input, ctx: { prisma } }) => {
      if (!input.roundId) return [];
      const contributions = await prisma.contribution.findMany({
        where: {
          projectId: input.projectId,
          roundId: input.roundId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: input.skip,
        select: {
          id: true,
          total: true,
          usdTotal: true,
          createdAt: true,
          token: true,
          count: true,
          user: true,
        },
      });
      return contributions;
    }),

  getUserContributions: publicProcedure
    .input(
      z.object({
        userId: z.string().nonempty(),
      })
    )
    .query(async ({ input, ctx: { prisma } }) => {
      const contributions = await prisma.contribution.findMany({
        where: {
          userId: input.userId,
        },
        include: {
          ProjectsModel: {
            include: {
              owner: true,
              ProjectJoinRound: {
                include: {
                  fundingRound: true,
                  project: true,
                },
              },
            },
          },
        },
      });
      return contributions;
    }),

  getRoundContributions: publicProcedure
    .input(
      z.object({
        roundId: z.string().nonempty(),
      })
    )
    .query(async ({ input, ctx: { prisma } }) => {
      const contributions = await prisma.contribution.findMany({
        where: {
          roundId: input.roundId,
        },
        include: {
          user: true,
          ProjectsModel: true,
          Round: true,
        },
      });
      return contributions;
    }),
});

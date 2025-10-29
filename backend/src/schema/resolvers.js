const { prisma } = require('../db/prisma');
const { requireAuth } = require('../auth/requireAuth');

const resolvers = {
  Query: {
    jobs: async (_, args) => {
      const { location, remote, tags, categoryId, search, limit = 50, offset = 0 } = args;
      
      const where = {};
      
      if (location) {
        where.location = { contains: location, mode: 'insensitive' };
      }
      
      if (remote !== undefined) {
        where.remote = remote;
      }
      
      if (tags && tags.length > 0) {
        where.tags = { hasSome: tags };
      }
      
      if (categoryId) {
        where.categoryId = categoryId;
      }
      
      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ];
      }
      
      const [jobs, total] = await Promise.all([
        prisma.job.findMany({
          where,
          include: {
            company: true,
            category: true,
            applications: true,
          },
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip: offset,
        }),
        prisma.job.count({ where }),
      ]);
      
      return { jobs, total };
    },
    
    job: async (_, { id }) => {
      return prisma.job.findUnique({
        where: { id },
        include: {
          company: true,
          category: true,
          applications: true,
        },
      });
    },
    
    categories: async () => {
      return prisma.category.findMany({
        include: { jobs: true },
        orderBy: { name: 'asc' },
      });
    },
    
    category: async (_, { id }) => {
      return prisma.category.findUnique({
        where: { id },
        include: { jobs: true },
      });
    },
    
    companies: async () => {
      return prisma.company.findMany({
        include: { jobs: true },
        orderBy: { name: 'asc' },
      });
    },
    
    company: async (_, { id }) => {
      return prisma.company.findUnique({
        where: { id },
        include: { jobs: true },
      });
    },
    
    applications: async () => {
      return prisma.application.findMany({
        include: { job: { include: { company: true } } },
        orderBy: { createdAt: 'desc' },
      });
    },
    
    application: async (_, { id }) => {
      return prisma.application.findUnique({
        where: { id },
        include: { job: { include: { company: true } } },
      });
    },
  },
  
  Mutation: {
    createJob: requireAuth(async (parent, args, context) => {
      const { input } = args;
      return prisma.job.create({
        data: {
          ...input,
          tags: input.tags || [],
        },
        include: { company: true, category: true },
      });
    }),
    
    updateJob: requireAuth(async (parent, args, context) => {
      const { id, input } = args;
      return prisma.job.update({
        where: { id },
        data: input,
        include: { company: true, category: true },
      });
    }),
    
    deleteJob: requireAuth(async (parent, args, context) => {
      const { id } = args;
      await prisma.job.delete({ where: { id } });
      return true;
    }),
    
    createCompany: requireAuth(async (parent, args, context) => {
      const { input } = args;
      return prisma.company.create({ data: input });
    }),
    
    updateCompany: requireAuth(async (parent, args, context) => {
      const { id, input } = args;
      return prisma.company.update({
        where: { id },
        data: input,
      });
    }),
    
    deleteCompany: requireAuth(async (parent, args, context) => {
      const { id } = args;
      await prisma.company.delete({ where: { id } });
      return true;
    }),
    
    createCategory: requireAuth(async (parent, args, context) => {
      const { input } = args;
      return prisma.category.create({ data: input });
    }),
    
    updateCategory: requireAuth(async (parent, args, context) => {
      const { id, input } = args;
      return prisma.category.update({
        where: { id },
        data: input,
      });
    }),
    
    deleteCategory: requireAuth(async (parent, args, context) => {
      const { id } = args;
      await prisma.category.delete({ where: { id } });
      return true;
    }),
    
    createApplication: async (_, { input }) => {
      return prisma.application.create({
        data: input,
        include: { job: { include: { company: true } } },
      });
    },
    
    updateApplicationStatus: async (_, { id, status }) => {
      return prisma.application.update({
        where: { id },
        data: { status },
        include: { job: { include: { company: true } } },
      });
    },
    
    deleteApplication: async (_, { id }) => {
      await prisma.application.delete({ where: { id } });
      return true;
    },
  },
};

module.exports = { resolvers };

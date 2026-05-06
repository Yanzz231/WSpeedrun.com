import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

jest.mock('uuid', () => ({
  v4: () => '00000000-0000-4000-8000-000000000000',
}));

import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Run Service (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'test-secret';
    process.env.DATABASE_URL =
      process.env.DATABASE_URL ?? 'mysql://root:@localhost:3306/wspeedrun';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue({ $connect: jest.fn(), $disconnect: jest.fn() })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('bootstraps the run service module', () => {
    expect(app).toBeDefined();
  });
});

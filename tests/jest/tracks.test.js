import { createMocks } from "node-mocks-http";

// Mock prisma before importing handler - use relative path since Jest aliases may not work
jest.mock("../../lib/prisma", () => ({
  __esModule: true,
  default: {
    track: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
  },
}));

import handler from "@/pages/api/tracks";
import prisma from "@/lib/prisma";

describe("GET /api/tracks (Pagination)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns paginated tracks with metadata", async () => {
    const mockTracks = [
      {
        id: 1,
        title: "Track A",
        artistId: 1,
        createdAt: new Date("2025-09-26T17:53:38.299Z"),
      },
      {
        id: 2,
        title: "Track B",
        artistId: 1,
        createdAt: new Date("2025-09-26T17:53:38.299Z"),
      },
    ];

    prisma.track.findMany.mockResolvedValue(mockTracks);
    prisma.track.count.mockResolvedValue(25);

    const { req, res } = createMocks({
      method: "GET",
      query: { skip: "0", take: "10" },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);

    const data = JSON.parse(res._getData());

    // Verify response structure
    expect(data).toHaveProperty("tracks");
    expect(data).toHaveProperty("total");
    expect(data).toHaveProperty("skip");
    expect(data).toHaveProperty("take");
    expect(data).toHaveProperty("hasMore");

    expect(data.tracks).toHaveLength(2);
    expect(data.total).toBe(25);
    expect(data.skip).toBe(0);
    expect(data.take).toBe(10);
    expect(data.hasMore).toBe(true);

    // Verify Prisma was called correctly
    expect(prisma.track.findMany).toHaveBeenCalledWith({
      where: { private: false },
      orderBy: { createdAt: "desc" },
      skip: 0,
      take: 10,
    });

    expect(prisma.track.count).toHaveBeenCalledWith({
      where: { private: false },
    });
  });

  it("uses default skip=0 and take=10 when not provided", async () => {
    prisma.track.findMany.mockResolvedValue([]);
    prisma.track.count.mockResolvedValue(0);

    const { req, res } = createMocks({
      method: "GET",
      query: {},
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);

    const data = JSON.parse(res._getData());
    expect(data.skip).toBe(0);
    expect(data.take).toBe(10);
    expect(data.hasMore).toBe(false);
  });

  it("correctly determines hasMore flag", async () => {
    prisma.track.findMany.mockResolvedValue(
      Array(10).fill({ id: 1, title: "Track" })
    );

    // Case 1: hasMore should be true (20 results, skip 0, take 10)
    prisma.track.count.mockResolvedValue(20);

    const { req, res } = createMocks({
      method: "GET",
      query: { skip: "0", take: "10" },
    });

    await handler(req, res);

    let data = JSON.parse(res._getData());
    expect(data.hasMore).toBe(true); // 0 + 10 < 20

    // Case 2: hasMore should be false (10 results, skip 0, take 10)
    prisma.track.count.mockResolvedValue(10);

    const { req: req2, res: res2 } = createMocks({
      method: "GET",
      query: { skip: "0", take: "10" },
    });

    await handler(req2, res2);

    data = JSON.parse(res2._getData());
    expect(data.hasMore).toBe(false); // 0 + 10 < 10 is false
  });
});

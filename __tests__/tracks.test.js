import handler from "../pages/api/tracks/[artistName]";
import prisma from "../lib/prisma";
import { createMocks } from "node-mocks-http";

jest.mock("../lib/prisma", () => ({
  track: {
    findMany: jest.fn(),
  },
}));

describe("GET /api/tracks/[artistName]", () => {
  it("returns tracks for the given artist", async () => {
    // mockTracks with Date objects (what Prisma would return)
    const mockTracks = [
      { id: 1, title: "Track A", artistId: 1, createdAt: new Date("2025-09-26T17:53:38.299Z") },
      { id: 2, title: "Track B", artistId: 1, createdAt: new Date("2025-09-26T17:53:38.299Z") },
    ];

    prisma.track.findMany.mockResolvedValue(mockTracks);

    const { req, res } = createMocks({
      method: "GET",
      query: { artistName: "Test Artist" },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);

    // parse response (createdAt will be ISO strings)
    const data = JSON.parse(res._getData());

    // Build expected: same objects but createdAt as ISO strings
    const expected = mockTracks.map((t) => ({
      ...t,
      createdAt: t.createdAt.toISOString(),
    }));

    expect(data).toEqual(expected);

    expect(prisma.track.findMany).toHaveBeenCalledWith({
      where: { artist: { name: "Test Artist" } },
      orderBy: { createdAt: "desc" },
    });
  });
});
import handler from "@/pages/api/health/dbHealth";
import prisma from "@/lib/prisma";


describe("DatabaseHealthcheck", () => {
    test("that the application is live with a status of 200", async () => {
        const resMock = { status: jest.fn() }; // Mocks `res`
        const resStatusMock = { json: jest.fn() }; // Mock `res.status`
        resMock.status.mockReturnValue(resStatusMock); // Makes `res.status` return `resStatusMock`
    
        await handler(undefined, resMock);

        console.log(resMock.status.mock.calls);

        expect(resMock.status).toHaveBeenCalledWith(200);
        expect(resStatusMock.json).toHaveBeenCalledWith({
            status: "ok",
            message: "Database connected successfully"
        });
    });
});

import handler from "@/pages/api/health/health";
import prisma from "@/lib/prisma";


describe("Healthcheck", () => {
    test("that the application is live with a status of 200", () => {
        const resMock = { status: jest.fn() }; // Mocks `res`
        const resStatusMock = { json: jest.fn() }; // Mock `res.status`
        resMock.status.mockReturnValue(resStatusMock); // Makes `res.status` return `resStatusMock`
    
        handler(undefined, resMock);

        expect(resMock.status).toHaveBeenCalledWith(200);
        expect(resStatusMock.json).toHaveBeenCalledWith({
            status: "ok"
        });
    });
});

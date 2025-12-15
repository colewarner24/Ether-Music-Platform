import handler from "@/pages/api/audio-url";

describe("audio-url", () => {
    test("that the application can generate a signed URL", async () => {
        const reqMock = { status: jest.fn() };
        reqMock.query = { key: "ether-tracks/audio/testsiren.wav" };
        const resMock = { status: jest.fn() };
        const resStatusMock = { json: jest.fn() };  
        resMock.status.mockReturnValue(resStatusMock); 
    
        await handler(reqMock, resMock);

        expect(resMock.status).toHaveBeenCalledWith(200);
        expect(resStatusMock.json).toHaveBeenCalledWith({
            signedUrl: expect.any(String),
        });
    });
});
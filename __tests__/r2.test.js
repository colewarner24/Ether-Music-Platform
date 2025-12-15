// __tests__/r2.test.js
import { r2 } from '@/lib/r2';
import { HeadObjectCommand, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

const BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET;
const TEST_KEY = 'r2-healthcheck.txt';

describe('Cloudflare R2 Connectivity', () => {
  it('should be able to reach the R2 bucket', async () => {
    try {
      // Write a tiny temporary object to test write access
      await r2.send(new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: TEST_KEY,
        Body: 'healthcheck'
      }));

      // Verify it exists (test read access)
      const result = await r2.send(new HeadObjectCommand({
        Bucket: BUCKET_NAME,
        Key: TEST_KEY
      }));
      expect(result).toBeDefined();

      // Clean up
      await r2.send(new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: TEST_KEY
      }));

      console.log('R2 connectivity test successful');
    } catch (error) {
      console.error('R2 connectivity test failed:', error);
      throw new Error('Cannot connect to R2 bucket');
    }
  });
});

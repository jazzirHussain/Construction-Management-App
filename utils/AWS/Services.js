// awsConfig.js
import AWS from 'aws-sdk';
import dotenv from 'dotenv'
if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: './.env.production' });
} else {
  dotenv.config({ path: './.env.development' });
}

// Ensure environment variables are loaded
if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_REGION) {
  console.log('AWS environment variables are not set.');
}

export const AWSCred = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
}
export const s3 = new AWS.S3(AWSCred);

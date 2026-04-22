import aws from 'aws-sdk';
import stream from 'stream';
import { s3 } from './Services.js';

export async function uploadFile(base64Image, bucketName, key, format) {
  // Remove the base64 prefix if present
  const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64Data, 'base64');
  const readStream = new stream.PassThrough();
  readStream.end(buffer);

  // Set up S3 upload parameters
  const params = {
    Bucket: bucketName,
    Key: key,
    Body: readStream,
    ContentType: `image/${format}`,
  };

  // Upload to S3
  return (await s3.upload(params).promise()).Location;
}

export async function uploadFiles(images, bucketName, folder) {
  try {
    return Promise.all(images.map(image => uploadFile(
      image.url,
      bucketName,
      `${folder}/${image.name}.${getImageFormat(image.url)}`,
      getImageFormat(image.url)
    )))
  } catch (error) {
    console.log("Error uploading files: ", error);
  }
}

export function getImageFormat(base64Image) {
  // Directly slice the first few characters to extract the format
  if (base64Image.startsWith('data:image/')) {
    const format = base64Image.slice(11, base64Image.indexOf(';', 11)); // Extract format (e.g., 'jpeg', 'png')
    return format;
  }
  throw new Error('Invalid Base64 image string');
}
import {
  GetObjectCommand,
  GetObjectCommandInput,
  S3Client,
} from "@aws-sdk/client-s3";

export class S3 {
  awsS3Client: S3Client;
  constructor() {
    this.awsS3Client = new S3Client({ region: "eu-west-2" });
  }

  async getData(fileName: string): Promise<any> {
    const input: GetObjectCommandInput = {
      Bucket: "alifensome-general-bucket",
      Key: `/gpga/data/${fileName}`,
    };
    const request = new GetObjectCommand(input);

    const result = await this.awsS3Client.send(request);
    const body = await result.Body?.transformToString();
    if (!body) {
      throw new Error("no body for getData");
    }
    return JSON.parse(body);
  }
}

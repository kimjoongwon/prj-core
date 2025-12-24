import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
// aws.service.ts
import { Global, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AwsConfig } from "@cocrepo/type";

@Global()
@Injectable()
export class AwsService {
	s3Client: S3Client;
	aws: AwsConfig;

	constructor(private configService: ConfigService) {
		const aws = this.configService.get<AwsConfig>("aws");
		if (!aws) {
			throw new Error("AWS configuration is missing");
		}
		this.aws = aws;
		// AWS S3 클라이언트 초기화. 환경 설정 정보를 사용하여 AWS 리전, Access Key, Secret Key를 설정.
		this.s3Client = new S3Client({
			region: aws.region, // AWS Region
			credentials: {
				accessKeyId: aws.accessKeyId, // Access Key
				secretAccessKey: aws.secretAccessKey, // Secret Key
			},
		});
	}

	async uploadToS3(
		fileName: string, // 업로드될 파일의 이름
		file: any, // 업로드할 파일
		ext: string, // 파일 확장자
	) {
		// AWS S3에 이미지 업로드 명령을 생성합니다. 파일 이름, 파일 버퍼, 파일 접근 권한, 파일 타입 등을 설정합니다.
		const command = new PutObjectCommand({
			Bucket: this.aws.s3BucketName, // S3 버킷 이름
			Key: fileName, // 업로드될 파일의 이름
			Body: file.buffer, // 업로드할 파일
			ContentType: `image/${ext}`, // 파일 타입
		});

		// 생성된 명령을 S3 클라이언트에 전달하여 이미지 업로드를 수행합니다.
		await this.s3Client.send(command);

		// 업로드된 이미지의 URL을 반환합니다.
		return `https://s3.${process.env.AWS_REGION}.amazonaws.com/${this.aws.s3BucketName}/${fileName}`;
	}

	// async upload(file: Express.Multer.File) {
	//   const url = await this.awsService.uploadToS3(
	//     file.originalname,
	//     file,
	//     file.mimetype.split('/')[1],
	//   );

	//   return url;
	// }
}

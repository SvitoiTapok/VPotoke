package com.example.backend.s3api;

import io.minio.*;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.InputStream;

@Slf4j
@Service
public class MinioService {

    private final MinioClient minioClient;

    @Value("${minio.bucket-name}")
    private String bucket;
    public MinioService(MinioClient minioClient) {
        this.minioClient = minioClient;
    }

    //Для дяди Богдана
//    public String saveImportFile(MultipartFile file) throws Exception {
//        ensureBucketExists();
//
//        String originalFilename = file.getOriginalFilename();
//        String fileExtension = getFileExtension(originalFilename);
//        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
//        String uniqueFileName = String.format("import_%s_%s%s",
//                timestamp, UUID.randomUUID().toString().substring(0, 8), fileExtension);
//
//        try (InputStream inputStream = file.getInputStream()) {
//            minioClient.putObject(
//                    PutObjectArgs.builder()
//                            .bucket(bucketName)
//                            .object(uniqueFileName)
//                            .stream(inputStream, file.getSize(), -1)
//                            .contentType(file.getContentType())
//                            .build()
//            );
//
//            log.info("Файл '{}' сохранен в MinIO как '{}'", originalFilename, uniqueFileName);
//            return uniqueFileName;
//        }
//    }

//    private void ensureBucketExists() throws Exception {
//        boolean bucketExists = minioClient.bucketExists(
//                BucketExistsArgs.builder()
//                        .bucket(bucketName)
//                        .build()
//        );
//
//        if (!bucketExists) {
//            minioClient.makeBucket(
//                    MakeBucketArgs.builder()
//                            .bucket(bucketName)
//                            .build()
//            );
//            log.info("Bucket '{}' создан в MinIO", bucketName);
//        }
//    }
//
//    private String getFileExtension(String filename) {
//        if (filename == null || filename.lastIndexOf(".") == -1) {
//            return "";
//        }
//        return filename.substring(filename.lastIndexOf("."));
//    }

    public byte[] getFile(String objectName) {
        try (InputStream stream = minioClient.getObject(
                GetObjectArgs.builder()
                        .bucket(bucket)
                        .object(objectName)
                        .build())) {

            return stream.readAllBytes();

        } catch (Exception e) {
            throw new RuntimeException("MinIO read error: " + e.getMessage(), e);
        }
    }
}

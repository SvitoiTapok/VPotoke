package com.example.backend.s3api;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.ResponseBytes;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@Service
@Slf4j
public class YandexService {

    private final S3Client s3;

    @Value("${yandex.bucket}")
    private String bucket;

    public YandexService(S3Client s3) {
        this.s3 = s3;
    }

    public byte[] getFile(String key) {
        ResponseBytes<GetObjectResponse> bytes =
                s3.getObjectAsBytes(GetObjectRequest.builder()
                        .bucket(bucket)
                        .key(key)
                        .build());

        return bytes.asByteArray();
    }
    public void uploadFile(String key, byte[] data, String contentType) {

        s3.putObject(
                PutObjectRequest.builder()
                        .bucket(bucket)
                        .key(key)
                        .contentType(contentType)
                        .build(),
                RequestBody.fromBytes(data)
        );
    }
//    @PostConstruct
//    public void uploadTestFile() {
//        try {
//            byte[] data = "Hello Yandex Object Storage!".getBytes();
//
//            uploadFile(
//                    "test/test-video.txt",
//                    data,
//                    "text/plain"
//            );
//
//           log.info(" Файл загружен на Yandex Object Storage!");
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//    }
}
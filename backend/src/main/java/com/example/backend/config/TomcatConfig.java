package com.example.backend.config;

import org.apache.catalina.connector.Connector;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.stereotype.Component;

@Component
public class TomcatConfig implements WebServerFactoryCustomizer<TomcatServletWebServerFactory> {

    @Override
    public void customize(TomcatServletWebServerFactory factory) {
        factory.addConnectorCustomizers((Connector connector) -> {
            // Устанавливаем максимальный размер POST запроса
            connector.setMaxPostSize(5 * 1024 * 1024 * 1024); // 5GB в байтах
            connector.setMaxSavePostSize(5 * 1024 * 1024 * 1024); // 5GB в байтах

            // Вместо setConnectionTimeout используем setProperty
            connector.setProperty("connectionTimeout", "600000"); // 10 минут в миллисекундах

            // Дополнительные настройки через setProperty
            connector.setProperty("maxSwallowSize", String.valueOf(5L * 1024 * 1024 * 1024));
            connector.setProperty("maxKeepAliveRequests", "100");
            connector.setProperty("keepAliveTimeout", "60000");
        });
    }
}
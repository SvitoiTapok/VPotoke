package com.example.backend.util;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

import javax.sql.DataSource;

@Configuration
public class ClickHouseConfig {
    @Bean
    public JdbcTemplate clickhouseJdbcTemplate() {
        DataSource dataSource = new DriverManagerDataSource(
                "jdbc:clickhouse://clickhouse:8123/vpotoke_clickhouse?protocol=http&compress=0",
                "user",
                "password"
        );
        return new JdbcTemplate(dataSource);
    }
}


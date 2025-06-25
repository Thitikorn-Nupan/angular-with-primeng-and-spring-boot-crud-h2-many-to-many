package com.ttknp.springbootcrudh2manytomany.helpers.useful_services;

import org.springframework.data.relational.core.mapping.Table;
import org.springframework.stereotype.Component;

@Component
public class JdbcCommonService {
    public String getSchemaAndTableNameOnTableAnnotation(Class<?> entityClass) {
        Table tableAnnotation = entityClass.getAnnotation(Table.class);
        if (tableAnnotation != null) {
            return tableAnnotation.schema()+"."+tableAnnotation.name();
        }
        throw new RuntimeException("Schema & Table " + entityClass.getSimpleName() + " has no @Table annotation");
    }

    public String getTableNameOnTableAnnotation(Class<?> entityClass) {
        Table tableAnnotation = entityClass.getAnnotation(Table.class);
        if (tableAnnotation != null) {
            return tableAnnotation.name();
        }
        throw new RuntimeException("Table " + entityClass.getSimpleName() + " has no @Table annotation");
    }

    public String getSchemaNameOnTableAnnotation(Class<?> entityClass) {
        Table tableAnnotation = entityClass.getAnnotation(Table.class);
        if (tableAnnotation != null) {
            return tableAnnotation.schema();
        }
        throw new RuntimeException("Schema " + entityClass.getSimpleName() + " has no @Table annotation");
    }
}

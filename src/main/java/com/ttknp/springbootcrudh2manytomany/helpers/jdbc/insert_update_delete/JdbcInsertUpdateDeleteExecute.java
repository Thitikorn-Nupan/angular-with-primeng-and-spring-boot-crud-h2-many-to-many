package com.ttknp.springbootcrudh2manytomany.helpers.jdbc.insert_update_delete;

import com.ttknp.springbootcrudh2manytomany.custom_annotations.IgnoreGenerateSQL;
import com.ttknp.springbootcrudh2manytomany.helpers.useful_services.JdbcCommonService;
import com.ttknp.springbootcrudh2manytomany.helpers.useful_services.SQLSyntaxService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class JdbcInsertUpdateDeleteExecute<T> {

    private final JdbcTemplate jdbcTemplate;
    private final JdbcCommonService jdbcCommonService;

    @Autowired
    public JdbcInsertUpdateDeleteExecute(JdbcTemplate jdbcTemplate, JdbcCommonService jdbcCommonService) {
        this.jdbcTemplate = jdbcTemplate;
        this.jdbcCommonService = jdbcCommonService;
    }

    /** Note, update works for insert & delete & update statements */
    private Integer executeUpdate(String sql, Object... params) {
        return jdbcTemplate.update(sql, params);
    }

    // ------------ Dynamic insert statement auto map param ------------
    public Integer insertOne(Class<T> aBeanClass, T aBeanObject) throws IllegalAccessException {
        StringBuilder stringBuilderSQL,stringBuilderSQLValues;

        stringBuilderSQL = new StringBuilder();
        stringBuilderSQLValues = new StringBuilder();

        stringBuilderSQL.append(SQLSyntaxService.INSERT);
        stringBuilderSQL.append(jdbcCommonService.getSchemaAndTableNameOnTableAnnotation(aBeanClass));
        stringBuilderSQL.append(" (");

        stringBuilderSQLValues.append(" values (");

        Field[] fields = aBeanClass.getDeclaredFields(); // get each props as array of class
        List<Object> objectsValues = new ArrayList<>();

        for (int i = 0; i < fields.length ; i++) {

            Field field = fields[i];

            if (!field.isAnnotationPresent(IgnoreGenerateSQL.class)) {

                // **** Make the field accessible if it's private
                field.setAccessible(true);
                Column columnAnnotation = null;
                String fieldName;
                Object fieldValue;

                if (field.isAnnotationPresent(Column.class)) {
                    columnAnnotation = field.getAnnotation(Column.class);
                }

                if (columnAnnotation != null) { // check if property name (POJO) it's not the same column name (Field Table)
                    fieldName = columnAnnotation.value();  // columnAnnotation => @org.springframework.data.relational.core.mapping.Column("full_name") columnAnnotation.value() =>  full_name
                } else {
                    fieldName = field.getName();
                }

                stringBuilderSQL
                        .append(fieldName)
                        .append(" ,");

                stringBuilderSQLValues
                        .append(SQLSyntaxService.ASSIGN)
                        .append(" ,");


                // **** Get the value of the field for the specific POJO instance
                fieldValue = field.get(aBeanObject);
                // log.debug("Field Name: {} , Value: {}" ,fieldName, fieldValue);
                objectsValues.add(fieldValue);
            }

        } // end for

        stringBuilderSQL
                .deleteCharAt(stringBuilderSQL.length() - 1)
                .append(")");

        stringBuilderSQLValues
                .deleteCharAt(stringBuilderSQLValues.length() - 1)
                .append(")");

        stringBuilderSQL
                .append(stringBuilderSQLValues);

        log.debug("sql insert = {}", stringBuilderSQL.toString());
        return executeUpdate(stringBuilderSQL.toString(),objectsValues.toArray());
    }


    // ------------ Dynamic update statement auto map param  ------------
    public Integer updateOne(Class<T> aBeanClass, String uniqColumnName, T aBeanObject) throws IllegalAccessException {

        StringBuilder stringBuilderSQL;
        stringBuilderSQL = new StringBuilder();

        stringBuilderSQL.append(SQLSyntaxService.UPDATE);
        stringBuilderSQL.append(jdbcCommonService.getSchemaAndTableNameOnTableAnnotation(aBeanClass));
        stringBuilderSQL.append(" set ");

        Field[] fields = aBeanClass.getDeclaredFields(); // get each props as array of class
        List<Object> objectsValues = new ArrayList<>();

        for (Field field : fields) {

            if (!field.isAnnotationPresent(IgnoreGenerateSQL.class)) {

                field.setAccessible(true); // **** Make the field accessible if it's private
                Column columnAnnotation = null;
                String fieldName;
                Object fieldValue;

                if (field.isAnnotationPresent(Column.class)) {
                    columnAnnotation = field.getAnnotation(Column.class);
                }

                if (columnAnnotation != null) { // check if property name (POJO) it's not the same column name (Field Table)
                    fieldName = columnAnnotation.value();  // columnAnnotation => @org.springframework.data.relational.core.mapping.Column("full_name") columnAnnotation.value() =>  full_name
                } else {
                    fieldName = field.getName();
                }

                if (!uniqColumnName.equals(fieldName)) { // uniqColumnName.equals(fieldName) have to do on last element
                    stringBuilderSQL.append(fieldName)
                            .append(SQLSyntaxService.ASSIGN_EQUAL)
                            .append(" ,");

                    fieldValue = field.get(aBeanObject); // **** Get the value of the field for the specific POJO instance
                    log.debug("Field Name: {} , Value: {}", fieldName, fieldValue);
                    objectsValues.add(fieldValue);
                }

            }

        } // end for


        for (Field field : fields) {
            String fieldName;
            Column columnAnnotation = null;
            if (field.isAnnotationPresent(Column.class)) {
                columnAnnotation = field.getAnnotation(Column.class);
            }
            if (columnAnnotation != null) { // check if property name (POJO) it's not the same column name (Field Table)
                fieldName = columnAnnotation.value();  // columnAnnotation => @org.springframework.data.relational.core.mapping.Column("full_name") columnAnnotation.value() =>  full_name
            } else {
                fieldName = field.getName();
            }
            Object fieldValue;
            if (uniqColumnName.equals(fieldName)) {
                field.setAccessible(true); // **** Make the field accessible if it's private
                fieldValue = field.get(aBeanObject); // **** Get the value of the field for the specific POJO instance
                log.debug("Field Name: {} , Value: {}", fieldName, fieldValue);
                objectsValues.add(fieldValue);
            }
        }

        stringBuilderSQL
                .deleteCharAt(stringBuilderSQL.length() - 1)
                .append(" where ")
                .append(uniqColumnName)
                .append(SQLSyntaxService.ASSIGN_EQUAL);

        log.debug("sql update = {}", stringBuilderSQL.toString());
        return executeUpdate(stringBuilderSQL.toString(),objectsValues.toArray());
    }


    // ------------ Dynamic delete statement ------------
    public Integer deleteOne(Class<T> aBeanClass, String uniqColumnName,Object uniqValue) throws IllegalAccessException {
        StringBuilder stringBuilderSQL = new StringBuilder()
                .append(SQLSyntaxService.DELETE)
                .append(jdbcCommonService.getSchemaAndTableNameOnTableAnnotation(aBeanClass))
                .append(" where ")
                .append(uniqColumnName+" ")
                .append(SQLSyntaxService.ASSIGN_EQUAL);
        log.debug("sql delete = {}", stringBuilderSQL.toString());
        return executeUpdate(stringBuilderSQL.toString(),uniqValue);
    }

    public Integer deleteOne(Class<T> aBeanClass, String uniqColumnName, String uniqSubColumnName,Object ...params) throws IllegalAccessException {
        StringBuilder stringBuilderSQL = new StringBuilder()
                .append(SQLSyntaxService.DELETE)
                .append(jdbcCommonService.getSchemaAndTableNameOnTableAnnotation(aBeanClass))
                .append(" where ")
                .append(uniqColumnName)
                .append(SQLSyntaxService.ASSIGN_EQUAL)
                .append(" and ")
                .append(uniqSubColumnName)
                .append(SQLSyntaxService.ASSIGN_EQUAL);
        log.debug("sql delete = {}", stringBuilderSQL.toString());
        return executeUpdate(stringBuilderSQL.toString(),params);
    }

}

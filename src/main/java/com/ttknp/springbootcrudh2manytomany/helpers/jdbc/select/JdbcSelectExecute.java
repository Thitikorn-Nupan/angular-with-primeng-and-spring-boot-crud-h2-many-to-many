package com.ttknp.springbootcrudh2manytomany.helpers.jdbc.select;

import com.ttknp.springbootcrudh2manytomany.helpers.useful_services.JdbcCommonService;
import com.ttknp.springbootcrudh2manytomany.helpers.useful_services.SQLSyntaxService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JdbcSelectExecute<T> {

    private final JdbcTemplate jdbcTemplate;
    private final JdbcCommonService jdbcCommonService;

    @Autowired
    public JdbcSelectExecute(JdbcTemplate jdbcTemplate, JdbcCommonService jdbcCommonService) {
        this.jdbcTemplate = jdbcTemplate;
        this.jdbcCommonService = jdbcCommonService;
    }

    private <U> List<U> executeQueryForList(String sql , Class<U> aTypeClass, Object... params) {
        return jdbcTemplate.queryForList(sql, aTypeClass,params);
    }

    private <T> List<T> executeQuery(String sql, RowMapper<T> rowMapper, Object... params) { // RowMapper as Mapping auto
        return jdbcTemplate.query(sql, rowMapper, params);
    }

    private <T> T executeQuery(String sql, ResultSetExtractor<T> resultSetExtractor, Object... params) { // RowMapper as Mapping auto
        return jdbcTemplate.query(sql, resultSetExtractor, params);
    }

    private <T> T executeQueryForObject(String sql, RowMapper<T> rowMapper, Object... params) {
        return jdbcTemplate.queryForObject(sql, rowMapper, params);
    }

    /** Note, Class<T> aClassType for specify return type */
    private <U> U executeQueryForObject(String sql, Class<U> aClassType, Object... params) {
        return jdbcTemplate.queryForObject(sql, aClassType, params);
    }


    // ------------ Select as List ------------
    public <T> List<T> selectAll(Class<T> aBeanClass) {
        StringBuilder stringBuilder = new StringBuilder()
                .append(SQLSyntaxService.SELECT_START)
                .append(jdbcCommonService.getSchemaAndTableNameOnTableAnnotation(aBeanClass));
        return executeQuery(stringBuilder.toString() , new BeanPropertyRowMapper<>(aBeanClass) ,null);
    }

    public <T,S,TS> List<T> selectAllWhereNotIn(Class<T> aBeanClass,Class<S> aSubBeanClass, Class<TS> aRelationBeanClass, String uniqKeyMain, String uniqKeySub,  Object uniqSubValue) {
        /*
            Expect.
            select *
            from H2_SCHOOL.ACTORS as a
            where a.AID not in (
                select a.AID
                from H2_SCHOOL.MOVIES as m
                join H2_SCHOOL.ACTORS_MOVIES as a_m
                on m.MID = a_m.MID
                join H2_SCHOOL.ACTORS as a
                on a.AID = a_m.AID
                where a_m.MID = 'M002'
        )*/
        StringBuilder stringBuilder = new StringBuilder()
                .append(SQLSyntaxService.SELECT_START) // select *
                .append(jdbcCommonService.getSchemaAndTableNameOnTableAnnotation(aBeanClass)+" m") // m = actor
                .append(" WHERE m."+uniqKeyMain +" NOT IN ( ") // m.AID
                // Subquery
                .append(SQLSyntaxService.SELECT)
                .append(" m."+uniqKeyMain) // m.AID
                .append(" FROM "+jdbcCommonService.getSchemaAndTableNameOnTableAnnotation(aSubBeanClass)+" s")
                .append(" JOIN "+jdbcCommonService.getSchemaAndTableNameOnTableAnnotation(aRelationBeanClass)+" r")
                .append(" ON r."+uniqKeySub+" = s."+uniqKeySub)
                .append(" JOIN "+jdbcCommonService.getSchemaAndTableNameOnTableAnnotation(aBeanClass)+" m")
                .append(" ON r."+uniqKeyMain+" = m."+uniqKeyMain)
                .append(" WHERE r."+uniqKeySub)
                .append(SQLSyntaxService.ASSIGN_EQUAL)
                .append(")");
        return executeQuery(stringBuilder.toString() , new BeanPropertyRowMapper<>(aBeanClass) ,uniqSubValue);
    }

    public <U> List<U> selectAllOnlyColumn(Class<T> aBeanClass, Class<U> aTypeClass, String columnName ) { // U can be only String , Integer , ... anything but should not be Object
        StringBuilder stringBuilder = new StringBuilder()
                .append(SQLSyntaxService.SELECT)
                .append(columnName + " from ")
                .append(jdbcCommonService.getSchemaAndTableNameOnTableAnnotation(aBeanClass));
        return executeQueryForList(stringBuilder.toString(), aTypeClass,null);
    }





    // ------------ Select as Object ------------
    public <T> T selectOne(Class<T> aBeanClass,String uniqColumnName ,Object param) {
        StringBuilder stringBuilder = new StringBuilder()
                .append(SQLSyntaxService.SELECT_START)
                .append(jdbcCommonService.getSchemaAndTableNameOnTableAnnotation(aBeanClass))
                .append(" where "+uniqColumnName)
                .append(SQLSyntaxService.ASSIGN_EQUAL);
        return executeQueryForObject(stringBuilder.toString(), new BeanPropertyRowMapper<T>(aBeanClass), param);
    }

    public <T,S,TS> T selectRelationWhereMain(Class<T> aBeanClass, Class<S> aSubBeanClass, Class<TS> aRelationBeanClass, String uniqKeyMain, String uniqKeySub, ResultSetExtractor<T> resultSetExtractor, Object param) {
        StringBuilder stringBuilder = new StringBuilder()
                .append(SQLSyntaxService.SELECT_START)
                .append(jdbcCommonService.getSchemaAndTableNameOnTableAnnotation(aBeanClass)+" m ")
                .append("JOIN "+jdbcCommonService.getSchemaAndTableNameOnTableAnnotation(aRelationBeanClass)+" r ")
                .append("ON r."+uniqKeyMain+" = m."+uniqKeyMain+" ")
                .append("JOIN ")
                .append(jdbcCommonService.getSchemaAndTableNameOnTableAnnotation(aSubBeanClass)+" s ")
                .append("ON r."+uniqKeySub+" = s."+uniqKeySub+" ")
                .append("WHERE m."+uniqKeyMain)
                .append(SQLSyntaxService.ASSIGN_EQUAL);
        return executeQuery(stringBuilder.toString(), resultSetExtractor, param);
    }




    // ------------ Select Count ------------
    public Integer selectCount( Class<T> aBeanClass , String uniqColumnName, Object uniqValue) {
        StringBuilder stringBuilder = new StringBuilder()
                .append(SQLSyntaxService.SELECT_COUNT)
                .append(jdbcCommonService.getSchemaAndTableNameOnTableAnnotation(aBeanClass))
                .append(" where ")
                .append(uniqColumnName)
                .append(SQLSyntaxService.ASSIGN_EQUAL);
        return executeQueryForObject(stringBuilder.toString(),Integer.class,uniqValue);
    }

    public Integer selectCount( Class<T> aBeanClass , String uniqColumnName,String uniqSubColumnName, Object ...params) {
        StringBuilder stringBuilder = new StringBuilder()
                .append(SQLSyntaxService.SELECT_COUNT)
                .append(jdbcCommonService.getSchemaAndTableNameOnTableAnnotation(aBeanClass))
                .append(" where ")
                .append(uniqColumnName)
                .append(SQLSyntaxService.ASSIGN_EQUAL)
                .append(" and ")
                .append(uniqSubColumnName)
                .append(SQLSyntaxService.ASSIGN_EQUAL);
        return executeQueryForObject(stringBuilder.toString(),Integer.class,params);
    }

    public Integer selectCount( Class<T> aBeanClass ) {
        StringBuilder stringBuilder = new StringBuilder()
                .append(SQLSyntaxService.SELECT_COUNT)
                .append(jdbcCommonService.getSchemaAndTableNameOnTableAnnotation(aBeanClass));
        return executeQueryForObject(stringBuilder.toString(),Integer.class,null);
    }



}

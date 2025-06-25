package com.ttknp.springbootcrudh2manytomany.helpers.jdbc;

import com.ttknp.springbootcrudh2manytomany.helpers.jdbc.insert_update_delete.JdbcInsertUpdateDeleteExecute;
import com.ttknp.springbootcrudh2manytomany.helpers.jdbc.select.JdbcSelectExecute;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

public abstract class ModelJdbcExecuteHelper<T> {
    // no need CDI in abs class
    @Autowired
    protected JdbcSelectExecute jdbcSelectExecute;
    @Autowired
    protected JdbcInsertUpdateDeleteExecute jdbcInsertUpdateDeleteExecute;

    // Reads
    public abstract List<T> findAll();
    public abstract <U> List<U> findAllOnlyColumn(String columnName);
    public abstract <U> T findOneIncludeRelation(U pk);
    public abstract <U> T findOneByPk(U pk);
    // Create
    public abstract Integer saveModel(T model);
    // Update
    public abstract Integer editModelByPk(T model);
    // Delete
    public abstract <U> Integer removeModelByPk( U pk);
}

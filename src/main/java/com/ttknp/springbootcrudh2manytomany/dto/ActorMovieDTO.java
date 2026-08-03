package com.ttknp.springbootcrudh2manytomany.dto;

import com.ttknp.springbootcrudh2manytomany.entities.ActorMovie;
import com.ttknp.springbootcrudh2manytomany.exception.ContentNotAllowed;
import com.ttknp.springbootcrudh2manytomany.helpers.jdbc.ModelJdbcExecuteHelper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.List;

@Slf4j
@Service
public class ActorMovieDTO extends ModelJdbcExecuteHelper<ActorMovie> {

    @Override
    public List<ActorMovie> findAll() {
        return null;
    }

    @Override
    public List<ActorMovie> findAllNotInWhere(String uniqSubKey) {
        return null;
    }

    @Override
    public <U> List<U> findAllOnlyColumn(String columnName) {
        return null;
    }

    @Override
    public <U> ActorMovie findOneIncludeRelation(U pk) {
        return null;
    }

    @Override
    public <U> ActorMovie findOneByPk(U pk) {
        return null;
    }

    @Override
    public Integer saveModel(ActorMovie model) {
        // check ai
        int rowAffected = 0;
        rowAffected = countAllRelationByPkAndSubPk(model.getAid(), model.getMid());
        if (rowAffected == 0) {
            log.debug("can insert");
            try {
                rowAffected = jdbcInsertUpdateDeleteExecute.insertOne(ActorMovie.class,model);
            } catch (Exception e) {
                throw new ContentNotAllowed(e);
            }
        } else {
            // log.debug("can not insert");
            Exception exception = new RuntimeException("can not insert aid has mid");
            throw new ContentNotAllowed(exception);
        }
        return rowAffected;
    }

    private Integer countAllRelationByPkAndSubPk(String pk,String subPk) {
        return jdbcSelectExecute.selectCount(ActorMovie.class, "aid","mid",pk,subPk);
    }

    @Override
    public Integer editModelByPk(ActorMovie model) {
        return null;
    }

    @Override
    public <U> Integer removeModelByPk(U pk) {
        return 0;
    }

    public Integer removeModelByPkAndSubPk(String pk,String subPk) {
        try {
            return jdbcInsertUpdateDeleteExecute.deleteOne(ActorMovie.class, "aid", "mid", pk, subPk);
        } catch (Exception e) {
            throw new ContentNotAllowed(e);
        }
    }
}

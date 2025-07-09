package com.ttknp.springbootcrudh2manytomany.dto;

import com.ttknp.springbootcrudh2manytomany.entities.Actor;
import com.ttknp.springbootcrudh2manytomany.entities.ActorMovie;
import com.ttknp.springbootcrudh2manytomany.entities.Movie;
import com.ttknp.springbootcrudh2manytomany.exception.ContentNotAllowed;
import com.ttknp.springbootcrudh2manytomany.helpers.jdbc.ModelJdbcExecuteHelper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Slf4j
@Service
public class MovieDTO extends ModelJdbcExecuteHelper<Movie> {


    @Override
    public List<Movie> findAll() {
        return jdbcSelectExecute.selectAll(Movie.class);
    }

    @Override
    public List<Movie> findAllNotInWhere(String uniqSubKey) {
        return jdbcSelectExecute.selectAllWhereNotIn(Movie.class, Actor.class, ActorMovie.class,"mid","aid", uniqSubKey);
    }

    public List<String> findAllOnlyColumnNotInWhere(String uniqSubKey) {
        return jdbcSelectExecute.selectAllOnlyColumnWhereNotIn(Movie.class, Actor.class, ActorMovie.class,String.class,"mid","aid","mid", uniqSubKey);

    }

    @Override
    public <U> List<U> findAllOnlyColumn(String columnName) {
        Class<?> typeClass = switch (columnName) {
            case "mid" -> String.class;
            case "title" -> String.class;
            case "categories" -> String.class;
            case "rate" -> BigDecimal.class;
            case "year" -> LocalDate.class;
            default -> null;
        };
        return jdbcSelectExecute.selectAllOnlyColumn(Movie.class,typeClass,columnName);
    }

    @Override
    public <U> Movie findOneIncludeRelation(U pk) {
        return (Movie) jdbcSelectExecute.selectRelationWhereMain(Movie.class, Actor.class, ActorMovie.class,"mid","aid",new MovieJoinActorsResultSetExtractor(),pk);
    }

    @Override
    public <U> Movie findOneByPk(U pk) {
        return (Movie) jdbcSelectExecute.selectOne(Movie.class,"mid",pk);
    }

    @Override
    public Integer saveModel(Movie model) {
        try {
            return jdbcInsertUpdateDeleteExecute.insertOne(Movie.class,model);
        } catch (Exception e) {
            throw new ContentNotAllowed(e);
        }
    }

    @Override
    public Integer editModelByPk(Movie model) {
        try {
            return jdbcInsertUpdateDeleteExecute.updateOne(Movie.class,"mid",model);
        } catch (Exception e) {
            throw new ContentNotAllowed(e);
        }
    }

    @Override
    public <U> Integer removeModelByPk(U pk) {
        int rowAffected = 0;
        if (countAllRelationByPk(pk.toString()) > 0) {
            log.debug("Found relation by pk");
            try {
                rowAffected = jdbcInsertUpdateDeleteExecute.deleteOne(ActorMovie.class,"mid",pk);
                log.debug("Removed {} relation",rowAffected);
            } catch (Exception e) {
                throw new ContentNotAllowed(e);
            }
        }
        try {
            rowAffected = jdbcInsertUpdateDeleteExecute.deleteOne(Movie.class,"mid",pk);
            log.debug("Removed {} by pk",rowAffected);
        } catch (Exception e) {
            throw new ContentNotAllowed(e);
        }
        return rowAffected;
    }

    private Integer countAllRelationByPk(String pk) {
        return jdbcSelectExecute.selectCount(ActorMovie.class, "mid",pk);
    }


    private static class MovieJoinActorsResultSetExtractor implements ResultSetExtractor<Movie> {
        @Override
        public Movie extractData(ResultSet rs) throws SQLException {
            Movie movie = new Movie();
            Set<Actor> actorAsSet = new HashSet<>(); // Note set won't cut the duplicate object if you forget set Override equals() and hashCode() on your POJOs

            while (rs.next()) {

                movie.setMid(rs.getString("mid"));
                movie.setTitle(rs.getString("title"));
                movie.setCategories(rs.getString("categories"));
                movie.setRate(BigDecimal.valueOf(rs.getDouble("rate")));
                movie.setYear(LocalDate.parse(rs.getString("year")));

                Actor actor = new Actor();
                actor.setAid(rs.getString("aid"));
                actor.setFullName(rs.getString("full_name"));
                actor.setBorn(LocalDate.parse(rs.getString("born")));
                actor.setContact(rs.getString("contact"));

                actorAsSet.add(actor);
            }
            movie.setActors(actorAsSet);
            return movie;
        }
    }

}

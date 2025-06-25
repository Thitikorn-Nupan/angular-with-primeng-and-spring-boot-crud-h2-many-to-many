package com.ttknp.springbootcrudh2manytomany.dto;

import com.ttknp.springbootcrudh2manytomany.entities.Actor;
import com.ttknp.springbootcrudh2manytomany.entities.ActorMovie;
import com.ttknp.springbootcrudh2manytomany.entities.Movie;
import com.ttknp.springbootcrudh2manytomany.helpers.jdbc.ModelJdbcExecuteHelper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Service;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Slf4j
@Service
public class ActorDTO extends ModelJdbcExecuteHelper<Actor> {

    @Override
    public List<Actor> findAll() {
        return jdbcSelectExecute.selectAll(Actor.class);
    }

    // *** select actors that is not in movie id (in actor service)
    @Override
    public List<Actor> findAllNotInWhere(String uniqSubKey) {
        return jdbcSelectExecute.selectAllWhereNotIn(Actor.class, Movie.class, ActorMovie.class,"aid","mid", uniqSubKey);
    }

    @Override
    public <U> List<U> findAllOnlyColumn(String columnName) {
        // new switch case
        Class<?> typeClass = switch (columnName) {
            case "aid" -> String.class;
            case "full_name" -> String.class;
            case "born" -> LocalDate.class;
            case "contact" -> String.class;
            default -> null;
        };
        return jdbcSelectExecute.selectAllOnlyColumn(Actor.class,typeClass,columnName);
    }

    @Override
    public <U> Actor findOneIncludeRelation(U pk) {
        return (Actor) jdbcSelectExecute.selectRelationWhereMain(Actor.class, Movie.class, ActorMovie.class,"aid","mid",new ActorJoinMoviesResultSetExtractor(),pk);
    }

    @Override
    public <U> Actor findOneByPk(U pk) {
        return (Actor) jdbcSelectExecute.selectOne(Actor.class,"aid",pk);
    }

    @Override
    public Integer saveModel(Actor model) {
        try {
            return jdbcInsertUpdateDeleteExecute.insertOne(Actor.class,model);
        } catch (IllegalAccessException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public Integer editModelByPk(Actor model) {
        try {
            return jdbcInsertUpdateDeleteExecute.updateOne(Actor.class,"aid",model);
        } catch (IllegalAccessException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public <U> Integer removeModelByPk(U pk) {
        int rowAffected = 0;
        if (countAllRelationByPk(pk.toString()) > 0) {
            log.debug("Found relation by pk");
            try {
                rowAffected = jdbcInsertUpdateDeleteExecute.deleteOne(ActorMovie.class,"aid",pk);
                log.debug("Removed {} relation",rowAffected);
            } catch (IllegalAccessException e) {
                throw new RuntimeException(e);
            }
        }
        try {
            rowAffected = jdbcInsertUpdateDeleteExecute.deleteOne(Actor.class,"aid",pk);
            log.debug("Removed {} by pk",rowAffected);
        } catch (IllegalAccessException e) {
            throw new RuntimeException(e);
        }
        return rowAffected;
    }


    private Integer countAllRelationByPk(String pk) {
        return jdbcSelectExecute.selectCount(ActorMovie.class, "aid",pk);
    }

    private static class ActorJoinMoviesResultSetExtractor implements ResultSetExtractor<Actor> {
        @Override
        public Actor extractData(ResultSet rs) throws SQLException {
            Actor actor = new Actor();
            Set<Movie> movieAsSet = new HashSet<>(); // Note set won't cut the duplicate object if you forget set Override equals() and hashCode() on your POJOs

            while (rs.next()) {

                actor.setAid(rs.getString("aid"));
                actor.setFullName(rs.getString("full_name"));
                actor.setBorn(LocalDate.parse(rs.getString("born")));
                actor.setContact(rs.getString("contact"));

                Movie movie = new Movie();
                movie.setMid(rs.getString("mid"));
                movie.setTitle(rs.getString("title"));
                movie.setCategories(rs.getString("categories"));
                movie.setRate(rs.getBigDecimal("rate"));
                movie.setYear(LocalDate.parse(rs.getString("year")));

                movieAsSet.add(movie);
            }
            actor.setMovies(movieAsSet);
            return actor;
        }
    }


}

package com.ttknp.springbootcrudh2manytomany.controllers;

import com.ttknp.springbootcrudh2manytomany.custom_annotations.CommonRestAPI;
import com.ttknp.springbootcrudh2manytomany.dto.MovieDTO;
import com.ttknp.springbootcrudh2manytomany.entities.Actor;
import com.ttknp.springbootcrudh2manytomany.entities.Movie;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = {"http://localhost:4200","http://thitkorn-nupan.com"})
@Slf4j
@CommonRestAPI(configPath = {"/movie","/movies"})
public class MovieController {
    private final MovieDTO movieDTO;

    @Autowired
    public MovieController(MovieDTO movieDTO) {
        this.movieDTO = movieDTO;
    }

    @GetMapping(value = "/selectAll")
    protected ResponseEntity<List<Movie>> selectAll() {
        return ResponseEntity.ok(movieDTO.findAll());
    }

    // *** select actors that is not in movie id (in actor service)
    // ex, selectAllNotInWhere?uniqSubValue=A003
    @GetMapping(value = "/selectAllNotInWhere",params = "uniqSubValue")
    protected ResponseEntity<List<Movie>> selectAllNotInWhere(String uniqSubValue) {
        return ResponseEntity.ok(movieDTO.findAllNotInWhere(uniqSubValue));
    }

    // ex, selectAllOnlyColumn?name=born
    @GetMapping(value = "/selectAllOnlyColumn",params = "name") // if you don't need to use @RequestParam you can set params name on @GetMapping instead
    protected ResponseEntity<List<Object>> selectAllOnlyColumn(String name) {
        return ResponseEntity.ok(movieDTO.findAllOnlyColumn(name));
    }

    // ex, selectOneByPk?aid=A001
    @GetMapping(value = "/selectOneByPk",params = "mid")
    protected ResponseEntity<Movie> selectOneByPk(String mid) {
        return ResponseEntity.ok(movieDTO.findOneByPk(mid));
    }

    @GetMapping(value = "/selectOneIncludeRelationByPk",params = "mid")
    protected ResponseEntity<Movie> selectOneIncludeRelationByPk(String mid) {
        return ResponseEntity.ok(movieDTO.findOneIncludeRelation(mid));
    }




    @PostMapping(value = "/saveOne")
    protected ResponseEntity<Boolean> saveOne(@RequestBody Movie movie) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(movieDTO.saveModel(movie) > 0);
    }




    @PutMapping(value = "/editOne")
    protected ResponseEntity<Boolean> editOne(@RequestBody Movie movie) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(movieDTO.editModelByPk(movie) > 0);
    }




    @DeleteMapping(value = "/deleteOneByPk",params = "mid")
    protected ResponseEntity<Boolean> deleteOneByPk(String mid) {
        return ResponseEntity.ok(movieDTO.removeModelByPk(mid) > 0);
    }

}

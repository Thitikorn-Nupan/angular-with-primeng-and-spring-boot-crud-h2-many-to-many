package com.ttknp.springbootcrudh2manytomany.controllers;

import com.ttknp.springbootcrudh2manytomany.custom_annotations.CommonRestAPI;
import com.ttknp.springbootcrudh2manytomany.dto.ActorMovieDTO;
import com.ttknp.springbootcrudh2manytomany.entities.ActorMovie;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@CrossOrigin(origins = {"http://localhost:4200","http://thitkorn-nupan.com"})
@Slf4j
@CommonRestAPI(configPath = "/actorMovie")
public class ActorMovieController {

    private final ActorMovieDTO actorMovieDTO;

    @Autowired
    public ActorMovieController(ActorMovieDTO actorMovieDTO) {
        this.actorMovieDTO = actorMovieDTO;
    }

    @PostMapping(value = "/saveOne")
    protected ResponseEntity<Boolean> saveOne(@RequestBody ActorMovie actorMovie) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(actorMovieDTO.saveModel(actorMovie) > 0);
    }

    @DeleteMapping(value = "/deleteOneByPkAndPk",params = {"aid","mid"})
    protected ResponseEntity<Boolean> deleteOneByPk(String aid,String mid) {
        return ResponseEntity.ok(actorMovieDTO.removeModelByPkAndSubPk(aid,mid) > 0);
    }
}

package com.ttknp.springbootcrudh2manytomany.entities;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.relational.core.mapping.Table;


@Getter
@Setter
@NoArgsConstructor
@ToString
@Table(schema = "H2_SCHOOL",name = "ACTORS_MOVIES")
public class ActorMovie {

    private String aid;
    private String mid;


    public ActorMovie(String aid, String mid) {
        this.aid = aid;
        this.mid = mid;
    }


}
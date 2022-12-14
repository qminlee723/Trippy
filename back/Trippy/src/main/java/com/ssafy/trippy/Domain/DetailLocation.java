package com.ssafy.trippy.Domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;

@Entity
@Getter
@ToString
@NoArgsConstructor(access= AccessLevel.PROTECTED)
public class DetailLocation extends BaseEntity{

    @Id
    @GeneratedValue
    @Column(name="DETAIL_LOCATION_ID")
    private Long id;

    private String detailLocationName;

    private float rating;

    private String detailLocationContent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="POST_ID")
    private Post post;

    private String filename;

    public void setPost(Post post){
        this.post = post;
        post.getDetailLocations().add(this);
    }

    public void setFilename(String filename){
        this.filename = filename;
    }

    @Builder
    public DetailLocation(Long id, String detailLocationName, float rating, String detailLocationContent,Post post,String filename) {
        this.id=id;
        this.detailLocationContent = detailLocationContent;
        this.detailLocationName = detailLocationName;
        this.rating = rating;
        this.post = post;
        this.filename = filename;
    }


    public void update(String detailLocationContent, String detailLocationName, float rating, String filename){
        this.detailLocationContent = detailLocationContent;
        this.detailLocationName = detailLocationName;
        this.rating = rating;
        this.filename = filename;
    }

}

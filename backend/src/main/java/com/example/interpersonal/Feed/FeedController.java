package com.example.interpersonal.Feed;

import com.example.interpersonal.Posts.dto.PostResponse;
import com.example.interpersonal.User.User;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/feed")
public class FeedController {

    private final FeedService feedService;
    public FeedController(FeedService feedService) {
        this.feedService = feedService;
    }



    @GetMapping("/getfeed")
    public List<PostResponse> getFeed(@RequestParam Long userId) {
        return feedService.getFeed(userId);
    }


}


//looping through the tweets in the server and creating HTML element for each tweet
const renderTweets = function(tweets) {
    for (const tweet of tweets) {
    const $htmltweet = createTweetElement(tweet);
    $('#tweets-container').prepend($htmltweet)
    }
};
  
//creating html element for a tweet
const createTweetElement = function(tweetData) {
    // using jquery to create a DOM object

    // convert data to safe data
const safeHTML = `<p>${escape(tweetData['content'].text)}</p>`;
const tweetArticle = `
    <article class="tweet"> 
        <header>
            <div class="tweet-icon">
                <img class="icon" src=${tweetData['user'].avatars}>
                <p>${tweetData['user'].name}</p>
            </div>
            <div><p>${tweetData['user'].handle}</p></div>
        </header>
        <div class="tweet-body"> ${safeHTML}</div>
        <hr class="line">
        <footer class="footer">
            <p>${moment(tweetData['created_at']).fromNow()}</p>
            <div>
                <i class="fa fa-flag"></i> <i class="fa fa-retweet"></i> <i class="fa fa-heart"></i>
            </div>
        </footer>
    </article>`;

    return tweetArticle;
};

//handle XSS edge case
const escape =  function(str) {
    let p = document.createElement('p');
    p.appendChild(document.createTextNode(str));
    return p.innerHTML;
};

 // AJAX POST for submit button
$(function() {
const $form = $("#newtweet");
$form.submit(function(event)  {
    event.preventDefault();
    const tweetcontent = $(this).children("#tweet-text");
    if (!tweetcontent.val() || tweetcontent.val() === null) {
    $("#error").html("Tweet is empty");
    $("#error").show();
    } else if (tweetcontent.val().length > 140) {
    $("#error").html("Too long. Plz rspct our arbitrary limit of 140 chars.");
    $("#error").show();
    } else {
    $("#error").html("");
    $("#error").hide();
    $.ajax({
        method: 'POST',
        url: "/tweets",
        data: $(this).serialize()
    }).then(res => {
        $("textarea").val("");
        loadTweets();
        $("#counter").val(140)
    });
    }
});

// function to load tweets from the server
const loadTweets = function() {
    $.getJSON("/tweets", function(data) {
        console.log('success',data)
    })
    .then(function (tweetdata) {
        renderTweets(tweetdata)
    })
  };
  loadTweets()
});

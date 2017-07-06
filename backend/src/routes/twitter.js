const KRouter = require('koa-router');
const router = new KRouter({ prefix: '/twitter' });

const Config = require('config');
const Twit = require('twit');

const T = new Twit({
  consumer_key: Config.twitter.key,
  consumer_secret: Config.twitter.secret,
  access_token: Config.twitter.accessToken,
  access_token_secret: Config.twitter.accessTokenSecret,
  timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests. 
});


// 
//  search twitter for all tweets containing the word 'banana' since July 11, 2011 
// 
// T.get('search/tweets', { q: 'osoc', count: 1 }, function(err, data, response) {
//   console.log(data.statuses)
// })



router.get('/search/:keyword', async(ctx, next) => {
  console.log(ctx.params.keyword);
  return T.get('search/tweets', {
      q: ctx.params.keyword,
      count: 10
    })
    .then(function(data) {
      ctx.body = data;

    }).then(next);
});



const formatDate = (str) => {
  const dte = new Date(str);
  return new Intl.DateTimeFormat('be-BE', {
    month: 'short',
    day: 'numeric',
    weekday: 'short',
    hour: 'numeric',
    minute: '2-digit',
    hour12: false,
    timeZone : "UTC"


  }).format(dte);
};



router.get('/q/:keyword', async(ctx, next) => {
  return T.get('search/tweets', {
      q: ctx.params.keyword,
      count: 7
    })
    .then(function({data}) {
      ctx.body = data.statuses.map((tweet, i) => {
        let res = {
          'link': 'https://twitter.com/',
          'created_at': formatDate(tweet.created_at),
          'body': tweet.text,
          'hastags': tweet.entities.hashtags.map(h => h.text),
          'user': tweet.user.screen_name,
          'user_full_name': tweet.user.name,
          'user_avatar': tweet.user.profile_image_url,
          'retweet_count': tweet.retweet_count,
          'favorite_count': tweet.favorite_count,
        };
        res.link += `${res.user}/status/${tweet.id}`;
        if (tweet.entities.media) {
          res.media = tweet.entities.media[0].media_url;
        }

        return res;
      });
    }).then(next);
});






router.get('/zen', (ctx, next) => {
  const jokes = Config.zen;
  ctx.body = jokes[Math.floor(Math.random() * (jokes.length))];
  return next();
});




// -------------------------------------------------------------------
// Exports


module.exports = router;
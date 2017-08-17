{{{
  "title": "GitHub widget Tutorial",
  "tags": ["JavaScript", "August 2017", "Tutorial", "API", "Vanilla JS", "Function Programming", "GitHub"],
  "date": "8-17-2017",
  "id": "b6118519-8d3e-4913-b185-f8bcfb58435e",
  "description": "A tutorial on how to build a widget using Vanilla JavaScript and GitHub API.",
  "publish": true
}}}

This is a two-parts tutorial on how to create a nice little widget displaying all the languages we used in our GitHub repos.

The whole tutorial will cover the following:
1. Use GitHub API
2. Aggregate API response data
2. Create HTML widget through vanilla JS
3. Update widget as API responses come in

In this first part we are going to focus on getting and formatting the data, while in the second part we will take care of the rendering.

<a href="../images/_3/result.png" target="_blank"><img src="../images/_3/result.png" alt-text="GitHub widget" title="GitHub Widget"></a>

**NOTE** you can find the full code of this first part [here >>](https://gist.github.com/NicolaFerracin/ab4ad6a2004d633164cbe06d36af8027).

## The API

Looking at the GitHub API official documentation it looks like there isn't any way to return the list of languages used across ALL our repos, but we can get them one repo at a time.

Our first step is to then get a list of all our repos, by using `GET /users/:username/repos`.


### Get repos

To make our HTTP requests we can use different tools, `XMLHttpRequest`, the `fetch() API`, `axios` or anything you prefer. I like to use built-in tools as much as possible, so in these examples we are going to be using the `fetch() API`, which is available in all browsers except IE. If you'd rather use Node.js, than you can use `fetch-node` package to run these same examples without having to change a single character.

```javascript
const gitHubApi = {
    base: 'https://api.github.com',
    reposList: (username) => `/users/${username}/repos`
};
const username = 'YOUR USERNAME';

fetch(gitHubApi.base + gitHubApi.reposList(username))
    .then(res => res.json())
    .then(repos => console.log(repos));
```

By taking a look at our `repos` object that we get back from GitHub we can make some observations:
- all repos are included in the list, also forked repos which - in my case at least - we might not want to include
- for each repo we have a list of multiple endpoints we can call to get additional information, including the list of used languages (see `languages_url`)
- if we hit the GitHub API with this or others endpoints multiple times, we might find ourselves getting `Rate limit exceeded` error! As most APIs out there, there is a fixed amount of how many `free` calls we can make before we reach the limit.

We are now going to address all the above points.

### Filter repos

As said before, we might want to filter out some repos from our list. Criterias can differ: from creation date, forking, last activity... you can choose! In my case I wanted to remove all repos that were forked, as it wouldn't be fair to consider code written almost entirely by someone else.

```javascript
const gitHubApi = {
    base: 'https://api.github.com',
    reposList: (username) => `/users/${username}/repos`
};
const username = 'YOUR USERNAME';

fetch(gitHubApi.base + gitHubApi.reposList(username))
    .then(res => res.json())
    .then(repos => console.log(
        repos.filter(repo => !repo.fork) // this is where the fitering takes place. The rest stays the same
    ));
```

### Getting the languages_url endpoint

As we saw, we don't even have to bother constructing the endpoint to get all languages for a specific repo, as the `repo` object we get back from GitHub already includes the URL we need. we can extract it by doing the following:

```javascript
const gitHubApi = {
    base: 'https://api.github.com',
    reposList: (username) => `/users/${username}/repos`
};
const username = 'YOUR USERNAME';

fetch(gitHubApi.base + gitHubApi.reposList(username))
    .then(res => res.json())
    .then(repos => repos
        .filter(repo => !repo.fork)
        .forEach(repo => console.log(repo.languages_url))); // Get the languages_url from our repo object
```

### Fixing the exceeding rate limit error

Most APIs offer an open amount of calls we can make before needing to authenticate ourselves, and GitHub is an example.

If you haven't run into this problem yet, then it means you didn't reach the limit yet. But you will probably run into it quite soon, so better fix it now.

To let GitHub know that we are authenticated users and we are actually allowed to make these API calls we need to:
- generate an API token
- send our username in every API call
- send our token in every API call 

To get the token, just login to **GitHub**, go to **Settings** and at the bottom of the left pane click on **Personal access tokens**. With this token we can now make all API calls we want.

Now, to send our username and token in our API calls, we need to add them in the HTTP headers that are going to be part of our calls.

```javascript
const gitHubApi = {
    base: 'https://api.github.com',
    listRepos: (username) => `/users/${username}/repos`
};
const username = 'YOUR USERNAME';
const token = 'YOUR TOKEN';
const httpConfig = {
    method: 'GET',
    headers: {
        'User-Agent': username,
        'Content-Type': 'application/json',
        'Authorization': `token ${token}`
    }
};

fetch(gitHubApi.base + gitHubApi.listRepos(username), httpConfig) // <-- Add the httpConfig here
    .then(res => res.json())
    .then(repos => repos
        .filter(repo => !repo.fork)
        .forEach(repo => console.log(repo.languages_url))
    );
```

Now that we are authenticated we can make as many API calls as we need. If you are experiencing any issue, it might be due to the different method you are using to send HTTP requests, make sure you are adding the HTTP configuration in the proper way.

### Get languages for repo

We should now be set and ready to go! So let's continue by setting up a new HTTP request where we can get languages by repo. As our JavaScript snippet is getting longer, I started omitting some of the code we already went through:

```javascript
// Omitted code

fetch(gitHubApi.base + gitHubApi.listRepos(username), httpConfig)
    .then(res => res.json())
    .then(repos => repos
        .filter(repo => !repo.fork)
        .forEach(repo => getLanguagesForRepo(repo.languages_url)) // instead of using console.log(), let's call a new method in charge of calling a different endpoint
    );

function getLanguagesForRepo(url) {
    fetch(url, httpConfig)
        .then(res => res.json())
        .then(repoLangs => console.log(repoLangs));
}
```

Our return value looks something like this:
```json
{
    "language": "number_of_bytes",
    "JavaScript": "61838"
}
```

What we need to do now is:
- aggregate the return values of all API calls into one single object/array
- do something with our data, as soon as new data comes in

On to the next section!

## Data Aggregation

A short recap: we now have code that makes:
- 1 API call to get all our repos
- 1 API call for each repo to get all languages used in it

What we need is all languages used across all our repos, and not split by different repos, so we need to put all the pieces together. You can see below the way I approached the problem, but there isn't only one right solution, so feel free to experiment different aggregations and leave me suggestions and improvments in the comments below.

The way I approached it was to:
- keep updating a single object as soon as API responses come in
- turn this object into an array, sort it and feed it to a function that takes care of the actual rendering of the widget

I chose to keep the languages used in an object as it has direct access by key and it's therefor easier to update. I then opted for turning the object into an array as I find it's a better data type for sorting and for looping through during the actual rendering.

Let's go step-by-step by first storing all languages in a single object while they keep coming in:

```javascript
// Omitted code
const allLanguages = {}; // Add a new variable at the top where we store the languages as they come in

function getLanguagesForRepo(url) {
    fetch(url, httpConfig)
        .then(res => res.json())
        .then(repoLangs => {
            // Object.keys(object) exctracts all keys of an object into an array:
            // Object.keys({ number1: 1, number2: 2}) => ['number1', 'number2'];

            // For each language in the object (aka ['JavaScript', 'HTML', 'CSS', ...])...
            Object.keys(repoLangs).forEach(repoLang => {
                // ...if the language is already present in our allLanguages object...
                if (allLanguages[repoLang]) {
                    // ...update the number of bytes by summing up the new amount
                    allLanguages[repoLang] += repoLangs[repoLang];
                } else {
                    // ...else create a new entry in our allLanguages object and update it with the first amount
                    allLanguages[repoLang] = repoLangs[repoLang];
                }
            });
        });
}
```

Now that we have all languages saved in a single object that keeps getting updating, we can do something with them! But first, to make it easier to work with them during the rendering, let's transform the object into an array that will looks something like this: 
`[['JavaScript', 9000], ['language', number_of_bytes]]`


```javascript
// Omitted code
const allLanguages = {};
function getLanguagesForRepo(url) {
    fetch(url, httpConfig)
        .then(res => res.json())
        .then(repoLangs => {
            Object.keys(repoLangs).forEach(repoLang => {
                if (allLanguages[repoLang]) {
                    allLanguages[repoLang] += repoLangs[repoLang];
                } else {
                    allLanguages[repoLang] = repoLangs[repoLang];
                }
            });

            // Now that our allLanguages object has been updated to include latest results, let's put it into an array and sort it so the most used languages come first

            // We again use Object.keys(allLanguages) to get all the keys in our object and...
            const sortedLangs = Object.keys(allLanguages)
                // ...for each language, add an element in our result array so it looks like ['JavaScript', 9000]
                .map(lang => [lang, languages[lang]])
                // ... sort the resulting array of arrays from above so the most used languages come first
                .sort((a, b) => b[1] - a[1]);
        });
}
```

## Summary

This is it for the first part of this tutorial! 

To sum it up:
- we use the GitHub API to get the list of our repos
- we filter the list of repos and we remove 'unwanted' repos (optional)
- for each repo we then get the list of languages used in it
- as we are firing multiple request, we have to keep track of async responses coming in all the time, for this reason, as soon as a response comes in, we update our `allLanguages` variable to include latest results
- once `allLanguages` is done updating we can start worrying about the rendering
- to make our life easier for the rendering, we turn the object into a sorted array

In the next tutorial we will cover the rendering part, so don't miss out!
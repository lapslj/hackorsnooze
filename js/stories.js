"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  //see if this story is a Favorite
  // const favIcon = "&#10084;&#65039;"
  const favIcon = "&hearts;"

  return $(`
      <li id="${story.storyId}">
        <a href="#" id="favButton"> ${favIcon} </a>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();
  $favsList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    //add favorite when clicking fav button
    $story.children("#favButton").on("click",favClicker)
    // let favIcon = checkFavorites(story.storyId)
    // $story.children("#favButton").text(favIcon)
  $allStoriesList.append($story);
  $allStoriesList.show();
}
}



async function submitStory(evt){
  // console.debug("submitStory");
  // evt.preventDefault();
  console.log("submitting story...")
  let title = $storyTitle.val();
  let author = $storyAuthor.val();
  let url = $storyUrl.val();
  if (url.includes("http://") === false){
    url = ("http://"+url);
  }
  let thUsername = currentUser.username;
  // console.log(thUsername)
  // const storyData = {thTitle, thUrl, thAuth, thUsername}
  // const newStory = await storyList.addStory(currentUser, storyData);
  // const story = await storyList.addStory(currentUser, {title, url, author});
  // const $story = generateStoryMarkup(story);
  // $allStoriesList.prepend($story);
  const newStory = await storyList.addStory(currentUser, {title,url,author});
  const $story = generateStoryMarkup(newStory);
  $allStoriesList.prepend($story);
  //   {title: thTitle, author: thAuth, url: thUrl});
  // //  {title: thTitle, title: thAuth, title: thUrl});
  //   // {title: $storyTitle.val(), author: $storyAuthor.val(), url: $storyUrl.val()});
  console.log(newStory)
  $storyForm.trigger("reset")
}

function favClicker(e){
  //TODO: check and see if this story is in the "favorites" list. if not, add. if yes, remove.
  e.target.innerHTML = "&#10084;&#65039;"
  const targ = e.target.parentElement
  const thisStoryId = targ.getAttribute("id")
  console.log(thisStoryId)
  for(let fav of currentUser.favorites){
    console.log(fav.storyId)
    if(fav.storyId === thisStoryId){
      e.target.innerHTML = "&#10060;"
      currentUser.deleteFavorite(thisStoryId)
      return
    }}
  e.target.innerHTML = "&#10084;&#65039;"
  currentUser.addFavorite(thisStoryId)
}

async function checkFavorites(thisStoryId){
  let faVs = await currentUser.favorites
  for(let fav of faVs){
    if(fav.storyId === thisStoryId){
      return "&#10084"
    }
    else{return "&hearts;"}
  }
}

$storyForm.on("submit",submitStory)


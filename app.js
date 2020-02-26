// waiting for the DOM to be loaded
window.addEventListener("DOMContentLoaded", () => {
  // main AJAX request
  const fetchData = () => {
    // reading the input value
    const username = document.getElementById("username").value;
    // input value empty
    if (username === "") {
      result.innerHTML = `<p class="emptyInput">Please enter the username.</p>`
    } else {
      // initialize a request
      const request = new XMLHttpRequest();
      request.open('GET', 'https://api.github.com/users/' + username);
      // fire a main callback when readyState property of the request changes
      request.onreadystatechange = () => {
        // checking if fetch operation is complete
        if (request.readyState === 4) {
          // checking the successful response form server
          if (request.status === 200) {
            // parsing data from JSON to JS
            const data = JSON.parse(request.responseText);
            // calling repos AJAX request, user login as a parameter to make precise AJAX request
            reposFetchData(data.login);
            // printing data in result box
            result.innerHTML = `<h2 class="box__resume__title">GitHub Résumé</h2><div class="box__resume__avatar"><img src="${data.avatar_url}" alt="user avatar"></div><div class="box__resume__result"><div class="result__box"><p>Username:</p><ul><li>${data.name}</li></ul></div><div class="result__box"><p>Website:</p><ul><li><a href="${data.html_url}" target="_blank">${data.html_url}</a></li></ul></div><div class="result__box"><p>Repositories:</p><ul id="reposList"></ul></div><div class="result__box"><p>Languages:</p><ul id="languagesList"></ul></div></div>`;
          }
          // 404 user doesn't exist
          else if (request.status === 404) {
            result.innerHTML = `<p class="userError">Such user doesn't exist!</p>`
          }
          // all the other responses status
          else {
            result.innerHTML = `<p class="userError">Ooops! Something goes wrong! Go to console.</p>`
          }
        }
      };
      // sending the request to the server
      request.send();
    }
  };

  // repos AJAX request
  const reposFetchData = (username) => {
    // initialize a request
    const request = new XMLHttpRequest();
    request.open('GET', 'https://api.github.com/users/' + username + `/repos`);
    // fire a main callback when readyState property of the request changes
    request.onreadystatechange = () => {
      // checking if fetch operation is complete
      if (request.readyState === 4) {
        // checking the successful response form server
        if (request.status === 200) {
          // parsing data from JSON to JS
          const repos = JSON.parse(request.responseText);
          // searching for created repo list
          const reposList = document.getElementById("reposList");
          // checking if there is at least one public repo
          if (repos.length === 0) {
            reposList.innerHTML = `<li>There are no public repositories</li>`;
          }
          // variable
          const languagesArray = [];
          // iterating whole repos array
          repos.forEach(repo => {
            // creating HTML element li
            let repoLi = document.createElement("li");
            // checking if there is a description
            if (repo.description === null) {
              repoLi.innerHTML = `<a href="${repo.html_url}" target="_blank">${repo.name}</a><p>No description.</p>`;
            } else {
              // adding content to the element li
              repoLi.innerHTML = `<a href="${repo.html_url}" target="_blank">${repo.name}</a><p>${repo.description}</p>`;
            }
            // appending each li element to repos ul
            reposList.append(repoLi);
            // adding main language repo to array
            languagesArray.push(repo.language);
          });
          // calling function which calculate percentage usage of languages
          calculatingUsedLanguages(languagesArray);
        } else {
          // all the other responses status
          result.innerHTML = `<p class="userError">Ooops! Something goes wrong! Go to console.</p>`
        }
      }
    };
    // sending the request to the server
    request.send();
  };

  // calculate percentage usage of languages
  const calculatingUsedLanguages = languagesArray => {
    // searching for languages list
    const languagesList = document.getElementById("languagesList");
    // checking if there is a any language used
    if (languagesArray.length === 0) {
      // creating HTML element li
      let languageLi = document.createElement("li");
      // adding content to the element li
      languageLi.innerHTML = `No languages.`;
      // appending each li element to repos ul
      languagesList.append(languageLi);
    }
    // filtering Array from nulls
    const filteredLanguagesArray = languagesArray.filter(value => value !== null);
    // counting the same elements
    const countedLanguagesObject = {};
    filteredLanguagesArray.forEach(language => {
      countedLanguagesObject[language] = (countedLanguagesObject[language] || 0) + 1;
    });
    // variable
    const sortableCountedLanguagesArray = [];
    // iterating through object to get sortable array
    for (const language in countedLanguagesObject) {
      sortableCountedLanguagesArray.push([language, countedLanguagesObject[language]]);
    }
    // sorting array from most to least used language
    const sortedCountedLanguagesArray = sortableCountedLanguagesArray.sort((a,b) => {
      return b[1] - a[1];
    });
    // iterating sorted and counted languages array
    sortedCountedLanguagesArray.forEach(count => {
      // creating HTML element li
      let languageLi = document.createElement("li");
      // adding content to the element li
      languageLi.innerHTML = `${count[0]} - ${((count[1]/filteredLanguagesArray.length)*100).toFixed(2)}%`;
      // appending each li element to languages ul
      languagesList.append(languageLi);
    })
  };

  // variables
  const result = document.getElementById("result");
  const submit = document.getElementById("form");

  // submit event
  submit.addEventListener("submit", e => {
    // preventing domain event (e.g. reloading page)
    e.preventDefault();
    // calling AJAX request
    fetchData();
  });
});

// waiting for the DOM to be loaded
window.addEventListener("DOMContentLoaded", e => {
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
            // calling repos AJAX request
            reposFetchData(data.login);
            // printing data in result box
            result.innerHTML = `<h2 class="box__resume__title">GitHub Résumé</h2><div class="box__resume__avatar"><img src="${data.avatar_url}"></div><div class="box__resume__result"><div class="result__box"><p>Username:</p><ul><li>${data.name}</li></ul></div><div class="result__box"><p>Website:</p><ul><li><a href="${data.html_url}" target="_blank">${data.html_url}</a></li></ul></div><div class="result__box"><p>Repositories:</p><ul id="reposList"></ul></div><div class="result__box"><p>Languages:</p><ul id="languagesList"></ul></div></div>`;
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
            // searching for created lists
            const reposList = document.getElementById("reposList");
            const languagesList = document.getElementById("languagesList");
            // iterating whole repos array
            repos.forEach(repo => {
              // creating HTML element li
              let li = document.createElement("li");
              // adding content to the element li
              li.innerHTML = `<a href="${repo.html_url}" target="_blank">${repo.name}</a><p>${repo.description}</p>`;
              // appending each li element to repos ul
              reposList.append(li);

              //
              li.innerHTML = `<p>${repo.language}</p>`;
              //
              languagesList.append(li);

            });
          }
          else {
            result.innerHTML = `<p class="userError">Ooops! Something goes wrong! Go to console.</p>`
          }
        }
      };
      // sending the request to the server
      request.send();
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
})
;

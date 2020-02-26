window.addEventListener("DOMContentLoaded", e => {
  const fetchData = () => {
    const username = document.getElementById("username").value;
    if (username === "") {
      result.innerHTML = `<p class="emptyInput">Please enter the username.</p>`
    } else {
      const request = new XMLHttpRequest();
      request.open('GET', 'https://api.github.com/users/' + username);
      request.onreadystatechange = () => {
        if (request.readyState === 4) {
          if (request.status === 200) {
            const data = JSON.parse(request.responseText);
            result.innerHTML = `<h2 class="box__resume__title">GitHub Résumé</h2><div class="box__resume__avatar"><img src="${data.avatar_url}"></div><div class="box__resume__result"><div class="result__box"><p>Username:</p><ul><li>${data.name}</li></ul></div><div class="result__box"><p>Website:</p><ul><li><a href="${data.html_url}" target="_blank">${data.html_url}</a></li></ul></div><div class="result__box"><p>Repositories:</p><ul><li>${data.name}</li></ul></div><div class="result__box"><p>Languages:</p><ul><li>${data.name}</li></ul></div></div>`;
          } else if (request.status === 404) {
            result.innerHTML = `<p class="userError">Such user doesn't exist!</p>`
          } else {
            result.innerHTML = `<p class="userError">Ooops! Something goes wrong! Go to console.</p>`
          }
        }
      };
      request.send();
    }
  };

  const result = document.getElementById("result");
  const submit = document.getElementById("form");

  submit.addEventListener("submit", e => {
    e.preventDefault();
    fetchData();
  });
})
;

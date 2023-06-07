document.addEventListener("DOMContentLoaded", function() {
  const repoInfo = document.getElementById("repository-info");
  const owner = "akash-rajak";
  const apiUrl = `https://api.github.com/users/${owner}/repos`;

  const fetchAllRepositories = async () => {
    let allRepos = [];
    let page = 1;
    let reposPerPage = 500;

    while (true) {
      const url = `${apiUrl}?per_page=${reposPerPage}&page=${page}`;
      const response = await fetch(url);
      const repos = await response.json();

      if (repos.length === 0) {
        break;
      }

      allRepos = allRepos.concat(repos);
      page++;
    }

    return allRepos;
  };

  fetchAllRepositories()
    .then(repos => {
      const filteredRepos = repos.filter(repo => !repo.fork); // Exclude forked repositories

      // Sort repositories by stars in descending order
      const sortedReposByStars = filteredRepos.sort((a, b) => b.stargazers_count - a.stargazers_count);

      // Sort repositories by forks in descending order
      const sortedReposByForks = filteredRepos.sort((a, b) => b.forks_count - a.forks_count);

      const ownerName = owner; // Capitalize owner name
      const heading = document.createElement("h1");
      const ownerLink = document.createElement("a"); // Create the anchor element
      ownerLink.href = `https://github.com/${owner}`; // Set the href attribute to the owner's GitHub profile
      ownerLink.textContent = ownerName; // Set the link text to the owner name
      heading.appendChild(ownerLink); // Append the anchor element to the heading
      repoInfo.appendChild(heading);

      let stats = '';
      sortedReposByStars.forEach(repo => {
        stats += `
          <div class="repo-stats">
            <ul>
              <li><h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3></li>
              <li><strong>Description:</strong> ${repo.description}</li>
              <li><strong>Stars:</strong> ${repo.stargazers_count}</li>
              <li><strong>Forks:</strong> ${repo.forks_count}</li>
            </ul>
          </div>
        `;
      });
      repoInfo.innerHTML += stats;
    })
    .catch(error => {
      repoInfo.textContent = "Error fetching repository statistics.";
      console.error(error);
    });
});

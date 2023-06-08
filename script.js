document.addEventListener("DOMContentLoaded", function() {
  const repoInfo = document.getElementById("repository-info");
  const owner = "akash-rajak";
  const apiUrl = `https://api.github.com/users/${owner}/repos`;
  // const apiUrl = `https://api.github.com/users/${owner}/repos?access_token=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`;

  const fetchOwnerDetails = async () => {
    const response = await fetch(`https://api.github.com/users/${owner}`);
    const data = await response.json();
    return data;
  };

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

    // Introduce a delay of 1 second between requests
    await new Promise(resolve => setTimeout(resolve, 1000));

    return allRepos;
  };

  Promise.all([fetchOwnerDetails(), fetchAllRepositories()])
    .then(([ownerData, repos]) => {
      const filteredRepos = repos.filter(repo => !repo.fork); // Exclude forked repositories

      // Sort repositories by stars in descending order
      const sortedReposByStars = filteredRepos.sort((a, b) => b.stargazers_count - a.stargazers_count);

      // Sort repositories by forks in descending order
      const sortedReposByForks = filteredRepos.sort((a, b) => b.forks_count - a.forks_count);

      const ownerName = ownerData.login; // Get owner's login name
      const ownerAvatar = ownerData.avatar_url; // Get owner's avatar URL

      const profileInfo = document.getElementById("profile-info");
      const profilePicture = document.getElementById("profile-picture");
      const ownerNameElement = document.getElementById("owner-name");

      profilePicture.src = ownerAvatar;

      const ownerProfileLink = document.createElement("a");
      ownerProfileLink.href = `https://github.com/${owner}`;
      ownerProfileLink.textContent = ownerName;
      ownerProfileLink.target = "_blank";

      ownerNameElement.innerHTML = ""; // Clear the existing content
      ownerNameElement.appendChild(ownerProfileLink);

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

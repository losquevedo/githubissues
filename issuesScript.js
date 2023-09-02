const axios = require('axios');

// The "label" parameter is optional
async function getOpenIssuesWithPullRequests(token, owner, repo, label) {
    //Instantiates the repo url, inital page, pull request, and open issues count
    const repoURL = `https://api.github.com/repos/${owner}/${repo}/issues`;
    let page = 1;
    let pullRequestCount = 0;
    let openIssuesCount = 0;

    // Creates a loop that uses axios to continuously send requests
    while (true) {
        const response = await axios.get(repoURL, {
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            },
            params: {
                state: 'open',
                per_page: 100,
                page: page,
                // Inserts the optional label parameter
                labels: label ? label : undefined
            }
        });

        // Ends the loop if the page has no content
        if (response.data.length === 0) {
            break;
        }

        // Increments the open issues count with every tallied issue in the page
        openIssuesCount += response.data.length;

        // Logic to tally the number of pull requests
        for (let issue of response.data) {
            if (issue.pull_request) {
                pullRequestCount++;
            }
        }

        page++;
    }

    console.log(`[${owner}/${repo}] Total open pull requests${label ? ` with label "${label}"` : ''}: ${pullRequestCount}`);
    console.log(`[${owner}/${repo}] Total open issues (excluding pull requests)${label ? ` with label "${label}"` : ''}: ${openIssuesCount}`);
}

// Stores the token given in the command line so it can pass it as a parameter
const token = process.argv[2];
const owner = process.argv[3];
const repo = process.argv[4];
const label = process.argv[5]; // This is optional

//Checks if the command line arguments are valid. Prints out the correct format for the user if it's incorrect
if (!token || !owner || !repo) {
    console.error('Usage: node script_name.js YOUR_GITHUB_TOKEN OWNER REPO_NAME [LABEL]');
    console.error('OWNER and REPO_NAME are mandatory. LABEL is optional. If provided, will filter issues by that label.');
    process.exit(1);
}

getOpenIssuesWithPullRequests(token, owner, repo, label);

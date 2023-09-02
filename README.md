# Github Issues Script #
This script was written in order to do the following with the GitHub Issues API:

1. Access the given Github repo using a given Github Access Token and tally the open issues and pull requests
2. If a label is given as an optional search parameter, filter the results by that label

## Installation ##
1. Clone the repo
2. Run `npm install` to install dev dependencies (for now it's just `axios`)
3. Run the script using the following command `node script_name.js YOUR_GITHUB_TOKEN ownerName repoName`
    - (Optional) If you want to filter by a given label, you can run the script with it in quotes like this:
        `node script_name.js YOUR_GITHUB_TOKEN ownerName repoName "labelName"`

### Example ###
    If you wanted to check for issues in the `facebook/react` repo with the "Component: Developer Tools" label, you'd run:
    `node issuesScript.js YOUR_GITHUB_TOKEN facebook react "Component: Developer Tools"`

## Considerations ##
1. The script uses pagination in order to fetch 100 issues per request and increments the `page` variable for every iteration
2. The script requires a Github Personal Access Token so that the user is not rate limited
3. Users can specify which repo they want to search given an owner (which allows them to search another repo by the same owner)
4. An optional label parameter in case users want to filter by a given lable in the repo
5. Comments are added throughout for readability


## How could you test this code without sending a network request? ##
I'll focus on three approaches I could take for this though I know there are some others we could use: Mocking/Stubbing, Environment Variables, Dependency Injection

### Mocking/Stubbing Directly ###
I'd use a library such as Jest to mock the required response and then assert the function behaves as expected using mock data. For example:
```
jest.mock('axios');

test('test without actual request', async () => {
  axios.get.mockResolvedValue({ data: /* mock data */ });

{Call function and assert behavior}
```
This would allow me to ensure that the code functions without relying on a network request (making this an atomized test case) and works best for smaller use cases we want to ensure.

### Environment Variables ###
In this case, an environment variable would be used to determine what kind of environment we'd run the code in (e.g. "dev", "staging", "prod"), and use mock data for the network call and other configurations based on that environment variable given. For example:

```
let response;
if (process.env.NODE_ENV === 'test') {
  response = /* mock data */;
} else {
  response = axios.get(/* ... */);
}
```

This would work best for larger test suites and projects that might run in particular environments and opens the door for other test configurations and data to be loaded as the test runs.

### Dependency Injection ###
This would make it so that functions and other mock configurations could be inserted at runtime instead of compile time. I'm not super familiar with this approach but I could see it looking something like this:

```
function fetchData(httpLib[Such as Axios]) {
  return httpLib.get(/* ... */);
}

// For testing
fetchData({ get: () => Promise.resolve(/* mock data */) });
```

I could see this making things hard to debug since compile time errors would be pushed to runtime but I can experiment with that come test time. It might be overly complex for this desired functionality too but that could just be me.


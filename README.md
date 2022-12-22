# autify-take-home-test
Backend Engineer Take Home Test

## Installation Guide
This solution is built using `Node.js` and requires at least `v18.12.1`. This version was used as it is the recommended version for most users (per [NodeJS Docs](https://nodejs.org/en/ at the time of writing 12/22/22)). Further, Node 18 began supporting `fetch`, natively as it used to have to be imported via the [node-fetch](https://www.npmjs.com/package/node-fetch) package.
**_Note_: the script will display a warning message when fetch is invoked as it is being treated as an experimental feature in this version of Node.**


Build docker image for the project 
```
docker build -t autify-take-home:test . 
```

Run the docker image
```
docker run -dit --name autify autify-take-home:test
```

Bash into the container
```
docker exec -it autify bash
```

### Running Tests
The project uses dev dependencies `chai` and `mocha` for running tests. To run tests run the following command from within the project/container:
```
npm run test
```

## Example Usage

The solution can run two separate commands, a) fetch b) metadata.
**_Note_: a file `input.txt` is supplied as a sample for testing a) and b).**
**_Note_: both commands will generate a folder with the appropriate contents for the domain(s) entered as part of the arguments.**
**_Note_: the below commands can alternatively be ran by replacing `./fetch` with `node src/index.mjs` (i.e.`node src/index.mjs https://www.google.com`).**
### Fetch
```
./fetch https://www.google.com https://www.example.com https://www.wikipedia.com
```

### Metadata
```
./fetch --metadata https://www.google.com https://www.example.com https://www.wikipedia.com
```

## Solution Overview
There is a single model defined:
- `Input`: class which represents a target URL input argument, provides constructor to assign `url` property of type `URL`.

There are also utility classes that provide helpers for regex (`RegexUtils`), fetch (`FetchR`), file (`FileUtils`) and logging (`Logger`).

The `Processor` class is responsible for tracking URL inputs and processing commands on them namely `processArguments`, `processFetchCommand` and `processMetaDataCommand`.

The `CommandLine` class is responsible for handling the different input.

## Assumptions and Explanations
**For this solution, I opted to not leverage 3rd party libraries (except for testing) as the objective of the assignment would be written concisely (i.e. Puppeteer) otherwise and would not demonstrate sufficient implementation on my part if done so**

That said, some assumptions were made for the assignment namely:
- Cannot use HTML parser (though 3rd party libraries are permitted) - `jsdom` is used inside of the test cases to validate the accuracy of the regex matchers
- When counting images that are displayed, the script only accounts for `<img>` tags i.e. CSS `url` references, `<svg>` or otherwise are not included in the count
- Likewise, when counting links, this only accounts for `<a>` tag and not those HTML elements that could are invoked as links via Javascript
- The script only downloads img assets for relatively referenced files i.e. not `http://google.com/test-image` but `/test-image` instead
- Non-2xx responses are invalid for document fetching, if it errors it is ignored


Some explanations regarding rationale include:
- The folder that stores site data uses the URL's hostname instead of the entire URL, this is to avoid long folder names for readability (in an improved version the directory structure would follow the paths of the URL i.e. www.google.com/search would result in 2 folders)
- Given the scope of this assignment, error handling is contained at the top level at the CLI.run call
- The `last_fetch` date takes the creation time of the downloaded `index.html` file as this is when the act of "fetching" is complete, however, it can be argued that the `fetch_time` would correspond to the time the HTTP request is made for the page

### Improvements
- Widen the scope of what is considered an asset or image
- Build out DOM selector capabilities without the use Regex
- Provide more verbose error handling
- More verbose folder structure for fetch results
- Use ./fetch to invoke script
- Add flow/state management to be leveraged for rolling back in the event of an error
- Use volumes in docker for storing data instead of having it live directly in the container

const gitHubApi = {
    base: 'https://api.github.com',
    listRepos: (username) => `/users/${username}/repos`,
    listLanguages: (username, repo) => `/repos/${username}/${repo}/languages`,
};
const username = 'NicolaFerracin';
const token = '504130bc2581863b9a907fe8d53943b1e3dab74c';
const languages = {};
const httpConfig = {
    method: 'GET',
    headers: {
        'User-Agent': username,
        'Content-Type': 'application/json',
        'Authorization': `token ${token}`
    }
};
const chart = document.getElementById('gitHubChart');

fetch(gitHubApi.base + gitHubApi.listRepos(username), httpConfig)
    .then(res => res.json())
    .then(repos => repos.filter(repo => !repo.fork)
                        .forEach(repo => getLanguagesForRepo(repo.languages_url)));

function getLanguagesForRepo(url) {
    fetch(url, httpConfig)
        .then(res => res.json())
        .then(repoLangs => {
            Object.keys(repoLangs).forEach(repoLang => {
                if (languages[repoLang]) {
                    languages[repoLang] += repoLangs[repoLang];
                } else {
                    languages[repoLang] = repoLangs[repoLang];
                }
            });
            const sortedLangs = Object.keys(languages)
                .map(lang => [lang, languages[lang]])
                .sort((a, b) => b[1] - a[1]);
            updateChart(sortedLangs);
        });
}

function updateChart(langs) {
    chart.innerHTML = JSON.stringify(langs);
    return;
    const max = langs[0][1];
    langs.forEach(lang => {
        let line;
        let bar;
        if (document.getElementById(lang[0])) {
            updateLine(lang, max)
        } else {
            createNewLine(lang, max);
        }
        
    });
}

function createNewLine(lang, max) {
    const line = document.createElement('div');
    const bar = document.createElement('div');
    const label = document.createElement('div');
    line.setAttribute('id', lang[0]);
    line.style.display = 'flex';
    label.innerText = lang[0];
    label.style.width = '200px';
    label.style.textAlign = 'right';
    bar.className = 'bar';
    bar.style.height = '20px';
    bar.style.backgroundColor = langsColors[lang[0]];
    bar.style.maxWidth = lang[1] * 100 / max + '%';
    line.appendChild(label);
    line.appendChild(bar);
    chart.appendChild(line);
}

function updateLine(lang, max) {
    line = document.getElementById(lang[0]);
    bar = line.getElementsByClassName('bar')[0];
    bar.style.maxWidth = lang[1] * 100 / max + '%';
}
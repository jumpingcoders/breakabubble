browser.storage.local.get('userId').then((data, error) => {
    fetch('https://socialex-api.herokuapp.com/api/users/' + data.userId)
        .then(res => res.json())
        .then(response => {
            const progressFill = document.getElementsByClassName('progress-fill')[0];
            progressFill.style.width = response.reactions_russia_vs_eu + '%';
            progressFill.innerText = response.reactions_russia_vs_eu + ' %';
        });
});

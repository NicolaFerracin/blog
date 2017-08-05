(function () {
    const palettes = {
        false: {
            '--bg-color': '#282a36',
            '--bg-secondary-color': '#44475a',
            '--primary-color': '#ff5722',
            '--primary-color-light': '#ffccbc',
            '--primary-text': '#f8f8f2',
            '--secondary-text': '#757575',
            '--divider-color': '#282a36',
        },
        true: {
            '--bg-color': '#E6E6E6',
            '--bg-secondary-color': '#FFFFFF',
            '--primary-color': '#ff5722',
            '--primary-color-light': '#ffccbc',
            '--primary-text': '#212121',
            '--secondary-text': '#757575',
            '--divider-color': '#E6E6E6',
        }
    };
    let nightMode = localStorage.getItem('nightMode') === 'true' ? true : false;
    changePalette(palettes[nightMode]);
    storeNightMode(nightMode);

    document.toggleNightMode = function() {
        nightMode = !nightMode;
        const newPalette = palettes[nightMode];
        document.body.classList.add('animate');
        changePalette(newPalette);
        document.body.addEventListener('transitionend', function(e) {
            document.body.classList.remove('animate');
        }, false);
        storeNightMode(nightMode);
    }

    function changePalette(newPalette) {
        Object.keys(newPalette).forEach(
            prop => document.documentElement.style.setProperty(prop, newPalette[prop])
        );
    }

    function storeNightMode(mode) {
        localStorage.setItem('nightMode', mode);
    }
}());
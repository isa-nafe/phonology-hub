document.addEventListener('DOMContentLoaded', () => {
    const pulmonicConsonantsTable = document.querySelector('#pulmonic-consonants');
    const vowelsTable = document.querySelector('#vowels-chart');
    const clicksTable = document.querySelector('#clicks table');
    const voicedImplosivesTable = document.querySelector('#voiced-implosives table');
    const ejectivesTable = document.querySelector('#ejectives table');
    const otherSymbolsTable = document.querySelector('#other-symbols table');

    // Fetch IPA chart data
    fetch('/api/ipa_chart')
        .then(response => response.json())
        .then(data => {
            renderPulmonicConsonants(data.consonants.pulmonic);
            renderVowels(data.vowels);
            renderNonPulmonicConsonants(data.non_pulmonic_consonants);
            renderOtherSymbols(data.other_symbols);
        })
        .catch(error => console.error('Error fetching IPA chart data:', error));

    function renderPulmonicConsonants(consonants) {
        const header = consonants.header;
        const rows = consonants.rows;

        // Create header row
        const headerRow = document.createElement('tr');
        header.forEach(cell => {
            const th = document.createElement('th');
            th.textContent = cell;
            headerRow.appendChild(th);
        });
        pulmonicConsonantsTable.appendChild(headerRow);

        // Create data rows
        rows.forEach(row => {
            const tr = document.createElement('tr');
            row.forEach((cell, index) => {
                const td = index === 0 ? document.createElement('th') : document.createElement('td');
                if (Array.isArray(cell)) {
                    cell.forEach(symbol => {
                        const span = createSymbolSpan(symbol);
                        td.appendChild(span);
                    });
                } else if (cell) {
                    const span = createSymbolSpan(cell);
                    td.appendChild(span);
                }
                tr.appendChild(td);
            });
            pulmonicConsonantsTable.appendChild(tr);
        });
    }

    function renderVowels(vowels) {
        const header = vowels.header;
        const rows = vowels.rows;
        const labels = vowels.labels;

        // Create header row
        const headerRow = document.createElement('tr');
        headerRow.appendChild(document.createElement('th')); // Empty cell for labels
        header.forEach(cell => {
            const th = document.createElement('th');
            th.textContent = cell;
            headerRow.appendChild(th);
        });
        vowelsTable.appendChild(headerRow);

        // Create data rows
        rows.forEach((row, rowIndex) => {
            const tr = document.createElement('tr');
            
            // Add label
            const labelCell = document.createElement('th');
            labelCell.textContent = labels[rowIndex] || '';
            tr.appendChild(labelCell);

            row.forEach(cell => {
                const td = document.createElement('td');
                if (Array.isArray(cell)) {
                    cell.forEach(vowel => {
                        const span = createSymbolSpan(vowel);
                        td.appendChild(span);
                    });
                } else if (cell) {
                    const span = createSymbolSpan(cell);
                    td.appendChild(span);
                } else {
                    td.innerHTML = '&nbsp;'; // Empty cell
                }
                tr.appendChild(td);
            });
            vowelsTable.appendChild(tr);
        });
    }

    function renderNonPulmonicConsonants(nonPulmonicConsonants) {
        renderSymbolTable(clicksTable, nonPulmonicConsonants.clicks);
        renderSymbolTable(voicedImplosivesTable, nonPulmonicConsonants.voiced_implosives);
        renderSymbolTable(ejectivesTable, nonPulmonicConsonants.ejectives);
    }

    function renderOtherSymbols(otherSymbols) {
        renderSymbolTable(otherSymbolsTable, otherSymbols);
    }

    function renderSymbolTable(table, symbols) {
        symbols.forEach(symbol => {
            const tr = document.createElement('tr');
            const symbolTd = document.createElement('td');
            const span = createSymbolSpan(symbol);
            symbolTd.appendChild(span);
            tr.appendChild(symbolTd);

            const descTd = document.createElement('td');
            descTd.textContent = symbol.description;
            tr.appendChild(descTd);

            table.appendChild(tr);
        });
    }

    function createSymbolSpan(symbol) {
        const span = document.createElement('span');
        span.className = 'ipa-symbol';
        if (symbol.rounded !== undefined) {
            span.className += symbol.rounded ? ' rounded' : ' unrounded';
        }
        span.textContent = symbol.symbol || symbol;
        span.setAttribute('data-symbol', symbol.symbol || symbol);
        span.setAttribute('data-description', symbol.description || '');
        span.setAttribute('data-example', symbol.example || '');
        span.addEventListener('click', showPopup);
        return span;
    }

    function showPopup(event) {
        const symbol = event.target.getAttribute('data-symbol');
        const description = event.target.getAttribute('data-description');
        const example = event.target.getAttribute('data-example');

        const popup = document.createElement('div');
        popup.className = 'ipa-popup';
        popup.innerHTML = `
            <h3>${symbol}</h3>
            <p><strong>Description:</strong> ${description}</p>
            <p><strong>Example:</strong> ${example}</p>
        `;

        // Remove any existing popups
        const existingPopup = document.querySelector('.ipa-popup');
        if (existingPopup) {
            existingPopup.remove();
        }

        // Position the popup near the clicked symbol
        const rect = event.target.getBoundingClientRect();
        popup.style.left = `${rect.left + window.scrollX}px`;
        popup.style.top = `${rect.bottom + window.scrollY}px`;

        document.body.appendChild(popup);

        // Close the popup when clicking outside of it
        document.addEventListener('click', function closePopup(e) {
            if (!popup.contains(e.target) && e.target !== event.target) {
                popup.remove();
                document.removeEventListener('click', closePopup);
            }
        });
    }
});
